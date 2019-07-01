import router from 'girder/router';

import events from 'girder/events';

import ColormapWidget from './views/widgets/colormapSelectorWidget';

router.route('colormap/view', 'colormapView', function () {
    events.trigger('g:navigateTo', ColormapWidget);
});