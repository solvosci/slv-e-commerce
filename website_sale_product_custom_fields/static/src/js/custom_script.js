odoo.define('website.user_custom_code', function (require) {
    'use strict';

    var publicWidget = require('web.public.widget');
    var core = require('web.core');
    var _t = core._t;
    require('website_sale.website_sale');

    publicWidget.registry.CustomActions = publicWidget.Widget.extend({
        selector: '#wrapwrap',

        start: function () {
            this._showCustomFields();
            this._carrouselStyle();
            this._setupPopupSelector();
            return this._super.apply(this, arguments);
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
            var checkbox = document.getElementById("is_tailored_check");
            var noteGroup = document.getElementById("custom_note_group");
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
            let hasLoaded = false;
            let tempProductSelection = null;

            function _loadComplements() {
                const productId = productVisualSelection.dataset.productId;

                if (popupContentPlaceholder) {
                    popupContentPlaceholder.innerHTML = _t('<div class="text-center p-5"><div class="spinner-border" role="status"></div><p class="mt-2">Loading complements...</p></div>');
                }

                self._rpc({
                    route: "/website/complements/get_products",
                    params: {
                        product_id: productId,
                    },
                }).then(function (data) {
                    if (data.error) {
                        popupContentPlaceholder.innerHTML = _t('<p class="text-danger p-3">Error: ') + data.error + '</p>';
                    } else {
                        popupContentPlaceholder.innerHTML = data;
                        hasLoaded = true;

                        _rebindPopupEvents();
                    }
                }).catch(function (error) {
                    popupContentPlaceholder.innerHTML = _t('<p class="text-danger p-3">Error loading complements.</p>');
                });
            }

            function _rebindPopupEvents() {
                const availableProducts = customPopup.querySelectorAll('.available-products');

                availableProducts.forEach(elemento => {
                    elemento.addEventListener('click', function () {
                        availableProducts.forEach(el => el.classList.remove('border-primary', 'selected'));
                        this.classList.add('border-primary', 'selected');

                        const selectedData = {
                            id: this.dataset.productId,
                            name: this.dataset.productName,
                            imageUrl: this.dataset.productImageUrl,
                            price: this.dataset.productPrice,
                            currency: this.dataset.productCurrency
                        };

                        if (submitSelectionBtn) submitSelectionBtn.disabled = false;
                        tempProductSelection = selectedData;
                    });
                });
            }

            function openPopup() {
                if (customPopup) {
                    customPopup.classList.remove('d-none');
                    customPopup.classList.add('d-flex');
                }

                if (!hasLoaded) {
                    _loadComplements();
                } else {
                    const availableProducts = customPopup.querySelectorAll('.available-products');
                    availableProducts.forEach(el => el.classList.remove('border-primary', 'selected'));
                    if (submitSelectionBtn) submitSelectionBtn.disabled = true;

                    const productId = productSelectedInputId?.value;
                    if (productId) {
                        const currentSelection = customPopup.querySelector(`.available-products[data-product-id="${productId}"]`);
                        if(currentSelection) {
                            currentSelection.classList.add('border-primary', 'selected');
                            if (submitSelectionBtn) submitSelectionBtn.disabled = false;
                        }
                    }
                }
            }

            function closePopup() {
                if (customPopup) {
                    customPopup.classList.remove('d-flex');
                    customPopup.classList.add('d-none');
                }
            }

            function resetSeleccionVisual() {
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

                        if (productSelectedBadge) {
                            productSelectedBadge.textContent = tempProductSelection.name;
                            productSelectedBadge.classList.remove('d-none');
                        }

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
        }

    });

    publicWidget.registry.WebsiteSale.include({
        _submitForm: function () {
            var errorMessage = document.getElementById("error_message_reference");
            if (errorMessage) errorMessage.remove();

            if (document.getElementById("reference_text")) {
                this.rootProduct.reference = document.getElementById("reference_text").value;
            }

            if (document.getElementById("is_tailored_check")) {
                this.rootProduct.is_tailored = document.getElementById("is_tailored_check").checked;
            }

            if (this.rootProduct.is_tailored) {
                this.rootProduct.chest_circumference = document.getElementById("chest_circumference").value;
                this.rootProduct.sleeve_length = document.getElementById("sleeve_length").value;

                if (document.getElementById("pant_type") != null) {
                    this.rootProduct.jacket_length = document.getElementById("jacket_length").value;
                    this.rootProduct.pant_type = document.getElementById("pant_type").value;
                    this.rootProduct.waist_circumference = document.getElementById("waist_circumference").value;
                    this.rootProduct.pant_length = document.getElementById("pant_length").value;
                } else {
                    this.rootProduct.arm_circumference = document.getElementById("arm_circumference").value;
                    this.rootProduct.dress_length = document.getElementById("dress_length").value;
                }
            }

            if (document.getElementById("custom_note")) {
                this.rootProduct.custom_note = document.getElementById("custom_note").value;
            }

            if (document.getElementById("custom_select")) {
                this.rootProduct.custom_select = document.getElementById("custom_select").value;
            }

            if (document.getElementById("product-selected-id")) {
                const productSelected = document.getElementById("product-selected-id").value;
                if(!productSelected == '') {
                    this.rootProduct.complement_id = productSelected;
                }
            }

            this._super.apply(this, arguments);
        },

        _raiseFormError: function (error_message, error_text, field_id) {
            document.getElementById(field_id).classList.add("error");
            var errorSpan = document.createElement("span");
            errorSpan.id = error_message;
            errorSpan.style.color = "red";
            errorSpan.style.fontSize = "12px";
            errorSpan.textContent = error_text;
            document.getElementById(field_id).parentNode.appendChild(errorSpan);
        }
    });
});
