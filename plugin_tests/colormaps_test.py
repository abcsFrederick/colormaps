#!/usr/bin/env python
# -*- coding: utf-8 -*-

#############################################################################
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
#############################################################################

from tests import base
import os
import json

from girder.models.folder import Folder
from girder.models.user import User


def setUpModule():
    base.enabledPlugins.append('colormaps')
    base.startServer()


def tearDownModule():
    base.stopServer()


class ColormapsTestCase(base.TestCase):
    def setUp(self, *args, **kwargs):
        base.TestCase.setUp(self, *args, **kwargs)
        admin = {
            'email': 'admin@email.com',
            'login': 'adminlogin',
            'firstName': 'Admin',
            'lastName': 'Last',
            'password': 'adminpassword',
            'admin': True
        }
        self.admin = User().createUser(**admin)
        user = {
            'email': 'user@email.com',
            'login': 'userlogin',
            'firstName': 'Common',
            'lastName': 'User',
            'password': 'userpassword'
        }
        self.user = User().createUser(**user)
        folders = Folder().childFolders(self.user, 'user', user=self.admin)
        for folder in folders:
            if folder['name'] == 'Private':
                self.userPrivateFolder = folder
        folders = Folder().childFolders(self.admin, 'user', user=self.admin)
        for folder in folders:
            if folder['name'] == 'Public':
                self.publicFolder = folder
            if folder['name'] == 'Private':
                self.privateFolder = folder

        self.path = 'plugins/colormaps/plugin_tests/test_files/Rainbow.json'
        self.name = os.path.basename(self.path)

    def _creatColormap(self):
        from girder.plugins.colormaps.models.colormap import Colormap
        file = open(self.path, 'rb')
        data = json.load(file)
        colormap = data.get('colormap')
        labels = data.get('labels')
        newColormap = Colormap().createColormap(self.user, colormap, name=self.name, labels=labels)
        return newColormap

    def testCreateColormap(self):
        from girder.plugins.colormaps.models.colormap import Colormap
        self._creatColormap()
        colormap = list(Colormap().find({'name': self.name}))

        assert len(colormap) == 1

    def testCreateColormapFromGradient(self):
        from girder.plugins.colormaps.models.colormap import Colormap
        name = 'specTest'
        gradient = [['0', '0', '0'], ['255', '255', '255']]
        labels = ['background', 'Tumor']
        Colormap().createColormapFromGradient(self.user, gradient, name=name, labels=labels)
        colormap = list(Colormap().find({'name': 'specTest'}))
        assert colormap[0]['colormap'][3] == [3, 3, 3]
        assert colormap[0]['labels'][1] == 'Tumor'
        assert len(colormap) == 1

    def testUpdateColormap(self):
        from girder.plugins.colormaps.models.colormap import Colormap
        newColormap = self._creatColormap()
        colormap = list(Colormap().find({'name': self.name}))[0]
        newColormap['name'] = 'test.json'
        newColormap['colormap'][0] = [0, 0, 0]
        Colormap().updateColormap(newColormap)
        colormap = list(Colormap().find({'name': 'test.json'}))
        assert len(colormap) == 1
        assert colormap[0].get('colormap')[0] == [0, 0, 0]

    def testDeleteColormap(self):
        from girder.plugins.colormaps.models.colormap import Colormap as ColormapModel
        newColormap = self._creatColormap()

        resp = self.request(path='/colormap/%s' % str(newColormap['_id']),
                            method='DELETE', user=self.admin)
        self.assertStatusOk(resp)
        colormap = list(ColormapModel().find({'name': self.name}))
        assert len(colormap) == 0
