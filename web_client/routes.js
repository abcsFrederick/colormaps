import ColormapWidget from './views/widgets/colormapSelectorWidget';
import router from 'girder/router';
import events from 'girder/events';

router.route('colormap/view', 'colormapView', function () {
    events.trigger('g:navigateTo', ColormapWidget);
});