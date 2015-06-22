from five import grok
from plone import api
from zope.interface import Interface
from genweb.core.browser.viewlets import gwJSViewletManager

from genweb.theme.browser.interfaces import IGenwebTheme


class gwJSDevelViewlet(grok.Viewlet):
    grok.context(Interface)
    grok.viewletmanager(gwJSViewletManager)
    grok.layer(IGenwebTheme)

    def is_devel_mode(self):
        return api.env.debug_mode()


class gwJSProductionViewlet(grok.Viewlet):
    grok.context(Interface)
    grok.viewletmanager(gwJSViewletManager)
    grok.layer(IGenwebTheme)

    def is_devel_mode(self):
        return api.env.debug_mode()
