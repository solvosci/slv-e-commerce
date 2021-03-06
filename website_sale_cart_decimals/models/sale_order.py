# © 2021 Solvos Consultoría Informática (<http://www.solvos.es>)
# License LGPL-3.0 (http://www.gnu.org/licenses/lgpl-3.0.html)

from odoo import models, fields


class SaleOrder(models.Model):
    _inherit = "sale.order"
    
    cart_quantity = fields.Float(compute='_compute_cart_info')
    
    #To do a more complete rounding for odoo
    def _compute_cart_info(self):
        super()._compute_cart_info()
        for order in self:
            order.cart_quantity = float(
                round(sum(order.mapped('website_order_line.product_uom_qty')), 2)
            )
