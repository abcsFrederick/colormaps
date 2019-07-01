import { registerPluginNamespace } from 'girder/pluginUtils';
import './routes';
import * as colormaps from './index';
registerPluginNamespace('colormaps', colormaps);
