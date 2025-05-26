odoo.define('website.user_custom_code', function (require) {
    'use strict';

    var publicWidget = require('web.public.widget');
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
            const productVisualSelection = document.getElementById('product-visual-selection');
            const productSelectedInputId = document.getElementById('product-selected-id');
            const productSelectedImage = document.getElementById('product-selected-image');
            const productSelectedPlaceholder = document.getElementById('product-selected-placeholder');
            const productSelectedBadge = document.getElementById('product-selected-badge');
            const deleteSelectionBtn = document.getElementById('delete-selection-btn');

            const productSelectedPrice = document.getElementById('product-selected-price');

            const popupProductImage = document.getElementById('popup-product-image');
            const popupProductName = document.getElementById('popup-product-name');
            const popupProductPrice = document.getElementById('popup-product-price');

            const customPopup = document.getElementById('custom-popup');
            const closePopupBtn = document.getElementById('close-popup');
            const cancelSelectionBtn = document.getElementById('cancel-selection');
            const submitSelectionBtn = document.getElementById('submit-selection');

            const availableProducts = document.querySelectorAll('.available-products');
            let tempProductSelection = null;

            function openPopup() {
                if (customPopup) {
                    customPopup.classList.remove('d-none');
                    customPopup.classList.add('d-flex');
                }

                availableProducts.forEach(el => el.classList.remove('border-primary', 'selected'));
                tempProductSelection = null;
                if (submitSelectionBtn) submitSelectionBtn.disabled = true;

                const productId = productSelectedInputId?.value;
                if (productId) {
                    availableProducts.forEach(el => {
                        if (el.dataset.productId === productId) {
                            el.classList.add('border-primary', 'selected');
                            tempProductSelection = {
                                id: el.dataset.productId,
                                name: el.dataset.productName,
                                imageUrl: el.dataset.productImageUrl,
                                price: el.dataset.productPrice,
                                currency: el.dataset.productCurrency
                            };

                            const price = parseFloat(tempProductSelection.price || 0).toFixed(2);
                            const currency = tempProductSelection.currency || '€';

                            if (popupProductImage && popupProductName && popupProductPrice) {
                                popupProductImage.src = tempProductSelection.imageUrl;
                                popupProductImage.style.display = 'block';
                                popupProductName.textContent = tempProductSelection.name;
                                popupProductPrice.textContent = `+ ${price} ${currency} `;
                                popupProductPrice.style.display = 'block';
                            }
                            if (submitSelectionBtn) submitSelectionBtn.disabled = false;
                        }
                    });
                } else {
                    if (popupProductImage && popupProductName && popupProductPrice) {
                        popupProductImage.style.display = 'none';
                        popupProductImage.src = '';
                        popupProductName.textContent = '';
                        popupProductPrice.style.display = 'none';
                        popupProductPrice.textContent = '';
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

            if (closePopupBtn) closePopupBtn.addEventListener('click', closePopup);
            if (cancelSelectionBtn) cancelSelectionBtn.addEventListener('click', closePopup);
            if (customPopup) {
                customPopup.addEventListener('click', function (event) {
                    if (event.target === customPopup) closePopup();
                });
            }

            if (availableProducts.length > 0) {
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

                        const price = parseFloat(tempProductSelection.price || 0).toFixed(2);
                        const currency = tempProductSelection.currency || '€';

                        if (popupProductImage && popupProductName && popupProductPrice) {
                            popupProductImage.src = tempProductSelection.imageUrl;
                            popupProductImage.style.display = 'block';
                            popupProductName.textContent = tempProductSelection.name;
                            popupProductPrice.textContent = `+ ${price} ${currency}`;
                            popupProductPrice.style.display = 'block';
                        }

                        if (submitSelectionBtn) submitSelectionBtn.disabled = false;
                    });
                });
            }

            if (submitSelectionBtn) {
                submitSelectionBtn.addEventListener('click', function () {
                    if (tempProductSelection) {
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
