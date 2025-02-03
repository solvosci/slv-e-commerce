# © 2025 Solvos Consultoría Informática (<http://www.solvos.es>)
# License LGPL-3 - See http://www.gnu.org/licenses/lgpl-3.0.html
{
    "name": "Website Sale Size Image Cron",
    "summary": """
        Cron to change size image in the website.
    """,
    "author": "Solvos",
    "license": "LGPL-3",
    "version": "15.0.1.0.0",
    "category": "Website",
    "website": "https://github.com/solvosci/slv-e-commerce",
    "depends": [
        "website_sale",
    ],
    "data": [
        "data/ir_cron.xml",
    ],
    'installable': True,
}
