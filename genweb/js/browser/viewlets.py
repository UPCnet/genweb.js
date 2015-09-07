from five import grok
from zope.interface import Interface
from genweb.core.browser.viewlets import gwJSViewletManager
from genweb.core.browser.viewlets import baseResourcesViewlet
from genweb.theme.browser.interfaces import IGenwebTheme


class gwJSViewlet(baseResourcesViewlet):
    grok.context(Interface)
    grok.viewletmanager(gwJSViewletManager)
    grok.layer(IGenwebTheme)

    resource_type = 'js'
    current_egg_name = 'genweb.js'
