# © 2025 Solvos Consultoría Informática (<http://www.solvos.es>)
# License LGPL-3 - See http://www.gnu.org/licenses/lgpl-3.0.html

from odoo import http
from odoo.http import request


class ProductComplements(http.Controller):

    @http.route('/website/complements/get_products', type='json', auth="public", methods=['POST'], website=True)
    def get_complementary_products(self, product_id):

        product = request.env['product.template'].sudo().browse(int(product_id))
        complement_data = []

        for category_id in product.complement_category_ids.sudo():
            complement_products = request.env['product.template'].sudo().search([
                ('categ_id', '=', category_id.id)
            ])

            if complement_products:
                products_list = []
                for p in complement_products:
                    products_list.append({
                        'id': p.id,
                        'name': p.name,
                        'list_price': p.list_price,
                        'currency_symbol': p.currency_id.symbol,
                        'variant_price': p.product_variant_ids and p.product_variant_ids[0].lst_price or p.list_price,
                    })

                complement_data.append({
                    'category_name': category_id.name,
                    'products': products_list,
                })

        return request.env['ir.ui.view']._render_template(
            'website_sale_product_custom_fields.complement_popup_content',
            {
                'complement_data': complement_data,
                'product': product.sudo(),
            }
        )
