import router from '@girder/core/router';

import events from '@girder/core/events';
import { exposePluginConfig } from '@girder/core/utilities/PluginUtils';

import ColormapWidget from './views/widgets/colormapSelectorWidget';
import ConfigView from './views/configView';

exposePluginConfig('colormaps', 'plugins/colormaps/config');

router.route('plugins/colormaps/config', 'colormapsConfig', function () {
    events.trigger('g:navigateTo', ConfigView);
});

router.route('colormap/view', 'colormapView', function () {
    events.trigger('g:navigateTo', ColormapWidget);
});