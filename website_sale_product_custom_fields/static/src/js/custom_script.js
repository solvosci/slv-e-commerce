odoo.define('website.user_custom_code', function (require) {
    'use strict';

    const publicWidget = require('web.public.widget');
    const core = require('web.core');
    const _t = core._t;
    require('website_sale.website_sale');

    publicWidget.registry.CustomActions = publicWidget.Widget.extend({
        selector: '#wrapwrap',

        start: function () {
            this._showCustomFields();
            this._carrouselStyle();
            this._setupPopupSelector();
            this._setupAddToCartValidation();
            this._injectDateIntoCheckout();
            return this._super.apply(this, arguments);
        },
        _injectDateIntoCheckout: function () {
            const checkoutBtn = document.querySelectorAll('a[href*="/shop/checkout"]');
            const dateInput = document.querySelector('input[name="adv_requested_delivery_date"]');

            if (checkoutBtn.length && dateInput) {
                checkoutBtn.forEach(function (btn) {
                    btn.addEventListener('click', function () {
                        const v = dateInput.value;
                        if (v) {
                            this.href = "/shop/checkout?express=1&adv_requested_delivery_date=" +
                            encodeURIComponent(v);
                        }
                    });
                });
            }
        },

        _setupAddToCartValidation: function () {
            const addToCartBtn = document.querySelector('#add_to_cart, form[action="/shop/cart/update_json"] button[type="submit"]');
            if (!addToCartBtn) return;

            addToCartBtn.addEventListener('click', (ev) => {
                const complementBlock = document.getElementById("product-visual-selection");
                const complementInput = document.getElementById("product-selected-id");
                const complementsAvailable = complementBlock && complementBlock.offsetParent !== null;

                document.querySelectorAll('.adv-error-message').forEach(el => el.remove());
                complementBlock?.classList.remove('border', 'border-warning');

                if (complementsAvailable && complementInput && !complementInput.value.trim()) {
                    ev.preventDefault();
                    ev.stopImmediatePropagation();

                    const msg = document.createElement('div');
                    msg.className = 'adv-error-message alert alert-warning mt-3';
                    msg.textContent = _t("You have to select a complement before submit.");
                    complementBlock.parentNode.insertBefore(msg, complementBlock.nextSibling);

                    complementBlock.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    complementBlock.classList.add('border', 'border-warning');
                    setTimeout(() => complementBlock.classList.remove('border', 'border-warning'), 2000);
                }
            });
        },

        _carrouselStyle: function () {
            const productItems = document.querySelectorAll('.adv-product');
            productItems.forEach(item => {
                const checkbox = item.querySelector('.adv-complement-check');

                item.addEventListener('click', function () {
                    const wasChecked = checkbox.checked;

                    document.querySelectorAll('.adv-complement-check').forEach(cb => cb.checked = false);
                    document.querySelectorAll('.adv-product').forEach(div => div.classList.remove('selected'));

                    if (!wasChecked) {
                        checkbox.checked = true;
                        item.classList.add('selected');
                        sessionStorage.setItem('adv_complement_id', checkbox.value);
                    } else {
                        checkbox.checked = false;
                        sessionStorage.removeItem('adv_complement_id');
                    }
                });
            });

            const selectedId = sessionStorage.getItem('adv_complement_id');
            if (selectedId) {
                const selectedCheckbox = document.querySelector(`.adv-complement-check[value="${selectedId}"]`);
                if (selectedCheckbox) {
                    selectedCheckbox.checked = true;
                    selectedCheckbox.closest('.adv-product').classList.add('selected');
                }
            }
        },

        _showCustomFields: function () {
            const checkbox = document.getElementById("is_tailored_check");
            const noteGroup = document.getElementById("custom_note_group");
            if (checkbox && noteGroup) {
                checkbox.addEventListener('change', function () {
                    noteGroup.style.display = checkbox.checked ? "block" : "none";
                });
            }
        },

        _setupPopupSelector: function () {
            const self = this;
            const productVisualSelection = document.getElementById('product-visual-selection');
            const productSelectedInputId = document.getElementById('product-selected-id');
            const productSelectedImage = document.getElementById('product-selected-image');
            const productSelectedPlaceholder = document.getElementById('product-selected-placeholder');
            const productSelectedBadge = document.getElementById('product-selected-badge');
            const deleteSelectionBtn = document.getElementById('delete-selection-btn');
            const productSelectedPrice = document.getElementById('product-selected-price');
            const customPopup = document.getElementById('custom-popup');
            const cancelSelectionBtn = document.getElementById('cancel-selection');
            const submitSelectionBtn = document.getElementById('submit-selection');
            const popupContentPlaceholder = document.getElementById('popup-content-placeholder');
            let tempProductSelection = null;
            let complementsAvailable = false;

            function _loadComplementsVisibility() {
                if (!productVisualSelection) return;
                const productId = productVisualSelection.dataset.productId;
                if (!productId) return;

                self._rpc({
                    route: "/website/complements/get_products",
                    params: { product_id: productId },
                }).then(function (data) {
                    if (!data || data.trim() === '' || data.error) {
                        complementsAvailable = false;
                        const parentGroup = productVisualSelection.closest('.form-group');
                        if (parentGroup) parentGroup.style.display = 'none';
                    } else {
                        complementsAvailable = true;
                    }
                }).catch(function (error) {
                    console.error("Error verifying complements:", error);
                });
            }

            function _rebindPopupEvents() {
                const availableProducts = customPopup.querySelectorAll('.available-products');
                availableProducts.forEach(elemento => {
                    elemento.addEventListener('click', function () {
                        availableProducts.forEach(el => el.classList.remove('border-primary', 'selected'));
                        this.classList.add('border-primary', 'selected');

                        tempProductSelection = {
                            id: this.dataset.productId,
                            name: this.dataset.productName,
                            imageUrl: this.dataset.productImageUrl,
                            price: this.dataset.productPrice,
                            currency: this.dataset.productCurrency
                        };
                        if (submitSelectionBtn) submitSelectionBtn.disabled = false;
                    });
                });
            }

            function openPopup() {
                if (!complementsAvailable) return;
                const productId = productVisualSelection?.dataset.productId;
                if (!productId) return;

                self._rpc({
                    route: "/website/complements/get_products",
                    params: { product_id: productId },
                }).then(function (data) {
                    if (!data || data.trim() === '' || data.error) return;

                    if (customPopup) {
                        customPopup.classList.remove('d-none');
                        customPopup.classList.add('d-flex');
                    }

                    popupContentPlaceholder.innerHTML = data;
                    _rebindPopupEvents();

                    if (submitSelectionBtn) submitSelectionBtn.disabled = true;
                    const selectedId = productSelectedInputId?.value;
                    if (selectedId) {
                        const currentSelection = customPopup.querySelector(`.available-products[data-product-id="${selectedId}"]`);
                        if (currentSelection) {
                            currentSelection.classList.add('border-primary', 'selected');
                            if (submitSelectionBtn) submitSelectionBtn.disabled = false;
                        }
                    }
                }).catch(() => console.error("Error al cargar complementos."));
            }

            function closePopup() {
                if (customPopup) {
                    customPopup.classList.remove('d-flex');
                    customPopup.classList.add('d-none');
                }
            }

            function resetSeleccionVisual() {
                if (!productSelectedInputId) return;
                productSelectedImage.style.display = 'none';
                productSelectedImage.src = '';
                productSelectedPlaceholder.style.display = 'block';
                productSelectedBadge.classList.add('d-none');
                productSelectedBadge.textContent = '';
                productSelectedInputId.value = '';
                if (productSelectedPrice) {
                    productSelectedPrice.textContent = '';
                    productSelectedPrice.style.display = 'none';
                }
            }

            if (productVisualSelection) {
                productVisualSelection.addEventListener('click', openPopup);
                productVisualSelection.addEventListener('mouseenter', function () {
                    productVisualSelection.classList.add('shadow-lg');
                });
                productVisualSelection.addEventListener('mouseleave', function () {
                    productVisualSelection.classList.remove('shadow-lg');
                });
            }

            if (cancelSelectionBtn) cancelSelectionBtn.addEventListener('click', closePopup);
            if (customPopup) {
                customPopup.addEventListener('click', function (event) {
                    if (event.target === customPopup) closePopup();
                });
            }

            if (submitSelectionBtn) {
                submitSelectionBtn.addEventListener('click', function () {
                    const selectedElement = customPopup.querySelector('.available-products.selected');
                    if (selectedElement) {
                        tempProductSelection = {
                            id: selectedElement.dataset.productId,
                            name: selectedElement.dataset.productName,
                            imageUrl: selectedElement.dataset.productImageUrl,
                            price: selectedElement.dataset.productPrice,
                            currency: selectedElement.dataset.productCurrency
                        };
                        productSelectedInputId.value = tempProductSelection.id;

                        productSelectedImage.src = tempProductSelection.imageUrl;
                        productSelectedImage.style.display = 'block';
                        productSelectedPlaceholder.style.display = 'none';
                        productSelectedBadge.textContent = tempProductSelection.name;
                        productSelectedBadge.classList.remove('d-none');

                        if (productSelectedPrice) {
                            const price = parseFloat(tempProductSelection.price || 0).toFixed(2);
                            const currency = tempProductSelection.currency || '€';
                            productSelectedPrice.textContent = `+ ${price} ${currency}`;
                            productSelectedPrice.style.display = 'block';
                        }
                        closePopup();
                    }
                });
            }

            if (deleteSelectionBtn) {
                deleteSelectionBtn.addEventListener('click', function (e) {
                    e.stopPropagation();
                    resetSeleccionVisual();
                });
            }

            _loadComplementsVisibility();
        }
    });

    publicWidget.registry.WebsiteSale.include({
        _submitForm: function () {
            if (document.getElementById("reference_text")) {
                this.rootProduct.reference = document.getElementById("reference_text").value;
            }

            if (document.getElementById("is_tailored_check")) {
                this.rootProduct.is_tailored = document.getElementById("is_tailored_check").checked;
            }
            if (document.getElementById("pant_type")) {
                this.rootProduct.pant_type = document.getElementById("pant_type").value;
            }

            if (this.rootProduct.is_tailored) {
                this.rootProduct.chest_circumference = document.getElementById("chest_circumference").value;
                this.rootProduct.sleeve_length = document.getElementById("sleeve_length").value;

                if (document.getElementById("arm_circumference") || document.getElementById("dress_length")) {
                    this.rootProduct.arm_circumference = document.getElementById("arm_circumference").value;
                    this.rootProduct.dress_length = document.getElementById("dress_length").value;
                } else {
                    this.rootProduct.jacket_length = document.getElementById("jacket_length").value;
                    this.rootProduct.waist_circumference = document.getElementById("waist_circumference").value;
                    this.rootProduct.pant_length = document.getElementById("pant_length").value;
                }
            }

            if (document.getElementById("custom_note")) {
                this.rootProduct.custom_note = document.getElementById("custom_note").value;
            }

            if (document.getElementById("custom_select")) {
                this.rootProduct.custom_select = document.getElementById("custom_select").value;
            }

            const productSelected = document.getElementById("product-selected-id");
            if (productSelected && productSelected.value.trim() !== '') {
                this.rootProduct.complement_id = parseInt(productSelected.value);
            }

            this._super.apply(this, arguments);
        }
    });
});
