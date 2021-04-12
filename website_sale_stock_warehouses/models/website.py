# © 2021 Solvos Consultoría Informática (<http://www.solvos.es>)
# License LGPL-3.0 (http://www.gnu.org/licenses/lgpl-3.0.html)

from odoo import models, fields


class Website(models.Model):
    _inherit = "website"
    
    warehouse_ids = fields.Many2many(
        "stock.warehouse", 
        string="Warehouses for stock computing",
    )

    def get_stock_warehouses(self):
        self.ensure_one()
        return self.sudo().warehouse_ids.ids or False

    def sale_get_order(self, force_create=False, code=None, update_pricelist=False, force_pricelist=False):
        ctx = self.env.context.copy()
        ctx["website_warehouses_ids"] = \
            self.env['website'].get_current_website().get_stock_warehouses()
        website = self.with_context(ctx)
        return super(Website, website).sale_get_order(
            force_create=force_create,
            code=code,
            update_pricelist=update_pricelist,
            force_pricelist=force_pricelist
        )
