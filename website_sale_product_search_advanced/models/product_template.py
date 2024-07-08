# © 2024 Solvos Consultoría Informática (<http://www.solvos.es>)
# License LGPL-3.0 (https://www.gnu.org/licenses/lgpl-3.0.html)

from odoo import models, fields, api


class ProductTemplate(models.Model):
    _inherit = "product.template"

    website_partner_ref = fields.Char(
        string='Partner Reference'
    )

    @api.model
    def _search_get_detail(self, website, order, options):
        res = super()._search_get_detail(website, order, options)
        res['search_fields'].append('product_variant_ids.barcode')
        res['search_fields'].append('website_partner_ref')
        return res
