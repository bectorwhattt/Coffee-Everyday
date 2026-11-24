const mainContainer = document.querySelector(".main");

const openPanelButton = mainContainer.querySelector("#open-panel-button");
const closePanelButton = mainContainer.querySelector("#close-panel-button");
const panelOverlay = mainContainer.querySelector("#panel-overlay");
const panel = mainContainer.querySelector("#new-purchase-order-panel");

const filterTabs = mainContainer.querySelectorAll(".filter-tab");
const purchaseOrdersBody = mainContainer.querySelector("#purchase-orders-body");

const supplierSelect = mainContainer.querySelector("#supplier-select");
const deliveryDateInput = mainContainer.querySelector("#delivery-date-input");

const addItemCard = mainContainer.querySelector("#add-item-card");
const addItemToggle = mainContainer.querySelector("#add-item-toggle");

const itemSelect = mainContainer.querySelector("#item-select");
const quantityInput = mainContainer.querySelector("#quantity-input");
const unitSelect = mainContainer.querySelector("#unit-select");
const costInput = mainContainer.querySelector("#cost-input");
const amountInput = mainContainer.querySelector("#amount-input");
const measureSelect = mainContainer.querySelector("#measure-select");
const resetButton = mainContainer.querySelector("#reset-button");
const addItemButton = mainContainer.querySelector("#add-item-button");

const orderItemsList = mainContainer.querySelector("#order-items-list");
const orderItemsCount = mainContainer.querySelector("#order-items-count");
const orderItemsSummary = mainContainer.querySelector("#order-items-summary");
const orderItemsTotal = mainContainer.querySelector("#order-items-total");

const saveDraftButton = mainContainer.querySelector("#save-draft-button");
const placeOrderButton = mainContainer.querySelector("#place-order-button");

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

// Demo data shown in the Figma design. Set to [] to start with an empty order.
let orderItems = [
    { name: "Whole Milk", quantity: 12, unit: "Carton", amount: 1, measure: "L", cost: 95 },
    { name: "Coffee Beans", quantity: 3, unit: "Pack", amount: 1, measure: "kg", cost: 950 },
    { name: "Matcha Powder", quantity: 2, unit: "Pack", amount: 500, measure: "g", cost: 1400 },
    { name: "Vanilla Syrup", quantity: 2, unit: "Bottle", amount: 750, measure: "mL", cost: 420 },
    { name: "Cup Lid", quantity: 2, unit: "Sleeve", amount: 50, measure: "pcs", cost: 450 }
];

// Sample data only, replace with real data later.
// The row total and item count are worked out from the items of each purchase order.
let purchaseOrders = [
    {
        number: 10, supplier: "Coffee Beans", date: "2026-11-14", status: "Ordered", expectedDelivery: "2026-11-26",
        items: [
            { name: "Arabica Beans", quantity: 3, unit: "Pack", amount: 1, measure: "kg", cost: 950 },
            { name: "House Blend Beans", quantity: 5, unit: "Pack", amount: 1, measure: "kg", cost: 650 }
        ]
    },
    {
        number: 9, supplier: "Supplier Inc.", date: "2026-11-12", status: "Received", expectedDelivery: "2026-11-24",
        items: [
            { name: "Big Cups", quantity: 7, unit: "Pack", amount: 300, measure: "pcs", cost: 170 },
            { name: "Milk", quantity: 12, unit: "Carton", amount: 1000, measure: "mL", cost: 155 }
        ]
    },
    {
        number: 8, supplier: "Dairy supplier", date: "2026-11-10", status: "Received", expectedDelivery: "2026-11-12",
        items: [
            { name: "Fresh Milk", quantity: 10, unit: "Carton", amount: 1, measure: "L", cost: 95 },
            { name: "Heavy Cream", quantity: 2, unit: "Bottle", amount: 1, measure: "L", cost: 420 },
            { name: "Butter", quantity: 3, unit: "Pack", amount: 250, measure: "g", cost: 220 },
            { name: "Cheese Slices", quantity: 1, unit: "Pack", amount: 200, measure: "g", cost: 150 }
        ]
    },
    {
        number: 7, supplier: "SM Aura (market run)", date: "2026-11-09", status: "Received", expectedDelivery: "2026-11-11",
        items: [
            { name: "Matcha Powder", quantity: 3, unit: "Pack", amount: 500, measure: "g", cost: 1400 },
            { name: "Vanilla Syrup", quantity: 4, unit: "Bottle", amount: 750, measure: "mL", cost: 420 },
            { name: "Brown Sugar", quantity: 6, unit: "Pack", amount: 1, measure: "kg", cost: 420 }
        ]
    }
];

// Which filter pill is selected, and which orders are opened (order 9 is opened in the Figma)
const FILTER_LABELS = { all: "All", received: "Received", ordered: "Ordered", canceled: "Canceled" };
const STATUS_FILTER_KEYS = { Ordered: "ordered", Received: "received", Cancelled: "canceled" };
const STATUS_CLASSES = { Ordered: "status-ordered", Received: "status-received", Cancelled: "status-canceled" };

let activeFilter = "all";
const expandedOrderNumbers = new Set([9]);


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

function flagInvalid(field) {
    field.classList.add("invalid");
}

function clearInvalid(field) {
    field.classList.remove("invalid");
}

// Built from the local date on purpose, toISOString() would shift the day in Manila time
function toDateKey(date) {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return date.getFullYear() + "-" + month + "-" + day;
}

function fromDateKey(dateKey) {
    const parts = dateKey.split("-").map(Number);
    return new Date(parts[0], parts[1] - 1, parts[2]);
}

function formatShortDate(dateKey) {
    return fromDateKey(dateKey).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatLongDate(dateKey) {
    return fromDateKey(dateKey).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatOrderNumber(number) {
    return "#" + String(number).padStart(4, "0");
}


/*********************************************************************************
PANEL
*********************************************************************************/
function openPanel() {
    panel.classList.add("open");
    panelOverlay.classList.add("open");
    panel.setAttribute("aria-hidden", "false");
}

function closePanel() {
    panel.classList.remove("open");
    panelOverlay.classList.remove("open");
    panel.setAttribute("aria-hidden", "true");
}

openPanelButton.addEventListener("click", openPanel);
closePanelButton.addEventListener("click", closePanel);
panelOverlay.addEventListener("click", closePanel);

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closePanel();
    }
});


/*********************************************************************************
PURCHASE ORDERS TABLE
*********************************************************************************/
function getPurchaseOrderTotal(purchaseOrder) {
    return purchaseOrder.items.reduce(function (total, item) {
        return total + item.quantity * item.cost;
    }, 0);
}

function createDetailsLine(className, cells) {
    const line = createDiv(className);

    cells.forEach(function (cell) {
        line.appendChild(createDiv(cell.className, cell.text));
    });

    return line;
}

function createPurchaseOrderDetails(purchaseOrder) {
    const details = createDiv("purchase-order-details");

    details.appendChild(createDetailsLine("details-header", [
        { className: "detail-item", text: "Items" },
        { className: "detail-quantity", text: "Qty" },
        { className: "detail-unit", text: "Unit" },
        { className: "detail-amount", text: "Amount per Unit" },
        { className: "detail-measure", text: "Measure" },
        { className: "detail-price", text: "Price each" },
        { className: "detail-subtotal", text: "Subtotal" }
    ]));

    purchaseOrder.items.forEach(function (item) {
        details.appendChild(createDetailsLine("details-line", [
            { className: "detail-item", text: item.name },
            { className: "detail-quantity", text: item.quantity },
            { className: "detail-unit", text: item.unit },
            { className: "detail-amount", text: item.amount ? item.amount : "-" },
            { className: "detail-measure", text: item.amount ? item.measure : "-" },
            { className: "detail-price", text: formatCurrency(item.cost) },
            { className: "detail-subtotal detail-bold", text: formatCurrency(item.quantity * item.cost) }
        ]));
    });

    details.appendChild(createDiv("details-divider"));

    details.appendChild(createDetailsLine("details-line", [
        { className: "detail-item", text: "" },
        { className: "detail-quantity", text: "" },
        { className: "detail-unit", text: "" },
        { className: "detail-summary-label detail-bold", text: "Total" },
        { className: "detail-subtotal detail-bold", text: formatCurrency(getPurchaseOrderTotal(purchaseOrder)) }
    ]));

    if (purchaseOrder.expectedDelivery) {
        details.appendChild(createDetailsLine("details-line", [
            { className: "detail-item", text: "" },
            { className: "detail-quantity", text: "" },
            { className: "detail-unit", text: "" },
            { className: "detail-summary-label detail-muted", text: "Expected delivery" },
            { className: "detail-subtotal detail-muted", text: formatLongDate(purchaseOrder.expectedDelivery) }
        ]));
    }

    return details;
}

function createPurchaseOrderRow(purchaseOrder) {
    const row = createDiv("purchase-order-row");
    const summary = createDiv("purchase-order-summary");
    const statusCell = createDiv("cell-status");
    const toggle = createDiv("order-toggle");
    const isExpanded = expandedOrderNumbers.has(purchaseOrder.number);

    statusCell.appendChild(createDiv("status-pill " + (STATUS_CLASSES[purchaseOrder.status] || ""), purchaseOrder.status));

    toggle.setAttribute("role", "button");
    toggle.setAttribute("aria-label", "Toggle order details");
    toggle.setAttribute("aria-expanded", String(isExpanded));
    toggle.innerHTML = chevronIcon;

    summary.appendChild(createDiv("cell-order-number", formatOrderNumber(purchaseOrder.number)));
    summary.appendChild(createDiv("cell-supplier", purchaseOrder.supplier));
    summary.appendChild(createDiv("cell-date", formatShortDate(purchaseOrder.date)));
    summary.appendChild(createDiv("cell-items", purchaseOrder.items.length));
    summary.appendChild(createDiv("cell-total", formatCurrency(getPurchaseOrderTotal(purchaseOrder))));
    summary.appendChild(statusCell);
    summary.appendChild(toggle);

    row.classList.toggle("expanded", isExpanded);
    row.appendChild(summary);
    row.appendChild(createPurchaseOrderDetails(purchaseOrder));

    // Expand or collapse the item details of this order
    toggle.addEventListener("click", function () {
        const nowExpanded = row.classList.toggle("expanded");

        toggle.setAttribute("aria-expanded", String(nowExpanded));

        if (nowExpanded) {
            expandedOrderNumbers.add(purchaseOrder.number);
        } else {
            expandedOrderNumbers.delete(purchaseOrder.number);
        }
    });

    return row;
}

function updateFilterCounts() {
    filterTabs.forEach(function (filterTab) {
        const filterKey = filterTab.dataset.filter;
        const count = purchaseOrders.filter(function (purchaseOrder) {
            return filterKey === "all" || STATUS_FILTER_KEYS[purchaseOrder.status] === filterKey;
        }).length;

        filterTab.textContent = FILTER_LABELS[filterKey] + " (" + count + ")";
        filterTab.classList.toggle("active", filterKey === activeFilter);
    });
}

function renderPurchaseOrders() {
    purchaseOrdersBody.innerHTML = "";

    const visibleOrders = purchaseOrders.filter(function (purchaseOrder) {
        return activeFilter === "all" || STATUS_FILTER_KEYS[purchaseOrder.status] === activeFilter;
    });

    if (visibleOrders.length === 0) {
        purchaseOrdersBody.appendChild(createDiv("purchase-orders-empty", "No purchase orders yet"));
    }

    visibleOrders.forEach(function (purchaseOrder) {
        purchaseOrdersBody.appendChild(createPurchaseOrderRow(purchaseOrder));
    });

    updateFilterCounts();
}

// Filter purchase orders by status
filterTabs.forEach(function (filterTab) {
    filterTab.addEventListener("click", function () {
        activeFilter = filterTab.dataset.filter;
        renderPurchaseOrders();
    });
});


/*********************************************************************************
ITEMS IN THIS ORDER
*********************************************************************************/
function renderOrderItems() {
    orderItemsList.innerHTML = "";

    if (orderItems.length === 0) {
        orderItemsList.appendChild(createDiv("order-items-empty", "No items added yet"));
    }

    orderItems.forEach(function (orderItem, index) {
        const orderItemRow = createDiv("order-item-row");
        const amountText = orderItem.amount ? orderItem.amount + " " + orderItem.measure : "-";

        orderItemRow.appendChild(createDiv("order-item-name", orderItem.name));
        orderItemRow.appendChild(createDiv("order-item-quantity", orderItem.quantity));
        orderItemRow.appendChild(createDiv("order-item-unit", orderItem.unit));
        orderItemRow.appendChild(createDiv("order-item-amount", amountText));
        orderItemRow.appendChild(createDiv("order-item-cost", formatCurrency(orderItem.cost)));
        orderItemRow.appendChild(createDiv("order-item-subtotal", formatCurrency(orderItem.quantity * orderItem.cost)));

        const actionCell = createDiv("order-item-action");
        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-button";
        deleteButton.type = "button";
        deleteButton.setAttribute("aria-label", "Remove " + orderItem.name);
        deleteButton.innerHTML = trashIcon;
        deleteButton.addEventListener("click", function () {
            orderItems.splice(index, 1);
            renderOrderItems();
        });
        actionCell.appendChild(deleteButton);
        orderItemRow.appendChild(actionCell);

        orderItemsList.appendChild(orderItemRow);
    });

    updateOrderSummary();
}

function getOrderTotal() {
    return orderItems.reduce(function (total, orderItem) {
        return total + orderItem.quantity * orderItem.cost;
    }, 0);
}

function updateOrderSummary() {
    const itemCount = orderItems.length;
    const unitCount = orderItems.reduce(function (total, orderItem) {
        return total + orderItem.quantity;
    }, 0);
    const itemLabel = itemCount === 1 ? "item" : "items";

    orderItemsCount.textContent = itemCount + " " + itemLabel;
    orderItemsSummary.textContent = itemCount + " " + itemLabel + " - " + unitCount + " total units";
    orderItemsTotal.textContent = formatCurrency(getOrderTotal());
}


/*********************************************************************************
ADD ITEM
*********************************************************************************/
// Collapse / expand the Add item form
addItemToggle.addEventListener("click", function () {
    const isCollapsed = addItemCard.classList.toggle("collapsed");
    addItemToggle.setAttribute("aria-expanded", String(!isCollapsed));
});

function resetAddItemForm() {
    itemSelect.selectedIndex = 0;
    quantityInput.value = "";
    unitSelect.selectedIndex = 0;
    costInput.value = "";
    amountInput.value = "";
    measureSelect.selectedIndex = 0;

    [itemSelect, quantityInput, costInput].forEach(clearInvalid);
}

function addItem() {
    const quantity = Number(quantityInput.value);
    const cost = Number(costInput.value);
    let isValid = true;

    if (!itemSelect.value) {
        flagInvalid(itemSelect);
        isValid = false;
    }

    if (!(quantity > 0)) {
        flagInvalid(quantityInput);
        isValid = false;
    }

    if (costInput.value === "" || cost < 0) {
        flagInvalid(costInput);
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    orderItems.push({
        name: itemSelect.value,
        quantity: quantity,
        unit: unitSelect.value,
        amount: amountInput.value ? Number(amountInput.value) : null,
        measure: measureSelect.value,
        cost: cost
    });

    resetAddItemForm();
    renderOrderItems();
}

resetButton.addEventListener("click", resetAddItemForm);
addItemButton.addEventListener("click", addItem);

// Remove the warning outline as soon as the person fixes a field
[supplierSelect, itemSelect, quantityInput, costInput].forEach(function (field) {
    field.addEventListener("input", function () {
        clearInvalid(field);
    });
});


/*********************************************************************************
PLACE ORDER
*********************************************************************************/
function getNextOrderNumber() {
    return purchaseOrders.reduce(function (highest, purchaseOrder) {
        return Math.max(highest, purchaseOrder.number);
    }, 0) + 1;
}

function addPurchaseOrder() {
    const purchaseOrder = {
        number: getNextOrderNumber(),
        supplier: supplierSelect.value,
        date: toDateKey(new Date()),
        status: "Ordered",
        expectedDelivery: deliveryDateInput.value || null,
        items: orderItems.map(function (orderItem) {
            return Object.assign({}, orderItem);
        })
    };

    purchaseOrders.unshift(purchaseOrder);
    activeFilter = "all";
    renderPurchaseOrders();
}

function placeOrder() {
    let isValid = true;

    if (!supplierSelect.value) {
        flagInvalid(supplierSelect);
        isValid = false;
    }

    if (orderItems.length === 0) {
        addItemCard.classList.remove("collapsed");
        addItemToggle.setAttribute("aria-expanded", "true");
        flagInvalid(itemSelect);
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    addPurchaseOrder();

    // Start fresh for the next order
    orderItems = [];
    deliveryDateInput.value = "";
    resetAddItemForm();
    renderOrderItems();
    closePanel();
}

// There is no draft storage yet, so the draft stays in the panel until the page reloads
saveDraftButton.addEventListener("click", closePanel);
placeOrderButton.addEventListener("click", placeOrder);

renderPurchaseOrders();
renderOrderItems();