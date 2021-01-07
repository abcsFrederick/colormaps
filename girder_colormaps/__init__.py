#!/usr/bin/env python
# -*- coding: utf-8 -*-

###############################################################################
#  Girder plugin framework and tests adapted from Kitware Inc. source and
#  documentation by the Imaging and Visualization Group, Advanced Biomedical
#  Computational Science, Frederick National Laboratory for Cancer Research.
#
#  Copyright Kitware Inc.
#
#  Licensed under the Apache License, Version 2.0 ( the "License" );
#  you may not use this file except in compliance with the License.
#  You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
#  Unless required by applicable law or agreed to in writing, software
#  distributed under the License is distributed on an "AS IS" BASIS,
#  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#  See the License for the specific language governing permissions and
#  limitations under the License.
###############################################################################

from girder import plugin
from .rest import ColormapResource
from .models.colormap import Colormap
from girder.utility.model_importer import ModelImporter


class ColormapsPlugin(plugin.GirderPlugin):
  DISPLAY_NAME = 'Colormaps'
  CLIENT_SOURCE_PATH = 'web_client'
  def load(self, info):
    ModelImporter.registerModel('colormap', Colormap, 'colormaps')
    info['apiRoot'].colormap = ColormapResource()
