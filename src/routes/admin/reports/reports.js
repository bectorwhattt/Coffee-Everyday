// Scoped to the main div so imported components are never affected
const mainContainer = document.querySelector(".main");

// Sample data only, replace with real data later
const salesPerDay = [
    { day: "Mon", sales: 4300 },
    { day: "Tue", sales: 6200 },
    { day: "Wed", sales: 5200 },
    { day: "Thu", sales: 8600 },
    { day: "Fri", sales: 8000 },
    { day: "Sat", sales: 9800 },
    { day: "Sun", sales: 9200 }
];

const stockHealth = [
    { label: "In Stock", count: 42, tagClass: "tag-positive" },
    { label: "Low Stock", count: 7, tagClass: "tag-warning" },
    { label: "Out of Stock", count: 2, tagClass: "tag-negative" }
];

const topSellingItems = [
    { name: "Spanish Latte", sold: 128 },
    { name: "Salted Caramel", sold: 104 },
    { name: "Iced Matcha", sold: 87 },
    { name: "Classic Americano", sold: 70 },
    { name: "Fudge Brownie", sold: 55 }
];

const ordersByType = [
    { type: "Dine in", count: 38 },
    { type: "Take out", count: 31 },
    { type: "Grab", count: 17 }
];


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

function formatCurrency(value) {
    return "\u20B1" + value.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

// Creates a progress bar that fills to a percentage of its track
function createProgressTrack(percentage) {
    const track = createDiv("progress-track");
    const fill = createDiv("progress-fill");
    fill.style.width = percentage + "%";
    track.appendChild(fill);
    return track;
}


/*********************************************************************************
WELCOME BANNER
*********************************************************************************/
const currentDate = mainContainer.querySelector("#current-date");
currentDate.textContent = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
});


/*********************************************************************************
SALES OVERVIEW
*********************************************************************************/
function renderSalesChart() {
    const barPlot = mainContainer.querySelector("#sales-bar-plot");
    const barLabels = mainContainer.querySelector("#sales-bar-labels");
    const highestSales = Math.max.apply(null, salesPerDay.map(function (entry) {
        return entry.sales;
    }));

    salesPerDay.forEach(function (entry) {
        const bar = createDiv("bar");
        bar.style.height = (entry.sales / highestSales) * 92 + "%";
        bar.title = entry.day + ": " + formatCurrency(entry.sales);

        barPlot.appendChild(bar);
        barLabels.appendChild(createDiv("bar-label", entry.day));
    });
}


/*********************************************************************************
STOCK HEALTH
*********************************************************************************/
function renderStockHealth() {
    const stockList = mainContainer.querySelector("#stock-list");

    stockHealth.forEach(function (entry) {
        const stockPill = createDiv("tag stock-pill " + entry.tagClass);

        stockPill.appendChild(createDiv("stock-pill-dot"));
        stockPill.appendChild(createDiv("stock-pill-label", entry.label));
        stockPill.appendChild(createDiv("stock-pill-count", entry.count));

        stockList.appendChild(stockPill);
    });
}


/*********************************************************************************
TOP SELLING ITEMS
*********************************************************************************/
function renderTopSellingItems() {
    const topSellingList = mainContainer.querySelector("#top-selling-list");
    const mostSold = Math.max.apply(null, topSellingItems.map(function (entry) {
        return entry.sold;
    }));

    topSellingItems.forEach(function (entry, index) {
        const topSellingRow = createDiv("top-selling-row");

        topSellingRow.appendChild(createDiv("top-selling-name", (index + 1) + ". " + entry.name));
        topSellingRow.appendChild(createProgressTrack((entry.sold / mostSold) * 100));

        topSellingList.appendChild(topSellingRow);
    });
}


/*********************************************************************************
ORDERS BY TYPE
*********************************************************************************/
function renderOrdersByType() {
    const orderTypesList = mainContainer.querySelector("#order-types-list");
    const mostOrders = Math.max.apply(null, ordersByType.map(function (entry) {
        return entry.count;
    }));

    ordersByType.forEach(function (entry) {
        const orderTypeRow = createDiv("order-type-row");
        const orderTypeHeading = createDiv("order-type-heading");

        orderTypeHeading.appendChild(createDiv("order-type-name", entry.type));
        orderTypeHeading.appendChild(createDiv("order-type-count", entry.count));

        orderTypeRow.appendChild(orderTypeHeading);
        orderTypeRow.appendChild(createProgressTrack((entry.count / mostOrders) * 100));

        orderTypesList.appendChild(orderTypeRow);
    });
}

renderSalesChart();
renderStockHealth();
renderTopSellingItems();
renderOrdersByType();