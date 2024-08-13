# © 2024 Solvos Consultoría Informática (<http://www.solvos.es>)
# License LGPL-3 - See http://www.gnu.org/licenses/lgpl-3.0.html

from odoo.addons.sale.controllers.variant import VariantController as VC


class VariantController(VC):
    
    def get_combination_info(
        self,
        product_template_id,
        product_id,
        combination,
        add_qty,
        pricelist_id,
        **kw
    ):
        res = super().get_combination_info(
            product_template_id, product_id, combination, add_qty, pricelist_id, **kw
        )
        # TODO float_compare
        if (
            res.get("is_combination_possible", False)
            and "free_qty" in res
            and res.get("free_qty") <= 0.0
        ):
            res["is_combination_possible"] = False
            
        return res
