
(() => {
    "use strict";

    const categories = [
        { name: "Coffee Classics", count: 12 },
        { name: "Coffee Specials", count: 7 },
        { name: "Non-coffee", count: 8 },
        { name: "Frappes & Shakes", count: 9 },
        { name: "Soda Pop", count: 3 },
        { name: "Bread & Pastries", count: 4 },
        { name: "Sandwiches", count: 3 },
        { name: "Snacks", count: 7 },
        { name: "Pastas", count: 5 },
        { name: "Rice Meals", count: 8 }
    ];

    const inventory = [
        { name: "Coffee Beans", unit: "g", unitCost: 17 / 18, stock: "Low" },
        { name: "Whole Milk", unit: "ml", unitCost: 17 / 150, stock: "Low" },
        { name: "Salted Caramel Syrup", unit: "ml", unitCost: 18 / 20, stock: "No stock" },
        { name: "16oz Cup", unit: "pc", unitCost: 4, stock: "No stock" },
        { name: "Cup Lid", unit: "pc", unitCost: 2, stock: "No stock" }
    ];

    // Menu prices match the checkout catalog; ingredient costs remain separate.
    const checkoutMenuPrices = new Map([
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
        ["Toffeedamia", 190],
        ["Roasted Almondamia", 190],
        ["Biscoffee", 200],
        ["Oreo Madness", 200],
        ["C.E. Barista Blend", 220],
        ["Signature Choco", 150],
        ["Milky Strawberry", 150],
        ["Dark Chocolate", 150],
        ["Matcha Latte", 170],
        ["Berry Matcha", 190],
        ["Oreo Milk", 150],
        ["Nutella Latte", 150],
        ["Biscoff Latte", 150],
        ["Vanilla Milkshake", 170],
        ["Strawberries & Cream", 170],
        ["Oreos & Cream", 170],
        ["Dark Mocha Frappe", 190],
        ["Java Chip Frappe", 190],
        ["Seasalt Frappe", 190],
        ["Butter Croissant", 70],
        ["Pain Au Chocolat", 80],
        ["Choco Chip Cookies", 90],
        ["White Chocochip Cookies", 90],
        ["Ham & Egg Sandwich", 160],
        ["Spam Sandwich", 170],
        ["Chicken Fillet Sandwich", 180],
        ["French Fries (salted/cheese)", 90],
        ["Twister Fries", 110],
        ["Mojos", 120],
        ["Pica Platter", 199],
        ["4pcs Nuggets & Fries", 140],
        ["3pcs Chicken Tenders w/ dip", 160],
        ["Chicken Popcorn", 110],
        ["Creamy Sausage & Shrimp Cajun", 250],
        ["Spicy Shrimp Aglio Olio", 220],
        ["Cheesy Tuna Pesto", 220],
        ["Allday Spam Rice", 250],
        ["Sausage Delight, 1pc", 220],
        ["Sausage Delight, 2pcs", 220],
        ["Chicken Pastil (spicy / orig)", 250],
        ["Tori Katsu with Cabbage Salad", 220],
        ["2-pc Mushroom Burger Steak", 220],
        ["Chicken Peppered Steak", 250],
        ["4-pc Nuggets with rice", 220]
    ].map(([name, price]) => [name.trim().toLowerCase(), price]));
    // The first Recipes draft displayed these values as estimated costs.
    // Reuse the original amounts as menu-price fallbacks only for recipes
    // that do not have a matching Checkout menu item.
    const originalRecipePrices = new Map([
        ["dirty matcha", 45],
        ["mocha frappe", 59]
    ]);
    const checkoutPriceFor = name => {
        const normalizedName = String(name).trim().toLowerCase();
        return checkoutMenuPrices.get(normalizedName) ?? originalRecipePrices.get(normalizedName) ?? 0;
    };

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

    const initialRecipes = [
        {
            id: "salted-caramel", name: "Salted Caramel", category: "Coffee Specials",
            serving: "1 cup (16oz)", price: 170, labor: 10,
            costEstimate: 58, image: "",
            ingredients: [
                { id: "beans", name: "Coffee Beans", quantity: 18, unit: "g", unitCost: 17 / 18, stock: "Low" },
                { id: "milk", name: "Whole Milk", quantity: 150, unit: "ml", unitCost: 17 / 150, stock: "Low" },
                { id: "syrup", name: "Salted Caramel Syrup", quantity: 20, unit: "ml", unitCost: 18 / 20, stock: "No stock" },
                { id: "cup", name: "16oz Cup", quantity: 1, unit: "pc", unitCost: 4, stock: "No stock" },
                { id: "lid", name: "Cup Lid", quantity: 1, unit: "pc", unitCost: 2, stock: "No stock" }
            ]
        },
        ...[
            ["Dirty Matcha", 45],
            ["Matcha Latte", 39], ["Mocha Frappe", 59],
            ["Americano", 23], ["Spanish Latte", 45]
        ].map(([name, costEstimate], index) => ({
            id: "special-" + index, name, category: "Coffee Specials",
            serving: "", price: checkoutPriceFor(name), labor: 10,
            costEstimate, image: "", ingredients: []
        })),
        ...sample("Coffee Classics", [
            "Americano", "Cafe Latte", "Cappucino", "French Vanilla",
            "Salted Caramel", "Spanish Latte", "Seasalt Latte", "Caramel Macchiato",
            "Cafe Mocha", "Dark Choc Mocha", "White Mocha", "Hazelnut Mocha"
        ]),
        ...sample("Non-coffee", [
            "Signature Choco", "Milky Strawberry", "Dark Chocolate", "Matcha Latte",
            "Berry Matcha", "Oreo Milk", "Nutella Latte", "Biscoff Latte"
        ]),
        ...sample("Frappes & Shakes", [
            "Vanilla Milkshake", "Strawberries & Cream", "Oreos & Cream",
            "Dark Mocha Frappe", "Java Chip Frappe", "Seasalt Frappe"
        ]),
        ...sample("Bread & Pastries", [
            "Butter Croissant", "Pain au Chocolat", "Choco Chip Cookies", "White Chocochip Cookies"
        ]),
        ...sample("Sandwiches", [
            "Ham & Egg Sandwich", "Spam Sandwich", "Chicken Fillet Sandwich"
        ]),
        ...sample("Snacks", [
            "French Fries (salted/cheese)", "Twister Fries", "Mojos", "Pica Platter",
            "4pcs Nuggets & Fries", "3pcs Chicken Tenders w/ dip", "Chicken Popcorn"
        ]),
        ...sample("Pastas", [
            "Creamy Sausage & Shrimp Cajun", "Spicy Shrimp Aglio Olio", "Cheesy Tuna Pesto"
        ]),
        ...sample("Rice Meals", [
            "Allday Spam Rice", "Sausage Delight, 1pc", "Sausage Delight, 2pcs",
            "Chicken Pastil (spicy / orig)", "Tori Katsu with Cabbage Salad",
            "2-pc Mushroom Burger Steak", "Chicken Peppered Steak", "4-pc Nuggets with rice"
        ])
    ];

    const storageKey = "coffee-everyday-recipes-demo-v1";
    let recipes = initialRecipes;
    let selectedCategory = "Coffee Specials";
    let selectedRecipeId = "salted-caramel";
    let draft = null;
    let addingNew = false;
    let toastTimeout = null;
    let nextIngredientId = 0;

    const getRecipeElement = identifier => document.getElementById(identifier);
    const clone = value => JSON.parse(JSON.stringify(value));
    const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[character]));
    const formatMoney = (value, decimals = 0) => "\u20B1" + Number(value || 0).toLocaleString("en-PH", {
        minimumFractionDigits: decimals, maximumFractionDigits: decimals
    });
    const imageIcon = () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.4" cy="8.4" r="1.4"/><path d="m3 17 5-5 4 3 4-5 5 6"/></svg>';
    const trashIcon = () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M10 4h4m-8 3 1 13h10l1-13M10 11v6m4-6v6"/></svg>';
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
        "white mocha": "mocha-white-mocha",
        "salted caramel": "salted-caramel",
        "spanish latte": "spanish-latte",
        "caramel macchiato": "caramel-macchiato",
        "french vanilla": "french-vanilla",
        "cafe latte": "cafe-latte",
        "cappucino": "cappuccino",
        "americano": "americano",
        "pain au chocolat": "pain-au-chocolat",
        "spicy shrimp aglio olio": "spicy-shrimp-aglio-olio",
        "cheesy tuna pesto": "cheesy-tuna-pesto",
        "tori katsu with cabbage salad": "tori-katsu-with-cabbage-salad",
        "2-pc mushroom burger steak": "mushroom-burger-steak",
        "chicken pastil (spicy / orig)": "chicken-pastil",
        "sausage delight, 1pc": "sausage-delight",
        "sausage delight, 2pcs": "sausage-delight",
        "chicken fillet sandwich": "chicken-fillet-sandwich",
        "ham & egg sandwich": "ham-egg-sandwich",
        // Tentative matches: verify the product/photo identity before use.
        "french fries (salted/cheese)": "french-fries-salted-cheese",
        "choco chip cookies": "choco-chip-cookies",
        "allday spam rice": "allday-spam-rice",
    "dirty matcha": "dirty-matcha",
    };
    const inventoryImageStem = (name) =>
        inventoryImageNames[String(name || "").trim().toLowerCase()] || "";

    const imageMarkup = (recipe) => {
        // A manually uploaded recipe photo overrides its catalog photo.
        if (recipe.image) {
            return '<img src="' + escapeHtml(recipe.image) + '" alt="' + escapeHtml(recipe.name) + '" loading="lazy">';
        }
        const filename = inventoryImageStem(recipe.name);
        if (!filename) return imageIcon();
        return '<img src="' + escapeHtml(inventoryImageDirectory + filename + "." + inventoryImageExtensions[0]) +
            '" data-inventory-stem="' + escapeHtml(filename) +
            '" data-inventory-index="0" alt="' + escapeHtml(recipe.name) + '" loading="lazy">';
    };

    // Try WebP first, then JPG, JPEG, and PNG. If none exists, keep the SVG placeholder.
    document.querySelector(".main").addEventListener("error", (event) => {
        const image = event.target;
        if (!image.matches || !image.matches("img[data-inventory-stem]")) return;
        const nextIndex = Number(image.dataset.inventoryIndex) + 1;
        if (nextIndex < inventoryImageExtensions.length) {
            image.dataset.inventoryIndex = String(nextIndex);
            image.src = inventoryImageDirectory + image.dataset.inventoryStem + "." + inventoryImageExtensions[nextIndex];
        } else {
            const container = image.parentElement;
            if (container) container.innerHTML = imageIcon();
        }
    }, true);
    const ingredientCost = recipe => recipe.ingredients.length
        ? recipe.ingredients.reduce((total, item) => total + Number(item.quantity) * Number(item.unitCost), 0)
        : Number(recipe.costEstimate || 0);
    const lineCost = ingredient => Number(ingredient.quantity) * Number(ingredient.unitCost);
    const newIdentifier = prefix => prefix + "-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);

    try {
        const stored = JSON.parse(localStorage.getItem(storageKey) || "null");
        if (Array.isArray(stored) && stored.every(item => item && item.id && item.category && Array.isArray(item.ingredients))) {
            // Exclude the retired sample recipe from previously saved browser data.
            recipes = stored.filter(recipe =>
                String(recipe.name).trim().toLowerCase() !== "spanish latte dwadaw"
            ).map(recipe => {
                const menuPrice = checkoutPriceFor(recipe.name);
                return menuPrice > 0 && !(Number(recipe.price) > 0)
                    ? { ...recipe, price: menuPrice }
                    : recipe;
            });
        }
    } catch (error) {
        recipes = initialRecipes;
    }

    function persist() {
        try {
            localStorage.setItem(storageKey, JSON.stringify(recipes));
            return true;
        } catch (error) {
            return false;
        }
    }

    function notify(message) {
        const toast = getRecipeElement("recipes-toast");
        toast.textContent = message;
        toast.hidden = false;
        if (toastTimeout) clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => { toast.hidden = true; }, 3200);
    }

    function categoryCount(category) {
        const actual = recipes.filter(recipe => recipe.category === category.name).length;
        return Math.max(category.count, actual);
    }

    function renderCategories() {
        getRecipeElement("recipes-categories").innerHTML = categories.map(category => {
            const active = selectedCategory === category.name;
            return '<button class="recipes-category' + (active ? ' recipes-category-active' : '') +
                '" type="button" data-category="' + escapeHtml(category.name) +
                '" aria-pressed="' + active + '"><span>' + escapeHtml(category.name) +
                '</span><strong>' + categoryCount(category) + '</strong></button>';
        }).join("");
    }

    function renderBrowser() {
        getRecipeElement("recipes-browser").hidden = false;
        getRecipeElement("recipes-editor").hidden = true;
        renderCategories();
        getRecipeElement("recipes-category-title").textContent = selectedCategory;
        const shown = recipes.filter(recipe => recipe.category === selectedCategory);
        if (!shown.some(recipe => recipe.id === selectedRecipeId)) {
            selectedRecipeId = shown[0] ? shown[0].id : null;
        }
        getRecipeElement("recipes-cards").innerHTML = shown.length ? shown.map(recipe => {
            const active = selectedRecipeId === recipe.id;
            const menuPrice = Number(recipe.price) > 0
                ? "Price " + formatMoney(recipe.price) : "Price not in checkout";
            return '<button type="button" class="recipes-card' + (active ? ' recipes-card-selected' : '') +
                '" data-recipe-id="' + escapeHtml(recipe.id) + '" aria-pressed="' + active + '">' +
                '<span class="recipes-card-image">' + imageMarkup(recipe) + '</span>' +
                '<span class="recipes-card-name">' + escapeHtml(recipe.name) + '</span>' +
                '<strong class="recipes-card-price">' + escapeHtml(menuPrice) + '</strong></button>';
        }).join("") : '<div class="recipes-empty-catalog">No recipes in this category yet.<br>Select <strong>+ New recipe</strong> to add one.</div>';
        renderPreview();
    }

    function renderPreview() {
        const recipe = recipes.find(item => item.id === selectedRecipeId);
        if (!recipe) {
            getRecipeElement("recipes-preview").innerHTML = '<div class="recipes-empty-preview">Select a recipe to see its ingredients and pricing.</div>';
            return;
        }
        const rows = recipe.ingredients.map(ingredient => {
            const stockClass = ingredient.stock === "No stock" ? " recipes-stock-empty" : " recipes-stock-low";
            return '<div class="recipes-preview-table-row">' +
                '<span>' + escapeHtml(ingredient.name) + '</span>' +
                '<span>' + escapeHtml(ingredient.quantity) + '</span>' +
                '<span>' + escapeHtml(ingredient.unit) + '</span>' +
                '<strong>' + formatMoney(lineCost(ingredient)) + '</strong>' +
                '<span class="recipes-stock-badge' + stockClass + '">' + escapeHtml(ingredient.stock || "Unknown") + '</span></div>';
        }).join("");
        const ingredientTotal = ingredientCost(recipe);
        const laborTotal = (Number(recipe.price) || 0) * (Number(recipe.labor) || 0) / 100;
        getRecipeElement("recipes-preview").innerHTML =
            '<div class="recipes-preview-image">' + imageMarkup(recipe, true) + '</div>' +
            '<h3 class="recipes-preview-name">' + escapeHtml(recipe.name) + '</h3>' +
            '<p class="recipes-preview-description">' + escapeHtml(recipe.category) +
            (recipe.serving ? ' - Makes ' + escapeHtml(recipe.serving) : '') + '</p>' +
            '<div class="recipes-preview-table-heading"><span>Item</span><span>Qty</span><span>Unit</span><span>Cost</span><span>Stock</span></div>' +
            '<div class="recipes-preview-table-body">' + (rows || '<div class="recipes-preview-table-empty">No ingredients recorded for this recipe.</div>') + '</div>' +
            '<div class="recipes-preview-summary">' +
                '<div><span>Total recipe cost</span><strong>' + (recipe.costEstimate === null && !recipe.ingredients.length ? '-' : formatMoney(ingredientTotal)) + '</strong></div>' +
                '<div><span>Labor cost (' + escapeHtml(recipe.labor) + '%)</span><strong>' + formatMoney(laborTotal) + '</strong></div>' +
                '<div class="recipes-preview-menu-price"><strong>Menu price</strong><strong>' + (Number(recipe.price) > 0 ? formatMoney(recipe.price) : 'Not in checkout') + '</strong></div>' +
            '</div>' +
            '<button class="recipes-button recipes-button-primary recipes-edit-button" id="recipes-edit-button" type="button">Edit recipe</button>';
    }

    function displayEditor(recipe, newRecipe) {
        addingNew = newRecipe;
        draft = clone(recipe);
        getRecipeElement("recipes-browser").hidden = true;
        getRecipeElement("recipes-editor").hidden = false;
        getRecipeElement("recipes-editor").scrollTop = 0;
        getRecipeElement("recipes-editor-title").textContent = newRecipe ? "Add new recipe" : "Edit recipe";
        getRecipeElement("recipes-editor-description").textContent = newRecipe
            ? "Fill in the details, then add the ingredients."
            : recipe.name + " - " + recipe.category;
        getRecipeElement("recipes-save").textContent = newRecipe ? "Save recipe" : "Save changes";
        getRecipeElement("recipes-name").value = draft.name;
        getRecipeElement("recipes-category").innerHTML = '<option value="">Select category</option>' + categories.map(category =>
            '<option value="' + escapeHtml(category.name) + '">' + escapeHtml(category.name) + '</option>'
        ).join("");
        getRecipeElement("recipes-category").value = draft.category;
        getRecipeElement("recipes-serving").value = draft.serving;
        getRecipeElement("recipes-price").value = draft.price || "";
        getRecipeElement("recipes-labor").value = newRecipe ? "" : draft.labor;
        getRecipeElement("recipes-image-button").textContent = newRecipe ? "Upload image" : "Change image";
        getRecipeElement("recipes-image-file").value = "";
        getRecipeElement("recipes-inventory-item").innerHTML = '<option value="">Select item</option>' + inventory.map(item =>
            '<option value="' + escapeHtml(item.name) + '">' + escapeHtml(item.name) + '</option>'
        ).join("") + '<option value="__custom__">Custom item...</option>';
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
    }

    function renderImage() {
        const hasImage = Boolean(draft.image || inventoryImageStem(draft.name));
        getRecipeElement("recipes-image-preview").innerHTML = hasImage
            ? imageMarkup(draft)
            : '<div class="recipes-upload-placeholder">' + (addingNew
                ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M12 16V4m-5 5 5-5 5 5M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/></svg><span>No image yet</span>'
                : imageIcon()) + '</div>';
        getRecipeElement("recipes-image-preview").classList.toggle("recipes-image-upload-empty", addingNew && !hasImage);
    }

    function renderIngredients() {
        getRecipeElement("recipes-ingredient-count").textContent = draft.ingredients.length + (draft.ingredients.length === 1 ? " item" : " items");
        getRecipeElement("recipes-ingredient-rows").innerHTML = draft.ingredients.length ? draft.ingredients.map(item =>
            '<div class="recipes-ingredient-row" data-ingredient-id="' + escapeHtml(item.id) + '">' +
                '<span class="recipes-ingredient-name">' + escapeHtml(item.name) + '</span>' +
                '<input class="recipes-row-quantity" type="number" min="0.01" step="any" value="' + escapeHtml(item.quantity) + '" aria-label="Quantity of ' + escapeHtml(item.name) + '">' +
                '<select class="recipes-row-unit" aria-label="Unit for ' + escapeHtml(item.name) + '">' +
                    ["g", "ml", "pc"].map(unit => '<option value="' + unit + '"' + (item.unit === unit ? ' selected' : '') + '>' + unit + '</option>').join("") +
                '</select>' +
                '<strong class="recipes-row-cost">' + formatMoney(lineCost(item)) + '</strong>' +
                '<button class="recipes-ingredient-remove" type="button" data-remove-ingredient="' + escapeHtml(item.id) + '" aria-label="Remove ' + escapeHtml(item.name) + '">' + trashIcon() + '</button>' +
            '</div>'
        ).join("") : '<div class="recipes-no-ingredients"><strong>No ingredients yet</strong><span>Use "Add ingredient" above to start building this recipe.</span></div>';
        getRecipeElement("recipes-ingredient-total").textContent = formatMoney(ingredientCost(draft));
    }

    function renderCostSummary() {
        if (!draft) return;
        const subtotal = ingredientCost(draft);
        const labor = Number(draft.price || 0) * Number(draft.labor || 0) / 100;
        const profit = Number(draft.price || 0) - subtotal - labor;
        const margin = Number(draft.price) > 0 ? (profit / Number(draft.price)) * 100 : null;
        getRecipeElement("recipes-cost-summary").innerHTML =
            '<div><span>Ingredients cost</span><strong>' + formatMoney(subtotal, 2) + '</strong></div>' +
            '<div><span>Labor cost (' + escapeHtml(draft.labor || 0) + '% of menu price)</span><strong>' + formatMoney(labor, 2) + '</strong></div>' +
            '<div><span>Menu price</span><strong>' + formatMoney(draft.price, 2) + '</strong></div>' +
            '<div class="recipes-summary-profit"><strong>Estimated profit</strong><strong>' + formatMoney(profit, 2) + '</strong></div>' +
            '<div><span>Margin</span><strong>' + (margin === null ? '-' : margin.toFixed(1) + '%') + '</strong></div>';
        getRecipeElement("recipes-ingredient-total").textContent = formatMoney(subtotal);
    }

    function addIngredient() {
        const selected = getRecipeElement("recipes-inventory-item").value;
        const quantity = Number(getRecipeElement("recipes-inventory-quantity").value);
        const unit = getRecipeElement("recipes-inventory-unit").value;
        let ingredient = inventory.find(item => item.name === selected);
        const custom = selected === "__custom__";
        const name = custom ? getRecipeElement("recipes-custom-item-name").value.trim() : (ingredient ? ingredient.name : "");
        const unitCost = custom ? Number(getRecipeElement("recipes-custom-unit-cost").value) : (ingredient ? ingredient.unitCost : NaN);
        if (!name || !Number.isFinite(quantity) || quantity <= 0 || !unit || !Number.isFinite(unitCost) || unitCost < 0 ||
            (custom && getRecipeElement("recipes-custom-unit-cost").value.trim() === "")) {
            getRecipeElement("recipes-add-message").textContent = "Choose an item, valid quantity, unit, and cost.";
            return;
        }
        draft.ingredients.push({
            id: newIdentifier("ingredient"), name, quantity, unit, unitCost,
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

    function saveRecipe() {
        draft.name = getRecipeElement("recipes-name").value.trim();
        draft.category = getRecipeElement("recipes-category").value;
        draft.serving = getRecipeElement("recipes-serving").value.trim();
        draft.price = Number(getRecipeElement("recipes-price").value);
        draft.labor = getRecipeElement("recipes-labor").value.trim() === "" ? 0 : Number(getRecipeElement("recipes-labor").value);
        if (!draft.name || !draft.category || !draft.serving || getRecipeElement("recipes-price").value.trim() === "" ||
            !Number.isFinite(draft.price) || draft.price <= 0 ||
            !Number.isFinite(draft.labor) || draft.labor < 0 || draft.labor > 100) {
            getRecipeElement("recipes-form-message").textContent = "Complete the recipe name, category, serving size, valid menu price, and labor cost before saving.";
            return;
        }
        if (!draft.ingredients.length) {
            getRecipeElement("recipes-form-message").textContent = "Add at least one ingredient before saving the recipe.";
            return;
        }
        draft.costEstimate = null;
        if (addingNew) {
            draft.id = newIdentifier("recipe");
            recipes.push(clone(draft));
        } else {
            const index = recipes.findIndex(item => item.id === draft.id);
            if (index !== -1) recipes[index] = clone(draft);
        }
        selectedCategory = draft.category;
        selectedRecipeId = draft.id;
        const persisted = persist();
        draft = null;
        renderBrowser();
        notify(persisted ? "Recipe saved in this browser." : "Recipe updated for this session; browser storage was unavailable.");
    }

    getRecipeElement("recipes-categories").addEventListener("click", event => {
        const button = event.target.closest("[data-category]");
        if (!button) return;
        selectedCategory = button.dataset.category;
        selectedRecipeId = null;
        renderBrowser();
    });
    getRecipeElement("recipes-cards").addEventListener("click", event => {
        const button = event.target.closest("[data-recipe-id]");
        if (!button) return;
        selectedRecipeId = button.dataset.recipeId;
        renderBrowser();
    });
    getRecipeElement("recipes-new-button").addEventListener("click", () => displayEditor({
        id: "", name: "", category: "", serving: "", price: 0,
        labor: 0, image: "", costEstimate: 0, ingredients: []
    }, true));
    getRecipeElement("recipes-preview").addEventListener("click", event => {
        if (!event.target.closest("#recipes-edit-button")) return;
        const recipe = recipes.find(item => item.id === selectedRecipeId);
        if (recipe) displayEditor(recipe, false);
    });
    const returnToBrowser = () => { draft = null; renderBrowser(); };
    getRecipeElement("recipes-back-button").addEventListener("click", returnToBrowser);
    getRecipeElement("recipes-cancel-edit").addEventListener("click", returnToBrowser);
    getRecipeElement("recipes-save").addEventListener("click", saveRecipe);
    getRecipeElement("recipes-add-ingredient").addEventListener("click", addIngredient);
    getRecipeElement("recipes-inventory-item").addEventListener("change", event => {
        const custom = event.target.value === "__custom__";
        getRecipeElement("recipes-custom-ingredient").hidden = !custom;
        const item = inventory.find(value => value.name === event.target.value);
        getRecipeElement("recipes-inventory-unit").value = item ? item.unit : "";
        getRecipeElement("recipes-inventory-quantity").value = item ? 1 : "";
        getRecipeElement("recipes-add-message").textContent = "";
    });
    getRecipeElement("recipes-image-button").addEventListener("click", () => getRecipeElement("recipes-image-file").click());
    getRecipeElement("recipes-image-file").addEventListener("change", event => {
        const file = event.target.files[0];
        if (!file) return;
        if (!(["image/png", "image/jpeg", "image/webp"].includes(file.type)) || file.size > 5 * 1024 * 1024) {
            getRecipeElement("recipes-form-message").textContent = "Choose a JPG, PNG, or WebP image no larger than 5MB.";
            event.target.value = "";
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            if (!draft) return;
            draft.image = String(reader.result);
            getRecipeElement("recipes-form-message").textContent = "";
            renderImage();
            getRecipeElement("recipes-image-button").textContent = "Change image";
        };
        reader.readAsDataURL(file);
    });
    getRecipeElement("recipes-name").addEventListener("change", () => {
        if (!draft) return;
        draft.name = getRecipeElement("recipes-name").value;
        renderImage();
        if (!addingNew || Number(getRecipeElement("recipes-price").value) > 0) return;
        const menuPrice = checkoutPriceFor(draft.name);
        if (menuPrice > 0) {
            getRecipeElement("recipes-price").value = menuPrice;
            draft.price = menuPrice;
            renderCostSummary();
        }
    });
    ["recipes-name", "recipes-category", "recipes-serving", "recipes-price", "recipes-labor"].forEach(id => {
        getRecipeElement(id).addEventListener("input", () => {
            if (!draft) return;
            draft.name = getRecipeElement("recipes-name").value;
            draft.category = getRecipeElement("recipes-category").value;
            draft.serving = getRecipeElement("recipes-serving").value;
            draft.price = Number(getRecipeElement("recipes-price").value) || 0;
            draft.labor = Number(getRecipeElement("recipes-labor").value) || 0;
            getRecipeElement("recipes-form-message").textContent = "";
            renderCostSummary();
        });
    });
    getRecipeElement("recipes-ingredient-rows").addEventListener("click", event => {
        const button = event.target.closest("[data-remove-ingredient]");
        if (!button || !draft) return;
        draft.ingredients = draft.ingredients.filter(item => item.id !== button.dataset.removeIngredient);
        draft.costEstimate = null;
        renderIngredients();
        renderCostSummary();
    });
    getRecipeElement("recipes-ingredient-rows").addEventListener("change", event => {
        const row = event.target.closest("[data-ingredient-id]");
        if (!row || !draft) return;
        const ingredient = draft.ingredients.find(item => item.id === row.dataset.ingredientId);
        if (!ingredient) return;
        const input = row.querySelector(".recipes-row-quantity");
        const quantity = Number(input.value);
        if (!Number.isFinite(quantity) || quantity <= 0) {
            input.value = ingredient.quantity;
            notify("Ingredient quantities must be greater than zero.");
            return;
        }
        ingredient.quantity = quantity;
        ingredient.unit = row.querySelector(".recipes-row-unit").value;
        draft.costEstimate = null;
        row.querySelector(".recipes-row-cost").textContent = formatMoney(lineCost(ingredient));
        renderCostSummary();
    });
    renderBrowser();
})();
