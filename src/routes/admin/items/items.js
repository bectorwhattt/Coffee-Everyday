const mainContainer = document.querySelector(".main");

const openPanelButton = mainContainer.querySelector("#open-panel-button");
const closePanelButton = mainContainer.querySelector("#close-panel-button");
const panelOverlay = mainContainer.querySelector("#panel-overlay");
const panel = mainContainer.querySelector("#item-panel");
const panelTitle = mainContainer.querySelector("#panel-title");
const panelSubtitle = mainContainer.querySelector("#panel-subtitle");

const categoryFilterSelect = mainContainer.querySelector("#category-filter-select");
const itemsBody = mainContainer.querySelector("#items-body");

const itemNameInput = mainContainer.querySelector("#item-name-input");
const itemCategorySelect = mainContainer.querySelector("#item-category-select");
const itemUnitSelect = mainContainer.querySelector("#item-unit-select");

const deleteItemButton = mainContainer.querySelector("#delete-item-button");
const cancelItemButton = mainContainer.querySelector("#cancel-item-button");
const saveItemButton = mainContainer.querySelector("#save-item-button");

const editIcon =
    '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M12 20h9"></path>' +
    '<path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>' +
    "</svg>";

// Sample data only, replace with real data later.
const categories = [
    "Cooking Oils, Culinary Sauces & Seasonings",
    "Dairy & Eggs",
    "Coffee & Tea",
    "Packaging & Disposables"
];

// Demo data shown in the Figma design. Set to [] to start with an empty list.
// Stocks and usedIn are display values for now, they will come from the stock and recipe records later.
let items = [
    { id: 1, name: "Brown Sugar", category: "Cooking Oils, Culinary Sauces & Seasonings", usedIn: 4, stocks: 1, unit: "Packet" },
    { id: 2, name: "Vanilla Syrup", category: "Cooking Oils, Culinary Sauces & Seasonings", usedIn: 4, stocks: 0, unit: "mL" },
    { id: 3, name: "Butter", category: "Cooking Oils, Culinary Sauces & Seasonings", usedIn: 4, stocks: 2143, unit: "pcs" },
    { id: 4, name: "Whole Milk", category: "Dairy & Eggs", usedIn: 9, stocks: 12, unit: "L" },
    { id: 5, name: "Heavy Cream", category: "Dairy & Eggs", usedIn: 3, stocks: 2, unit: "L" },
    { id: 6, name: "Coffee Beans", category: "Coffee & Tea", usedIn: 12, stocks: 3, unit: "kg" },
    { id: 7, name: "Matcha Powder", category: "Coffee & Tea", usedIn: 4, stocks: 0, unit: "g" },
    { id: 8, name: "Paper Cup", category: "Packaging & Disposables", usedIn: 0, stocks: 240, unit: "pcs" },
    { id: 9, name: "Cup Lid", category: "Packaging & Disposables", usedIn: 0, stocks: 4, unit: "pcs" }
];

// An item is "Low" when its stock is above zero but at or below this number
const LOW_STOCK_LIMIT = 5;

const STATUS_LOW = { label: "Low", className: "status-low" };
const STATUS_NO_STOCK = { label: "No stock", className: "status-no-stock" };
const STATUS_IN_STOCK = { label: "In stock", className: "status-in-stock" };

// Which category is shown, and which panel mode is used ("add" or "edit")
let activeCategory = categories[0];
let formMode = "add";
let editingItemId = null;


/*********************************************************************************
HELPERS
*********************************************************************************/
function createDiv(className, text) {
    const element = document.createElement("div");
    element.className = className;
    if (text !== undefined) {
        element.textContent = text;
    }
    return element;
}

function createOption(value, label) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    return option;
}

function flagInvalid(field) {
    field.classList.add("invalid");
}

function clearInvalid(field) {
    field.classList.remove("invalid");
}

function getItemStatus(stocks) {
    if (stocks <= 0) {
        return STATUS_NO_STOCK;
    }

    if (stocks <= LOW_STOCK_LIMIT) {
        return STATUS_LOW;
    }

    return STATUS_IN_STOCK;
}

function formatRecipeCount(count) {
    return count + (count === 1 ? " Recipe" : " Recipes");
}

function getNextItemId() {
    return items.reduce(function (highest, item) {
        return Math.max(highest, item.id);
    }, 0) + 1;
}


/*********************************************************************************
PANEL
*********************************************************************************/
function clearFormValidation() {
    [itemNameInput, itemCategorySelect].forEach(clearInvalid);
}

function openPanel() {
    panel.classList.add("open");
    panel.classList.toggle("editing", formMode === "edit");
    panelOverlay.classList.add("open");
    panel.setAttribute("aria-hidden", "false");

    panelTitle.textContent = formMode === "edit" ? "Edit item" : "Add item";
    panelSubtitle.textContent = formMode === "edit"
        ? "Update the details of this item."
        : "Add a new item to your inventory.";

    clearFormValidation();

    // A hidden panel can't take focus yet, so wait for the slide-in to start
    window.setTimeout(function () {
        itemNameInput.focus({ preventScroll: true });
    }, 50);
}

function closePanel() {
    panel.classList.remove("open", "editing");
    panelOverlay.classList.remove("open");
    panel.setAttribute("aria-hidden", "true");

    formMode = "add";
    editingItemId = null;
    clearFormValidation();
}

function openAddPanel() {
    formMode = "add";
    editingItemId = null;

    itemNameInput.value = "";
    itemCategorySelect.value = activeCategory;
    itemUnitSelect.selectedIndex = 0;

    openPanel();
}

function openEditPanel(item) {
    formMode = "edit";
    editingItemId = item.id;

    itemNameInput.value = item.name;
    itemCategorySelect.value = item.category;
    itemUnitSelect.value = item.unit;

    openPanel();
}

openPanelButton.addEventListener("click", openAddPanel);
closePanelButton.addEventListener("click", closePanel);
cancelItemButton.addEventListener("click", closePanel);
panelOverlay.addEventListener("click", closePanel);

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closePanel();
    }
});


/*********************************************************************************
CATEGORY FILTER
*********************************************************************************/
function renderCategoryOptions() {
    categories.forEach(function (category) {
        categoryFilterSelect.appendChild(createOption(category, category));
        itemCategorySelect.appendChild(createOption(category, category));
    });

    categoryFilterSelect.value = activeCategory;
}

// Show the items of the chosen category
categoryFilterSelect.addEventListener("change", function () {
    activeCategory = categoryFilterSelect.value;
    renderItems();
});


/*********************************************************************************
ITEMS TABLE
*********************************************************************************/
function createItemRow(item) {
    const row = createDiv("item-row");
    const status = getItemStatus(item.stocks);
    const statusCell = createDiv("cell-status");
    const actionCell = createDiv("cell-action");
    const editButton = document.createElement("button");

    statusCell.appendChild(createDiv("status-pill " + status.className, status.label));

    editButton.className = "edit-button";
    editButton.type = "button";
    editButton.setAttribute("aria-label", "Edit " + item.name);
    editButton.innerHTML = editIcon;
    editButton.addEventListener("click", function () {
        openEditPanel(item);
    });

    actionCell.appendChild(editButton);

    row.appendChild(createDiv("cell-item-name", item.name));
    row.appendChild(createDiv("cell-used-in", formatRecipeCount(item.usedIn)));
    row.appendChild(createDiv("cell-stocks", item.stocks));
    row.appendChild(createDiv("cell-units", item.unit));
    row.appendChild(statusCell);
    row.appendChild(actionCell);

    return row;
}

function renderItems() {
    itemsBody.innerHTML = "";

    const visibleItems = items.filter(function (item) {
        return item.category === activeCategory;
    });

    if (visibleItems.length === 0) {
        itemsBody.appendChild(createDiv("items-empty", "No items in this category yet"));
    }

    visibleItems.forEach(function (item) {
        itemsBody.appendChild(createItemRow(item));
    });
}


/*********************************************************************************
SAVE / DELETE ITEM
*********************************************************************************/
function isDuplicateName(name, category) {
    return items.some(function (item) {
        return item.id !== editingItemId
            && item.category === category
            && item.name.toLowerCase() === name.toLowerCase();
    });
}

function saveItem() {
    const name = itemNameInput.value.trim();
    const category = itemCategorySelect.value;
    let isValid = true;

    if (name === "" || isDuplicateName(name, category)) {
        flagInvalid(itemNameInput);
        isValid = false;
    }

    if (!category) {
        flagInvalid(itemCategorySelect);
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    if (formMode === "edit") {
        const item = items.find(function (current) {
            return current.id === editingItemId;
        });

        item.name = name;
        item.category = category;
        item.unit = itemUnitSelect.value;
    } else {
        items.push({
            id: getNextItemId(),
            name: name,
            category: category,
            usedIn: 0,
            stocks: 0,
            unit: itemUnitSelect.value
        });
    }

    // Jump to the category of the saved item so it is visible right away
    activeCategory = category;
    categoryFilterSelect.value = category;

    closePanel();
    renderItems();
}

function deleteItem() {
    const item = items.find(function (current) {
        return current.id === editingItemId;
    });

    if (!item || !window.confirm("Delete \"" + item.name + "\"?")) {
        return;
    }

    items = items.filter(function (current) {
        return current.id !== item.id;
    });

    closePanel();
    renderItems();
}

saveItemButton.addEventListener("click", saveItem);
deleteItemButton.addEventListener("click", deleteItem);

// Save with Enter while typing the name
itemNameInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        saveItem();
    }
});

// Remove the warning outline as soon as the person fixes a field
[itemNameInput, itemCategorySelect].forEach(function (field) {
    field.addEventListener("input", function () {
        clearInvalid(field);
    });
});

renderCategoryOptions();
renderItems();


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