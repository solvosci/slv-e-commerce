# © 2021 Solvos Consultoría Informática (<http://www.solvos.es>)
# License LGPL-3.0 (http://www.gnu.org/licenses/lgpl-3.0.html)

from odoo import api, models, fields


class ResConfigSettings(models.TransientModel):
    _inherit = "res.config.settings"
    
    website_warehouse_ids = fields.Many2many(
        "stock.warehouse", 
        related="website_id.warehouse_ids", 
        domain="[('company_id', '=', website_company_id)]",
        readonly=False
    )

    @api.onchange("website_company_id")
    def _onchange_website_company_id(self):
        ret = super()._onchange_website_company_id()
        if self.website_warehouse_ids and \
            self.website_warehouse_ids.mapped("company_id")[0] \
                != self.website_company_id:
            ret = ret or {"value": {}}
            ret["value"]["website_warehouse_ids"] = False
            return ret
