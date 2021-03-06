import _ from 'underscore';
import $ from 'jquery';

import View from '@girder/core/views/View';
import { restRequest } from '@girder/core/rest';
import events from '@girder/core/events';

import PluginConfigBreadcrumbWidget from
    '@girder/core/views/widgets/PluginConfigBreadcrumbWidget';

// import ColormapWidget from './widgets/colormapSelectorWidget';
import ConfigViewTemplate from '../templates/views/configView.pug';
import ColorpickerTemplate from '../templates/views/colorpicker.pug';

import '../stylesheets/views/configView.styl';

var ConfigView = View.extend({
    events: {
        'click #addLabel': 'addNewLabel',
        'submit #g-colormaps-settings-form': function (event) {
            let labels = [];
            let gradient = [];
            let name = $('#g-colormaps-settings-name').val();
            event.preventDefault();
            this.$('#g-colormaps-settings-error-message').empty();
            _.each($('.g-colormaps-settings-label'), (each) => {
                labels.push($(each).val());
            });
            _.each($('.colorpicker-component'), (each) => {
                gradient.push($(each).val().match(/([0-9]+\.?[0-9]*)/g));
            });
            let labelmap = $('.g-colormaps-settings-labelmap').is(':checked');
            this._createColormap(labels, gradient, name, labelmap);
        }
    },
    initialize: function (settings) {
        this.numOfLabel = 0;
        this.settings = settings;
        this.render();
    },
    render: function () {
        this.$el.html(ConfigViewTemplate({
            settings: this.settings
        }));

        if (!this.breadcrumb) {
            this.breadcrumb = new PluginConfigBreadcrumbWidget({
                pluginName: 'Colormaps',
                el: this.$('.g-config-breadcrumb-container'),
                parentView: this
            }).render();
        }
        // this.colormapSelector = new ColormapWidget({
        //     parentView: this,
        //     el: this.$('#colormap-selector-preview')
        // }).render();
        return this;
    },
    addNewLabel(e) {
        this.$('.colorpickerTable').append(ColorpickerTemplate({
            labelValue: this.numOfLabel
        }));
        $('.g-colormaps-settings-color').colorpicker({
            color: '#000000',
            format: 'rgb'
        });
        this.numOfLabel = this.numOfLabel + 1;
    },
    _createColormap(labels, gradient, name, labelmap) {
        restRequest({
            url: 'colormap/gradient',
            method: 'POST',
            data: {
                name: name,
                labelmap: labelmap,
                gradient: JSON.stringify(gradient),
                labels: JSON.stringify(labels)
            }
        }).done(() => {
            events.trigger('g:alert', {
                icon: 'ok',
                text: 'Settings saved.',
                type: 'success',
                timeout: 4000
            });
        }).fail((error) => {
            this.$('#g-colormaps-settings-error-message').text(
                error.responseJSON.message
            );
        });
    }
});

export default ConfigView;
