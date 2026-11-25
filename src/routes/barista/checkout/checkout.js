(() => {
    "use strict";

    const checkout = document.querySelector(".main");

    if (!checkout) return;


    /*********************************************************************************
    PRODUCT CATALOG
    *********************************************************************************/

    const catalog = {
        "Coffee Classics": [
            ["Americano", 120],
            ["Cafe Latte", 150],
            ["Cappucino", 150],
            ["French Vanilla", 170],
            ["Salted Caramel", 170],
            ["Spanish Latte", 180],
            ["Seasalt Latte", 180],
            ["Caramel Macchiato", 180],
            ["Cafe Mocha", 180],
            ["Dark Choc Mocha", 180],
            ["White Mocha", 170],
            ["Hazelnut Mocha", 170]
        ],

        "Coffee Specials": [
            ["Toffeedamia", 190],
            ["Roasted Almondamia", 190],
            ["Biscoffee", 200],
            ["Oreo Madness", 200],
            ["C.E. Barista Blend", 220]
        ],

        "Non-coffee": [
            ["Signature Choco", 150],
            ["Milky Strawberry", 150],
            ["Dark Chocolate", 150],
            ["Matcha Latte", 170],
            ["Berry Matcha", 190],
            ["Oreo Milk", 150],
            ["Nutella Latte", 150],
            ["Biscoff Latte", 150]
        ],

        "Frappes & Shakes": [
            ["Vanilla Milkshake", 170],
            ["Strawberries & Cream", 170],
            ["Oreos & Cream", 170],
            ["Dark Mocha Frappe", 190],
            ["Java Chip Frappe", 190],
            ["Seasalt Frappe", 190]
        ],

        "Soda Pop": [],

        "Bread & Pastries": [
            ["Butter Croissant", 70],
            ["Pain Au Chocolat", 80],
            ["Choco Chip Cookies", 90],
            ["White Chocochip Cookies", 90]
        ],

        "Sandwiches": [
            ["Ham & Egg Sandwich", 160],
            ["Spam Sandwich", 170],
            ["Chicken Fillet Sandwich", 180]
        ],

        "Snacks": [
            ["French Fries (salted/cheese)", 90],
            ["Twister Fries", 110],
            ["Mojos", 120],
            ["Pica Platter", 199],
            ["4pcs Nuggets & Fries", 140],
            ["3pcs Chicken Tenders w/ dip", 160],
            ["Chicken Popcorn", 110]
        ],

        "Pastas": [
            ["Creamy Sausage & Shrimp Cajun", 250],
            ["Spicy Shrimp Aglio Olio", 220],
            ["Cheesy Tuna Pesto", 220]
        ],

        "Rice Meals": [
            ["Allday Spam Rice", 250],
            ["Sausage Delight, 1pc", 220],
            ["Sausage Delight, 2pcs", 220],
            ["Chicken Pastil (spicy / orig)", 250],
            ["Tori Katsu with Cabbage Salad", 220],
            ["2-pc Mushroom Burger Steak", 220],
            ["Chicken Peppered Steak", 250],
            ["4-pc Nuggets with rice", 220]
        ]
    };


    /*********************************************************************************
    BEVERAGE SIZES
    *********************************************************************************/

    const beverageCategories = new Set([
        "Coffee Classics",
        "Coffee Specials",
        "Non-coffee",
        "Frappes & Shakes",
        "Soda Pop"
    ]);

    const beverageSizes = [
        "Tall",
        "Grande",
        "Venti"
    ];

    const selectedSizes = new Map();

    const getSelectedSize = (name, category) => {
        if (!beverageCategories.has(category)) return "";

        return selectedSizes.get(name) || "Tall";
    };


    /*********************************************************************************
    CHECKOUT STATE
    *********************************************************************************/

    const cart = new Map();
    const maximumQuantity = 9999;

    let activeCategory = "Coffee Classics";

    const categoriesContainer = checkout.querySelector("#checkout-categories");
    const productsContainer = checkout.querySelector("#checkout-products");
    const itemsTitle = checkout.querySelector("#checkout-items-title");
    const searchInput = checkout.querySelector("#checkout-search");

    const orderItems = checkout.querySelector("#order-items");
    const orderListScroll = checkout.querySelector("#order-list-scroll");
    const orderPayment = checkout.querySelector("#order-payment");
    const orderStatus = checkout.querySelector("#order-status");

    const cashControls = checkout.querySelector("#order-cash-controls");
    const cashInput = checkout.querySelector("#order-cash-amount");
    const cashError = checkout.querySelector("#order-cash-error");
    const exactCheckbox = checkout.querySelector("#order-exact");
    const calculateButton = checkout.querySelector("#order-calculate");

    const subtotalAmount = checkout.querySelector("#order-subtotal");
    const vatAmount = checkout.querySelector("#order-vat");
    const totalAmount = checkout.querySelector("#order-total");
    const changeAmount = checkout.querySelector("#order-change");


    /*********************************************************************************
    GENERAL FUNCTIONS
    *********************************************************************************/

    const money = (value, digits = Number.isInteger(value) ? 0 : 2) => {
        return "\u20B1" + value.toLocaleString("en-PH", {
            minimumFractionDigits: digits,
            maximumFractionDigits: digits
        });
    };

    const makeElement = (tagName, className, value) => {
        const element = document.createElement(tagName);

        element.className = className;

        if (value !== undefined) {
            element.textContent = value;
        }

        return element;
    };

    const makeButton = (className, label, value) => {
        const button = makeElement("button", className, value);

        button.type = "button";

        button.setAttribute("aria-label", label);

        return button;
    };

    const makeIcon = (symbol) => {
        const namespace = "http://www.w3.org/2000/svg";

        const icon = document.createElementNS(namespace, "svg");
        const reference = document.createElementNS(namespace, "use");

        icon.setAttribute("aria-hidden", "true");

        reference.setAttribute("href", `#${symbol}`);

        icon.appendChild(reference);

        return icon;
    };

    const getProductLabel = (name, size) => {
        return size ? `${name} (${size})` : name;
    };

    const getCartKey = (name, size) => {
        return JSON.stringify([name, size]);
    };

    const calculateTotal = () => {
        let total = 0;

        cart.forEach((item) => {
            total += item.price * item.quantity;
        });

        return total;
    };

    const getProductQuantity = (name) => {
        let quantity = 0;

        cart.forEach((item) => {
            if (item.name === name) {
                quantity += item.quantity;
            }
        });

        return quantity;
    };


    /*********************************************************************************
    PRODUCT IMAGES
    *********************************************************************************/

    const inventoryImageDirectory =
        "../../../../assets/images/products/inventory/";

    const inventoryImageExtensions = [
        "webp",
        "jpg",
        "jpeg",
        "png"
    ];

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
        "french fries (salted/cheese)": "french-fries-salted-cheese",
        "choco chip cookies": "choco-chip-cookies",
        "allday spam rice": "allday-spam-rice"
    };

    const makeImage = (productName) => {
        const container = makeElement(
            "div",
            "checkout-product-image"
        );

        const showPlaceholder = () => {
            const icon = makeIcon("checkout-image-symbol");

            icon.classList.add("checkout-image-icon");

            container.replaceChildren(icon);
        };

        const filename = inventoryImageNames[
            productName.trim().toLowerCase()
        ];

        if (!filename) {
            showPlaceholder();

            return container;
        }

        const image = document.createElement("img");

        image.alt = productName;
        image.loading = "lazy";
        image.decoding = "async";

        let extensionIndex = 0;

        const loadImage = () => {
            image.src =
                inventoryImageDirectory +
                filename +
                "." +
                inventoryImageExtensions[extensionIndex];
        };

        image.addEventListener("error", () => {
            extensionIndex++;

            if (extensionIndex < inventoryImageExtensions.length) {
                loadImage();
            } else {
                showPlaceholder();
            }
        });

        container.appendChild(image);

        loadImage();

        return container;
    };


    /*********************************************************************************
    CATEGORIES
    *********************************************************************************/

    const updateCategories = () => {
        const categoryButtons = categoriesContainer.querySelectorAll(
            ".checkout-category"
        );

        categoryButtons.forEach((button) => {
            const selected = button.dataset.category === activeCategory;

            button.classList.toggle(
                "checkout-category-active",
                selected
            );

            button.setAttribute(
                "aria-pressed",
                String(selected)
            );
        });
    };

    const renderCategories = () => {
        categoriesContainer.replaceChildren();

        Object.entries(catalog).forEach(([category, products]) => {
            const button = makeButton(
                "checkout-category",
                `${category}, ${products.length} products`
            );

            button.dataset.category = category;

            button.appendChild(
                makeElement(
                    "div",
                    "checkout-category-name",
                    category
                )
            );

            button.appendChild(
                makeElement(
                    "div",
                    "checkout-category-count",
                    String(products.length)
                )
            );

            button.addEventListener("click", () => {
                activeCategory = category;

                searchInput.value = "";

                updateCategories();
                renderProducts();
            });

            categoriesContainer.appendChild(button);
        });

        updateCategories();
    };


    /*********************************************************************************
    PRODUCT SEARCH
    *********************************************************************************/

    const getVisibleProducts = () => {
        const search = searchInput.value.trim().toLowerCase();

        if (!search) {
            return catalog[activeCategory].map(([name, price]) => ({
                name,
                price,
                category: activeCategory
            }));
        }

        return Object.entries(catalog).flatMap(
            ([category, products]) => {
                return products
                    .filter(([name]) => {
                        return name.toLowerCase().includes(search);
                    })
                    .map(([name, price]) => ({
                        name,
                        price,
                        category
                    }));
            }
        );
    };


    /*********************************************************************************
    PRODUCT CARD STATE
    *********************************************************************************/

    const updateProductCards = () => {
        const productCards = productsContainer.querySelectorAll(
            ".checkout-product"
        );

        productCards.forEach((product) => {
            const quantity = getProductQuantity(
                product.dataset.productName
            );

            const badge = product.querySelector(
                ".checkout-product-badge"
            );

            product.classList.toggle(
                "checkout-product-selected",
                quantity > 0
            );

            badge.hidden = quantity === 0;

            badge.textContent = quantity > 0
                ? `\u00D7${quantity}`
                : "";
        });
    };


    /*********************************************************************************
    PRODUCT CARDS
    *********************************************************************************/

    const renderProducts = () => {
        const search = searchInput.value.trim();
        const products = getVisibleProducts();

        itemsTitle.textContent = search
            ? "Search Results"
            : activeCategory;

        productsContainer.replaceChildren();

        productsContainer.scrollTop = 0;

        if (!products.length) {
            productsContainer.appendChild(
                makeElement(
                    "div",
                    "checkout-empty-products",
                    search
                        ? "No matching products found."
                        : "No products available in this category."
                )
            );

            return;
        }

        products.forEach(({ name, price, category }) => {
            const hasSizes = beverageCategories.has(category);

            const product = makeElement(
                "div",
                "checkout-product"
            );

            product.dataset.productName = name;

            if (hasSizes) {
                product.classList.add(
                    "checkout-product-with-sizes"
                );
            }

            product.appendChild(makeImage(name));

            product.appendChild(
                makeElement(
                    "div",
                    "checkout-product-name",
                    name
                )
            );

            const details = makeElement(
                "div",
                "checkout-product-details"
            );

            details.appendChild(
                makeElement(
                    "div",
                    "checkout-product-price",
                    money(price)
                )
            );

            const addButton = makeButton(
                "checkout-product-add",
                `Add ${getProductLabel(
                    name,
                    getSelectedSize(name, category)
                )} to the order`
            );

            addButton.appendChild(
                makeIcon("checkout-cart-symbol")
            );

            addButton.addEventListener("click", () => {
                if (
                    hasSizes &&
                    compactCatalogViewport.matches
                ) {
                    openBeverageSelection(
                        name,
                        category,
                        price,
                        addButton
                    );

                    return;
                }

                const size = getSelectedSize(
                    name,
                    category
                );

                updateCart(
                    name,
                    size,
                    price,
                    1
                );
            });

            product.addEventListener("click", (event) => {
                if (!compactCatalogViewport.matches) return;

                if (!hasSizes) return;

                if (event.target.closest("button")) return;

                openBeverageSelection(
                    name,
                    category,
                    price,
                    addButton
                );
            });

            details.appendChild(addButton);

            product.appendChild(details);

            const badge = makeElement(
                "div",
                "checkout-product-badge"
            );

            badge.hidden = true;

            product.appendChild(badge);

            if (hasSizes) {
                const sizes = makeElement(
                    "div",
                    "checkout-product-sizes"
                );

                sizes.setAttribute("role", "group");
                sizes.setAttribute(
                    "aria-label",
                    `Select size for ${name}`
                );

                beverageSizes.forEach((size) => {
                    const button = makeButton(
                        "checkout-size-button",
                        `${name}, ${size}`
                    );

                    button.dataset.size = size;

                    const selected =
                        getSelectedSize(name, category) === size;

                    button.classList.toggle(
                        "checkout-size-button-active",
                        selected
                    );

                    button.setAttribute(
                        "aria-pressed",
                        String(selected)
                    );

                    const iconContainer = makeElement(
                        "div",
                        "checkout-size-icon"
                    );

                    iconContainer.appendChild(
                        makeIcon("checkout-cup-symbol")
                    );

                    button.appendChild(iconContainer);

                    button.appendChild(
                        makeElement(
                            "span",
                            "checkout-size-label",
                            size
                        )
                    );

                    button.addEventListener("click", () => {
                        selectedSizes.set(name, size);

                        sizes.querySelectorAll(
                            ".checkout-size-button"
                        ).forEach((sizeButton) => {
                            const active =
                                sizeButton.dataset.size === size;

                            sizeButton.classList.toggle(
                                "checkout-size-button-active",
                                active
                            );

                            sizeButton.setAttribute(
                                "aria-pressed",
                                String(active)
                            );
                        });

                        addButton.setAttribute(
                            "aria-label",
                            `Add ${getProductLabel(name, size)} to the order`
                        );
                    });

                    sizes.appendChild(button);
                });

                product.appendChild(sizes);
            }

            productsContainer.appendChild(product);
        });

        updateProductCards();
    };


    /*********************************************************************************
    CART MANAGEMENT
    *********************************************************************************/

    const updateCart = (name, size, price, change) => {
        const key = getCartKey(name, size);

        const current = cart.get(key);

        const quantity = Math.min(
            maximumQuantity,
            (current?.quantity || 0) + change
        );

        if (quantity > 0) {
            cart.set(key, {
                name,
                size,
                price,
                quantity
            });
        } else {
            cart.delete(key);
        }

        orderStatus.textContent = "";

        updateProductCards();
        renderOrder();
    };

    const removeCartItem = (key) => {
        cart.delete(key);

        orderStatus.textContent = "";

        updateProductCards();
        renderOrder();
    };

    const clearCart = () => {
        cart.clear();

        cashInput.value = "";
        exactCheckbox.checked = false;

        orderStatus.textContent = "";

        showCashError("");

        updateProductCards();
        renderOrder();
    };


    /*********************************************************************************
    ORDER SCROLL INDICATORS
    *********************************************************************************/

    const syncScrollShadows = () => {
        const canScroll =
            orderItems.scrollHeight > orderItems.clientHeight + 1;

        const atTop = orderItems.scrollTop <= 1;

        const atBottom =
            orderItems.scrollTop + orderItems.clientHeight >=
            orderItems.scrollHeight - 1;

        orderListScroll.classList.toggle(
            "order-list-shadow-top",
            canScroll && !atTop
        );

        orderListScroll.classList.toggle(
            "order-list-shadow-bottom",
            canScroll && !atBottom
        );
    };


    /*********************************************************************************
    ORDER ITEMS
    *********************************************************************************/

    const renderOrder = () => {
        const previousScrollTop = orderItems.scrollTop;

        const focusedElement = document.activeElement;

        const focusedItem = focusedElement?.closest(".order-item");

        const focusedKey = focusedItem?.dataset.cartKey;
        const focusedAction = focusedElement?.dataset.action;

        orderItems.replaceChildren();

        if (cart.size === 0) {
            orderItems.appendChild(
                makeElement(
                    "div",
                    "order-empty",
                    "Add products to start an order."
                )
            );
        }

        cart.forEach(({ name, size, price, quantity }, key) => {
            const label = getProductLabel(name, size);

            const item = makeElement(
                "div",
                "order-item"
            );

            item.dataset.cartKey = key;

            const deleteButton = makeButton(
                "order-item-delete",
                `Remove ${label} from the order`
            );

            deleteButton.dataset.action = "delete";

            deleteButton.appendChild(
                makeIcon("checkout-delete-symbol")
            );

            deleteButton.addEventListener("click", () => {
                removeCartItem(key);
            });

            item.appendChild(deleteButton);

            const details = makeElement(
                "div",
                "order-item-details"
            );

            details.appendChild(
                makeElement(
                    "p",
                    "order-item-name",
                    label
                )
            );

            details.appendChild(
                makeElement(
                    "p",
                    "order-item-price",
                    `${money(price)} each`
                )
            );

            item.appendChild(details);

            const controls = makeElement(
                "div",
                "order-item-quantity"
            );

            const decrease = makeButton(
                "order-quantity-button",
                `Decrease quantity of ${label}`,
                "\u2212"
            );

            decrease.dataset.action = "decrease";

            decrease.addEventListener("click", () => {
                updateCart(name, size, price, -1);
            });

            const quantityInput = makeElement(
                "input",
                "order-quantity-input"
            );

            quantityInput.type = "number";
            quantityInput.min = "1";
            quantityInput.max = String(maximumQuantity);
            quantityInput.step = "1";
            quantityInput.inputMode = "numeric";
            quantityInput.value = String(quantity);

            quantityInput.dataset.action = "quantity";

            quantityInput.setAttribute(
                "aria-label",
                `Quantity of ${label}`
            );

            quantityInput.setAttribute(
                "aria-invalid",
                "false"
            );

            const itemTotal = makeElement(
                "div",
                "order-item-total",
                money(price * quantity)
            );

            quantityInput.addEventListener("input", () => {
                const raw = quantityInput.value.trim();

                const nextQuantity = Number(raw);

                const valid =
                    raw !== "" &&
                    Number.isSafeInteger(nextQuantity) &&
                    nextQuantity >= 1 &&
                    nextQuantity <= maximumQuantity;

                quantityInput.classList.toggle(
                    "order-quantity-input-invalid",
                    !valid
                );

                quantityInput.setAttribute(
                    "aria-invalid",
                    String(!valid)
                );

                if (!valid) return;

                cart.set(key, {
                    name,
                    size,
                    price,
                    quantity: nextQuantity
                });

                itemTotal.textContent = money(
                    price * nextQuantity
                );

                orderStatus.textContent = "";

                updateOrderAmounts();
                updateProductCards();
            });

            quantityInput.addEventListener("blur", () => {
                const current = cart.get(key);

                if (!current) return;

                quantityInput.value = String(
                    current.quantity
                );

                quantityInput.classList.remove(
                    "order-quantity-input-invalid"
                );

                quantityInput.setAttribute(
                    "aria-invalid",
                    "false"
                );
            });

            quantityInput.addEventListener("keydown", (event) => {
                if (event.key === "Enter") {
                    quantityInput.blur();
                }
            });

            const increase = makeButton(
                "order-quantity-button",
                `Increase quantity of ${label}`,
                "+"
            );

            increase.dataset.action = "increase";

            increase.addEventListener("click", () => {
                updateCart(name, size, price, 1);
            });

            controls.appendChild(decrease);
            controls.appendChild(quantityInput);
            controls.appendChild(increase);

            item.appendChild(controls);
            item.appendChild(itemTotal);

            orderItems.appendChild(item);
        });

        orderItems.scrollTop = previousScrollTop;

        if (focusedKey && focusedAction) {
            const matchingItem = Array.from(
                orderItems.querySelectorAll(".order-item")
            ).find((item) => {
                return item.dataset.cartKey === focusedKey;
            });

            matchingItem?.querySelector(
                `[data-action="${focusedAction}"]`
            )?.focus({
                preventScroll: true
            });
        }

        updateOrderAmounts();

        window.requestAnimationFrame(syncScrollShadows);
    };


    /*********************************************************************************
    ORDER CALCULATIONS
    *********************************************************************************/

    const updateOrderAmounts = () => {
        const total = calculateTotal();

        const subtotal = total / 1.12;
        const vat = total - subtotal;

        subtotalAmount.textContent = money(subtotal, 2);
        vatAmount.textContent = money(vat, 2);
        totalAmount.textContent = money(total);

        synchronizeMobileOrderBar();

        if (exactCheckbox.checked) {
            cashInput.value = total.toFixed(2);
        }

        updateChange();

        if (cashError.textContent) {
            validateCash();
        }
    };

    const updateChange = () => {
        if (orderPayment.value !== "Cash") {
            changeAmount.textContent = money(0);

            return;
        }

        const value = cashInput.value.trim();

        const received = Number(value);

        const valid =
            value !== "" &&
            Number.isFinite(received) &&
            received >= 0;

        const change = valid
            ? Math.max(0, received - calculateTotal())
            : 0;

        changeAmount.textContent = money(
            Math.round(change * 100) / 100
        );
    };


    /*********************************************************************************
    CASH VALIDATION
    *********************************************************************************/

    const showCashError = (message) => {
        cashError.textContent = message;

        cashInput.classList.toggle(
            "order-cash-input-invalid",
            Boolean(message)
        );

        cashInput.setAttribute(
            "aria-invalid",
            String(Boolean(message))
        );
    };

    const validateCash = () => {
        if (orderPayment.value !== "Cash") {
            showCashError("");

            return true;
        }

        const received = cashInput.value.trim();
        const amount = Number(received);

        if (!received) {
            showCashError("Enter a cash amount.");

            return false;
        }

        if (
            !/^\d+(\.\d{1,2})?$/.test(received) ||
            !Number.isFinite(amount) ||
            amount < 0
        ) {
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


    /*********************************************************************************
    PAYMENT METHOD
    *********************************************************************************/

    const updatePaymentMethod = () => {
        const cashPayment = orderPayment.value === "Cash";

        cashControls.classList.toggle(
            "order-cash-controls-disabled",
            !cashPayment
        );

        cashInput.disabled = !cashPayment;
        exactCheckbox.disabled = !cashPayment;
        calculateButton.disabled = !cashPayment;

        cashInput.value = "";
        exactCheckbox.checked = false;

        orderStatus.textContent = "";

        showCashError("");
        updateChange();
    };


    /*********************************************************************************
    BARISTA RECIPE DATA
    *********************************************************************************/

    const recipeStorageKey = "coffee-everyday-recipes-demo-v1";

    const recipeCostEstimates = new Map([
        ["Americano", 23],
        ["Spanish Latte", 45],
        ["Salted Caramel", 58],
        ["Dirty Matcha", 45],
        ["Mocha Frappe", 59],
        ["Matcha Latte", 39]
    ]);

    const saltedCaramelIngredients = [
        {
            name: "Coffee Beans",
            quantity: 18,
            unit: "g",
            unitCost: 17 / 18,
            stock: "Low"
        },
        {
            name: "Whole Milk",
            quantity: 150,
            unit: "ml",
            unitCost: 17 / 150,
            stock: "Low"
        },
        {
            name: "Salted Caramel Syrup",
            quantity: 20,
            unit: "ml",
            unitCost: 18 / 20,
            stock: "No stock"
        },
        {
            name: "16oz Cup",
            quantity: 1,
            unit: "pc",
            unitCost: 4,
            stock: "No stock"
        },
        {
            name: "Cup Lid",
            quantity: 1,
            unit: "pc",
            unitCost: 2,
            stock: "No stock"
        }
    ];

    const defaultRecipeCatalog = {
        ...catalog,

        "Coffee Classics": catalog["Coffee Classics"].filter(
            ([name]) => name !== "Salted Caramel"
        ),

        "Coffee Specials": [
            ["Salted Caramel", 170],
            ["Dirty Matcha", 45],
            ["Mocha Frappe", 59],
            ...catalog["Coffee Specials"]
        ]
    };

    const defaultRecipes = Object.entries(
        defaultRecipeCatalog
    ).flatMap(([category, products]) => {
        return products.map(([name, price]) => ({
            id: `${category}-${name}`,
            name,
            category,
            price,
            serving: name === "Salted Caramel"
                ? "1 cup (16oz)"
                : "",
            labor: 10,
            costEstimate: recipeCostEstimates.get(name) ?? null,
            image: "",
            ingredients: name === "Salted Caramel"
                ? saltedCaramelIngredients
                : []
        }));
    });


    /*********************************************************************************
    RECIPE STATE
    *********************************************************************************/

    let activeCheckoutView = "pos";
    let activeRecipeCategory = "Coffee Classics";
    let selectedRecipeId = null;

    let recipes = [];

    const checkoutSearchValues = {
        pos: "",
        recipe: ""
    };

    const checkoutNavigationButtons = checkout.querySelectorAll(
        "[data-checkout-view]"
    );

    const checkoutPosView = checkout.querySelector(
        ".checkout-content:not(.checkout-recipe-content)"
    );

    const checkoutRecipeView = checkout.querySelector(
        "#checkout-recipe-content"
    );

    const recipeCategoriesContainer = checkout.querySelector(
        "#checkout-recipe-categories"
    );

    const recipeProductsContainer = checkout.querySelector(
        "#checkout-recipe-products"
    );

    const recipeCategoryTitle = checkout.querySelector(
        "#checkout-recipe-title"
    );

    const recipePreview = checkout.querySelector(
        "#checkout-recipe-preview"
    );


    /*********************************************************************************
    SAVED RECIPES
    *********************************************************************************/

    const loadRecipes = () => {
        try {
            const savedRecipes = JSON.parse(
                localStorage.getItem(recipeStorageKey) || "null"
            );

            if (
                Array.isArray(savedRecipes) &&
                savedRecipes.every((recipe) => {
                    return (
                        recipe &&
                        recipe.id &&
                        typeof recipe.name === "string" &&
                        typeof recipe.category === "string" &&
                        Array.isArray(recipe.ingredients)
                    );
                })
            ) {
                return savedRecipes;
            }
        } catch (error) {
            return defaultRecipes;
        }

        return defaultRecipes;
    };


    /*********************************************************************************
    RECIPE IMAGES
    *********************************************************************************/

    const makeRecipeImage = (
        recipe,
        className = "checkout-product-image"
    ) => {
        const makeFallbackImage = () => {
            const container = makeImage(recipe.name);

            container.className = className;

            return container;
        };

        if (!recipe.image) {
            return makeFallbackImage();
        }

        const container = makeElement(
            "div",
            className
        );

        const image = document.createElement("img");

        image.alt = recipe.name;
        image.loading = "lazy";
        image.decoding = "async";

        image.addEventListener("error", () => {
            container.replaceWith(
                makeFallbackImage()
            );
        }, { once: true });

        container.appendChild(image);

        image.src = recipe.image;

        return container;
    };


    /*********************************************************************************
    RECIPE CALCULATIONS
    *********************************************************************************/

    const getRecipeNumber = (value) => {
        if (
            value === null ||
            value === undefined ||
            String(value).trim() === ""
        ) {
            return null;
        }

        const number = Number(value);

        return Number.isFinite(number) && number >= 0
            ? number
            : null;
    };

    const formatRecipeMoney = (value) => {
        const number = getRecipeNumber(value);

        if (number === null) {
            return "—";
        }

        return money(
            number,
            Number.isInteger(number) ? 0 : 2
        );
    };

    const calculateIngredientCost = (ingredient) => {
        const quantity = getRecipeNumber(
            ingredient.quantity
        );

        const unitCost = getRecipeNumber(
            ingredient.unitCost
        );

        if (quantity === null || unitCost === null) {
            return null;
        }

        return quantity * unitCost;
    };

    const calculateRecipeCost = (recipe) => {
        if (!recipe.ingredients.length) {
            return getRecipeNumber(recipe.costEstimate);
        }

        const costs = recipe.ingredients.map(
            calculateIngredientCost
        );

        if (costs.some((cost) => cost === null)) {
            return null;
        }

        return costs.reduce((total, cost) => {
            return total + cost;
        }, 0);
    };

    const calculateRecipeLabor = (recipe) => {
        const price = getRecipeNumber(recipe.price);
        const labor = getRecipeNumber(recipe.labor);

        if (price === null || labor === null) {
            return null;
        }

        return price * labor / 100;
    };


    /*********************************************************************************
    RECIPE CATEGORIES
    *********************************************************************************/

    const getRecipeCategories = () => {
        return [...new Set([
            ...Object.keys(defaultRecipeCatalog),
            ...recipes.map((recipe) => recipe.category)
        ])];
    };

    const updateRecipeCategories = () => {
        recipeCategoriesContainer.querySelectorAll(
            ".checkout-category"
        ).forEach((button) => {
            const selected =
                button.dataset.category === activeRecipeCategory;

            button.classList.toggle(
                "checkout-category-active",
                selected
            );

            button.setAttribute(
                "aria-pressed",
                String(selected)
            );
        });
    };

    const renderRecipeCategories = () => {
        recipeCategoriesContainer.replaceChildren();

        getRecipeCategories().forEach((category) => {
            const count = recipes.filter((recipe) => {
                return recipe.category === category;
            }).length;

            const button = makeButton(
                "checkout-category",
                `${category}, ${count} recipes`
            );

            button.dataset.category = category;

            button.appendChild(
                makeElement(
                    "div",
                    "checkout-category-name",
                    category
                )
            );

            button.appendChild(
                makeElement(
                    "div",
                    "checkout-category-count",
                    String(count)
                )
            );

            button.addEventListener("click", () => {
                activeRecipeCategory = category;
                selectedRecipeId = null;

                searchInput.value = "";

                updateRecipeCategories();
                renderRecipeCards();
            });

            recipeCategoriesContainer.appendChild(button);
        });

        updateRecipeCategories();
    };


    /*********************************************************************************
    RECIPE SEARCH
    *********************************************************************************/

    const getVisibleRecipes = () => {
        const search = searchInput.value.trim().toLowerCase();

        if (search) {
            return recipes.filter((recipe) => {
                return recipe.name.toLowerCase().includes(search);
            });
        }

        return recipes.filter((recipe) => {
            return recipe.category === activeRecipeCategory;
        });
    };


    /*********************************************************************************
    RECIPE CARD STATE
    *********************************************************************************/

    const updateRecipeCards = () => {
        recipeProductsContainer.querySelectorAll(
            ".checkout-recipe-card"
        ).forEach((card) => {
            const selected =
                card.dataset.recipeId === selectedRecipeId;

            card.classList.toggle(
                "checkout-product-selected",
                selected
            );

            card.setAttribute(
                "aria-pressed",
                String(selected)
            );
        });
    };


    /*********************************************************************************
    RECIPE CARDS
    *********************************************************************************/

    const renderRecipeCards = () => {
        const search = searchInput.value.trim();
        const visibleRecipes = getVisibleRecipes();

        recipeCategoryTitle.textContent = search
            ? "Search Results"
            : activeRecipeCategory;

        recipeProductsContainer.replaceChildren();

        recipeProductsContainer.scrollTop = 0;

        if (!visibleRecipes.some((recipe) => {
            return String(recipe.id) === selectedRecipeId;
        })) {
            selectedRecipeId = visibleRecipes.length
                ? String(visibleRecipes[0].id)
                : null;
        }

        if (!visibleRecipes.length) {
            recipeProductsContainer.appendChild(
                makeElement(
                    "div",
                    "checkout-empty-products",
                    search
                        ? "No matching recipes found."
                        : "No recipes available in this category."
                )
            );

            renderRecipePreview();

            return;
        }

        visibleRecipes.forEach((recipe) => {
            const card = makeButton(
                "checkout-product checkout-recipe-card",
                `View ${recipe.name} recipe`
            );

            card.dataset.recipeId = String(recipe.id);

            card.appendChild(
                makeRecipeImage(recipe)
            );

            card.appendChild(
                makeElement(
                    "div",
                    "checkout-product-name",
                    recipe.name
                )
            );

            card.appendChild(
                makeElement(
                    "div",
                    "checkout-product-price",
                    Number(recipe.price) > 0
                        ? formatRecipeMoney(recipe.price)
                        : "—"
                )
            );

            card.addEventListener("click", () => {
                selectedRecipeId = String(recipe.id);

                updateRecipeCards();
                renderRecipePreview();

                if (drawerViewport.matches) {
                    openRecipeDetails(card);
                }
            });

            recipeProductsContainer.appendChild(card);
        });

        updateRecipeCards();
        renderRecipePreview();
    };


    /*********************************************************************************
    RECIPE STOCK STATUS
    *********************************************************************************/

    const makeRecipeStock = (ingredient) => {
        const status = String(
            ingredient.stock || ""
        ).trim().toLowerCase();

        const stockStatuses = {
            "no stock": {
                label: "No stock",
                className: "checkout-recipe-stock-empty"
            },

            "low": {
                label: "Low",
                className: "checkout-recipe-stock-low"
            },

            "high": {
                label: "High",
                className: "checkout-recipe-stock-high"
            },

            "in stock": {
                label: "In stock",
                className: "checkout-recipe-stock-high"
            }
        };

        const stock = stockStatuses[status] || {
            label: "Unknown",
            className: ""
        };

        return makeElement(
            "span",
            `checkout-recipe-stock ${stock.className}`.trim(),
            stock.label
        );
    };


    /*********************************************************************************
    RECIPE INGREDIENT TABLE
    *********************************************************************************/

    const makeRecipeTable = (recipe) => {
        const table = makeElement(
            "table",
            "checkout-recipe-table"
        );

        table.setAttribute(
            "aria-label",
            `${recipe.name} ingredients`
        );

        const tableHead = document.createElement("thead");
        const headingRow = document.createElement("tr");

        [
            "Item",
            "Qty",
            "Unit",
            "Cost",
            "Stock"
        ].forEach((label) => {
            const heading = makeElement(
                "th",
                "",
                label
            );

            heading.scope = "col";

            headingRow.appendChild(heading);
        });

        tableHead.appendChild(headingRow);
        table.appendChild(tableHead);

        const tableBody = document.createElement("tbody");

        recipe.ingredients.forEach((ingredient) => {
            const row = document.createElement("tr");

            row.appendChild(
                makeElement(
                    "td",
                    "",
                    ingredient.name
                )
            );

            row.appendChild(
                makeElement(
                    "td",
                    "",
                    ingredient.quantity ?? "—"
                )
            );

            row.appendChild(
                makeElement(
                    "td",
                    "",
                    ingredient.unit || "—"
                )
            );

            row.appendChild(
                makeElement(
                    "td",
                    "",
                    formatRecipeMoney(
                        calculateIngredientCost(ingredient)
                    )
                )
            );

            const stockCell = document.createElement("td");

            stockCell.appendChild(
                makeRecipeStock(ingredient)
            );

            row.appendChild(stockCell);

            tableBody.appendChild(row);
        });

        table.appendChild(tableBody);

        return table;
    };


    /*********************************************************************************
    RECIPE COST SUMMARY
    *********************************************************************************/

    const makeRecipeSummaryLine = (
        label,
        value,
        highlighted = false
    ) => {
        const line = makeElement(
            "div",
            "checkout-recipe-summary-line"
        );

        if (highlighted) {
            line.classList.add(
                "checkout-recipe-menu-price"
            );
        }

        line.appendChild(
            makeElement("span", "", label)
        );

        line.appendChild(
            makeElement("strong", "", value)
        );

        return line;
    };

    const makeRecipeSummary = (recipe) => {
        const summary = makeElement(
            "div",
            "checkout-recipe-summary"
        );

        summary.appendChild(
            makeRecipeSummaryLine(
                "Total recipe cost",
                formatRecipeMoney(
                    calculateRecipeCost(recipe)
                )
            )
        );

        const labor = getRecipeNumber(recipe.labor);

        summary.appendChild(
            makeRecipeSummaryLine(
                labor === null
                    ? "Labor cost"
                    : `Labor cost (${labor}%)`,
                formatRecipeMoney(
                    calculateRecipeLabor(recipe)
                )
            )
        );

        summary.appendChild(
            makeRecipeSummaryLine(
                "Menu price",
                Number(recipe.price) > 0
                    ? formatRecipeMoney(recipe.price)
                    : "Not in checkout",
                true
            )
        );

        return summary;
    };


    /*********************************************************************************
    SELECTED RECIPE PREVIEW
    *********************************************************************************/

    const renderRecipePreview = () => {
        const recipe = recipes.find((item) => {
            return String(item.id) === selectedRecipeId;
        });

        recipePreview.replaceChildren();

        recipePreview.scrollTop = 0;

        if (!recipe) {
            recipePreview.appendChild(
                makeElement(
                    "div",
                    "checkout-recipe-empty",
                    "Select a recipe to view its ingredients."
                )
            );

            return;
        }

        recipePreview.appendChild(
            makeRecipeImage(
                recipe,
                "checkout-recipe-preview-image"
            )
        );

        recipePreview.appendChild(
            makeElement(
                "h3",
                "checkout-recipe-name",
                recipe.name
            )
        );

        const description = recipe.serving
            ? `${recipe.category} - Makes ${recipe.serving}`
            : recipe.category;

        recipePreview.appendChild(
            makeElement(
                "p",
                "checkout-recipe-description",
                description
            )
        );

        recipePreview.appendChild(
            makeRecipeTable(recipe)
        );

        if (!recipe.ingredients.length) {
            recipePreview.appendChild(
                makeElement(
                    "div",
                    "checkout-recipe-table-empty",
                    "No ingredients recorded for this recipe."
                )
            );
        }

        recipePreview.appendChild(
            makeRecipeSummary(recipe)
        );
    };


    /*********************************************************************************
    RECIPE SYNCHRONIZATION
    *********************************************************************************/

    const refreshRecipes = () => {
        recipes = loadRecipes();

        const categories = getRecipeCategories();

        if (!categories.includes(activeRecipeCategory)) {
            activeRecipeCategory = categories[0];
            selectedRecipeId = null;
        }

        renderRecipeCategories();
        renderRecipeCards();
    };

    window.addEventListener("storage", (event) => {
        if (
            activeCheckoutView === "recipe" &&
            (
                event.key === recipeStorageKey ||
                event.key === null
            )
        ) {
            refreshRecipes();
        }
    });


    /*********************************************************************************
    BARISTA NAVIGATION
    *********************************************************************************/

    const displayCheckoutView = (view) => {
        if (
            view !== "pos" &&
            view !== "orders" &&
            view !== "recipe"
        ) {
            return;
        }

        if (view === activeCheckoutView) return;

        checkoutSearchValues[activeCheckoutView] =
            searchInput.value;

        activeCheckoutView = view;

        checkoutPosView.hidden =
            view !== "pos";

        orderHistoryView.hidden =
            view !== "orders";

        checkoutRecipeView.hidden =
            view !== "recipe";

        synchronizeMobileOrderBar();

        checkoutNavigationButtons.forEach((button) => {
            const active =
                button.dataset.checkoutView === view;

            button.classList.toggle(
                "checkout-navigation-active",
                active
            );

            button.setAttribute(
                "aria-pressed",
                String(active)
            );
        });

        const searchLabels = {
            pos: "Search products",
            orders: "Search orders",
            recipe: "Search recipes"
        };

        searchInput.value =
            checkoutSearchValues[view] || "";

        searchInput.placeholder =
            `${searchLabels[view]}...`;

        searchInput.setAttribute(
            "aria-label",
            searchLabels[view]
        );

        if (view === "recipe") {
            refreshRecipes();
        } else if (view === "orders") {
            updateOrderHistoryFilters();
            renderOrderHistory();
        } else {
            window.requestAnimationFrame(
                syncScrollShadows
            );
        }
    };

    checkoutNavigationButtons.forEach((button) => {
        button.addEventListener("click", () => {
            displayCheckoutView(
                button.dataset.checkoutView
            );
        });
    });


    /*********************************************************************************
    CHECKOUT SEARCH
    *********************************************************************************/

    const handleCheckoutSearch = () => {
        if (activeCheckoutView === "recipe") {
            renderRecipeCards();
        } else if (activeCheckoutView === "orders") {
            expandedOrderId = null;

            renderOrderHistory();

            orderHistoryScroll.scrollTop = 0;
        } else {
            renderProducts();
        }
    };


    /*********************************************************************************
    CHECKOUT EVENTS
    *********************************************************************************/

    searchInput.addEventListener("input", handleCheckoutSearch);

    orderPayment.addEventListener(
        "change",
        updatePaymentMethod
    );

    exactCheckbox.addEventListener("change", () => {
        cashInput.value = exactCheckbox.checked
            ? calculateTotal().toFixed(2)
            : "";

        orderStatus.textContent = "";

        showCashError("");
        updateChange();
    });

    cashInput.addEventListener("input", () => {
        exactCheckbox.checked = false;

        orderStatus.textContent = "";

        if (cashError.textContent) {
            validateCash();
        }

        updateChange();
    });

    calculateButton.addEventListener("click", () => {
        orderStatus.textContent = "";

        if (!validateCash()) {
            cashInput.focus();

            return;
        }

        updateChange();
    });

    cashInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            calculateButton.click();
        }
    });

    checkout.querySelector(
        "#order-cancel"
    ).addEventListener("click", clearCart);

    orderItems.addEventListener(
        "scroll",
        syncScrollShadows,
        { passive: true }
    );

    window.addEventListener(
        "resize",
        syncScrollShadows
    );

    if ("ResizeObserver" in window) {
        const orderObserver = new ResizeObserver(
            syncScrollShadows
        );

        orderObserver.observe(orderItems);
    }


    /*********************************************************************************
    ORDER SUBMISSION
    *********************************************************************************/

    checkout.querySelector(
        "#order-submit"
    ).addEventListener("click", () => {
        if (cart.size === 0) {
            orderStatus.textContent =
                "Add at least one product to the order.";

            return;
        }

        if (!validateCash()) {
            cashInput.focus();

            return;
        }

        updateChange();

        // Backend integration

        orderStatus.textContent =
            "Order submission is not yet available.";
    });

    /*********************************************************************************
    RESPONSIVE VIEWPORTS
    *********************************************************************************/

    const compactCatalogViewport = window.matchMedia(
        "(max-width: 1199px)"
    );

    const drawerViewport = window.matchMedia(
        "(max-width: 899px), " +
        "(max-width: 1199px) and (orientation: portrait)"
    );

    const reducedMotionViewport = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );


    /*********************************************************************************
    MOBILE ORDER BAR
    *********************************************************************************/

    const mobileOrderBar = checkout.querySelector(
        "#checkout-mobile-order-bar"
    );

    const mobileOrderButton = checkout.querySelector(
        "#checkout-mobile-order-button"
    );

    const mobileOrderCount = checkout.querySelector(
        "#checkout-mobile-order-count"
    );

    const mobileOrderTotal = checkout.querySelector(
        "#checkout-mobile-order-total"
    );

    const synchronizeMobileOrderBar = () => {
        let quantity = 0;

        cart.forEach((item) => {
            quantity += item.quantity;
        });

        const total = calculateTotal();

        const itemLabel = quantity === 1
            ? "1 item in order"
            : `${quantity} items in order`;

        mobileOrderCount.textContent = itemLabel;

        mobileOrderTotal.textContent = money(total);

        mobileOrderButton.setAttribute(
            "aria-label",
            `View order, ${itemLabel}, total ${money(total)}`
        );

        mobileOrderBar.hidden =
            activeCheckoutView !== "pos" ||
            !drawerViewport.matches;
    };


    /*********************************************************************************
    CHECKOUT DRAWER STATE
    *********************************************************************************/

    const checkoutDrawer = checkout.querySelector(
        "#checkout-drawer"
    );

    const checkoutDrawerTitle = checkout.querySelector(
        "#checkout-drawer-title"
    );

    const checkoutDrawerClose = checkout.querySelector(
        "#checkout-drawer-close"
    );

    const checkoutDrawerBody = checkoutDrawer.querySelector(
        ".checkout-drawer-body"
    );

    const checkoutDrawerPanel = checkout.querySelector(
        "#checkout-drawer-panel"
    );

    const currentOrderPanel = checkoutPosView.querySelector(
        ".checkout-order"
    );

    const beverageSelection = checkout.querySelector(
        "#checkout-beverage-selection"
    );

    let activeDrawer = null;
    let drawerClosing = false;
    let drawerCloseTimer = null;
    let drawerReturnFocus = null;
    let drawerPanelPosition = null;


    /*********************************************************************************
    DRAWER PANEL MANAGEMENT
    *********************************************************************************/

    const moveDrawerPanel = (panel) => {
        drawerPanelPosition = {
            element: panel,
            parent: panel.parentNode,
            nextSibling: panel.nextSibling
        };

        checkoutDrawerPanel.appendChild(panel);
    };

    const restoreDrawerPanel = () => {
        if (!drawerPanelPosition) return;

        const {
            element,
            parent,
            nextSibling
        } = drawerPanelPosition;

        const insertionPoint =
            nextSibling?.parentNode === parent
                ? nextSibling
                : null;

        parent.insertBefore(
            element,
            insertionPoint
        );

        drawerPanelPosition = null;
    };


    /*********************************************************************************
    OPEN DRAWER
    *********************************************************************************/

    const openCheckoutDrawer = (
        view,
        title,
        trigger,
        panel = null
    ) => {
        if (checkoutDrawer.open || drawerClosing) {
            return false;
        }

        activeDrawer = view;

        drawerReturnFocus =
            trigger || document.activeElement;

        checkoutDrawer.dataset.drawerView = view;

        checkoutDrawerTitle.textContent = title;

        beverageSelection.hidden = view !== "beverage";

        checkoutDrawerPanel.hidden = !panel;

        if (panel) {
            moveDrawerPanel(panel);
        }

        checkoutDrawer.classList.remove(
            "checkout-drawer-closing"
        );

        checkoutDrawer.showModal();

        checkoutDrawerBody.scrollTop = 0;

        checkoutDrawerClose.focus({
            preventScroll: true
        });

        if (view === "order") {
            window.requestAnimationFrame(
                syncScrollShadows
            );
        }

        return true;
    };


    /*********************************************************************************
    CLOSE DRAWER
    *********************************************************************************/

    const finishDrawerClose = () => {
        window.clearTimeout(drawerCloseTimer);

        drawerCloseTimer = null;

        const returnFocus = drawerReturnFocus;

        activeDrawer = null;
        drawerClosing = false;
        drawerReturnFocus = null;

        if (checkoutDrawer.open) {
            checkoutDrawer.close();
        }

        restoreDrawerPanel();

        checkoutDrawer.classList.remove(
            "checkout-drawer-closing"
        );

        checkoutDrawer.removeAttribute(
            "data-drawer-view"
        );

        beverageSelection.hidden = true;

        checkoutDrawerPanel.hidden = true;

        activeBeverage = null;

        if (
            returnFocus?.isConnected &&
            returnFocus.getClientRects().length &&
            !returnFocus.disabled
        ) {
            returnFocus.focus({
                preventScroll: true
            });
        }

        window.requestAnimationFrame(
            syncScrollShadows
        );
    };

    const closeCheckoutDrawer = (immediate = false) => {
        if (!checkoutDrawer.open) return;

        if (
            immediate ||
            reducedMotionViewport.matches
        ) {
            finishDrawerClose();

            return;
        }

        if (drawerClosing) return;

        drawerClosing = true;

        checkoutDrawer.classList.add(
            "checkout-drawer-closing"
        );

        drawerCloseTimer = window.setTimeout(
            finishDrawerClose,
            300
        );
    };

    checkoutDrawer.addEventListener(
        "animationend",
        (event) => {
            if (
                drawerClosing &&
                event.target === checkoutDrawer &&
                event.animationName === "checkout-drawer-exit"
            ) {
                finishDrawerClose();
            }
        }
    );

    checkoutDrawer.addEventListener("close", () => {
        if (
            activeDrawer &&
            !checkoutDrawer.open
        ) {
            finishDrawerClose();
        }
    });


    /*********************************************************************************
    CURRENT ORDER DRAWER
    *********************************************************************************/

    const openCurrentOrder = () => {
        if (!drawerViewport.matches) return;

        if (activeCheckoutView !== "pos") return;

        openCheckoutDrawer(
            "order",
            "Current order",
            mobileOrderButton,
            currentOrderPanel
        );
    };

    mobileOrderButton.addEventListener(
        "click",
        openCurrentOrder
    );


    /*********************************************************************************
    RECIPE DETAILS DRAWER
    *********************************************************************************/

    const openRecipeDetails = (trigger) => {
        if (!drawerViewport.matches) return;

        if (activeCheckoutView !== "recipe") return;

        if (!selectedRecipeId) return;

        openCheckoutDrawer(
            "recipe",
            "Recipe details",
            trigger,
            recipePreview
        );
    };


    /*********************************************************************************
    BEVERAGE SELECTION STATE
    *********************************************************************************/

    const beverageImage = checkout.querySelector(
        "#checkout-beverage-image"
    );

    const beverageName = checkout.querySelector(
        "#checkout-beverage-name"
    );

    const beveragePrice = checkout.querySelector(
        "#checkout-beverage-price"
    );

    const beverageQuantityValue = checkout.querySelector(
        "#checkout-beverage-quantity"
    );

    const beverageDecrease = checkout.querySelector(
        "#checkout-beverage-decrease"
    );

    const beverageIncrease = checkout.querySelector(
        "#checkout-beverage-increase"
    );

    const beverageAdd = checkout.querySelector(
        "#checkout-beverage-add"
    );

    const beverageSizeButtons = checkout.querySelectorAll(
        "[data-drawer-size]"
    );

    let activeBeverage = null;
    let beverageSize = "Tall";
    let beverageQuantity = 1;


    /*********************************************************************************
    BEVERAGE SELECTION
    *********************************************************************************/

    const getAvailableBeverageQuantity = () => {
        if (!activeBeverage) return 0;

        const key = getCartKey(
            activeBeverage.name,
            beverageSize
        );

        const currentQuantity =
            cart.get(key)?.quantity || 0;

        return Math.max(
            0,
            maximumQuantity - currentQuantity
        );
    };

    const updateBeverageSelection = () => {
        if (!activeBeverage) return;

        const availableQuantity =
            getAvailableBeverageQuantity();

        beverageQuantity = Math.max(
            1,
            Math.min(
                beverageQuantity,
                availableQuantity
            )
        );

        beverageSizeButtons.forEach((button) => {
            const selected =
                button.dataset.drawerSize === beverageSize;

            button.classList.toggle(
                "checkout-beverage-size-active",
                selected
            );

            button.setAttribute(
                "aria-pressed",
                String(selected)
            );
        });

        beverageQuantityValue.textContent =
            String(beverageQuantity);

        beverageDecrease.disabled =
            beverageQuantity <= 1;

        beverageIncrease.disabled =
            beverageQuantity >= availableQuantity;

        beverageAdd.disabled =
            availableQuantity === 0;

        beverageAdd.textContent =
            availableQuantity === 0
                ? "Maximum quantity reached"
                : `Add to order — ${
                    money(
                        activeBeverage.price *
                        beverageQuantity
                    )
                }`;
    };

    const openBeverageSelection = (
        name,
        category,
        price,
        trigger
    ) => {
        if (!compactCatalogViewport.matches) return;

        if (checkoutDrawer.open || drawerClosing) return;

        activeBeverage = {
            name,
            category,
            price
        };

        beverageSize = getSelectedSize(
            name,
            category
        ) || "Tall";

        beverageQuantity = 1;

        beverageImage.replaceChildren(
            makeImage(name)
        );

        beverageName.textContent = name;

        beveragePrice.textContent =
            `${money(price)} each`;

        updateBeverageSelection();

        openCheckoutDrawer(
            "beverage",
            "Customize beverage",
            trigger
        );
    };


    /*********************************************************************************
    BEVERAGE SIZE EVENTS
    *********************************************************************************/

    beverageSizeButtons.forEach((button) => {
        button.addEventListener("click", () => {
            if (!activeBeverage || drawerClosing) return;

            const size = button.dataset.drawerSize;

            if (!beverageSizes.includes(size)) return;

            beverageSize = size;

            updateBeverageSelection();
        });
    });


    /*********************************************************************************
    BEVERAGE QUANTITY EVENTS
    *********************************************************************************/

    beverageDecrease.addEventListener("click", () => {
        if (!activeBeverage || drawerClosing) return;

        beverageQuantity = Math.max(
            1,
            beverageQuantity - 1
        );

        updateBeverageSelection();
    });

    beverageIncrease.addEventListener("click", () => {
        if (!activeBeverage || drawerClosing) return;

        beverageQuantity = Math.min(
            getAvailableBeverageQuantity(),
            beverageQuantity + 1
        );

        updateBeverageSelection();
    });


    /*********************************************************************************
    DESKTOP SIZE SYNCHRONIZATION
    *********************************************************************************/

    const synchronizeProductSize = (name, size) => {
        const productCards = productsContainer.querySelectorAll(
            ".checkout-product"
        );

        productCards.forEach((product) => {
            if (product.dataset.productName !== name) return;

            const sizeButtons = product.querySelectorAll(
                ".checkout-size-button"
            );

            sizeButtons.forEach((button) => {
                const selected =
                    button.dataset.size === size;

                button.classList.toggle(
                    "checkout-size-button-active",
                    selected
                );

                button.setAttribute(
                    "aria-pressed",
                    String(selected)
                );
            });

            const addButton = product.querySelector(
                ".checkout-product-add"
            );

            if (addButton) {
                addButton.setAttribute(
                    "aria-label",
                    `Add ${getProductLabel(name, size)} to the order`
                );
            }
        });
    };


    /*********************************************************************************
    ADD BEVERAGE TO ORDER
    *********************************************************************************/

    beverageAdd.addEventListener("click", () => {
        if (!activeBeverage || drawerClosing) return;

        const availableQuantity =
            getAvailableBeverageQuantity();

        if (
            beverageQuantity < 1 ||
            beverageQuantity > availableQuantity
        ) {
            updateBeverageSelection();

            return;
        }

        const {
            name,
            price
        } = activeBeverage;

        selectedSizes.set(
            name,
            beverageSize
        );

        synchronizeProductSize(
            name,
            beverageSize
        );

        updateCart(
            name,
            beverageSize,
            price,
            beverageQuantity
        );

        synchronizeMobileOrderBar();

        closeCheckoutDrawer();
    });


    /*********************************************************************************
    DRAWER EVENTS
    *********************************************************************************/

    checkoutDrawerClose.addEventListener(
        "click",
        () => {
            closeCheckoutDrawer();
        }
    );

    checkoutDrawer.addEventListener(
        "cancel",
        (event) => {
            event.preventDefault();

            closeCheckoutDrawer();
        }
    );

    checkoutDrawer.addEventListener(
        "click",
        (event) => {
            if (event.target === checkoutDrawer) {
                closeCheckoutDrawer();
            }
        }
    );


    /*********************************************************************************
    RESPONSIVE VIEWPORT EVENTS
    *********************************************************************************/

    const updateResponsiveCheckout = () => {
        if (checkoutDrawer.open) {
            const panelDrawer =
                activeDrawer === "order" ||
                activeDrawer === "recipe" ||
                activeDrawer === "order-details";

            const beverageDrawer =
                activeDrawer === "beverage";

            if (
                panelDrawer &&
                !drawerViewport.matches
            ) {
                closeCheckoutDrawer(true);
            }

            if (
                beverageDrawer &&
                !compactCatalogViewport.matches
            ) {
                closeCheckoutDrawer(true);
            }
        }

        synchronizeMobileOrderBar();

        window.requestAnimationFrame(
            syncScrollShadows
        );
    };

    drawerViewport.addEventListener(
        "change",
        updateResponsiveCheckout
    );

    compactCatalogViewport.addEventListener(
        "change",
        updateResponsiveCheckout
    );

    /*********************************************************************************
    ORDER RECORDS
    *********************************************************************************/

    const orderHistory = [
        {
            id: "0018",
            time: "10:45 AM",
            type: "Dine-in",
            payment: "Cash",
            status: "Processing",

            items: [
                {
                    name: "French Vanilla",
                    quantity: 1,
                    price: 170
                },
                {
                    name: "NYC Style Cookies",
                    quantity: 1,
                    price: 155
                }
            ]
        },
        {
            id: "0017",
            time: "10:21 AM",
            type: "Take-out",
            payment: "GCash",
            status: "Completed",

            items: [
                {
                    name: "Pain Au Chocolat",
                    quantity: 1,
                    price: 80
                }
            ]
        },
        {
            id: "0016",
            time: "9:58 AM",
            type: "Dine-in",
            payment: "Cash",
            status: "Completed",

            items: [
                {
                    name: "Nutella Latte",
                    quantity: 1,
                    price: 150
                }
            ]
        },
        {
            id: "0015",
            time: "9:30 AM",
            type: "Take-out",
            payment: "Cash",
            status: "Canceled",

            items: [
                {
                    name: "Cafe Latte",
                    quantity: 1,
                    price: 150
                }
            ]
        }
    ];


    /*********************************************************************************
    ORDER HISTORY STATE
    *********************************************************************************/

    const orderHistoryView = checkout.querySelector(
        "#checkout-orders-content"
    );

    const orderHistoryFilters = checkout.querySelector(
        "#checkout-orders-filters"
    );

    const orderHistoryScroll = checkout.querySelector(
        "#checkout-orders-scroll"
    );

    const orderHistoryList = checkout.querySelector(
        "#checkout-history-list"
    );

    const orderHistoryDrawerDetails = checkout.querySelector(
        "#checkout-history-drawer-details"
    );

    const orderStatuses = [
        "All",
        "Processing",
        "Completed",
        "Canceled"
    ];

    let activeOrderStatus = "All";
    let expandedOrderId = "0018";

    checkoutSearchValues.orders = "";


    /*********************************************************************************
    ORDER CALCULATIONS
    *********************************************************************************/

    const getHistoryOrderTotal = (order) => {
        return order.items.reduce((total, item) => {
            return total + item.price * item.quantity;
        }, 0);
    };

    const getHistoryOrderVat = (order) => {
        const total = getHistoryOrderTotal(order);

        return total - total / 1.12;
    };

    const getHistoryItemSummary = (order) => {
        return order.items.map((item) => {
            const size = item.size
                ? ` (${item.size})`
                : "";

            return `${item.name}${size} ×${item.quantity}`;
        }).join(", ");
    };


    /*********************************************************************************
    ORDER STATUS
    *********************************************************************************/

    const makeHistoryStatus = (status) => {
        const statusClass = status.toLowerCase();

        return makeElement(
            "span",
            `checkout-history-status checkout-history-status-${statusClass}`,
            status
        );
    };

    const getHistoryStatusCount = (status) => {
        if (status === "All") {
            return orderHistory.length;
        }

        return orderHistory.filter((order) => {
            return order.status === status;
        }).length;
    };


    /*********************************************************************************
    ORDER FILTERS
    *********************************************************************************/

    const updateOrderHistoryFilters = () => {
        orderHistoryFilters.querySelectorAll(
            ".checkout-orders-filter"
        ).forEach((button) => {
            const status = button.dataset.status;

            const selected =
                status === activeOrderStatus;

            button.textContent =
                `${status} (${getHistoryStatusCount(status)})`;

            button.classList.toggle(
                "checkout-orders-filter-active",
                selected
            );

            button.setAttribute(
                "aria-pressed",
                String(selected)
            );
        });
    };

    const renderOrderHistoryFilters = () => {
        orderHistoryFilters.replaceChildren();

        orderStatuses.forEach((status) => {
            const button = makeButton(
                "checkout-orders-filter",
                `Filter ${status.toLowerCase()} orders`
            );

            button.dataset.status = status;

            button.addEventListener("click", () => {
                activeOrderStatus = status;
                expandedOrderId = null;

                updateOrderHistoryFilters();
                renderOrderHistory();

                orderHistoryScroll.scrollTop = 0;
            });

            orderHistoryFilters.appendChild(button);
        });

        updateOrderHistoryFilters();
    };


    /*********************************************************************************
    ORDER SEARCH
    *********************************************************************************/

    const getVisibleHistoryOrders = () => {
        const search = searchInput.value
            .trim()
            .toLowerCase();

        return orderHistory.filter((order) => {
            const matchesStatus =
                activeOrderStatus === "All" ||
                order.status === activeOrderStatus;

            const searchableText = [
                order.id,
                `#${order.id}`,
                order.time,
                order.type,
                order.payment,
                order.status,
                getHistoryItemSummary(order),
                String(getHistoryOrderTotal(order)),
                money(getHistoryOrderTotal(order))
            ].join(" ").toLowerCase();

            const matchesSearch =
                !search ||
                search.split(/\s+/).every((term) => {
                    return searchableText.includes(term);
                });

            return matchesStatus && matchesSearch;
        });
    };


    /*********************************************************************************
    ORDER DETAILS HEADING
    *********************************************************************************/

    const makeHistoryDetailsHeading = (order) => {
        const heading = makeElement(
            "div",
            "checkout-history-detail-heading"
        );

        const headingTop = makeElement(
            "div",
            "checkout-history-detail-heading-top"
        );

        headingTop.appendChild(
            makeElement(
                "h3",
                "checkout-history-detail-number",
                `#${order.id}`
            )
        );

        headingTop.appendChild(
            makeHistoryStatus(order.status)
        );

        heading.appendChild(headingTop);

        heading.appendChild(
            makeElement(
                "p",
                "checkout-history-detail-information",
                `${order.time} · ${order.type} · ${order.payment}`
            )
        );

        heading.appendChild(
            makeElement(
                "h4",
                "checkout-history-detail-title",
                "Order items"
            )
        );

        return heading;
    };


    /*********************************************************************************
    ORDER DETAILS COLUMNS
    *********************************************************************************/

    const makeHistoryDetailsColumns = () => {
        const columns = makeElement(
            "div",
            "checkout-history-detail-columns"
        );

        [
            "Items",
            "Qty",
            "Price each",
            "Subtotal"
        ].forEach((label) => {
            columns.appendChild(
                makeElement("span", "", label)
            );
        });

        return columns;
    };


    /*********************************************************************************
    ORDER DETAILS ITEMS
    *********************************************************************************/

    const makeHistoryDetailsItem = (item) => {
        const row = makeElement(
            "div",
            "checkout-history-detail-item"
        );

        const name = item.size
            ? `${item.name} (${item.size})`
            : item.name;

        row.appendChild(
            makeElement(
                "span",
                "checkout-history-detail-name",
                name
            )
        );

        const quantity = makeElement(
            "span",
            "checkout-history-detail-quantity",
            String(item.quantity)
        );

        quantity.setAttribute(
            "aria-label",
            `Quantity: ${item.quantity}`
        );

        row.appendChild(quantity);

        row.appendChild(
            makeElement(
                "span",
                "checkout-history-detail-price",
                money(item.price)
            )
        );

        row.appendChild(
            makeElement(
                "span",
                "checkout-history-detail-subtotal",
                money(item.price * item.quantity)
            )
        );

        return row;
    };


    /*********************************************************************************
    ORDER DETAILS SUMMARY
    *********************************************************************************/

    const makeHistorySummaryLine = (
        label,
        value,
        highlighted = false
    ) => {
        const line = makeElement(
            "div",
            "checkout-history-summary-line"
        );

        if (highlighted) {
            line.classList.add(
                "checkout-history-summary-total"
            );
        }

        line.appendChild(
            makeElement("span", "", label)
        );

        line.appendChild(
            makeElement("strong", "", value)
        );

        return line;
    };

    const makeHistoryDetailsSummary = (order) => {
        const summary = makeElement(
            "div",
            "checkout-history-detail-summary"
        );

        summary.appendChild(
            makeHistorySummaryLine(
                "VAT (12%, included)",
                money(getHistoryOrderVat(order), 2)
            )
        );

        summary.appendChild(
            makeHistorySummaryLine(
                "Total",
                money(getHistoryOrderTotal(order)),
                true
            )
        );

        return summary;
    };


    /*********************************************************************************
    ORDER DETAILS
    *********************************************************************************/

    const makeHistoryDetails = (order) => {
        const details = makeElement(
            "div",
            "checkout-history-details"
        );

        details.appendChild(
            makeHistoryDetailsHeading(order)
        );

        details.appendChild(
            makeHistoryDetailsColumns()
        );

        order.items.forEach((item) => {
            details.appendChild(
                makeHistoryDetailsItem(item)
            );
        });

        details.appendChild(
            makeHistoryDetailsSummary(order)
        );

        return details;
    };


    /*********************************************************************************
    MOBILE ORDER HISTORY DRAWER
    *********************************************************************************/

    const openHistoryOrderDetails = (order, trigger) => {
        if (!drawerViewport.matches) return;

        if (activeCheckoutView !== "orders") return;

        if (checkoutDrawer.open || drawerClosing) return;

        orderHistoryDrawerDetails.replaceChildren(
            makeHistoryDetails(order)
        );

        openCheckoutDrawer(
            "order-details",
            "Order details",
            trigger,
            orderHistoryDrawerDetails
        );
    };


    /*********************************************************************************
    ORDER EXPANSION
    *********************************************************************************/

    const updateHistoryOrderExpansion = () => {
        orderHistoryList.querySelectorAll(
            ".checkout-history-record"
        ).forEach((record) => {
            const orderId = record.dataset.orderId;

            const order = orderHistory.find((item) => {
                return item.id === orderId;
            });

            const button = record.querySelector(
                ".checkout-history-row"
            );

            const existingDetails = record.querySelector(
                ".checkout-history-details"
            );

            const mobileView = drawerViewport.matches;

            const expanded =
                !mobileView &&
                expandedOrderId === orderId;

            record.classList.toggle(
                "checkout-history-record-expanded",
                expanded
            );

            if (mobileView) {
                button.removeAttribute("aria-expanded");

                button.setAttribute(
                    "aria-haspopup",
                    "dialog"
                );
            } else {
                button.removeAttribute("aria-haspopup");

                button.setAttribute(
                    "aria-expanded",
                    String(expanded)
                );
            }

            if (expanded && !existingDetails && order) {
                record.appendChild(
                    makeHistoryDetails(order)
                );
            }

            if (!expanded && existingDetails) {
                existingDetails.remove();
            }
        });
    };


    /*********************************************************************************
    ORDER RECORDS
    *********************************************************************************/

    const makeHistoryOrderRecord = (order) => {
        const record = makeElement(
            "div",
            "checkout-history-record"
        );

        record.dataset.orderId = order.id;

        const button = makeButton(
            "checkout-history-row",
            `Order #${order.id}, ${order.time}, ${
                getHistoryItemSummary(order)
            }, ${order.type}, ${order.payment}, ${
                money(getHistoryOrderTotal(order))
            }, ${order.status}. View details.`
        );

        const fields = [
            [
                "checkout-history-number",
                `#${order.id}`
            ],
            [
                "checkout-history-time",
                order.time
            ],
            [
                "checkout-history-items",
                getHistoryItemSummary(order)
            ],
            [
                "checkout-history-type",
                order.type
            ],
            [
                "checkout-history-payment",
                order.payment
            ],
            [
                "checkout-history-total",
                money(getHistoryOrderTotal(order))
            ]
        ];

        fields.forEach(([className, value]) => {
            button.appendChild(
                makeElement(
                    "span",
                    className,
                    value
                )
            );
        });

        button.appendChild(
            makeHistoryStatus(order.status)
        );

        const toggle = makeElement(
            "span",
            "checkout-history-toggle"
        );

        toggle.setAttribute(
            "aria-hidden",
            "true"
        );

        toggle.appendChild(
            makeElement(
                "span",
                "checkout-history-detail-label",
                "View details"
            )
        );

        button.appendChild(toggle);

        button.addEventListener("click", () => {
            if (drawerViewport.matches) {
                openHistoryOrderDetails(
                    order,
                    button
                );

                return;
            }

            expandedOrderId =
                expandedOrderId === order.id
                    ? null
                    : order.id;

            updateHistoryOrderExpansion();
        });

        record.appendChild(button);

        return record;
    };


    /*********************************************************************************
    RENDER ORDER HISTORY
    *********************************************************************************/

    const renderOrderHistory = () => {
        const visibleOrders = getVisibleHistoryOrders();

        const previousScrollTop =
            orderHistoryScroll.scrollTop;

        orderHistoryList.replaceChildren();

        if (!visibleOrders.length) {
            orderHistoryList.appendChild(
                makeElement(
                    "div",
                    "checkout-history-empty",
                    "No matching orders found."
                )
            );

            return;
        }

        visibleOrders.forEach((order) => {
            orderHistoryList.appendChild(
                makeHistoryOrderRecord(order)
            );
        });

        updateHistoryOrderExpansion();

        orderHistoryScroll.scrollTop =
            previousScrollTop;
    };


    /*********************************************************************************
    ORDER HISTORY RESPONSIVENESS
    *********************************************************************************/

    drawerViewport.addEventListener("change", () => {
        if (activeCheckoutView !== "orders") return;

        updateHistoryOrderExpansion();
    });

    /*********************************************************************************
    BARISTA PROFILE
    *********************************************************************************/

    const baristaProfile = checkout.querySelector(
        "#checkout-profile"
    );

    const profileButton = checkout.querySelector(
        "#checkout-profile-button"
    );

    const profileMenu = checkout.querySelector(
        "#checkout-profile-menu"
    );

    const logoutButton = checkout.querySelector(
        "#checkout-logout-button"
    );

    const profileIsOpen = () => {
        return baristaProfile.classList.contains(
            "checkout-profile-open"
        );
    };

    const openProfileMenu = () => {
        baristaProfile.classList.add(
            "checkout-profile-open"
        );

        profileButton.setAttribute(
            "aria-expanded",
            "true"
        );

        profileMenu.inert = false;
    };

    const closeProfileMenu = () => {
        baristaProfile.classList.remove(
            "checkout-profile-open"
        );

        profileButton.setAttribute(
            "aria-expanded",
            "false"
        );

        profileMenu.inert = true;
    };


    /*********************************************************************************
    PROFILE MENU EVENTS
    *********************************************************************************/

    profileButton.addEventListener("click", () => {
        if (profileIsOpen()) {
            closeProfileMenu();
        } else {
            openProfileMenu();
        }
    });

    document.addEventListener("click", (event) => {
        if (!profileIsOpen()) return;

        if (!baristaProfile.contains(event.target)) {
            closeProfileMenu();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (
            event.key === "Escape" &&
            profileIsOpen()
        ) {
            event.preventDefault();

            closeProfileMenu();

            profileButton.focus({
                preventScroll: true
            });
        }
    });

    baristaProfile.addEventListener("focusout", (event) => {
        if (
            event.relatedTarget &&
            !baristaProfile.contains(event.relatedTarget)
        ) {
            closeProfileMenu();
        }
    });

    checkoutNavigationButtons.forEach((button) => {
        button.addEventListener(
            "click",
            closeProfileMenu
        );
    });


    /*********************************************************************************
    LOGOUT
    *********************************************************************************/

    logoutButton.addEventListener("click", () => {
        if (cart.size > 0) {
            const confirmed = window.confirm(
                "You have an unfinished order. " +
                "Are you sure you want to log out?"
            );

            if (!confirmed) return;
        }

        closeProfileMenu();

        // Backend session termination

        window.location.replace(
            "../../admin/login/login.html"
        );
    });

    /*********************************************************************************
    INITIALIZATION
    *********************************************************************************/

    checkout.querySelector("#order-date").textContent =
        new Date().toLocaleDateString("en-PH", {
            month: "short",
            day: "numeric"
        });

    renderCategories();
    renderProducts();
    renderOrder();
    renderOrderHistoryFilters();
    updatePaymentMethod();
    updateResponsiveCheckout();
})();
