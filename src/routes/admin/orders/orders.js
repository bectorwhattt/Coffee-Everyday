const PESO = "\u20B1";
const VAT_RATE = 0.12;

const STATUS = {
  processing: { label: "Processing", pill: "status-processing" },
  completed: { label: "Completed", pill: "status-completed" },
  canceled: { label: "Cancelled", pill: "status-canceled" },
};

const FILTERS = [
  { key: "all", label: "All" },
  { key: "processing", label: "Processing" },
  { key: "completed", label: "Completed" },
  { key: "canceled", label: "Canceled" },
];

const ORDERS = [
  {
    number: "0018",
    date: "Nov 23, 2026",
    time: "10:45 AM",
    type: "Dine in",
    payment: "Cash",
    status: "processing",
    expanded: true,
    items: [["French Vanilla", 170, 1], ["NYC Style Cookies", 155, 1]],
  },
  {
    number: "0017",
    date: "Nov 23, 2026",
    time: "10:21 AM",
    type: "Take out",
    payment: "GCash",
    status: "completed",
    items: [["Pain au Chocolat", 80, 1]],
  },
  {
    number: "0016",
    date: "Nov 23, 2026",
    time: "9:58 AM",
    type: "Dine in",
    payment: "Cash",
    status: "completed",
    items: [["Nutella Latte", 150, 1]],
  },
  {
    number: "0015",
    date: "Nov 23, 2026",
    time: "9:30 AM",
    type: "Take out",
    payment: "Cash",
    status: "canceled",
    items: [["Cafe Latte", 150, 1]],
  },
];

const selectElement = (selector) => document.querySelector(selector);
const money = (amount) => `${PESO}${Number.isInteger(amount) ? amount : amount.toFixed(2)}`;

// prices already include VAT, so this backs the VAT out of the total
const orderTotal = (order) => order.items.reduce((sum, [, price, qty]) => sum + price * qty, 0);
const orderVat = (total) => (total * VAT_RATE) / (1 + VAT_RATE);

let currentFilter = "all";

function renderFilterTabs() {
  const box = selectElement("#filter-tabs");
  if (!box) { console.warn("[orders] #filter-tabs not found in the HTML"); return; }
  box.innerHTML = FILTERS
    .map(({ key, label }) => {
      const count = key === "all" ? ORDERS.length : ORDERS.filter((order) => order.status === key).length;
      const active = key === currentFilter ? " active" : "";
      return `<div class="filter-tab${active}" data-filter="${key}">${label} (${count})</div>`;
    })
    .join("");
}

function renderOrders() {
  const root = selectElement("#order-rows");
  if (!root) { console.warn("[orders] #order-rows not found in the HTML"); return; }

  root.innerHTML = ORDERS
    .map((order) => {
      const total = orderTotal(order);
      const status = STATUS[order.status];
      const summary = order.items.map(([name, , qty]) => `${name} x${qty}`).join(", ");

      const lines = order.items
        .map(
          ([name, price, qty]) => `
            <div class="order-details-line">
                <div class="detail-item">${name}</div>
                <div class="detail-quantity">${qty}</div>
                <div class="detail-price">${money(price)}</div>
                <div class="detail-subtotal detail-bold">${money(price * qty)}</div>
            </div>`
        )
        .join("");

      return `
        <div class="order-row${order.expanded ? " expanded" : ""}" data-status="${order.status}">
            <div class="order-summary">
                <div class="order-number">#${order.number}</div>
                <div class="order-date">${order.date}</div>
                <div class="order-time">${order.time}</div>
                <div class="order-items">${summary}</div>
                <div class="order-type">${order.type}</div>
                <div class="order-payment">${order.payment}</div>
                <div class="order-total">${money(total)}</div>
                <div class="order-status">
                    <div class="status-pill ${status.pill}">${status.label}</div>
                </div>
                <div class="order-toggle" role="button" aria-expanded="${Boolean(order.expanded)}" aria-label="Toggle order details">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="2.5,4.5 6,8 9.5,4.5"></polyline>
                    </svg>
                </div>
            </div>

            <div class="order-details">
                <div class="order-details-header">
                    <div class="detail-item">Item</div>
                    <div class="detail-quantity">Qty</div>
                    <div class="detail-price">Price each</div>
                    <div class="detail-subtotal">Subtotal</div>
                </div>
                ${lines}
                <div class="order-details-divider"></div>
                <div class="order-details-line">
                    <div class="detail-item"></div>
                    <div class="detail-quantity"></div>
                    <div class="detail-price">VAT (12%, included)</div>
                    <div class="detail-subtotal">${PESO}${orderVat(total).toFixed(2)}</div>
                </div>
                <div class="order-details-line">
                    <div class="detail-item"></div>
                    <div class="detail-quantity"></div>
                    <div class="detail-price detail-bold">Total</div>
                    <div class="detail-subtotal detail-bold">${money(total)}</div>
                </div>
            </div>
        </div>`;
    })
    .join("");
}

function applyFilter(filter) {
  currentFilter = filter;

  document.querySelectorAll(".filter-tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.filter === filter);
  });

  document.querySelectorAll(".order-row").forEach((row) => {
    const matches = filter === "all" || row.dataset.status === filter;
    row.style.display = matches ? "" : "none";
  });
}

// filter orders by status
const filterTabsBox = selectElement("#filter-tabs");
if (filterTabsBox) {
  filterTabsBox.addEventListener("click", (event) => {
    const tab = event.target.closest(".filter-tab");
    if (tab) applyFilter(tab.dataset.filter);
  });
}

// expand/collapse an order's details
const orderRowsBox = selectElement("#order-rows");
if (orderRowsBox) {
  orderRowsBox.addEventListener("click", (event) => {
    const toggle = event.target.closest(".order-toggle");
    if (!toggle) return;
    const row = toggle.closest(".order-row");
    const expanded = row.classList.toggle("expanded");
    toggle.setAttribute("aria-expanded", expanded);
  });
}

renderFilterTabs();
renderOrders();
applyFilter(currentFilter);