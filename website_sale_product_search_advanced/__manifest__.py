# © 2024 Solvos Consultoría Informática (<http://www.solvos.es>)
# License LGPL-3.0 (https://www.gnu.org/licenses/lgpl-3.0.html)
{
    "name": "Website Sale Product Search Advanced",
    "summary": """
        Adds an improvement to the website search to be able to search by:
        - website_partner_ref
        - barcode
    """,
    "author": "Solvos",
    "license": "LGPL-3",
    "version": "17.0.1.0.0",
    "category": "Extra Tools",
    "website": "https://github.com/solvosci/slv-e-commerce",
    "depends": ["website_sale"],
    "data": [
        'views/product_template_views.xml'
    ],
    'installable': True,
}
