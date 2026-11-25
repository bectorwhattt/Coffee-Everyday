const mainContainer = document.querySelector(".main");

const openNewPanelButton = mainContainer.querySelector("#open-new-panel-button");
const closePanelButton = mainContainer.querySelector("#close-panel-button");
const panelOverlay = mainContainer.querySelector("#panel-overlay");
const panel = mainContainer.querySelector("#supplier-panel");
const panelTitle = mainContainer.querySelector("#panel-title");
const panelSubtitle = mainContainer.querySelector("#panel-subtitle");

const suppliersBody = mainContainer.querySelector("#suppliers-body");

const supplierNameInput = mainContainer.querySelector("#supplier-name-input");
const contactSelect = mainContainer.querySelector("#contact-select");
const statusSelect = mainContainer.querySelector("#status-select");

const itemSelect = mainContainer.querySelector("#item-select");
const unitSelect = mainContainer.querySelector("#unit-select");
const costInput = mainContainer.querySelector("#cost-input");
const amountInput = mainContainer.querySelector("#amount-input");
const measureSelect = mainContainer.querySelector("#measure-select");
const resetButton = mainContainer.querySelector("#reset-button");
const addItemButton = mainContainer.querySelector("#add-item-button");

const offeredItemsList = mainContainer.querySelector("#offered-items-list");
const offeredItemsCount = mainContainer.querySelector("#offered-items-count");

const deleteSupplierButton = mainContainer.querySelector("#delete-supplier-button");
const cancelButton = mainContainer.querySelector("#cancel-button");
const saveSupplierButton = mainContainer.querySelector("#save-supplier-button");

const trashIcon =
    '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<polyline points="3 6 5 6 21 6"></polyline>' +
    '<path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>' +
    '<path d="M10 11v6M14 11v6"></path>' +
    '<path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>' +
    "</svg>";

const chevronIcon =
    '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' +
    '<polyline points="2.5,4.5 6,8 9.5,4.5"></polyline>' +
    "</svg>";

const pencilIcon =
    '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M12 20h9"></path>' +
    '<path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>' +
    "</svg>";

// The items a supplier can offer, with the category shown in the Item Categories column.
// Sample data only, replace with the real items list later.
const ITEM_CATEGORIES = {
    "Whole Milk": "Milk",
    "Milk": "Milk",
    "Coffee Beans": "Coffee Beans",
    "Matcha Powder": "Matcha",
    "Vanilla Syrup": "Syrup",
    "Chocolate Sauce": "Syrup",
    "Brown Sugar": "Sugar",
    "Cup Lid": "Lid",
    "Paper Cup": "Cups",
    "Big Cups": "Cups"
};

const STATUS_CLASSES = { Active: "status-active", Inactive: "status-inactive" };

const PANEL_TEXT = {
    edit: {
        title: "Modify suppliers information",
        subtitle: "Change the supplier's details, or add or delete an item.",
        saveLabel: "Save changes"
    },
    add: {
        title: "Add new supplier",
        subtitle: "Add supplier details then you may add items they offer as a default value for placing purchase orders.",
        saveLabel: "Add supplier"
    }
};

// Sample data only, replace with real data later.
// The quantity of an offered item is always 1, so it is not stored.
let suppliers = [
    {
        id: 1, name: "Coffee Beans", contact: "Facebook Messenger", status: "Active",
        items: [
            { name: "Coffee Beans", unit: "Pack", amount: 1, measure: "kg", cost: 950 }
        ]
    },
    {
        id: 2, name: "Supplier Inc.", contact: "Shopee", status: "Inactive",
        items: [
            { name: "Big Cups", unit: "Pack", amount: 300, measure: "pcs", cost: 170 },
            { name: "Milk", unit: "Carton", amount: 1000, measure: "mL", cost: 155 },
            { name: "Cup Lid", unit: "Sleeve", amount: 50, measure: "pcs", cost: 450 }
        ]
    },
    {
        id: 3, name: "Dairy supplier", contact: "Viber", status: "Active",
        items: [
            { name: "Whole Milk", unit: "Carton", amount: 1, measure: "L", cost: 95 }
        ]
    },
    {
        id: 4, name: "SM Aura (market run)", contact: "In person", status: "Active",
        items: [
            { name: "Matcha Powder", unit: "Pack", amount: 500, measure: "g", cost: 1400 },
            { name: "Vanilla Syrup", unit: "Bottle", amount: 750, measure: "mL", cost: 420 },
            { name: "Brown Sugar", unit: "Pack", amount: 1, measure: "kg", cost: 420 }
        ]
    }
];

// Which suppliers are opened (Supplier Inc. is opened in the Figma),
// which supplier the panel is editing (null means a new supplier),
// and the items shown in the panel before they are saved
const expandedSupplierIds = new Set([2]);
let editingSupplierId = null;
let draftItems = [];


/*********************************************************************************
HELPERS
*********************************************************************************/
function formatCurrency(value) {
    return "\u20B1" + value.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

function createDiv(className, text) {
    const element = document.createElement("div");
    element.className = className;
    if (text !== undefined) {
        element.textContent = text;
    }
    return element;
}

function createIconButton(className, label, iconMarkup) {
    const button = document.createElement("button");
    button.className = className;
    button.type = "button";
    button.setAttribute("aria-label", label);
    button.innerHTML = iconMarkup;
    return button;
}

function flagInvalid(field) {
    field.classList.add("invalid");
}

function clearInvalid(field) {
    field.classList.remove("invalid");
}

function getCategories(supplier) {
    const categories = [];

    supplier.items.forEach(function (item) {
        const category = ITEM_CATEGORIES[item.name] || "Other";

        if (categories.indexOf(category) === -1) {
            categories.push(category);
        }
    });

    return categories.length ? categories.join(", ") : "-";
}

function findSupplier(supplierId) {
    return suppliers.find(function (supplier) {
        return supplier.id === supplierId;
    });
}

function fillItemSelect() {
    Object.keys(ITEM_CATEGORIES).forEach(function (itemName) {
        const option = document.createElement("option");
        option.value = itemName;
        option.textContent = itemName;
        itemSelect.appendChild(option);
    });
}


/*********************************************************************************
SUPPLIERS TABLE
*********************************************************************************/
function createDetailsLine(className, cells) {
    const line = createDiv(className);

    cells.forEach(function (cell) {
        line.appendChild(createDiv(cell.className, cell.text));
    });

    return line;
}

function createSupplierDetails(supplier) {
    const details = createDiv("supplier-details");

    details.appendChild(createDetailsLine("details-header", [
        { className: "detail-item", text: "Items" },
        { className: "detail-unit", text: "Unit" },
        { className: "detail-amount", text: "Amount per Unit" },
        { className: "detail-measure", text: "Measure" },
        { className: "detail-price", text: "Price each" }
    ]));

    if (supplier.items.length === 0) {
        details.appendChild(createDiv("details-empty", "No items offered yet"));
    }

    supplier.items.forEach(function (item) {
        details.appendChild(createDetailsLine("details-line", [
            { className: "detail-item", text: item.name },
            { className: "detail-unit", text: "1 " + item.unit },
            { className: "detail-amount", text: item.amount ? item.amount : "-" },
            { className: "detail-measure", text: item.amount ? item.measure : "-" },
            { className: "detail-price", text: formatCurrency(item.cost) }
        ]));
    });

    return details;
}

function createSupplierRow(supplier) {
    const row = createDiv("supplier-row");
    const summary = createDiv("supplier-summary");
    const statusCell = createDiv("cell-status");
    const actionsCell = createDiv("cell-actions");
    const isExpanded = expandedSupplierIds.has(supplier.id);

    const editButton = createIconButton("row-action-button row-edit", "Edit " + supplier.name, pencilIcon);
    const toggleButton = createIconButton("row-action-button row-toggle", "Show items of " + supplier.name, chevronIcon);

    statusCell.appendChild(createDiv("status-pill " + (STATUS_CLASSES[supplier.status] || ""), supplier.status));
    toggleButton.setAttribute("aria-expanded", String(isExpanded));

    actionsCell.appendChild(editButton);
    actionsCell.appendChild(toggleButton);

    summary.appendChild(createDiv("cell-supplier-name", supplier.name));
    summary.appendChild(createDiv("cell-categories", getCategories(supplier)));
    summary.appendChild(createDiv("cell-contact", supplier.contact));
    summary.appendChild(statusCell);
    summary.appendChild(actionsCell);

    row.classList.toggle("expanded", isExpanded);
    row.appendChild(summary);
    row.appendChild(createSupplierDetails(supplier));

    editButton.addEventListener("click", function () {
        openPanel(supplier.id);
    });

    // Expand or collapse the items this supplier offers
    toggleButton.addEventListener("click", function () {
        const nowExpanded = row.classList.toggle("expanded");

        toggleButton.setAttribute("aria-expanded", String(nowExpanded));

        if (nowExpanded) {
            expandedSupplierIds.add(supplier.id);
        } else {
            expandedSupplierIds.delete(supplier.id);
        }
    });

    return row;
}

function renderSuppliers() {
    suppliersBody.innerHTML = "";

    if (suppliers.length === 0) {
        suppliersBody.appendChild(createDiv("suppliers-empty", "No suppliers yet"));
    }

    suppliers.forEach(function (supplier) {
        suppliersBody.appendChild(createSupplierRow(supplier));
    });
}


/*********************************************************************************
PANEL
*********************************************************************************/
// Pass a supplier id to edit that supplier, or nothing to add a new one
function openPanel(supplierId) {
    const supplier = supplierId === undefined ? null : findSupplier(supplierId);
    const text = supplier ? PANEL_TEXT.edit : PANEL_TEXT.add;

    editingSupplierId = supplier ? supplier.id : null;

    panelTitle.textContent = text.title;
    panelSubtitle.textContent = text.subtitle;
    saveSupplierButton.textContent = text.saveLabel;
    deleteSupplierButton.hidden = !supplier;

    supplierNameInput.value = supplier ? supplier.name : "";
    contactSelect.value = supplier ? supplier.contact : "";
    statusSelect.value = supplier ? supplier.status : "Active";

    draftItems = supplier ? supplier.items.map(function (item) {
        return Object.assign({}, item);
    }) : [];

    [supplierNameInput, contactSelect].forEach(clearInvalid);
    resetAddItemForm();
    renderOfferedItems();

    panel.classList.add("open");
    panelOverlay.classList.add("open");
    panel.setAttribute("aria-hidden", "false");
}

function closePanel() {
    panel.classList.remove("open");
    panelOverlay.classList.remove("open");
    panel.setAttribute("aria-hidden", "true");
}

openNewPanelButton.addEventListener("click", function () {
    openPanel();
});
closePanelButton.addEventListener("click", closePanel);
panelOverlay.addEventListener("click", closePanel);
cancelButton.addEventListener("click", closePanel);

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closePanel();
    }
});


/*********************************************************************************
ITEMS OFFERS
*********************************************************************************/
function renderOfferedItems() {
    offeredItemsList.innerHTML = "";

    if (draftItems.length === 0) {
        offeredItemsList.appendChild(createDiv("offered-items-empty", "No items added yet"));
    }

    draftItems.forEach(function (draftItem, index) {
        const offeredItemRow = createDiv("offered-item-row");
        const amountText = draftItem.amount ? draftItem.amount + " " + draftItem.measure : "-";

        offeredItemRow.appendChild(createDiv("offered-item-name", draftItem.name));
        offeredItemRow.appendChild(createDiv("offered-item-quantity", "1"));
        offeredItemRow.appendChild(createDiv("offered-item-unit", draftItem.unit));
        offeredItemRow.appendChild(createDiv("offered-item-amount", amountText));
        offeredItemRow.appendChild(createDiv("offered-item-cost", formatCurrency(draftItem.cost)));

        const actionCell = createDiv("offered-item-action");
        const deleteButton = createIconButton("delete-button", "Remove " + draftItem.name, trashIcon);
        deleteButton.addEventListener("click", function () {
            draftItems.splice(index, 1);
            renderOfferedItems();
        });
        actionCell.appendChild(deleteButton);
        offeredItemRow.appendChild(actionCell);

        offeredItemsList.appendChild(offeredItemRow);
    });

    const itemLabel = draftItems.length === 1 ? "item" : "items";
    offeredItemsCount.textContent = draftItems.length + " " + itemLabel;
}

function resetAddItemForm() {
    itemSelect.selectedIndex = 0;
    unitSelect.selectedIndex = 0;
    costInput.value = "";
    amountInput.value = "";
    measureSelect.selectedIndex = 0;

    [itemSelect, costInput].forEach(clearInvalid);
}

function addItem() {
    const cost = Number(costInput.value);
    let isValid = true;

    if (!itemSelect.value) {
        flagInvalid(itemSelect);
        isValid = false;
    }

    if (costInput.value === "" || cost < 0) {
        flagInvalid(costInput);
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    const newItem = {
        name: itemSelect.value,
        unit: unitSelect.value,
        amount: amountInput.value ? Number(amountInput.value) : null,
        measure: measureSelect.value,
        cost: cost
    };

    // A supplier offers each item once, so adding it again updates it
    const existingIndex = draftItems.findIndex(function (draftItem) {
        return draftItem.name === newItem.name;
    });

    if (existingIndex === -1) {
        draftItems.push(newItem);
    } else {
        draftItems[existingIndex] = newItem;
    }

    resetAddItemForm();
    renderOfferedItems();
}

resetButton.addEventListener("click", resetAddItemForm);
addItemButton.addEventListener("click", addItem);

// Remove the warning outline as soon as the person fixes a field
[supplierNameInput, contactSelect, itemSelect, costInput].forEach(function (field) {
    field.addEventListener("input", function () {
        clearInvalid(field);
    });
});


/*********************************************************************************
SAVE AND DELETE SUPPLIER
*********************************************************************************/
function getNextSupplierId() {
    return suppliers.reduce(function (highest, supplier) {
        return Math.max(highest, supplier.id);
    }, 0) + 1;
}

function saveSupplier() {
    const supplierName = supplierNameInput.value.trim();
    let isValid = true;

    if (!supplierName) {
        flagInvalid(supplierNameInput);
        isValid = false;
    }

    if (!contactSelect.value) {
        flagInvalid(contactSelect);
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    const supplier = editingSupplierId === null ? null : findSupplier(editingSupplierId);

    if (supplier) {
        supplier.name = supplierName;
        supplier.contact = contactSelect.value;
        supplier.status = statusSelect.value;
        supplier.items = draftItems;
    } else {
        suppliers.push({
            id: getNextSupplierId(),
            name: supplierName,
            contact: contactSelect.value,
            status: statusSelect.value,
            items: draftItems
        });
    }

    renderSuppliers();
    closePanel();
}

function deleteSupplier() {
    const supplier = findSupplier(editingSupplierId);

    if (!supplier || !window.confirm("Delete " + supplier.name + "?")) {
        return;
    }

    suppliers = suppliers.filter(function (currentSupplier) {
        return currentSupplier.id !== supplier.id;
    });
    expandedSupplierIds.delete(supplier.id);

    renderSuppliers();
    closePanel();
}

saveSupplierButton.addEventListener("click", saveSupplier);
deleteSupplierButton.addEventListener("click", deleteSupplier);

fillItemSelect();
renderSuppliers();


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