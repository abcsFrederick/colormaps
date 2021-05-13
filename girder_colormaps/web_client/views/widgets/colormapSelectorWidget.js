import _ from 'underscore';

import Panel from '@girder/slicer_cli_web/views/Panel';

import { getCurrentUser } from '@girder/core/auth';
import { handleClose } from '@girder/core/dialog';
import { restRequest } from '@girder/core/rest';
import UploadWidget from '@girder/core/views/widgets/UploadWidget';

import FolderCollection from '@girder/core/collections/FolderCollection';
import FileModel from '@girder/core/models/FileModel';

import ColormapCollection from '../../collections/ColormapCollection';

import colormapSelectorWidget from '../../templates/widgets/colormapSelectorWidget.pug';
import '../../stylesheets/widgets/colormapSelectorWidget.styl';

var ColormapSelectorWidget = Panel.extend({
    events: {
        'change select': '_select',
        'click .h-remove-colormap': '_removeColormap',
        'click .h-upload-colormap': uploadColormapWidget
    },

    initialize: function (settings) {
        this.nullLabel = '(none)';
        this.nullNameLabel = '(unnamed)';
        this.collection = new ColormapCollection();
        this.colormapId = settings.colormapId;
        this.collection.on('g:changed', () => {
            this.render();
            this.trigger('g:changed');
        });
        this.listenTo(this.collection, 'update', this.render);
        this.on('h:colormapsUpdated', () => {
            this.collection.fetch({limit: 0, offset: 0});
        });
        this.collection.fetch({limit: 0});
    },

    render: function () {
        this.$el.html(colormapSelectorWidget({
            colormaps: this.collection.toArray(),
            colormapId: this.colormapId,
            nullLabel: this.nullLabel,
            nullNameLabel: this.nullNameLabel
        }));
        return this;
    },

    _select: function () {
        var selected;
        this.colormapId = this.$(':selected').attr('value');
        if (this.colormapId) {
            selected = this.collection.get(this.colormapId);
            this.$('.h-remove-colormap').removeClass('disabled');
        } else {
            this.$('.h-remove-colormap').addClass('disabled');
        }
        this.trigger('g:selected', selected);
    },

    _removeColormap: function () {
        if (this.colormapId) {
            this.collection.get(this.colormapId).destroy();
            this.$('.h-colormap').val(this.nullLabel).trigger('change');
        }
    }
});

function uploadColormapWidget() {
    const user = getCurrentUser();
    if (!user) {
        throw new Error('User must be logged in');
    }
    const userFolders = new FolderCollection();
    userFolders.fetch({
        parentId: user.id,
        parentType: 'user',
        name: 'Private',
        limit: 1
    }).then(() => {
        if (userFolders.isEmpty()) {
            throw new Error('Could not find the user\'s private folder');
        }
        return new UploadWidget({
            el: $('#g-dialog-container'),
            title: 'Upload Colormap',
            parent: userFolders.at(0),
            parentType: 'folder',
            parentView: this
        }).on('g:uploadFinished', function (e) {
            _.each(e.files, (file) => {
                restRequest({
                    url: `colormap/file/${file.id}`,
                    method: 'POST'
                }).done((results) => {
                    var model = new FileModel({_id: file.id});
                    model.destroy(); // .fail();
                    this.trigger('h:colormapsUpdated');
                }).fail((error) => {
                    console.log(error);
                });
            });
            handleClose('upload');
        }, this).render();
    });
}

export default ColormapSelectorWidget;
