#!/usr/bin/env python
# -*- coding: utf-8 -*-

import datetime

from bson.binary import Binary

from girder.constants import AccessType
from girder.models.model_base import AccessControlledModel


# for PIL.ImagePalette
def colormap_to_bytes(colormap, default=None):
    palette = []
    for i in range(3):
        for j in range(256):
            try:
                value = int(colormap[j][i])
            except KeyError:
                try:
                    value = int(colormap[str(j)][i])
                except KeyError:
                    if default is None:
                        value = j
                    else:
                        value = default[i]
            palette.append(value)
    return bytes(bytearray(palette))


class Colormap(AccessControlledModel):
    def initialize(self):
        self.name = 'colormap'
        self.ensureIndices([
            'created',
            'creatorId',
        ])
        self.ensureTextIndex({
            'name': 10,
        })

        self.exposeFields(AccessType.READ, (
            '_id',
            'name',
            'created',
            'creatorId',
            'colormap',
            'labels',
            'created',
            'updated',
            'updatedId',
            'public',
            'publicFlags',
            'groups',
        ))

    def createColormap(self, creator, colormap, name=None, labels=None,
                       public=None):
        now = datetime.datetime.utcnow()
        doc = {
            'creatorId': creator['_id'],
            'created': now,
            'updatedId': creator['_id'],
            'updated': now,
            'colormap': colormap,
        }
        if name is not None:
            doc['name'] = name
        if labels is not None:
            doc['labels'] = labels
        if colormap:
            doc['binary'] = Binary(colormap_to_bytes(doc['colormap']))
        else:
            doc['binary'] = None

        if public is not None and isinstance(public, bool):
            self.setPublic(doc, public, save=False)

        # give the current user admin access
        self.setUserAccess(doc, user=creator, level=AccessType.ADMIN,
                           save=False)

        return self.save(doc)

    def updateColormap(self, doc, updateUser=None):
        """
        Update a colormap.

        :param docl: the colormap document to update.
        :param updateUser: the user who is creating the update.
        :returns: the colormap document that was updated.
        """
        doc['updated'] = datetime.datetime.utcnow()
        doc['updatedId'] = updateUser['_id'] if updateUser else None
        if 'colormap' in doc:
            if doc['colormap']:
                doc['binary'] = Binary(colormap_to_bytes(doc['colormap']))
            else:
                doc['binary'] = None
        return self.save(doc)

    def validate(self, doc):
        return doc
