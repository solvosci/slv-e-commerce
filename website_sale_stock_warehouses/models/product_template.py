# © 2021 Solvos Consultoría Informática (<http://www.solvos.es>)
# License LGPL-3.0 (http://www.gnu.org/licenses/lgpl-3.0.html)

from odoo import models, fields


class ProductTemplate(models.Model):
    _inherit = "product.template"
    
    def _get_combination_info(self, combination=False, product_id=False, add_qty=1, pricelist=False, parent_combination=False, only_template=False):
        ctx = self.env.context.copy()
        ctx["website_warehouses_ids"] = \
            self.env['website'].get_current_website().get_stock_warehouses()
        products = self.with_context(ctx)
        return super(ProductTemplate, products)._get_combination_info(
            combination=combination,
            product_id=product_id,
            add_qty=add_qty,
            pricelist=pricelist,
            parent_combination=parent_combination,
            only_template=only_template
        )
