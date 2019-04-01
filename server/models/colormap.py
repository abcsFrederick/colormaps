#!/usr/bin/env python
# -*- coding: utf-8 -*-

from girder.models.model_base import AccessControlledModel


class Colormap(AccessControlledModel):
    def initialize(self):
        self.name = 'colormap'
