const mainContainer = document.querySelector(".main");

const itemsCard = mainContainer.querySelector(".items-card");

const itemForm = mainContainer.querySelector("#item-form");
const itemFormTitle = mainContainer.querySelector("#item-form-title");
const deleteItemButton = mainContainer.querySelector("#delete-item-button");
const itemNameInput = mainContainer.querySelector("#item-name-input");
const itemCategorySelect = mainContainer.querySelector("#item-category-select");
const itemUnitSelect = mainContainer.querySelector("#item-unit-select");
const cancelItemButton = mainContainer.querySelector("#cancel-item-button");
const saveItemButton = mainContainer.querySelector("#save-item-button");

const categoryFilterSelect = mainContainer.querySelector("#category-filter-select");
const openAddItemButton = mainContainer.querySelector("#open-add-item-button");
const itemsBody = mainContainer.querySelector("#items-body");

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

// Which category is shown, and which form mode is open ("closed", "add" or "edit")
let activeCategory = categories[0];
let formMode = "closed";
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

function createOption(value, label) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    return option;
}


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

// Show the items of the chosen category, and close the form since the list changed
categoryFilterSelect.addEventListener("change", function () {
    activeCategory = categoryFilterSelect.value;
    closeForm();
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
    editButton.classList.toggle("active", formMode === "edit" && editingItemId === item.id);

    // Clicking the edit button of the item being edited closes the form
    editButton.addEventListener("click", function () {
        if (formMode === "edit" && editingItemId === item.id) {
            closeForm();
        } else {
            openEditForm(item);
        }
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
ITEM FORM (ADD / EDIT)
*********************************************************************************/
function clearFormValidation() {
    [itemNameInput, itemCategorySelect].forEach(clearInvalid);
}

function showForm() {
    itemForm.classList.add("open");
    itemForm.classList.toggle("editing", formMode === "edit");
    itemsCard.classList.add("form-open");
    itemFormTitle.textContent = formMode === "edit" ? "Edit item" : "Add item";

    clearFormValidation();
    renderItems();
    itemNameInput.focus();
}

function openAddForm() {
    formMode = "add";
    editingItemId = null;

    itemNameInput.value = "";
    itemCategorySelect.value = activeCategory;
    itemUnitSelect.selectedIndex = 0;

    showForm();
}

function openEditForm(item) {
    formMode = "edit";
    editingItemId = item.id;

    itemNameInput.value = item.name;
    itemCategorySelect.value = item.category;
    itemUnitSelect.value = item.unit;

    showForm();
}

function closeForm() {
    formMode = "closed";
    editingItemId = null;

    itemForm.classList.remove("open", "editing");
    itemsCard.classList.remove("form-open");

    clearFormValidation();
    renderItems();
}

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

    closeForm();
}

function deleteItem() {
    const item = items.find(function (current) {
        return current.id === editingItemId;
    });

    if (!item || !window.confirm("Delete \"" + item.name + "\"?")) {
        return;
    }

    items = items.filter(function (current) {
        return current.id !== editingItemId;
    });

    closeForm();
}

openAddItemButton.addEventListener("click", openAddForm);
cancelItemButton.addEventListener("click", closeForm);
saveItemButton.addEventListener("click", saveItem);
deleteItemButton.addEventListener("click", deleteItem);

// Save with Enter while typing the name
itemNameInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        saveItem();
    }
});

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && formMode !== "closed") {
        closeForm();
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
