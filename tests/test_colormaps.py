import os
import json
import pytest

from girder.models.folder import Folder
from girder.models.user import User


@pytest.mark.plugin('colormaps')
class TestColormaps(object):
    def init(self, admin):
        user = {
            'email': 'user@email.com',
            'login': 'userlogin',
            'firstName': 'Common',
            'lastName': 'User',
            'password': 'userpassword'
        }
        self.user = User().createUser(**user)
        folders = Folder().childFolders(self.user, 'user', user=admin)
        for folder in folders:
            if folder['name'] == 'Private':
                self.userPrivateFolder = folder
        folders = Folder().childFolders(admin, 'user', user=admin)
        for folder in folders:
            if folder['name'] == 'Public':
                self.publicFolder = folder
            if folder['name'] == 'Private':
                self.privateFolder = folder
        basePath = 'data'
        curDir = os.path.dirname(os.path.realpath(__file__))
        jsonPath = os.path.join(basePath, 'Rainbow.json')
        self.jsonPath = os.path.join(curDir, jsonPath)
        self.name = os.path.basename(self.jsonPath)

    def _creatColormap(self):
        from girder_colormaps.models.colormap import Colormap
        file = open(self.jsonPath, 'rb')
        data = json.load(file)
        colormap = data.get('colormap')
        labels = data.get('labels')
        newColormap = Colormap().createColormap(self.user, colormap, name=self.name, labels=labels)
        return newColormap

    def testCreateColormap(self, server, fsAssetstore, admin):
        self.init(admin)
        from girder_colormaps.models.colormap import Colormap
        self._creatColormap()
        colormap = list(Colormap().find({'name': self.name}))

        assert len(colormap) == 1

    def testCreateColormapFromGradient(self, server, fsAssetstore, admin):
        self.init(admin)
        from girder_colormaps.models.colormap import Colormap
        name = 'specTest'
        gradient = [['0', '0', '0'], ['255', '255', '255']]
        labels = ['0', '255']
        Colormap().createColormapFromGradient(self.user, gradient, name=name, labels=labels)
        colormap = list(Colormap().find({'name': 'specTest'}))
        assert colormap[0]['colormap'][3] == [3, 3, 3]
        assert colormap[0]['labels'][1] == '255'
        assert len(colormap) == 1

    def testCreateColormapFromGradientLabelmap(self, server, fsAssetstore, admin):
        self.init(admin)
        from girder_colormaps.models.colormap import Colormap
        name = 'specTest'
        gradient = [['0', '0', '0'], ['1', '1', '1'], ['3', '3', '3'], ['6', '6', '6']]
        labels = ['0', '1', '3', '6']
        Colormap().createColormapFromGradient(self.user, gradient,
                                              name=name, labels=labels, labelmap=True)
        colormap = list(Colormap().find({'name': 'specTest'}))
        assert colormap[0]['colormap'][1] == [1, 1, 1]
        assert colormap[0]['colormap'][3] == [3, 3, 3]
        assert colormap[0]['colormap'][4] == [3, 3, 3]
        assert colormap[0]['colormap'][5] == [3, 3, 3]
        assert colormap[0]['colormap'][12] == [6, 6, 6]
        assert len(colormap) == 1

    def testDeleteColormap(self, server, fsAssetstore, admin):
        self.init(admin)
        from girder_colormaps.models.colormap import Colormap as ColormapModel
        newColormap = self._creatColormap()

        resp = server.request(path='/colormap/%s' % str(newColormap['_id']),
                              method='DELETE', user=admin)
        assert int(resp.output_status.split()[0]) == 200
        colormap = list(ColormapModel().find({'name': self.name}))
        assert len(colormap) == 0
