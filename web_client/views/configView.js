import _ from 'underscore';

import View from 'girder/views/View';
import { restRequest } from 'girder/rest';
import events from 'girder/events';

import PluginConfigBreadcrumbWidget from
    'girder/views/widgets/PluginConfigBreadcrumbWidget';

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
            this._createColormap(labels, gradient, name);
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
    _createColormap(labels, gradient, name) {
        restRequest({
            url: 'colormap/gradient',
            method: 'POST',
            data: { name: name,
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
            this.$('#g-colormaps-settinsge-error-message').text(
                error.responseJSON.message
            );
        });
    }
});

export default ConfigView;
