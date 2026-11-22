const mainContainer = document.querySelector(".main");

const openPanelButton = mainContainer.querySelector("#open-panel-button");
const closePanelButton = mainContainer.querySelector("#close-panel-button");
const panelOverlay = mainContainer.querySelector("#panel-overlay");
const panel = mainContainer.querySelector("#new-purchase-order-panel");

const purchaseOrdersBody = mainContainer.querySelector("#purchase-orders-body");

const supplierSelect = mainContainer.querySelector("#supplier-select");
const deliveryDateInput = mainContainer.querySelector("#delivery-date-input");

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

// Demo data shown in the Figma design. Set to [] to start with an empty order.
let orderItems = [
    { name: "Whole Milk", quantity: 12, unit: "Carton", amount: 1, measure: "L", cost: 95 },
    { name: "Coffee Beans", quantity: 3, unit: "Pack", amount: 1, measure: "kg", cost: 950 },
    { name: "Matcha Powder", quantity: 2, unit: "Pack", amount: 500, measure: "g", cost: 1400 },
    { name: "Vanilla Syrup", quantity: 2, unit: "Bottle", amount: 750, measure: "mL", cost: 420 },
    { name: "Cup Lid", quantity: 2, unit: "Sleeve", amount: 50, measure: "pcs", cost: 450 }
];

// The static rows in the table go up to PO-0010
let nextOrderNumber = 11;


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
function addPurchaseOrderRow(supplierName, itemCount, total) {
    const orderNumber = "PO-" + String(nextOrderNumber).padStart(4, "0");
    const orderDate = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });

    const purchaseOrderRow = createDiv("purchase-order-row");
    purchaseOrderRow.appendChild(createDiv("cell-order-number", orderNumber));
    purchaseOrderRow.appendChild(createDiv("cell-supplier", supplierName));
    purchaseOrderRow.appendChild(createDiv("cell-date", orderDate));
    purchaseOrderRow.appendChild(createDiv("cell-items", itemCount));
    purchaseOrderRow.appendChild(createDiv("cell-total", formatCurrency(total)));

    const statusCell = createDiv("cell-status");
    statusCell.appendChild(createDiv("status-pill status-ordered", "Ordered"));
    purchaseOrderRow.appendChild(statusCell);

    purchaseOrdersBody.prepend(purchaseOrderRow);
    nextOrderNumber += 1;
}

function placeOrder() {
    let isValid = true;

    if (!supplierSelect.value) {
        flagInvalid(supplierSelect);
        isValid = false;
    }

    if (orderItems.length === 0) {
        flagInvalid(itemSelect);
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    addPurchaseOrderRow(supplierSelect.value, orderItems.length, getOrderTotal());

    // Start fresh for the next order
    orderItems = [];
    supplierSelect.selectedIndex = 0;
    deliveryDateInput.value = "";
    resetAddItemForm();
    renderOrderItems();
    closePanel();
}

// There is no draft storage yet, so the draft stays in the panel until the page reloads
saveDraftButton.addEventListener("click", closePanel);
placeOrderButton.addEventListener("click", placeOrder);

renderOrderItems();