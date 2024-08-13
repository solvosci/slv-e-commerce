# © 2024 Solvos Consultoría Informática (<http://www.solvos.es>)
# License LGPL-3 - See http://www.gnu.org/licenses/lgpl-3.0.html
{
    "name": "Website Sale Stock - disable products without stock",
    "summary": """
        Prevents selecting products in e-Commerce that have no stock.
    """,
    "author": "Solvos",
    "license": "LGPL-3",
    "version": "15.0.1.0.0",
    "category": "Website/Website",
    "website": "https://github.com/solvosci/slv-e-commerce",
    "depends": ["website_sale_stock"],
    "data": [
        "views/website_sale_stock_hide_noqty_templates.xml",
    ],
}
