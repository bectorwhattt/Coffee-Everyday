(() => {
    const checkout = document.querySelector(".main");
    if (!checkout) return;

    // Only the products legible in the supplied screenshots are included.
    const catalog = {
        "Coffee Classics": [
            ["Americano", 120], ["Cafe Latte", 150], ["Cappucino", 150],
            ["French Vanilla", 170], ["Salted Caramel", 170], ["Spanish Latte", 180],
            ["Seasalt Latte", 180], ["Caramel Macchiato", 180], ["Cafe Mocha", 180],
            ["Dark Choc Mocha", 180], ["White Mocha", 170], ["Hazelnut Mocha", 170]
        ],
        "Coffee Specials": [
            ["Toffeedamia", 190], ["Roasted Almondamia", 190], ["Biscoffee", 200],
            ["Oreo Madness", 200], ["C.E. Barista Blend", 220]
        ],
        "Non-coffee": [
            ["Signature Choco", 150], ["Milky Strawberry", 150], ["Dark Chocolate", 150],
            ["Matcha Latte", 170], ["Berry Matcha", 190], ["Oreo Milk", 150],
            ["Nutella Latte", 150], ["Biscoff Latte", 150]
        ],
        "Frappes & Shakes": [
            ["Vanilla Milkshake", 170], ["Strawberries & Cream", 170],
            ["Oreos & Cream", 170], ["Dark Mocha Frappe", 190],
            ["Java Chip Frappe", 190], ["Seasalt Frappe", 190]
        ],
        "Soda Pop": [],
        "Bread & Pastries": [
            ["Butter Croissant", 70], ["Pain Au Chocolat", 80],
            ["Choco Chip Cookies", 90], ["White Chocochip Cookies", 90]
        ],
        "Sandwiches": [
            ["Ham & Egg Sandwich", 160], ["Spam Sandwich", 170],
            ["Chicken Fillet Sandwich", 180]
        ],
        "Snacks": [
            ["French Fries (salted/cheese)", 90], ["Twister Fries", 110],
            ["Mojos", 120], ["Pica Platter", 199],
            ["4pcs Nuggets & Fries", 140], ["3pcs Chicken Tenders w/ dip", 160],
            ["Chicken Popcorn", 110]
        ],
        "Pastas": [
            ["Creamy Sausage & Shrimp Cajun", 250],
            ["Spicy Shrimp Aglio Olio", 220], ["Cheesy Tuna Pesto", 220]
        ],
        "Rice Meals": [
            ["Allday Spam Rice", 250], ["Sausage Delight, 1pc", 220],
            ["Sausage Delight, 2pcs", 220], ["Chicken Pastil (spicy / orig)", 250],
            ["Tori Katsu with Cabbage Salad", 220], ["2-pc Mushroom Burger Steak", 220],
            ["Chicken Peppered Steak", 250], ["4-pc Nuggets with rice", 220]
        ]
    };

    const cart = new Map([
        ["Spanish Latte", { price: 180, quantity: 1 }],
        ["Pain Au Chocolat", { price: 80, quantity: 1 }]
    ]);
    let activeCategory = "Coffee Classics";

    const categoryButtons = checkout.querySelectorAll(".checkout-category");
    const itemsTitle = checkout.querySelector("#checkout-items-title");
    const productsContainer = checkout.querySelector("#checkout-products");
    const orderItems = checkout.querySelector("#order-items");
    const orderListScroll = checkout.querySelector("#order-list-scroll");
    const cashInput = checkout.querySelector("#order-cash-amount");
    const cashError = checkout.querySelector("#order-cash-error");
    const exactCheckbox = checkout.querySelector("#order-exact");
    const orderStatus = checkout.querySelector("#order-status");

    const money = (value, digits = 0) => "\u20B1" + value.toLocaleString("en-PH", {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits
    });

    const makeElement = (tagName, className, value) => {
        const element = document.createElement(tagName);
        element.className = className;
        if (value !== undefined) element.textContent = value;
        return element;
    };

    // Product photos belong to assets/images/products/inventory/.
    // Use the same filenames on the Checkout and Recipes pages.
    // Keep the photo extension when renaming the original image file.
    const inventoryImageDirectory = "../../../../assets/images/products/inventory/";
    const inventoryImageExtensions = ["webp", "jpg", "jpeg", "png"];
    const inventoryImageNames = {
        "pica platter": "pica-platter",
        "mojos": "mojos",
        "twister fries": "twister-fries",
        "berry matcha": "berry-matcha",
        "dark chocolate": "dark-chocolate",
        "matcha latte": "matcha-latte",
        "milky strawberry": "milky-strawberry",
        "signature choco": "signature-choco",
        "toffeedamia": "toffeedamia",
        "seasalt latte": "seasalt-latte",
        "cafe mocha": "mocha-white-mocha",
        "salted caramel": "salted-caramel",
        "spanish latte": "spanish-latte",
        "caramel macchiato": "caramel-macchiato",
        "cafe latte": "cafe-latte",
        "cappucino": "cappuccino",
        "americano": "americano",
        "pain au chocolat": "pain-au-chocolat",
        "spicy shrimp aglio olio": "spicy-shrimp-aglio-olio",
        "cheesy tuna pesto": "cheesy-tuna-pesto",
        "tori katsu with cabbage salad": "tori-katsu-with-cabbage-salad",
        "2-pc mushroom burger steak": "mushroom-burger-steak",
        "chicken pastil (spicy / orig)": "chicken-pastil",
        "sausage delight, 2pcs": "sausage-delight",
        "chicken fillet sandwich": "chicken-fillet-sandwich",
        "ham & egg sandwich": "ham-egg-sandwich",
        // Tentative matches: verify the product/photo identity before use.
        "french fries (salted/cheese)": "french-fries-salted-cheese",
        "choco chip cookies": "choco-chip-cookies",
        "allday spam rice": "allday-spam-rice",
    };
    const inventoryImageStem = (name) =>
        inventoryImageNames[String(name || "").trim().toLowerCase()] || "";

    const makeImage = (className, productName) => {
        const container = makeElement("div", className);
        const placeholder = () => {
            container.innerHTML = '<svg class="checkout-image-icon" aria-hidden="true"><use href="#checkout-image-symbol"></use></svg>';
        };
        const filename = inventoryImageStem(productName);
        if (!filename) {
            placeholder();
            return container;
        }

        const image = document.createElement("img");
        image.alt = productName;
        image.loading = "lazy";
        image.decoding = "async";
        let extensionIndex = 0;
        image.addEventListener("error", () => {
            extensionIndex++;
            if (extensionIndex < inventoryImageExtensions.length) {
                image.src = inventoryImageDirectory + filename + "." + inventoryImageExtensions[extensionIndex];
            } else {
                placeholder();
            }
        });
        image.src = inventoryImageDirectory + filename + "." + inventoryImageExtensions[0];
        container.appendChild(image);
        return container;
    };

    const calculateTotal = () => {
        let total = 0;
        cart.forEach((item) => { total += item.price * item.quantity; });
        return total;
    };

    const maximumQuantity = 9999;

    const updateCart = (name, price, change) => {
        const current = cart.get(name);
        const quantity = Math.min(maximumQuantity, (current ? current.quantity : 0) + change);
        if (quantity > 0) cart.set(name, { price, quantity });
        else cart.delete(name);
        orderStatus.textContent = "";
        renderProducts();
        renderOrder();
    };

    const removeCartItem = (name) => {
        cart.delete(name);
        orderStatus.textContent = "";
        renderProducts();
        renderOrder();
    };

    const syncScrollShadows = () => {
        const canScroll = orderItems.scrollHeight > orderItems.clientHeight + 1;
        const atTop = orderItems.scrollTop <= 1;
        const atBottom = orderItems.scrollTop + orderItems.clientHeight >= orderItems.scrollHeight - 1;
        orderListScroll.classList.toggle("order-list-shadow-top", canScroll && !atTop);
        orderListScroll.classList.toggle("order-list-shadow-bottom", canScroll && !atBottom);
    };

    const updateOrderAmounts = () => {
        const total = calculateTotal();
        const subtotal = total / 1.12;
        const vat = total - subtotal;
        checkout.querySelector("#order-subtotal").textContent = money(subtotal, 2);
        checkout.querySelector("#order-vat").textContent = money(vat, 2);
        checkout.querySelector("#order-total").textContent = money(total);
        if (exactCheckbox.checked) cashInput.value = total.toFixed(2);
        updateChange();
        if (cashError.textContent) validateCash();
    };

    const renderProducts = () => {
        itemsTitle.textContent = activeCategory;
        productsContainer.replaceChildren();

        catalog[activeCategory].forEach(([name, price]) => {
            const quantity = cart.get(name)?.quantity || 0;
            const product = makeElement("button", "checkout-product");
            product.type = "button";
            product.setAttribute("aria-label", `Add ${name}, ${money(price)} to the order`);
            if (quantity) product.classList.add("checkout-product-selected");

            product.appendChild(makeImage("checkout-product-image", name));
            product.appendChild(makeElement("div", "checkout-product-name", name));
            product.appendChild(makeElement("div", "checkout-product-price", money(price)));
            if (quantity) {
                product.appendChild(makeElement("div", "checkout-product-badge", `\u00D7${quantity}`));
            }
            product.addEventListener("click", () => updateCart(name, price, 1));
            productsContainer.appendChild(product);
        });
    };

    const renderOrder = () => {
        const previousScrollTop = orderItems.scrollTop;
        orderItems.replaceChildren();

        cart.forEach(({ price, quantity }, name) => {
            const item = makeElement("div", "order-item");

            const deleteButton = makeElement("button", "order-item-delete");
            deleteButton.type = "button";
            deleteButton.title = `Delete ${name} from the order`;
            deleteButton.setAttribute("aria-label", `Delete ${name} from the order`);
            deleteButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M10 4h4M7 7l1 13h8l1-13M10 10v7M14 10v7"/></svg>';
            deleteButton.addEventListener("click", () => removeCartItem(name));
            item.appendChild(deleteButton);

            const details = makeElement("div", "order-item-details");
            details.appendChild(makeElement("p", "order-item-name", name));
            details.appendChild(makeElement("p", "order-item-price", `${money(price)} each`));
            item.appendChild(details);

            const controls = makeElement("div", "order-item-quantity");
            const decrease = makeElement("button", "order-quantity-button", "\u2212");
            decrease.type = "button";
            decrease.setAttribute("aria-label", `Decrease quantity of ${name}`);
            decrease.addEventListener("click", () => updateCart(name, price, -1));

            const quantityInput = makeElement("input", "order-quantity-input");
            quantityInput.type = "number";
            quantityInput.min = "1";
            quantityInput.max = String(maximumQuantity);
            quantityInput.step = "1";
            quantityInput.inputMode = "numeric";
            quantityInput.value = String(quantity);
            quantityInput.setAttribute("aria-label", `Quantity of ${name}`);
            quantityInput.setAttribute("aria-invalid", "false");

            // Update totals immediately without replacing the focused textbox.
            quantityInput.addEventListener("input", () => {
                const raw = quantityInput.value.trim();
                const nextQuantity = Number(raw);
                const valid = raw !== "" && Number.isSafeInteger(nextQuantity)
                    && nextQuantity >= 1 && nextQuantity <= maximumQuantity;
                quantityInput.classList.toggle("order-quantity-input-invalid", !valid);
                quantityInput.setAttribute("aria-invalid", String(!valid));
                quantityInput.title = valid ? "" : `Enter a whole number from 1 to ${maximumQuantity}`;
                if (!valid) return;

                cart.set(name, { price, quantity: nextQuantity });
                item.querySelector(".order-item-total").textContent = money(price * nextQuantity);
                orderStatus.textContent = "";
                updateOrderAmounts();
                renderProducts();
            });

            // Restore the last valid quantity if the cashier leaves an invalid value.
            quantityInput.addEventListener("blur", () => {
                const current = cart.get(name);
                if (!current) return;
                quantityInput.value = String(current.quantity);
                quantityInput.classList.remove("order-quantity-input-invalid");
                quantityInput.setAttribute("aria-invalid", "false");
                quantityInput.title = "";
            });
            quantityInput.addEventListener("keydown", (event) => {
                if (event.key === "Enter") quantityInput.blur();
            });

            const increase = makeElement("button", "order-quantity-button", "+");
            increase.type = "button";
            increase.setAttribute("aria-label", `Increase quantity of ${name}`);
            increase.addEventListener("click", () => updateCart(name, price, 1));

            controls.appendChild(decrease);
            controls.appendChild(quantityInput);
            controls.appendChild(increase);
            item.appendChild(controls);
            item.appendChild(makeElement("div", "order-item-total", money(price * quantity)));
            orderItems.appendChild(item);
        });

        orderItems.scrollTop = previousScrollTop;
        updateOrderAmounts();
        requestAnimationFrame(syncScrollShadows);
    };

    const updateChange = () => {
        const amount = Number(cashInput.value.trim());
        const change = cashInput.value.trim() && Number.isFinite(amount)
            ? Math.max(0, amount - calculateTotal()) : 0;
        checkout.querySelector("#order-change").textContent = money(change, Number.isInteger(change) ? 0 : 2);
    };

    const showCashError = (message) => {
        cashError.textContent = message;
        cashInput.classList.toggle("order-cash-input-invalid", Boolean(message));
        cashInput.setAttribute("aria-invalid", String(Boolean(message)));
    };

    const validateCash = () => {
        const received = cashInput.value.trim();
        const amount = Number(received);

        if (!received) {
            showCashError("Please enter a cash amount.");
            return false;
        }
        if (!Number.isFinite(amount) || amount < 0) {
            showCashError("Enter a valid amount.");
            return false;
        }
        if (amount < calculateTotal()) {
            showCashError("Amount is below the total.");
            return false;
        }

        showCashError("");
        return true;
    };

    categoryButtons.forEach((button) => {
        button.addEventListener("click", () => {
            activeCategory = button.dataset.category;
            categoryButtons.forEach((categoryButton) => {
                const selected = categoryButton === button;
                categoryButton.classList.toggle("checkout-category-active", selected);
                categoryButton.setAttribute("aria-pressed", String(selected));
            });
            renderProducts();
        });
    });

    exactCheckbox.addEventListener("change", () => {
        cashInput.value = exactCheckbox.checked ? calculateTotal().toFixed(2) : "";
        showCashError("");
        updateChange();
    });

    cashInput.addEventListener("input", () => {
        exactCheckbox.checked = false;
        if (cashError.textContent) validateCash();
        updateChange();
    });

    checkout.querySelector("#order-calculate").addEventListener("click", () => {
        orderStatus.textContent = "";
        if (!validateCash()) {
            cashInput.focus();
            return;
        }
        orderStatus.textContent = "";
        updateChange();
    });

    checkout.querySelector("#order-cancel").addEventListener("click", () => {
        cart.clear();
        cashInput.value = "";
        exactCheckbox.checked = false;
        showCashError("");
        orderStatus.textContent = "";
        renderProducts();
        renderOrder();
    });

    orderItems.addEventListener("scroll", syncScrollShadows, { passive: true });
    window.addEventListener("resize", syncScrollShadows);
    if ("ResizeObserver" in window) {
        new ResizeObserver(syncScrollShadows).observe(orderItems);
    }

    checkout.querySelector("#order-submit").addEventListener("click", () => {
        if (cart.size === 0) {
            orderStatus.textContent = "Add at least one product to the order.";
            return;
        }
        orderStatus.textContent = "Preview only: connect this button to your order-saving backend.";
    });

    renderProducts();
    renderOrder();
})();
