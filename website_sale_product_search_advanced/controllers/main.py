# © 2024 Solvos Consultoría Informática (<http://www.solvos.es>)
# License LGPL-3.0 (https://www.gnu.org/licenses/lgpl-3.0.html)

from odoo import fields, http, tools, _
from odoo.osv import expression
from odoo.http import request
from odoo.addons.website_sale.controllers.main import WebsiteSale


class WebsiteSale(WebsiteSale):

    # This method had to be replicated because there was no hook to inject direct ORs
    def _get_search_domain(self, search, category, attrib_values):
        domain_base = super(WebsiteSale, self)._get_search_domain(search, category, attrib_values)
        
        domain = request.website.sale_product_domain()
        if search:
            for srch in search.split(" "):
                domain += [
                    '|', ('website_partner_ref', 'ilike', srch), ('barcode', 'ilike', srch)]
        if category:
            domain += [('public_categ_ids', 'child_of', int(category))]
        if attrib_values:
            attrib = None
            ids = []
            for value in attrib_values:
                if not attrib:
                    attrib = value[0]
                    ids.append(value[1])
                elif value[0] == attrib:
                    ids.append(value[1])
                else:
                    domain += [('attribute_line_ids.value_ids', 'in', ids)]
                    attrib = value[0]
                    ids = [value[1]]
            if attrib:
                domain += [('attribute_line_ids.value_ids', 'in', ids)]		
        
        return expression.OR(
            [domain_base, domain]
        )
