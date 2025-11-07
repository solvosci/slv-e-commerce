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
        characteristics = self._get_tailored_characteristics(**kw)

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
            order.complement_size(line)
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
                complement_price = request.env['product.template'].sudo().browse(int(line.adv_complement_id.id)).list_price or 0.0

            if line.adv_modification_id:
                modification_price = request.env['sale.order.line.modification'].sudo().browse(int(line.adv_modification_id.id)).price or 0.0

            line.price_unit = base_price + complement_price + modification_price

    @staticmethod
    def _get_tailored_characteristics(**kw):
        if kw.get('pant_type'):
            return _("CP: {cp} // LC: {lc} // LM: {lm} // Pant.: {pant} // CC: {cc} // LP: {lp}").format(
                cp=kw.get('chest_circumference') or '',
                lc=kw.get('jacket_length') or '',
                lm=kw.get('sleeve_length') or '',
                pant=kw.get('pant_type') or '',
                cc=kw.get('waist_circumference') or '',
                lp=kw.get('pant_length') or ''
            )
        else:
            if kw.get('is_tailored'):
                return _("CP: %s // CB: %s // LV: %s // LM: %s") % (
                kw.get('chest_circumference'),
                kw.get('arm_circumference'),
                kw.get('dress_length'),
                kw.get('sleeve_length')
            )

    @http.route(['/shop/checkout'], type='http', auth="public", website=True, sitemap=False)
    def checkout(self, **post):
        response = super().checkout(**post)
        order = request.website.sale_get_order()
        delivery_date = post.get('adv_requested_delivery_date')
        order.adv_requested_delivery_date = delivery_date
        return response
