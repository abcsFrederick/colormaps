#!/usr/bin/env python
# -*- coding: utf-8 -*-
from __future__ import division
import datetime
import numpy as np
from bson.binary import Binary

from girder.constants import AccessType
from girder.models.model_base import AccessControlledModel
from girder.exceptions import RestException


def colormap_to_bytes(colormap, labels, default=None):
    palette = []
    for i in range(3):
        for j in range(int(max(labels)) + 1):
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
            'useAsIs'
        ))

    def createColormap(self, creator, colormap, name=None, labels=None,
                       public=None, useAsIs=None):
        now = datetime.datetime.utcnow()
        doc = {
            'creatorId': creator['_id'],
            'created': now,
            'updatedId': creator['_id'],
            'updated': now,
            'colormap': colormap,
            'useAsIs': useAsIs
        }
        if name is not None:
            doc['name'] = name
        if labels is not None:
            doc['labels'] = labels
        if colormap:
            doc['binary'] = Binary(colormap_to_bytes(doc['colormap'], labels))
        else:
            doc['binary'] = None

        if public is not None and isinstance(public, bool):
            self.setPublic(doc, public, save=False)

        # give the current user admin access
        self.setUserAccess(doc, user=creator, level=AccessType.ADMIN,
                           save=False)

        return self.save(doc)

    def createColormapFromGradient(self, creator, gradient, name=None, labels=None,
                                   public=None, useAsIs=None):
        if useAsIs:
            gradient = [list( map(int,i) ) for i in gradient]
            labels = list(map(int, labels))
            colors = np.zeros(256 * 3)
            colors = colors.reshape(256,3)
            hashtable = {}

            for index, label in enumerate(labels):
                hashtable[label] = gradient[index]
            _min = min(labels)
            _max = max(labels)
            for index, color in enumerate(colors):
                if index >= _max:
                    colors[index] = hashtable[_max]
                elif index < _min:
                    colors[index] = hashtable[_min]
                else:
                    try:
                        colors[index] = hashtable[index]
                    except:
                        colors[index] = colors[index - 1]

            colors = colors.tolist()

            self.createColormap(creator, colors, name, labels, public, useAsIs)
        else:
            if len(gradient) <= 1:
                raise RestException('At least one label is needed except background')
            # max pixel value
            n = 256
            n = int(max(labels)) + 1
            colors = []
            section = (n - 1) // (len(gradient) - 1)
            remainder = (n - 1) % (len(gradient) - 1)

            end = 0
            for i, color in enumerate(gradient[:-1]):
                start = end
                end = start + section + (i < remainder)
                for j in range(start, end):
                    colors.append([int(round((j - start)/(end - start) * (int(gradient[i +
                                                                          1][channel])
                                                                          -
                                                                          int(gradient[i][channel]))
                                             + int(gradient[i][channel]))) for channel in range(3)])
            colors.append(list(map(int, gradient[-1])))

            self.createColormap(creator, colors, name, labels, public, useAsIs)

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
