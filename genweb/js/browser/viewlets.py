from five import grok
from plone import api
from zope.interface import Interface
from plone.memoize import forever
from genweb.core.browser.viewlets import gwJSViewletManager
from genweb.theme.browser.interfaces import IGenwebTheme

import json
import pkg_resources


class gwJSDevelViewlet(grok.Viewlet):
    grok.context(Interface)
    grok.viewletmanager(gwJSViewletManager)
    grok.layer(IGenwebTheme)

    resource_type = 'js'

    def is_devel_mode(self):
        return api.env.debug_mode()

    def read_resource_config_file(self):
        genwebjsegg = pkg_resources.get_distribution('genweb.js')
        resource_file = open('{}/config.json'.format(genwebjsegg.location))
        return resource_file.read()

    @forever.memoize
    def get_resources(self):
        true_http_path = []
        resources_conf = json.loads(self.read_resource_config_file())
        replace_map = resources_conf['replace_map']

        for kind in resources_conf['order']:
            devel_resources = resources_conf['resources'][kind][self.resource_type]['development']
            for resource in devel_resources:
                found = False
                for source, destination in replace_map.items():
                    if source in resource:
                        true_http_path.append(resource.replace(source, destination))
                        found = True
                if not found:
                    true_http_path.append(resource)

        return true_http_path


class gwJSProductionViewlet(grok.Viewlet):
    grok.context(Interface)
    grok.viewletmanager(gwJSViewletManager)
    grok.layer(IGenwebTheme)

    resource_type = 'js'

    def is_devel_mode(self):
        return api.env.debug_mode()

    def read_resource_config_file(self):
        genwebjsegg = pkg_resources.get_distribution('genweb.js')
        resource_file = open('{}/config.json'.format(genwebjsegg.location))
        return resource_file.read()

    @forever.memoize
    def get_resources(self):
        true_http_path = []
        resources_conf = json.loads(self.read_resource_config_file())
        replace_map = resources_conf['replace_map']
        for kind in resources_conf['order']:
            production_resources = resources_conf['resources'][kind][self.resource_type]['production']
            for resource in production_resources:
                for res_rev_key in resources_conf['revision_info']:
                    if resource == res_rev_key:
                        resource = resources_conf['revision_info'][res_rev_key]

                found = False
                for source, destination in replace_map.items():
                    if source in resource:
                        true_http_path.append(resource.replace(source, destination))
                        found = True
                if not found:
                    true_http_path.append(resource)

        return true_http_path
