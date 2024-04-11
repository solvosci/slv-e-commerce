# © 2024 Solvos Consultoría Informática (<http://www.solvos.es>)
# License LGPL-3.0 (https://www.gnu.org/licenses/lgpl-3.0.html)

from odoo import models, fields


class ProductTemplate(models.Model):
    _inherit = "product.template"

    website_partner_ref = fields.Char(
        string='Partner Reference'
    )
