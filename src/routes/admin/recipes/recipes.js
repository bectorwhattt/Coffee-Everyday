(() => {
    "use strict";

    /*********************************************************************************
    RECIPE CATEGORIES
    *********************************************************************************/
    const categories = [
        { name: "Coffee Classics", count: 11 },
        { name: "Coffee Specials", count: 8 },
        { name: "Non-coffee", count: 8 },
        { name: "Frappes & Shakes", count: 6 },
        { name: "Soda Pop", count: 0 },
        { name: "Bread & Pastries", count: 4 },
        { name: "Sandwiches", count: 3 },
        { name: "Snacks", count: 7 },
        { name: "Pastas", count: 3 },
        { name: "Rice Meals", count: 8 }
    ];


    /*********************************************************************************
    INVENTORY DATA
    *********************************************************************************/
    const inventory = [
        { name: "Coffee Beans", unit: "g", unitCost: 17 / 18, stock: "Low" },
        { name: "Whole Milk", unit: "ml", unitCost: 17 / 150, stock: "Low" },
        { name: "Salted Caramel Syrup", unit: "ml", unitCost: 18 / 20, stock: "No stock" },
        { name: "16oz Cup", unit: "pc", unitCost: 4, stock: "No stock" },
        { name: "Cup Lid", unit: "pc", unitCost: 2, stock: "No stock" }
    ];


    /*********************************************************************************
    PRODUCT PRICES
    *********************************************************************************/
    const checkoutMenuPrices = new Map([

        // COFFEE CLASSICS
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
        ["Hazelnut Mocha", 170],

        // COFFEE SPECIALS
        ["Toffeedamia", 190],
        ["Roasted Almondamia", 190],
        ["Biscoffee", 200],
        ["Oreo Madness", 200],
        ["C.E. Barista Blend", 220],

        // NON-COFFEE
        ["Signature Choco", 150],
        ["Milky Strawberry", 150],
        ["Dark Chocolate", 150],
        ["Matcha Latte", 170],
        ["Berry Matcha", 190],
        ["Oreo Milk", 150],
        ["Nutella Latte", 150],
        ["Biscoff Latte", 150],

        // FRAPPES & SHAKES
        ["Vanilla Milkshake", 170],
        ["Strawberries & Cream", 170],
        ["Oreos & Cream", 170],
        ["Dark Mocha Frappe", 190],
        ["Java Chip Frappe", 190],
        ["Seasalt Frappe", 190],

        // BREAD & PASTRIES
        ["Butter Croissant", 70],
        ["Pain Au Chocolat", 80],
        ["Choco Chip Cookies", 90],
        ["White Chocochip Cookies", 90],

        // SANDWICHES
        ["Ham & Egg Sandwich", 160],
        ["Spam Sandwich", 170],
        ["Chicken Fillet Sandwich", 180],

        // SNACKS
        ["French Fries (salted/cheese)", 90],
        ["Twister Fries", 110],
        ["Mojos", 120],
        ["Pica Platter", 199],
        ["4pcs Nuggets & Fries", 140],
        ["3pcs Chicken Tenders w/ dip", 160],
        ["Chicken Popcorn", 110],

        // PASTAS
        ["Creamy Sausage & Shrimp Cajun", 250],
        ["Spicy Shrimp Aglio Olio", 220],
        ["Cheesy Tuna Pesto", 220],

        // RICE MEALS
        ["Allday Spam Rice", 250],
        ["Sausage Delight, 1pc", 220],
        ["Sausage Delight, 2pcs", 220],
        ["Chicken Pastil (spicy / orig)", 250],
        ["Tori Katsu with Cabbage Salad", 220],
        ["2-pc Mushroom Burger Steak", 220],
        ["Chicken Peppered Steak", 250],
        ["4-pc Nuggets with rice", 220]

    ].map(([name, price]) => [name.trim().toLowerCase(), price]));

    // Original amounts retained for recipe-only products.
    const originalRecipePrices = new Map([
        ["dirty matcha", 45],
        ["mocha frappe", 59]
    ]);

    const checkoutPriceFor = name => {
        const normalizedName = String(name).trim().toLowerCase();

        return checkoutMenuPrices.get(normalizedName)
            ?? originalRecipePrices.get(normalizedName)
            ?? 0;
    };


    /*********************************************************************************
    DEFAULT RECIPES
    *********************************************************************************/
    const sample = (category, names) => names.map((name, index) => ({
        id: category.replace(/[^a-z]/gi, "-").toLowerCase() + "-" + index,
        name,
        category,
        serving: "",
        price: checkoutPriceFor(name),
        labor: 10,
        costEstimate: null,
        image: "",
        ingredients: []
    }));

    // Restore the five missing Coffee Specials products.
    const restoredSpecials = sample("Coffee Specials", [
        "Toffeedamia",
        "Roasted Almondamia",
        "Biscoffee",
        "Oreo Madness",
        "C.E. Barista Blend"
    ]).map(recipe => ({
        ...recipe,
        id: "restored-" + recipe.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
    }));

    const initialRecipes = [
        {
            id: "salted-caramel",
            name: "Salted Caramel",
            category: "Coffee Specials",
            serving: "1 cup (16oz)",
            price: 170,
            labor: 10,
            costEstimate: 58,
            image: "",

            ingredients: [
                {
                    id: "beans",
                    name: "Coffee Beans",
                    quantity: 18,
                    unit: "g",
                    unitCost: 17 / 18,
                    stock: "Low"
                },
                {
                    id: "milk",
                    name: "Whole Milk",
                    quantity: 150,
                    unit: "ml",
                    unitCost: 17 / 150,
                    stock: "Low"
                },
                {
                    id: "syrup",
                    name: "Salted Caramel Syrup",
                    quantity: 20,
                    unit: "ml",
                    unitCost: 18 / 20,
                    stock: "No stock"
                },
                {
                    id: "cup",
                    name: "16oz Cup",
                    quantity: 1,
                    unit: "pc",
                    unitCost: 4,
                    stock: "No stock"
                },
                {
                    id: "lid",
                    name: "Cup Lid",
                    quantity: 1,
                    unit: "pc",
                    unitCost: 2,
                    stock: "No stock"
                }
            ]
        },

        ...[
            { id: "special-0", name: "Dirty Matcha", costEstimate: 45 },
            { id: "special-2", name: "Mocha Frappe", costEstimate: 59 }
        ].map(({ id, name, costEstimate }) => ({
            id,
            name,
            category: "Coffee Specials",
            serving: "",
            price: checkoutPriceFor(name),
            labor: 10,
            costEstimate,
            image: "",
            ingredients: []
        })),

        ...restoredSpecials,

        ...sample("Coffee Classics", [
            "Americano",
            "Cafe Latte",
            "Cappucino",
            "French Vanilla",
            "Spanish Latte",
            "Seasalt Latte",
            "Caramel Macchiato",
            "Cafe Mocha",
            "Dark Choc Mocha",
            "White Mocha",
            "Hazelnut Mocha"
        ]).map(recipe => ({
            ...recipe,
            costEstimate: recipe.name === "Americano" ? 23 :
                recipe.name === "Spanish Latte" ? 45 : null
        })),

        ...sample("Non-coffee", [
            "Signature Choco",
            "Milky Strawberry",
            "Dark Chocolate",
            "Matcha Latte",
            "Berry Matcha",
            "Oreo Milk",
            "Nutella Latte",
            "Biscoff Latte"
        ]).map(recipe => ({
            ...recipe,
            costEstimate: recipe.name === "Matcha Latte" ? 39 : null
        })),

        ...sample("Frappes & Shakes", [
            "Vanilla Milkshake",
            "Strawberries & Cream",
            "Oreos & Cream",
            "Dark Mocha Frappe",
            "Java Chip Frappe",
            "Seasalt Frappe"
        ]),

        ...sample("Bread & Pastries", [
            "Butter Croissant",
            "Pain Au Chocolat",
            "Choco Chip Cookies",
            "White Chocochip Cookies"
        ]),

        ...sample("Sandwiches", [
            "Ham & Egg Sandwich",
            "Spam Sandwich",
            "Chicken Fillet Sandwich"
        ]),

        ...sample("Snacks", [
            "French Fries (salted/cheese)",
            "Twister Fries",
            "Mojos",
            "Pica Platter",
            "4pcs Nuggets & Fries",
            "3pcs Chicken Tenders w/ dip",
            "Chicken Popcorn"
        ]),

        ...sample("Pastas", [
            "Creamy Sausage & Shrimp Cajun",
            "Spicy Shrimp Aglio Olio",
            "Cheesy Tuna Pesto"
        ]),

        ...sample("Rice Meals", [
            "Allday Spam Rice",
            "Sausage Delight, 1pc",
            "Sausage Delight, 2pcs",
            "Chicken Pastil (spicy / orig)",
            "Tori Katsu with Cabbage Salad",
            "2-pc Mushroom Burger Steak",
            "Chicken Peppered Steak",
            "4-pc Nuggets with rice"
        ])
    ];


    /*********************************************************************************
    PAGE STATE
    *********************************************************************************/
    const storageKey = "coffee-everyday-recipes-demo-v1";
    const priceRevisionKey = storageKey + "-original-prices-restored-v1";

    let recipes = initialRecipes;
    let selectedCategory = "Coffee Specials";
    let selectedRecipeId = "salted-caramel";
    let draft = null;
    let addingNew = false;
    let toastTimeout = null;
    let nextIngredientId = 0;


    /*********************************************************************************
    HELPERS
    *********************************************************************************/
    const getRecipeElement = identifier =>
        document.getElementById(identifier);

    const clone = value =>
        JSON.parse(JSON.stringify(value));

    const escapeHtml = value =>
        String(value ?? "").replace(/[&<>"']/g, character => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        }[character]));

    const formatMoney = (value, decimals = 0) =>
        "\u20B1" + Number(value || 0).toLocaleString("en-PH", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });

    const ingredientCost = recipe =>
        recipe.ingredients.length
            ? recipe.ingredients.reduce(
                (total, item) =>
                    total + Number(item.quantity) * Number(item.unitCost),
                0
            )
            : Number(recipe.costEstimate || 0);

    const lineCost = ingredient =>
        Number(ingredient.quantity) * Number(ingredient.unitCost);

    const newIdentifier = prefix =>
        prefix + "-" +
        Date.now().toString(36) + "-" +
        Math.random().toString(36).slice(2, 8);


    /*********************************************************************************
    SVG ICONS
    *********************************************************************************/
    const imageIcon = () =>
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
        'stroke-width="1.6" stroke-linecap="round" ' +
        'stroke-linejoin="round" aria-hidden="true">' +
        '<rect x="3" y="3" width="18" height="18" rx="2"/>' +
        '<circle cx="8.4" cy="8.4" r="1.4"/>' +
        '<path d="m3 17 5-5 4 3 4-5 5 6"/>' +
        '</svg>';

    const trashIcon = () =>
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
        'stroke-width="1.8" stroke-linecap="round" ' +
        'stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M4 7h16M10 4h4m-8 3 1 13h10l1-13M10 11v6m4-6v6"/>' +
        '</svg>';


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

        // TENTATIVE PRODUCT IMAGE MATCHES
        "french fries (salted/cheese)": "french-fries-salted-cheese",
        "choco chip cookies": "choco-chip-cookies",
        "allday spam rice": "allday-spam-rice",

        "dirty matcha": "dirty-matcha"
    };

    const inventoryImageStem = name =>
        inventoryImageNames[
            String(name || "").trim().toLowerCase()
        ] || "";

    const imageMarkup = recipe => {
        // Uploaded images override default inventory images.
        if (recipe.image) {
            return '<img src="' + escapeHtml(recipe.image) +
                '" alt="' + escapeHtml(recipe.name) +
                '" loading="lazy">';
        }

        const filename = inventoryImageStem(recipe.name);

        if (!filename) {
            return imageIcon();
        }

        return '<img src="' +
            escapeHtml(
                inventoryImageDirectory +
                filename + "." +
                inventoryImageExtensions[0]
            ) +
            '" data-inventory-stem="' + escapeHtml(filename) +
            '" data-inventory-index="0" alt="' +
            escapeHtml(recipe.name) +
            '" loading="lazy">';
    };

    // Try other extensions before displaying the placeholder.
    document.querySelector(".main").addEventListener("error", event => {
        const image = event.target;

        if (!image.matches ||
            !image.matches("img[data-inventory-stem]")) {
            return;
        }

        const nextIndex =
            Number(image.dataset.inventoryIndex) + 1;

        if (nextIndex < inventoryImageExtensions.length) {
            image.dataset.inventoryIndex = String(nextIndex);

            image.src =
                inventoryImageDirectory +
                image.dataset.inventoryStem + "." +
                inventoryImageExtensions[nextIndex];
        } else {
            const container = image.parentElement;

            if (container) {
                container.innerHTML = imageIcon();
            }
        }
    }, true);


    /*********************************************************************************
    SAVED RECIPE MIGRATION
    *********************************************************************************/
    const retiredSampleRecipes = new Map([
        [
            "coffee-classics-4",
            { name: "salted caramel", category: "Coffee Specials" }
        ],
        [
            "special-1",
            { name: "matcha latte", category: "Non-coffee" }
        ],
        [
            "special-3",
            { name: "americano", category: "Coffee Classics" }
        ],
        [
            "special-4",
            { name: "spanish latte", category: "Coffee Classics" }
        ]
    ]);

    const normalizeSavedRecipes = stored => {
        const normalized = stored.filter(recipe =>
            String(recipe.name).trim().toLowerCase() !==
                "spanish latte dwadaw"
        ).map(recipe => ({ ...recipe }));

        for (const duplicate of [...normalized]) {
            const correction =
                retiredSampleRecipes.get(duplicate.id);

            if (!correction ||
                String(duplicate.name).trim().toLowerCase() !==
                    correction.name) {
                continue;
            }

            const preferred = normalized.find(recipe =>
                recipe !== duplicate &&
                String(recipe.name).trim().toLowerCase() ===
                    correction.name &&
                recipe.category === correction.category
            );

            if (!preferred) {
                duplicate.category = correction.category;
                continue;
            }

            if (!preferred.ingredients.length &&
                duplicate.ingredients.length) {
                preferred.ingredients = duplicate.ingredients;
                preferred.costEstimate = duplicate.costEstimate;
            } else if (
                preferred.costEstimate == null &&
                duplicate.costEstimate != null
            ) {
                preferred.costEstimate = duplicate.costEstimate;
            }

            if (!preferred.image && duplicate.image) {
                preferred.image = duplicate.image;
            }

            if (!preferred.serving && duplicate.serving) {
                preferred.serving = duplicate.serving;
            }

            normalized.splice(
                normalized.indexOf(duplicate),
                1
            );
        }

        return normalized.map(recipe => {
            const menuPrice = checkoutPriceFor(recipe.name);

            return menuPrice > 0 &&
                !(Number(recipe.price) > 0)
                ? { ...recipe, price: menuPrice }
                : recipe;
        });
    };


    /*********************************************************************************
    RESTORE ORIGINAL PRODUCT PRICES
    *********************************************************************************/
    function restoreOriginalPrices(records) {
        const restored = records.map(recipe => {
            const menuPrice = checkoutPriceFor(recipe.name);

            return menuPrice > 0
                ? { ...recipe, price: menuPrice }
                : recipe;
        });

        const names = new Set(
            restored.map(recipe =>
                String(recipe.name).trim().toLowerCase()
            )
        );

        const ids = new Set(
            restored.map(recipe => recipe.id)
        );

        // Restore missing catalog entries without replacing saved ingredients.
        for (const recipe of initialRecipes) {
            const name = recipe.name.trim().toLowerCase();

            if (names.has(name)) {
                continue;
            }

            const copy = clone(recipe);

            if (ids.has(copy.id)) {
                copy.id = newIdentifier("recipe");
            }

            restored.push(copy);
            names.add(name);
            ids.add(copy.id);
        }

        return restored;
    }

    try {
        const stored = JSON.parse(
            localStorage.getItem(storageKey) || "null"
        );

        if (Array.isArray(stored) && stored.every(item =>
            item &&
            item.id &&
            item.category &&
            Array.isArray(item.ingredients)
        )) {
            recipes = normalizeSavedRecipes(stored);

            // Restore original prices once only.
            const needsPriceRestore =
                localStorage.getItem(priceRevisionKey) !== "1";

            if (needsPriceRestore) {
                recipes = restoreOriginalPrices(recipes);
            }

            if (needsPriceRestore ||
                JSON.stringify(recipes) !== JSON.stringify(stored)) {
                localStorage.setItem(
                    storageKey,
                    JSON.stringify(recipes)
                );
            }

            if (needsPriceRestore) {
                localStorage.setItem(priceRevisionKey, "1");
            }
        } else {
            // The default catalog already contains the correct prices.
            localStorage.setItem(priceRevisionKey, "1");
        }
    } catch (error) {
        // Retain the in-memory catalog if storage is unavailable.
    }

    function persist() {
        try {
            localStorage.setItem(
                storageKey,
                JSON.stringify(recipes)
            );

            return true;
        } catch (error) {
            return false;
        }
    }


    /*********************************************************************************
    NOTIFICATIONS
    *********************************************************************************/
    function notify(message) {
        const toast = getRecipeElement("recipes-toast");

        toast.textContent = message;
        toast.hidden = false;

        if (toastTimeout) {
            clearTimeout(toastTimeout);
        }

        toastTimeout = setTimeout(() => {
            toast.hidden = true;
        }, 3200);
    }


    /*********************************************************************************
    RECIPE CATEGORIES
    *********************************************************************************/
    function categoryCount(category) {
        return recipes.filter(recipe =>
            recipe.category === category.name
        ).length;
    }

    function renderCategories() {
        getRecipeElement("recipes-categories").innerHTML =
            categories.map(category => {
                const active =
                    selectedCategory === category.name;

                return '<button class="recipes-category' +
                    (active ? ' recipes-category-active' : '') +
                    '" type="button" data-category="' +
                    escapeHtml(category.name) +
                    '" aria-pressed="' + active + '">' +
                    '<span>' +
                    escapeHtml(category.name) +
                    '</span><strong>' +
                    categoryCount(category) +
                    '</strong></button>';
            }).join("");
    }


    /*********************************************************************************
    RECIPE BROWSER
    *********************************************************************************/
    function renderBrowser() {
        const wasEditing = !getRecipeElement("recipes-editor").hidden;

        getRecipeElement("recipes-browser").hidden = false;
        getRecipeElement("recipes-browser").inert = false;
        getRecipeElement("recipes-panel-overlay").hidden = true;
        getRecipeElement("recipes-editor").hidden = true;

        renderCategories();

        getRecipeElement("recipes-category-title").textContent = selectedCategory;

        const shown = recipes.filter(
            recipe => recipe.category === selectedCategory
        );

        if (!shown.some(recipe => recipe.id === selectedRecipeId)) {
            selectedRecipeId = shown[0] ? shown[0].id : null;
        }

        getRecipeElement("recipes-cards").innerHTML = shown.length
            ? shown.map(recipe => {
                const active = selectedRecipeId === recipe.id;
                const menuPrice = Number(recipe.price);

                const priceLabel =
                    Number.isFinite(menuPrice) && menuPrice > 0
                        ? "Price " + formatMoney(
                            menuPrice,
                            Number.isInteger(menuPrice) ? 0 : 2
                        )
                        : "Price \u2014";

                return (
                    '<button type="button" class="recipes-card' +
                    (active ? ' recipes-card-selected' : '') +
                    '" data-recipe-id="' +
                    escapeHtml(recipe.id) +
                    '" aria-pressed="' +
                    active +
                    '">' +

                    '<span class="recipes-card-image">' +
                    imageMarkup(recipe) +
                    '</span>' +

                    '<span class="recipes-card-name">' +
                    escapeHtml(recipe.name) +
                    '</span>' +

                    '<strong class="recipes-card-price">' +
                    escapeHtml(priceLabel) +
                    '</strong>' +

                    '</button>'
                );
            }).join("")
            : (
                '<div class="recipes-empty-catalog">' +
                'No recipes in this category yet.<br>' +
                'Select <strong>+ New recipe</strong> to add one.' +
                '</div>'
            );

        renderPreview();

        if (wasEditing) {
            const button = addingNew
                ? getRecipeElement("recipes-new-button")
                : (
                    getRecipeElement("recipes-edit-button") ||
                    getRecipeElement("recipes-new-button")
                );

            button.focus();
        }
    }


    /*********************************************************************************
    SELECTED RECIPE
    *********************************************************************************/
    function renderPreview() {
        const recipe = recipes.find(item =>
            item.id === selectedRecipeId
        );

        if (!recipe) {
            getRecipeElement("recipes-preview").innerHTML =
                '<div class="recipes-empty-preview">' +
                'Select a recipe to see its ingredients and pricing.' +
                '</div>';

            return;
        }

        const rows = recipe.ingredients.map(ingredient => {
            const stock = String(ingredient.stock || "")
                .trim()
                .toLowerCase();

            // INVENTORY STATUS
            const stockClass =
                stock === "no stock" ? " recipes-stock-empty" :
                stock === "low" ? " recipes-stock-low" :
                stock === "high" || stock === "in stock"
                    ? " recipes-stock-high" : "";

            const stockLabel =
                stock === "no stock" ? "No stock" :
                stock === "low" ? "Low" :
                stock === "high" ? "High" :
                stock === "in stock" ? "In stock" : "Unknown";

            return '<div class="recipes-preview-table-row">' +
                '<span>' + escapeHtml(ingredient.name) + '</span>' +
                '<span>' + escapeHtml(ingredient.quantity) + '</span>' +
                '<span>' + escapeHtml(ingredient.unit) + '</span>' +
                '<strong>' + formatMoney(lineCost(ingredient)) + '</strong>' +
                '<span class="recipes-stock-badge' + stockClass + '">' +
                escapeHtml(stockLabel) +
                '</span></div>';
        }).join("");

        const ingredientTotal = ingredientCost(recipe);

        const laborTotal =
            (Number(recipe.price) || 0) *
            (Number(recipe.labor) || 0) / 100;

        getRecipeElement("recipes-preview").innerHTML =
            '<div class="recipes-preview-image">' +
                imageMarkup(recipe) +
            '</div>' +

            '<h3 class="recipes-preview-name">' +
                escapeHtml(recipe.name) +
            '</h3>' +

            '<p class="recipes-preview-description">' +
                escapeHtml(recipe.category) +
                (recipe.serving
                    ? ' - Makes ' + escapeHtml(recipe.serving)
                    : '') +
            '</p>' +

            '<div class="recipes-preview-table-heading">' +
                '<span>Item</span>' +
                '<span>Qty</span>' +
                '<span>Unit</span>' +
                '<span>Cost</span>' +
                '<span>Stock</span>' +
            '</div>' +

            '<div class="recipes-preview-table-body">' +
                (rows ||
                    '<div class="recipes-preview-table-empty">' +
                    'No ingredients recorded for this recipe.' +
                    '</div>') +
            '</div>' +

            '<div class="recipes-preview-summary">' +

                '<div><span>Total recipe cost</span><strong>' +
                    (recipe.costEstimate === null &&
                    !recipe.ingredients.length
                        ? '-'
                        : formatMoney(ingredientTotal)) +
                '</strong></div>' +

                '<div><span>Labor cost (' +
                    escapeHtml(recipe.labor) +
                    '%)</span><strong>' +
                    formatMoney(laborTotal) +
                '</strong></div>' +

                '<div class="recipes-preview-menu-price">' +
                    '<strong>Menu price</strong><strong>' +
                    (Number(recipe.price) > 0
                        ? formatMoney(
                            recipe.price,
                            Number.isInteger(Number(recipe.price))
                                ? 0 : 2
                        )
                        : 'Not in checkout') +
                    '</strong>' +
                '</div>' +

            '</div>' +

            '<button class="recipes-button recipes-button-primary ' +
                'recipes-edit-button" id="recipes-edit-button" ' +
                'type="button">Edit recipe</button>';
    }


    /*********************************************************************************
    RECIPE EDITOR
    *********************************************************************************/
    function displayEditor(recipe, newRecipe) {
        addingNew = newRecipe;
        draft = clone(recipe);

        getRecipeElement("recipes-browser").hidden = false;
        getRecipeElement("recipes-browser").inert = true;
        getRecipeElement("recipes-panel-overlay").hidden = false;
        getRecipeElement("recipes-editor").hidden = false;
        getRecipeElement("recipes-editor-body").scrollTop = 0;
        getRecipeElement("recipes-delete-button").hidden = newRecipe;

        getRecipeElement("recipes-editor-title").textContent = newRecipe
            ? "Add new recipe"
            : "Edit recipe";

        getRecipeElement("recipes-editor-description").textContent = newRecipe
            ? "Fill in the details, then add the ingredients."
            : recipe.name + " - " + recipe.category;

        getRecipeElement("recipes-save").textContent = newRecipe
            ? "Save recipe"
            : "Save changes";

        getRecipeElement("recipes-name").value = draft.name;

        getRecipeElement("recipes-category").innerHTML =
            '<option value="">Select category</option>' +
            categories.map(category =>
                '<option value="' +
                escapeHtml(category.name) +
                '">' +
                escapeHtml(category.name) +
                '</option>'
            ).join("");

        getRecipeElement("recipes-category").value = draft.category;
        getRecipeElement("recipes-serving").value = draft.serving;

        getRecipeElement("recipes-price").value = draft.price
            ? Number(draft.price).toFixed(2)
            : "";

        getRecipeElement("recipes-labor").value = newRecipe
            ? ""
            : draft.labor;

        getRecipeElement("recipes-image-button").textContent = newRecipe
            ? "Upload image"
            : "Change image";

        getRecipeElement("recipes-image-file").value = "";

        getRecipeElement("recipes-inventory-item").innerHTML =
            '<option value="">Select item</option>' +
            inventory.map(item =>
                '<option value="' +
                escapeHtml(item.name) +
                '">' +
                escapeHtml(item.name) +
                '</option>'
            ).join("") +
            '<option value="__custom__">Custom item...</option>';

        getRecipeElement("recipes-inventory-quantity").value = "";
        getRecipeElement("recipes-inventory-unit").value = "";
        getRecipeElement("recipes-custom-ingredient").hidden = true;
        getRecipeElement("recipes-custom-item-name").value = "";
        getRecipeElement("recipes-custom-unit-cost").value = "";
        getRecipeElement("recipes-add-message").textContent = "";
        getRecipeElement("recipes-form-message").textContent = "";

        renderImage();
        renderIngredients();
        renderCostSummary();

        getRecipeElement("recipes-back-button").focus();
    }


    /*********************************************************************************
    RECIPE IMAGE PREVIEW
    *********************************************************************************/
    function renderImage() {
        const hasImage = Boolean(
            draft.image || inventoryImageStem(draft.name)
        );

        getRecipeElement("recipes-image-preview").innerHTML =
            hasImage
                ? imageMarkup(draft)
                : '<div class="recipes-upload-placeholder">' +
                    (addingNew
                        ? '<svg viewBox="0 0 24 24" fill="none" ' +
                            'stroke="currentColor" stroke-width="1.7" ' +
                            'aria-hidden="true">' +
                            '<path d="M12 16V4m-5 5 5-5 5 5M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/>' +
                            '</svg><span>No image yet</span>'
                        : imageIcon()) +
                    '</div>';

        getRecipeElement("recipes-image-preview").classList.toggle(
            "recipes-image-upload-empty",
            addingNew && !hasImage
        );
    }


    /*********************************************************************************
    INGREDIENT LIST
    *********************************************************************************/
    function renderIngredients() {
        getRecipeElement("recipes-ingredient-count").textContent =
            draft.ingredients.length +
            (draft.ingredients.length === 1 ? " item" : " items");

        getRecipeElement("recipes-ingredient-rows").innerHTML =
            draft.ingredients.length
                ? draft.ingredients.map(item =>

                    '<div class="recipes-ingredient-row" ' +
                        'data-ingredient-id="' +
                        escapeHtml(item.id) + '">' +

                        '<span class="recipes-ingredient-name">' +
                            escapeHtml(item.name) +
                        '</span>' +

                        '<input class="recipes-row-quantity" ' +
                            'type="number" min="0.01" step="any" ' +
                            'value="' + escapeHtml(item.quantity) +
                            '" aria-label="Quantity of ' +
                            escapeHtml(item.name) + '">' +

                        '<div class="recipes-select-control">' +

                            '<select class="recipes-row-unit" ' +
                                'aria-label="Unit for ' +
                                escapeHtml(item.name) + '">' +

                                ["g", "ml", "pc"].map(unit =>
                                    '<option value="' + unit + '"' +
                                    (item.unit === unit
                                        ? ' selected' : '') +
                                    '>' + unit + '</option>'
                                ).join("") +

                            '</select>' +

                        '</div>' +

                        '<strong class="recipes-row-cost">' +
                            formatMoney(lineCost(item)) +
                        '</strong>' +

                        '<button class="recipes-ingredient-remove" ' +
                            'type="button" data-remove-ingredient="' +
                            escapeHtml(item.id) +
                            '" aria-label="Remove ' +
                            escapeHtml(item.name) + '">' +
                            trashIcon() +
                        '</button>' +

                    '</div>'

                ).join("")
                : '<div class="recipes-no-ingredients">' +
                    '<strong>No ingredients yet</strong>' +
                    '<span>Use "Add ingredient" above to start ' +
                    'building this recipe.</span>' +
                  '</div>';

        getRecipeElement("recipes-ingredient-total").textContent =
            formatMoney(ingredientCost(draft));
    }


    /*********************************************************************************
    COST SUMMARY
    *********************************************************************************/
    function renderCostSummary() {
        if (!draft) return;

        const subtotal = ingredientCost(draft);
        const menuPrice = Number(draft.price || 0);
        const laborRate = Number(draft.labor || 0);

        const labor = menuPrice * laborRate / 100;
        const profit = menuPrice - subtotal - labor;

        const margin = menuPrice > 0
            ? profit / menuPrice * 100
            : null;

        getRecipeElement("recipes-cost-summary").innerHTML =
            '<div>' +
                '<span>Ingredients cost</span>' +
                '<strong>' + formatMoney(subtotal, 2) + '</strong>' +
            '</div>' +

            '<div>' +
                '<span>' +
                    (
                        laborRate
                            ? 'Labor cost (' +
                              escapeHtml(laborRate) +
                              '% of menu price)'
                            : 'Labor cost'
                    ) +
                '</span>' +

                '<strong>' + formatMoney(labor, 2) + '</strong>' +
            '</div>' +

            '<div>' +
                '<span>Menu price</span>' +
                '<strong>' + formatMoney(menuPrice, 2) + '</strong>' +
            '</div>' +

            '<div class="recipes-summary-profit">' +
                '<strong>Estimated profit</strong>' +
                '<strong>' + formatMoney(profit, 2) + '</strong>' +
            '</div>' +

            '<div>' +
                '<span>Margin</span>' +
                '<strong>' +
                    (margin === null ? '-' : margin.toFixed(1) + '%') +
                '</strong>' +
            '</div>';

        getRecipeElement("recipes-ingredient-total").textContent =
            formatMoney(subtotal);
    }


    /*********************************************************************************
    ADD INGREDIENT
    *********************************************************************************/
    function addIngredient() {
        const selected =
            getRecipeElement("recipes-inventory-item").value;

        const quantity = Number(
            getRecipeElement("recipes-inventory-quantity").value
        );

        const unit =
            getRecipeElement("recipes-inventory-unit").value;

        const ingredient = inventory.find(item =>
            item.name === selected
        );

        const custom = selected === "__custom__";

        const name = custom
            ? getRecipeElement("recipes-custom-item-name").value.trim()
            : (ingredient ? ingredient.name : "");

        const unitCost = custom
            ? Number(
                getRecipeElement("recipes-custom-unit-cost").value
            )
            : (ingredient ? ingredient.unitCost : NaN);

        if (
            !name ||
            !Number.isFinite(quantity) ||
            quantity <= 0 ||
            !unit ||
            !Number.isFinite(unitCost) ||
            unitCost < 0 ||
            (custom &&
                getRecipeElement("recipes-custom-unit-cost")
                    .value.trim() === "")
        ) {
            getRecipeElement("recipes-add-message").textContent =
                "Choose an item, valid quantity, unit, and cost.";

            return;
        }

        draft.ingredients.push({
            id: newIdentifier("ingredient"),
            name,
            quantity,
            unit,
            unitCost,
            stock: custom ? "Unknown" : ingredient.stock
        });

        draft.costEstimate = null;

        getRecipeElement("recipes-inventory-item").value = "";
        getRecipeElement("recipes-inventory-quantity").value = "";
        getRecipeElement("recipes-inventory-unit").value = "";
        getRecipeElement("recipes-custom-ingredient").hidden = true;
        getRecipeElement("recipes-custom-item-name").value = "";
        getRecipeElement("recipes-custom-unit-cost").value = "";
        getRecipeElement("recipes-add-message").textContent = "";

        renderIngredients();
        renderCostSummary();
    }


    /*********************************************************************************
    SAVE RECIPE
    *********************************************************************************/
    function saveRecipe() {
        if (!draft) return;

        draft.name = getRecipeElement("recipes-name").value.trim();
        draft.category = getRecipeElement("recipes-category").value;
        draft.serving = getRecipeElement("recipes-serving").value.trim();

        const priceInput = getRecipeElement("recipes-price").value.trim();
        const laborInput = getRecipeElement("recipes-labor").value.trim();

        draft.price = Number(priceInput);
        draft.labor = laborInput === "" ? 0 : Number(laborInput);

        const invalidDetails =
            !draft.name ||
            !draft.category ||
            !draft.serving ||
            priceInput === "" ||
            !Number.isFinite(draft.price) ||
            draft.price <= 0 ||
            !Number.isFinite(draft.labor) ||
            draft.labor < 0 ||
            draft.labor > 100;

        if (invalidDetails) {
            getRecipeElement("recipes-form-message").textContent =
                "Complete the recipe name, category, serving size, " +
                "valid menu price, and labor cost before saving.";

            getRecipeElement("recipes-editor-body").scrollTop = 0;

            return;
        }

        if (!draft.ingredients.length) {
            getRecipeElement("recipes-form-message").textContent =
                "Add at least one ingredient before saving the recipe.";

            getRecipeElement("recipes-editor-body").scrollTop = 0;

            return;
        }

        draft.costEstimate = null;

        if (addingNew) {
            draft.id = newIdentifier("recipe");

            recipes.push(clone(draft));
        } else {
            const index = recipes.findIndex(
                recipe => recipe.id === draft.id
            );

            if (index !== -1) {
                recipes[index] = clone(draft);
            }
        }

        selectedCategory = draft.category;
        selectedRecipeId = draft.id;

        const persisted = persist();

        draft = null;

        renderBrowser();

        notify(
            persisted
                ? "Recipe saved in this browser."
                : "Recipe updated for this session; browser storage was unavailable."
        );
    }

    /*********************************************************************************
    DELETE RECIPE
    *********************************************************************************/
    function deleteRecipe() {
        if (!draft || addingNew) return;

        const confirmed = window.confirm(
            "Delete " + draft.name + "?"
        );

        if (!confirmed) return;

        recipes = recipes.filter(
            recipe => recipe.id !== draft.id
        );

        selectedRecipeId = null;
        draft = null;

        const persisted = persist();

        renderBrowser();

        notify(
            persisted
                ? "Recipe deleted."
                : "Recipe deleted for this session only; browser storage was unavailable."
        );
    }


    /*********************************************************************************
    CATEGORY NAVIGATION
    *********************************************************************************/
    getRecipeElement("recipes-categories").addEventListener(
        "click",
        event => {
            const button = event.target.closest("[data-category]");

            if (!button) {
                return;
            }

            selectedCategory = button.dataset.category;
            selectedRecipeId = null;

            renderBrowser();
        }
    );

    getRecipeElement("recipes-cards").addEventListener(
        "click",
        event => {
            const button = event.target.closest("[data-recipe-id]");

            if (!button) {
                return;
            }

            selectedRecipeId = button.dataset.recipeId;

            renderBrowser();
        }
    );


    /*********************************************************************************
    RECIPE EDITOR CONTROLS
    *********************************************************************************/
    getRecipeElement("recipes-new-button").addEventListener(
        "click",
        () => displayEditor({
            id: "",
            name: "",
            category: "",
            serving: "",
            price: 0,
            labor: 0,
            image: "",
            costEstimate: 0,
            ingredients: []
        }, true)
    );

    getRecipeElement("recipes-preview").addEventListener(
        "click",
        event => {
            if (!event.target.closest("#recipes-edit-button")) {
                return;
            }

            const recipe = recipes.find(item =>
                item.id === selectedRecipeId
            );

            if (recipe) {
                displayEditor(recipe, false);
            }
        }
    );

    const returnToBrowser = () => {
        draft = null;

        renderBrowser();
    };

    getRecipeElement("recipes-back-button").addEventListener(
        "click",
        returnToBrowser
    );

    getRecipeElement("recipes-cancel-edit").addEventListener(
        "click",
        returnToBrowser
    );

    getRecipeElement("recipes-panel-overlay").addEventListener(
        "click",
        returnToBrowser
    );

    getRecipeElement("recipes-save").addEventListener(
        "click",
        saveRecipe
    );

    getRecipeElement("recipes-delete-button").addEventListener(
        "click",
        deleteRecipe
    );

    document.addEventListener("keydown", event => {
        const editor = getRecipeElement("recipes-editor");

        if (editor.hidden) return;

        if (event.key === "Escape") {
            event.preventDefault();

            returnToBrowser();

            return;
        }

        if (event.key !== "Tab") return;

        const controls = Array.from(
            editor.querySelectorAll(
                "button, input, select, textarea, [tabindex]"
            )
        ).filter(control =>
            !control.disabled &&
            control.tabIndex >= 0 &&
            control.getClientRects().length > 0
        );

        const firstControl = controls[0];
        const lastControl = controls[controls.length - 1];

        if (!firstControl) return;

        const focusOutsideEditor = !editor.contains(
            document.activeElement
        );

        if (
            event.shiftKey &&
            (
                document.activeElement === firstControl ||
                focusOutsideEditor
            )
        ) {
            event.preventDefault();

            lastControl.focus();
        } else if (
            !event.shiftKey &&
            (
                document.activeElement === lastControl ||
                focusOutsideEditor
            )
        ) {
            event.preventDefault();

            firstControl.focus();
        }
    });

    getRecipeElement("recipes-back-button").addEventListener(
        "click",
        returnToBrowser
    );

    getRecipeElement("recipes-cancel-edit").addEventListener(
        "click",
        returnToBrowser
    );

    getRecipeElement("recipes-save").addEventListener(
        "click",
        saveRecipe
    );

    getRecipeElement("recipes-add-ingredient").addEventListener(
        "click",
        addIngredient
    );


    /*********************************************************************************
    INGREDIENT SELECTION
    *********************************************************************************/
    getRecipeElement("recipes-inventory-item").addEventListener(
        "change",
        event => {
            const custom = event.target.value === "__custom__";

            getRecipeElement("recipes-custom-ingredient").hidden =
                !custom;

            const item = inventory.find(value =>
                value.name === event.target.value
            );

            getRecipeElement("recipes-inventory-unit").value =
                item ? item.unit : "";

            getRecipeElement("recipes-inventory-quantity").value =
                item ? 1 : "";

            getRecipeElement("recipes-add-message").textContent = "";
        }
    );


    /*********************************************************************************
    IMAGE UPLOAD
    *********************************************************************************/
    getRecipeElement("recipes-image-button").addEventListener(
        "click",
        () => getRecipeElement("recipes-image-file").click()
    );

    getRecipeElement("recipes-image-file").addEventListener(
        "change",
        event => {
            const file = event.target.files[0];

            if (!file) {
                return;
            }

            if (
                !["image/png", "image/jpeg", "image/webp"]
                    .includes(file.type) ||
                file.size > 5 * 1024 * 1024
            ) {
                getRecipeElement("recipes-form-message").textContent =
                    "Choose a JPG, PNG, or WebP image no larger than 5MB.";

                event.target.value = "";

                return;
            }

            const reader = new FileReader();

            reader.onload = () => {
                if (!draft) {
                    return;
                }

                draft.image = String(reader.result);

                getRecipeElement("recipes-form-message").textContent = "";

                renderImage();

                getRecipeElement("recipes-image-button").textContent =
                    "Change image";
            };

            reader.readAsDataURL(file);
        }
    );


    /*********************************************************************************
    AUTOMATIC PRODUCT PRICE SUGGESTION
    *********************************************************************************/
    getRecipeElement("recipes-name").addEventListener(
        "change",
        () => {
            if (!draft) {
                return;
            }

            draft.name =
                getRecipeElement("recipes-name").value;

            renderImage();

            if (
                !addingNew ||
                Number(getRecipeElement("recipes-price").value) > 0
            ) {
                return;
            }

            const menuPrice = checkoutPriceFor(draft.name);

            if (menuPrice > 0) {
                getRecipeElement("recipes-price").value =
                    menuPrice;

                draft.price = menuPrice;

                renderCostSummary();
            }
        }
    );


    /*********************************************************************************
    RECIPE INPUT UPDATES
    *********************************************************************************/
    [
        "recipes-name",
        "recipes-category",
        "recipes-serving",
        "recipes-price",
        "recipes-labor"
    ].forEach(id => {
        getRecipeElement(id).addEventListener("input", () => {
            if (!draft) {
                return;
            }

            draft.name =
                getRecipeElement("recipes-name").value;

            draft.category =
                getRecipeElement("recipes-category").value;

            draft.serving =
                getRecipeElement("recipes-serving").value;

            draft.price =
                Number(getRecipeElement("recipes-price").value) || 0;

            draft.labor =
                Number(getRecipeElement("recipes-labor").value) || 0;

            getRecipeElement("recipes-form-message").textContent = "";

            renderCostSummary();
        });
    });


    /*********************************************************************************
    REMOVE INGREDIENT
    *********************************************************************************/
    getRecipeElement("recipes-ingredient-rows").addEventListener(
        "click",
        event => {
            const button = event.target.closest(
                "[data-remove-ingredient]"
            );

            if (!button || !draft) {
                return;
            }

            draft.ingredients = draft.ingredients.filter(item =>
                item.id !== button.dataset.removeIngredient
            );

            draft.costEstimate = null;

            renderIngredients();
            renderCostSummary();
        }
    );


    /*********************************************************************************
    MODIFY INGREDIENT
    *********************************************************************************/
    getRecipeElement("recipes-ingredient-rows").addEventListener(
        "change",
        event => {
            const row = event.target.closest(
                "[data-ingredient-id]"
            );

            if (!row || !draft) {
                return;
            }

            const ingredient = draft.ingredients.find(item =>
                item.id === row.dataset.ingredientId
            );

            if (!ingredient) {
                return;
            }

            const input = row.querySelector(
                ".recipes-row-quantity"
            );

            const quantity = Number(input.value);

            if (!Number.isFinite(quantity) || quantity <= 0) {
                input.value = ingredient.quantity;

                notify(
                    "Ingredient quantities must be greater than zero."
                );

                return;
            }

            ingredient.quantity = quantity;

            ingredient.unit =
                row.querySelector(".recipes-row-unit").value;

            draft.costEstimate = null;

            row.querySelector(".recipes-row-cost").textContent =
                formatMoney(lineCost(ingredient));

            renderCostSummary();
        }
    );


    /*********************************************************************************
    INITIALIZATION
    *********************************************************************************/
    renderBrowser();
})();


/*********************************************************************************
ADMIN PROFILE DROPDOWN (LOGOUT)
Toggles the dropdown when the profile is clicked, closes it when the user
clicks outside or presses Escape. The Logout link itself lives in the HTML
and points to ../login/login.html.
*********************************************************************************/
(function () {
    const adminProfile = document.querySelector("#admin-profile");
    if (!adminProfile) return;

    function setDropdownOpen(isOpen) {
        adminProfile.classList.toggle("open", isOpen);
        adminProfile.setAttribute("aria-expanded", String(isOpen));
    }

    adminProfile.addEventListener("click", function (event) {
        // Let the Logout link do its own navigation
        if (event.target.closest(".dropdown-item")) return;

        event.preventDefault();
        event.stopPropagation();
        setDropdownOpen(!adminProfile.classList.contains("open"));
    });

    // Keyboard support: Enter or Space toggles the dropdown when focused
    adminProfile.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setDropdownOpen(!adminProfile.classList.contains("open"));
        }
    });

    document.addEventListener("click", function (event) {
        if (!adminProfile.contains(event.target)) {
            setDropdownOpen(false);
        }
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            setDropdownOpen(false);
        }
    });
})();


/*********************************************************************************
MOBILE DRAWER
(Move this block to lib/components.js if you want every admin page to get it.)
*********************************************************************************/
(function () {
    const TABLET_MAX = 1024;

    function setDrawer(open) {
        const nav = document.querySelector(".admin-navigation-bar");
        const overlay = document.querySelector(".nav-overlay");
        const menuBtn = document.querySelector(".menu-btn");
        if (!nav || !overlay) return;

        document.body.classList.toggle("nav-open", open);
        if (menuBtn) {
            menuBtn.setAttribute("aria-expanded", String(open));
            menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
        }
    }

    document.addEventListener("click", function (event) {
        if (event.target.closest(".menu-btn")) {
            const isOpen = document.body.classList.contains("nav-open");
            setDrawer(!isOpen);
        } else if (
            event.target.closest(".nav-overlay") ||
            event.target.closest(".admin-navigation-bar a")
        ) {
            setDrawer(false);
        }
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            setDrawer(false);
        }
    });

    // Swipe left on the drawer (or the dimmed overlay) to close it
    const SWIPE_MIN_DISTANCE = 50;
    let touchStartX = 0;
    let touchStartY = 0;
    let touchTracking = false;

    document.addEventListener("touchstart", function (event) {
        const isDrawerOpen = document.body.classList.contains("nav-open");
        const onDrawerArea = event.target.closest(".admin-navigation-bar, .nav-overlay");

        touchTracking = Boolean(isDrawerOpen && onDrawerArea);
        if (!touchTracking) return;

        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
    }, { passive: true });

    document.addEventListener("touchend", function (event) {
        if (!touchTracking) return;
        touchTracking = false;

        const deltaX = event.changedTouches[0].clientX - touchStartX;
        const deltaY = event.changedTouches[0].clientY - touchStartY;

        // Must be a mostly horizontal swipe to the left, so scrolling the menu up/down doesn't close it
        if (deltaX < -SWIPE_MIN_DISTANCE && Math.abs(deltaX) > Math.abs(deltaY)) {
            setDrawer(false);
        }
    }, { passive: true });

    // Reset when growing back to desktop so the drawer state never gets stuck
    window.addEventListener("resize", function () {
        if (window.innerWidth > TABLET_MAX) setDrawer(false);
    });
})();
