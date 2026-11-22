const mainContainer = document.querySelector(".main");

// sample data only, replace with real data later
const salesPerDay = [
    { day: "Sun", sales: 3120 },
    { day: "Mon", sales: 1980 },
    { day: "Tue", sales: 2140 },
    { day: "Wed", sales: 1760 },
    { day: "Thu", sales: 2420 },
    { day: "Fri", sales: 2860 },
    { day: "Sat", sales: 2350 }
];

const stockHealth = [
    { label: "In stock", count: 14, dotClass: "legend-dot-in-stock" },
    { label: "Low", count: 3, dotClass: "legend-dot-low" },
    { label: "No stock", count: 2, dotClass: "legend-dot-no-stock" }
];

const topSellers = [
    { name: "Spanish Latte", sold: 6 },
    { name: "Salted Caramel", sold: 4 },
    { name: "Dirty Matcha", sold: 3 },
    { name: "Biscaffee", sold: 3 },
    { name: "Pain Au Chocolat", sold: 2 }
];

const ordersByType = [
    { type: "Dine in", count: 8 },
    { type: "Take out", count: 5 },
    { type: "Grab", count: 2 }
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

// makes a progress bar na nag ffill bg percentage of its track
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
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
});


/*********************************************************************************
SALES THIS WEEK
*********************************************************************************/
function renderSalesChart() {
    const barPlot = mainContainer.querySelector("#sales-bar-plot");
    const barLabels = mainContainer.querySelector("#sales-bar-labels");
    const highestSales = Math.max.apply(null, salesPerDay.map(function (entry) {
        return entry.sales;
    }));
    const lastIndex = salesPerDay.length - 1;

    salesPerDay.forEach(function (entry, index) {
        const isHighlighted = index === lastIndex;
        const barColumn = createDiv("bar-column");

        barColumn.appendChild(createDiv(isHighlighted ? "bar-value bar-value-highlighted" : "bar-value", formatCurrency(entry.sales)));

        // The tallest bar fills 82% of the plot so its value label still fits above it
        const bar = createDiv(isHighlighted ? "bar bar-highlighted" : "bar");
        bar.style.height = (entry.sales / highestSales) * 82 + "%";
        barColumn.appendChild(bar);

        barPlot.appendChild(barColumn);
        barLabels.appendChild(createDiv("bar-label", entry.day));
    });
}


/*********************************************************************************
STOCK HEALTH
*********************************************************************************/
function renderStockHealth() {
    const donutChart = mainContainer.querySelector("#stock-donut");
    const stockTotal = mainContainer.querySelector("#stock-total");
    const stockLegend = mainContainer.querySelector("#stock-legend");
    const totalItems = stockHealth.reduce(function (total, entry) {
        return total + entry.count;
    }, 0);
    const gradientStops = [];
    let startPercentage = 0;

    stockHealth.forEach(function (entry) {
        const legendRow = createDiv("legend-row");
        const legendDot = createDiv("legend-dot " + entry.dotClass);

        legendRow.appendChild(legendDot);
        legendRow.appendChild(createDiv("legend-label", entry.label));
        legendRow.appendChild(createDiv("legend-value", entry.count));
        stockLegend.appendChild(legendRow);

        // The ring colors come from the legend dots, so the colors only live in the CSS file
        const dotColor = getComputedStyle(legendDot).backgroundColor;
        const endPercentage = startPercentage + (entry.count / totalItems) * 100;
        gradientStops.push(dotColor + " " + startPercentage + "% " + endPercentage + "%");
        startPercentage = endPercentage;
    });

    stockTotal.textContent = totalItems;
    donutChart.style.backgroundImage = "conic-gradient(" + gradientStops.join(", ") + ")";
}


/*********************************************************************************
TOP SELLERS
*********************************************************************************/
function renderTopSellers() {
    const topSellersList = mainContainer.querySelector("#top-sellers-list");
    const mostSold = Math.max.apply(null, topSellers.map(function (entry) {
        return entry.sold;
    }));

    topSellers.forEach(function (entry, index) {
        const topSellerRow = createDiv("top-seller-row");

        topSellerRow.appendChild(createDiv("top-seller-rank", index + 1));
        topSellerRow.appendChild(createDiv("top-seller-name", entry.name));
        topSellerRow.appendChild(createProgressTrack((entry.sold / mostSold) * 100));
        topSellerRow.appendChild(createDiv("top-seller-sold", entry.sold + " sold"));

        topSellersList.appendChild(topSellerRow);
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

        orderTypeRow.appendChild(createDiv("order-type-name", entry.type));
        orderTypeRow.appendChild(createProgressTrack((entry.count / mostOrders) * 100));
        orderTypeRow.appendChild(createDiv("order-type-count", entry.count));

        orderTypesList.appendChild(orderTypeRow);
    });
}

renderSalesChart();
renderStockHealth();
renderTopSellers();
renderOrdersByType();