# © 2025 Solvos Consultoría Informática (<http://www.solvos.es>)
# License LGPL-3 - See http://www.gnu.org/licenses/lgpl-3.0.html

from odoo import models, fields


class ProductTemplate(models.Model):
    _inherit = 'product.template'

    kid_gender = fields.Selection([
        ('boy', 'Boy'),
        ('girl', 'Girl'),
    ], string='Kid Gender')