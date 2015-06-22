# -*- coding: utf-8 -*-
"""Setup/installation tests for this package."""

from genweb.js.testing import IntegrationTestCase
from plone import api


class TestInstall(IntegrationTestCase):
    """Test installation of genweb.js into Plone."""

    def setUp(self):
        """Custom shared utility setup for tests."""
        self.portal = self.layer['portal']
        self.installer = api.portal.get_tool('portal_quickinstaller')

    def test_product_installed(self):
        """Test if genweb.js is installed with portal_quickinstaller."""
        self.assertTrue(self.installer.isProductInstalled('genweb.js'))

    def test_uninstall(self):
        """Test if genweb.js is cleanly uninstalled."""
        self.installer.uninstallProducts(['genweb.js'])
        self.assertFalse(self.installer.isProductInstalled('genweb.js'))

    # browserlayer.xml
    def test_browserlayer(self):
        """Test that IGenwebJsLayer is registered."""
        from genweb.js.interfaces import IGenwebJsLayer
        from plone.browserlayer import utils
        self.failUnless(IGenwebJsLayer in utils.registered_layers())
