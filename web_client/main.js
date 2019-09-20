import './routes';

import { registerPluginNamespace } from 'girder/pluginUtils';

import * as colormaps from './index';

registerPluginNamespace('colormaps', colormaps);
