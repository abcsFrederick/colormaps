import Collection from '@girder/core/collections/Collection';

import ColormapModel from '../models/ColormapModel';

export default Collection.extend({
    resourceName: 'colormap',
    model: ColormapModel
});
