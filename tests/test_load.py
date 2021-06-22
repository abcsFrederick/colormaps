import pytest

from girder.plugin import loadedPlugins


@pytest.mark.plugin('colormaps')
def test_import(server):
    assert 'colormaps' in loadedPlugins()
