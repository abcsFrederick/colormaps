import './routes';

import { registerPluginNamespace } from '@girder/core/pluginUtils';

import * as colormaps from './index';

registerPluginNamespace('colormaps', colormaps);
