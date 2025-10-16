# © 2025 Solvos Consultoría Informática (<http://www.solvos.es>)
# License LGPL-3 - See http://www.gnu.org/licenses/lgpl-3.0.html
{
    "name": "Website Sale Product Custom Fields",
    "summary": """
        Add fields to product website.
    """,
    "author": "Solvos",
    "license": "LGPL-3",
    "version": "15.0.2.0.0",
    "category": "Website",
    "website": "https://github.com/solvosci/slv-e-commerce",
    "depends": [
        "website_sale",
        'sale_order_field_advanced',
    ],
    "assets": {
        "web.assets_frontend": [
            "website_sale_product_custom_fields/static/src/js/custom_script.js",
            "website_sale_product_custom_fields/static/src/css/custom_style.css",
        ],
    },
    'data': [
        'security/ir_rule_data.xml',
        'views/complement_popup_template.xml',
        'views/product_template_views.xml',
        'views/website_sale_product_template_inherit.xml'
    ],
    'installable': True,
}
