# © 2024 Solvos Consultoría Informática (<http://www.solvos.es>)
# License LGPL-3.0 (https://www.gnu.org/licenses/lgpl-3.0.html)

from odoo import models


class ProductTemplate(models.Model):
    _inherit = "product.template"

    def get_filter_accessory_products(self):
        filter_id = self.env.ref('website_sale.dynamic_filter_cross_selling_accessories').id
        return filter_id