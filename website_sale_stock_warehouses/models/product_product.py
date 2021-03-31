# © 2021 Solvos Consultoría Informática (<http://www.solvos.es>)
# License LGPL-3.0 (http://www.gnu.org/licenses/lgpl-3.0.html)

from odoo import models, fields


class ProductProduct(models.Model):
    _inherit = "product.product"
    
    def _get_domain_locations(self):
        ctx = self.env.context.copy()
        if ctx.get("website_warehouses_ids", False):            
            ctx["warehouse"] = ctx.get("website_warehouses_ids")
        products = self.with_context(ctx)
        return super(ProductProduct, products)._get_domain_locations()
