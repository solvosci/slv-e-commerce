# © 2021 Solvos Consultoría Informática (<http://www.solvos.es>)
# License LGPL-3 - See https://www.gnu.org/licenses/lgpl-3.0.html

from odoo import api, SUPERUSER_ID


def post_init_hook(cr, registry):
    env = api.Environment(cr, SUPERUSER_ID, {})
    websites = env["website"].search([('warehouse_id', '!=', False)])

    for website in websites:
        website.warehouse_ids = [(6, 0, [website.warehouse_id.id])]
