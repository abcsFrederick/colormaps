/* eslint-disable backbone/no-silent */

import AccessControlledModel from '@girder/core/models/AccessControlledModel';

var ColormapModel = AccessControlledModel.extend({
    resourceName: 'colormap',

    save: function () {
        var colormap = this.get('colormap');
        var labels = this.get('labels');
        this.set({
            colormap: JSON.stringify(colormap),
            labels: JSON.stringify(labels)
        }, {silent: true});
        var promise = AccessControlledModel.prototype.save.call(this, arguments);
        this.set({colormap: colormap, labels: labels}, {silent: true});
        return promise;
    }
});

export default ColormapModel;
