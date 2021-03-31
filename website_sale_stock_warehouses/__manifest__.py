# © 2021 Solvos Consultoría Informática (<http://www.solvos.es>)
# License LGPL-3 - See http://www.gnu.org/licenses/lgpl-3.0.html
{
    "name": "Website Sale Stock Warehouses",
    "summary": """
        Adds custom warehouses for website stock computing
    """,
    "author": "Solvos",
    "license": "LGPL-3",
    "version": "13.0.1.0.0",
    "category": "Website",
    "website": "https://github.com/solvosci/slv-e-commerce",
    "depends": [
        "website_sale_stock",
    ],
    "data": [
        "views/res_config_settings_views.xml",
    ],
    "post_init_hook": "post_init_hook",
    'installable': True,
}
