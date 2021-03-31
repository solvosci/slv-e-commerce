# © 2021 Solvos Consultoría Informática (<http://www.solvos.es>)
# License LGPL-3.0 (http://www.gnu.org/licenses/lgpl-3.0.html)

from odoo import models, fields


class SaleOrder(models.Model):
    _inherit = "sale.order"
    
    def _cart_update(self, product_id=None, line_id=None, add_qty=0, set_qty=0, **kwargs):
        ctx = self.env.context.copy()
        ctx["website_warehouses_ids"] = \
            self.env['website'].get_current_website().get_stock_warehouses()
        orders = self.with_context(ctx)
        return super(SaleOrder, orders)._cart_update(product_id, line_id, add_qty, set_qty, **kwargs)
