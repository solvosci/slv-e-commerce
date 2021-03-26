/*  © 2021 Solvos Consultoría Informática (<http://www.solvos.es>)
    License LGPL-3.0 (http://www.gnu.org/licenses/lgpl-3.0.html)
*/

odoo.define('website_sale_cart_decimals.widgets', function (require) {
    "use strict";

    var variant_mixin = require('sale.VariantMixin');

    variant_mixin.onClickAddCartJSON = function (ev) {
        ev.preventDefault();
        var $link = $(ev.currentTarget);
        var $input = $link.closest('.input-group').find("input");
        var min = parseFloat($input.data("min") || 0);
        var max = parseFloat($input.data("max") || Infinity);
        var previousQty = parseFloat($input.val() || 0, 10);
        var quantity = ($link.has(".fa-minus").length ? -1 : 1) + previousQty;
        var newQty = quantity > min ? (quantity < max ? quantity : max) : min;

        //Round the quantity of the product by possible errors when adding decimals 
        newQty = Math.round(newQty * 100) / 100;

        if (newQty !== previousQty) {
            $input.val(newQty).trigger('change');
        }
        return false;
    };
});
