# © 2025 Solvos Consultoría Informática (<http://www.solvos.es>)
# License LGPL-3 - See http://www.gnu.org/licenses/lgpl-3.0.html

from odoo import http, _
from odoo.http import request
from odoo.addons.website_sale.controllers.main import WebsiteSale


class CustomWebsiteSale(WebsiteSale):

    @http.route(['/shop/cart/update_json'], type='json', auth="public", methods=['POST'], website=True, csrf=False)
    def cart_update_json(self, product_id, line_id=None, add_qty=None, set_qty=None, display=True, **kw):
        """ Override the cart_update_json method to add custom fields to the cart. """
        response = super().cart_update_json(product_id, line_id, add_qty=add_qty, set_qty=set_qty, display=display, **kw)

        if not (set_qty or add_qty):
            return response

        qty = add_qty or set_qty or 0

        reference = kw.get('reference')
        is_tailored = kw.get('is_tailored')
        characteristics = self._get_tailored_characteristics(**kw) if is_tailored else False

        custom_values = {
            'adv_reference': reference,
            'adv_is_tailored': is_tailored,
            'adv_characteristics': characteristics,
            'adv_note': kw.get('custom_note'),
            'adv_modification_id': kw.get('custom_select'),
            'adv_complement_id': kw.get('complement_id'),
        }

        line = request.env['sale.order.line'].browse(response['line_id'])
        order = line.order_id

        self._create_cart_line(line, response, order, product_id, qty, **custom_values)

        for line in order.order_line:
            self._update_price(line)

        return response

    def _create_cart_line(self, line, response, order, product_id, qty, **custom_values):
        new_line = request.env['sale.order.line'].create({
            'order_id': order.id,
            'product_id': product_id,
            'product_uom_qty': qty,
            **custom_values
        })
        response['line_id'] = new_line.id
        self._reduce_or_delete_line(line, qty)

    def _reduce_or_delete_line(self, line, qty):
        if line.product_uom_qty <= qty:
            line.sudo().unlink()
        else:
            line.product_uom_qty -= qty

    def _update_price(self, new_order_line):
        modification_price = 0.0
        complement_price = 0.0
        for line in new_order_line:
            base_price = line.adv_unitary_product_price or 0.0

            if line.adv_complement_id:
                complement_price = request.env['product.template'].browse(int(line.adv_complement_id.id)).list_price or 0.0

            if line.adv_modification_id:
                modification_price = request.env['sale.order.line.modification'].sudo().browse(int(line.adv_modification_id.id)).price or 0.0

            line.price_unit = base_price + complement_price + modification_price

    @staticmethod
    def _get_tailored_characteristics(**kw):
        if kw.get('pant_type'):
            return _("CP: %s // LC: %s // LM: %s // Pant.: %s // CC: %s // LP: %s") % (
                kw.get('chest_circumference'),
                kw.get('jacket_length'),
                kw.get('sleeve_length'),
                kw.get('pant_type'),
                kw.get('waist_circumference'),
                kw.get('pant_length')
            )
        else:
            return _("CP: %s // CB: %s // LV: %s // LM: %s") % (
                kw.get('chest_circumference'),
                kw.get('arm_circumference'),
                kw.get('dress_length'),
                kw.get('sleeve_length')
            )
