const mainContainer = document.querySelector(".main");

const filterTabs = mainContainer.querySelectorAll(".filter-tab");
const ordersBody = mainContainer.querySelector("#orders-body");

const chevronIcon =
    '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' +
    '<polyline points="2.5,4.5 6,8 9.5,4.5"></polyline>' +
    "</svg>";

// Prices already include VAT, so the VAT is backed out of the total
const VAT_RATE = 0.12;

// Sample data only, replace with real data later.
// The row total, VAT and item summary are worked out from the items of each order.
let orders = [
    {
        number: 18, date: "2026-11-23", time: "10:45 AM", type: "Dine in", payment: "Cash", status: "Processing",
        items: [
            { name: "French Vanilla", price: 170, quantity: 1 },
            { name: "NYC Style Cookies", price: 155, quantity: 1 }
        ]
    },
    {
        number: 17, date: "2026-11-23", time: "10:21 AM", type: "Take out", payment: "GCash", status: "Completed",
        items: [
            { name: "Pain au Chocolat", price: 80, quantity: 1 }
        ]
    },
    {
        number: 16, date: "2026-11-23", time: "9:58 AM", type: "Dine in", payment: "Cash", status: "Completed",
        items: [
            { name: "Nutella Latte", price: 150, quantity: 1 }
        ]
    },
    {
        number: 15, date: "2026-11-23", time: "9:30 AM", type: "Take out", payment: "Cash", status: "Cancelled",
        items: [
            { name: "Cafe Latte", price: 150, quantity: 1 }
        ]
    }
];

// Which filter pill is selected, and which orders are opened (order 18 is opened in the Figma)
const FILTER_LABELS = { all: "All", processing: "Processing", completed: "Completed", canceled: "Canceled" };
const STATUS_FILTER_KEYS = { Processing: "processing", Completed: "completed", Cancelled: "canceled" };
const STATUS_CLASSES = { Processing: "status-processing", Completed: "status-completed", Cancelled: "status-canceled" };

let activeFilter = "all";
const expandedOrderNumbers = new Set([18]);


/*********************************************************************************
HELPERS
*********************************************************************************/
function formatCurrency(value) {
    return "\u20B1" + value.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

// Always two decimals, used for the VAT line
function formatExactCurrency(value) {
    return "\u20B1" + value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function createDiv(className, text) {
    const element = document.createElement("div");
    element.className = className;
    if (text !== undefined) {
        element.textContent = text;
    }
    return element;
}

function fromDateKey(dateKey) {
    const parts = dateKey.split("-").map(Number);
    return new Date(parts[0], parts[1] - 1, parts[2]);
}

function formatLongDate(dateKey) {
    return fromDateKey(dateKey).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatOrderNumber(number) {
    return "#" + String(number).padStart(4, "0");
}

function getOrderTotal(order) {
    return order.items.reduce(function (total, item) {
        return total + item.quantity * item.price;
    }, 0);
}

function getOrderVat(total) {
    return (total * VAT_RATE) / (1 + VAT_RATE);
}


/*********************************************************************************
ORDERS TABLE
*********************************************************************************/
function createDetailsLine(className, cells) {
    const line = createDiv(className);

    cells.forEach(function (cell) {
        line.appendChild(createDiv(cell.className, cell.text));
    });

    return line;
}

function createOrderDetails(order) {
    const details = createDiv("order-details");
    const total = getOrderTotal(order);

    details.appendChild(createDetailsLine("details-header", [
        { className: "detail-item", text: "Item" },
        { className: "detail-quantity", text: "Qty" },
        { className: "detail-price", text: "Price each" },
        { className: "detail-subtotal", text: "Subtotal" }
    ]));

    order.items.forEach(function (item) {
        details.appendChild(createDetailsLine("details-line", [
            { className: "detail-item", text: item.name },
            { className: "detail-quantity", text: item.quantity },
            { className: "detail-price", text: formatCurrency(item.price) },
            { className: "detail-subtotal detail-bold", text: formatCurrency(item.quantity * item.price) }
        ]));
    });

    details.appendChild(createDiv("details-divider"));

    details.appendChild(createDetailsLine("details-line", [
        { className: "detail-item", text: "" },
        { className: "detail-quantity", text: "" },
        { className: "detail-summary-label", text: "VAT (" + VAT_RATE * 100 + "%, included)" },
        { className: "detail-subtotal", text: formatExactCurrency(getOrderVat(total)) }
    ]));

    details.appendChild(createDetailsLine("details-line", [
        { className: "detail-item", text: "" },
        { className: "detail-quantity", text: "" },
        { className: "detail-summary-label detail-bold", text: "Total" },
        { className: "detail-subtotal detail-bold", text: formatCurrency(total) }
    ]));

    return details;
}

function createOrderRow(order) {
    const row = createDiv("order-row");
    const summary = createDiv("order-summary");
    const statusCell = createDiv("cell-status");
    const toggle = createDiv("order-toggle");
    const isExpanded = expandedOrderNumbers.has(order.number);
    const itemsSummary = order.items.map(function (item) {
        return item.name + " x" + item.quantity;
    }).join(", ");

    statusCell.appendChild(createDiv("status-pill " + (STATUS_CLASSES[order.status] || ""), order.status));

    toggle.setAttribute("role", "button");
    toggle.setAttribute("aria-label", "Toggle order details");
    toggle.setAttribute("aria-expanded", String(isExpanded));
    toggle.innerHTML = chevronIcon;

    summary.appendChild(createDiv("cell-order-number", formatOrderNumber(order.number)));
    summary.appendChild(createDiv("cell-date", formatLongDate(order.date)));
    summary.appendChild(createDiv("cell-time", order.time));
    summary.appendChild(createDiv("cell-items", itemsSummary));
    summary.appendChild(createDiv("cell-type", order.type));
    summary.appendChild(createDiv("cell-payment", order.payment));
    summary.appendChild(createDiv("cell-total", formatCurrency(getOrderTotal(order))));
    summary.appendChild(statusCell);
    summary.appendChild(toggle);

    row.classList.toggle("expanded", isExpanded);
    row.appendChild(summary);
    row.appendChild(createOrderDetails(order));

    // Expand or collapse the item details of this order
    toggle.addEventListener("click", function () {
        const nowExpanded = row.classList.toggle("expanded");

        toggle.setAttribute("aria-expanded", String(nowExpanded));

        if (nowExpanded) {
            expandedOrderNumbers.add(order.number);
        } else {
            expandedOrderNumbers.delete(order.number);
        }
    });

    return row;
}

function updateFilterCounts() {
    filterTabs.forEach(function (filterTab) {
        const filterKey = filterTab.dataset.filter;
        const count = orders.filter(function (order) {
            return filterKey === "all" || STATUS_FILTER_KEYS[order.status] === filterKey;
        }).length;

        filterTab.textContent = FILTER_LABELS[filterKey] + " (" + count + ")";
        filterTab.classList.toggle("active", filterKey === activeFilter);
    });
}

function renderOrders() {
    ordersBody.innerHTML = "";

    const visibleOrders = orders.filter(function (order) {
        return activeFilter === "all" || STATUS_FILTER_KEYS[order.status] === activeFilter;
    });

    if (visibleOrders.length === 0) {
        ordersBody.appendChild(createDiv("orders-empty", "No orders yet"));
    }

    visibleOrders.forEach(function (order) {
        ordersBody.appendChild(createOrderRow(order));
    });

    updateFilterCounts();
}

// Filter orders by status
filterTabs.forEach(function (filterTab) {
    filterTab.addEventListener("click", function () {
        activeFilter = filterTab.dataset.filter;
        renderOrders();
    });
});

renderOrders();


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