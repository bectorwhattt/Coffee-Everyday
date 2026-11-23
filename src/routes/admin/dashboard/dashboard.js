// Scoped to the main div so imported components are never affected
const mainContainer = document.querySelector(".main");

const PESO = "\u20B1";
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Sample data only, replace with real data later.
// Every date has its own snapshot of the widgets. salesThisWeek holds the 7 days ending on that date.
const DASHBOARD = {
  "2026-11-21": {
    statistics: {
      sales: 2350, salesChange: 13,
      orders: 15, ordersChange: 5,
      averageOrders: 18,
    },
    salesThisWeek: [3120, 1980, 2140, 1760, 2420, 2860, 2350],
    stockHealth: { inStock: 14, low: 3, noStock: 2 },
    topSellers: [
      { name: "Spanish Latte", sold: 6 },
      { name: "Salted Caramel", sold: 4 },
      { name: "Dirty Matcha", sold: 3 },
      { name: "Biscaffee", sold: 3 },
      { name: "Pain Au Chocolat", sold: 2 },
    ],
    todaysOrders: [
      { number: "#0018", time: "10:45 AM", items: "French Vanilla x1, NYC Style Cookies x1", total: 325, status: "Processing" },
      { number: "#0017", time: "10:21 AM", items: "Pain Au Chocolat x1", total: 110, status: "Completed" },
      { number: "#0016", time: "9:58 AM", items: "Nutella Latte x1", total: 150, status: "Completed" },
      { number: "#0015", time: "9:30 AM", items: "Cafe Latte x1", total: 130, status: "Completed" },
    ],
    ordersByType: [
      { type: "Dine in", count: 8 },
      { type: "Take out", count: 5 },
      { type: "Grab", count: 2 },
    ],
  },

  "2026-11-22": {
    statistics: {
      sales: 3010, salesChange: 28,
      orders: 24, ordersChange: 60,
      averageOrders: 19,
    },
    salesThisWeek: [1980, 2140, 1760, 2420, 2860, 2350, 3010],
    stockHealth: { inStock: 13, low: 4, noStock: 2 },
    topSellers: [
      { name: "Spanish Latte", sold: 8 },
      { name: "Salted Caramel", sold: 5 },
      { name: "Dirty Matcha", sold: 4 },
      { name: "Biscaffee", sold: 3 },
      { name: "Pain Au Chocolat", sold: 3 },
    ],
    todaysOrders: [
      { number: "#0022", time: "10:05 AM", items: "Fudge Brownie x1", total: 95, status: "Processing" },
      { number: "#0021", time: "9:42 AM", items: "Americano x1", total: 120, status: "Completed" },
      { number: "#0020", time: "9:25 AM", items: "Iced Matcha x1", total: 160, status: "Completed" },
      { number: "#0019", time: "9:10 AM", items: "Spanish Latte x1", total: 150, status: "Completed" },
    ],
    ordersByType: [
      { type: "Dine in", count: 11 },
      { type: "Take out", count: 9 },
      { type: "Grab", count: 4 },
    ],
  },
};

const STATUS_CLASSES = {
  Processing: "status-processing",
  Completed: "status-completed",
  Cancelled: "status-canceled",
};

const STOCK_ROWS = [
  { key: "inStock", label: "In stock", dotClass: "legend-dot-in-stock" },
  { key: "low", label: "Low", dotClass: "legend-dot-low" },
  { key: "noStock", label: "No stock", dotClass: "legend-dot-no-stock" },
];


/*********************************************************************************
HELPERS
*********************************************************************************/
const selectElement = (selector) => mainContainer.querySelector(selector);
const money = (amount) => PESO + amount.toLocaleString("en-US", { maximumFractionDigits: 2 });

function fill(selector, value) {
  const element = selectElement(selector);
  if (!element) { console.warn(`[dashboard] Element ${selector} not found in the HTML`); return null; }
  element.textContent = value;
  return element;
}

function createDiv(className, text) {
  const element = document.createElement("div");
  element.className = className;
  if (text !== undefined) {
    element.textContent = text;
  }
  return element;
}

// makes a progress bar na nag ffill bg percentage of its track
function createProgressTrack(percentage) {
  const track = createDiv("progress-track");
  const fill = createDiv("progress-fill");
  fill.style.width = percentage + "%";
  track.appendChild(fill);
  return track;
}

function clearElement(selector) {
  const element = selectElement(selector);
  if (!element) { console.warn(`[dashboard] Element ${selector} not found in the HTML`); return null; }
  element.innerHTML = "";
  return element;
}


/*********************************************************************************
DATES
*********************************************************************************/
// Built from the local date on purpose, toISOString() would shift the day in Manila time
function toDateKey(date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function fromDateKey(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function isValidDateKey(dateKey) {
  return /^\d{4}-\d{2}-\d{2}$/.test(dateKey) && toDateKey(fromDateKey(dateKey)) === dateKey;
}

// The date being viewed: #2026-11-21 in the address, otherwise today
function getRequestedDateKey() {
  const hash = location.hash.slice(1);
  return isValidDateKey(hash) ? hash : toDateKey(new Date());
}

// Uses the snapshot of that date, or the latest one before it when that date has no data yet
function findSnapshotKey(dateKey) {
  const keys = Object.keys(DASHBOARD).sort();
  const earlierKeys = keys.filter((key) => key <= dateKey);
  return earlierKeys.length ? earlierKeys[earlierKeys.length - 1] : keys[0];
}


/*********************************************************************************
WELCOME BANNER
*********************************************************************************/
function renderBanner(dateKey) {
  fill("#current-date", fromDateKey(dateKey).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }));
}


/*********************************************************************************
STATISTICS
*********************************************************************************/
function renderChange(selector, change) {
  const element = fill(selector, `${change}%`);
  if (!element) return;
  element.classList.toggle("statistic-percentage-positive", change >= 0);
  element.classList.toggle("statistic-percentage-negative", change < 0);
}

function renderStatistics(data) {
  const { statistics, stockHealth } = data;

  fill("#sales-total", money(statistics.sales));
  renderChange("#sales-change", statistics.salesChange);

  fill("#orders-total", statistics.orders);
  renderChange("#orders-change", statistics.ordersChange);

  fill("#low-stock-total", `${stockHealth.low + stockHealth.noStock} items`);
  fill("#low-stock-note", `${stockHealth.low} low, ${stockHealth.noStock} no stock`);

  fill("#average-orders", `${statistics.averageOrders} orders`);
}


/*********************************************************************************
SALES THIS WEEK
*********************************************************************************/
function renderSalesChart(snapshotKey, data) {
  const barPlot = clearElement("#sales-bar-plot");
  const barLabels = clearElement("#sales-bar-labels");
  if (!barPlot || !barLabels) return;

  const lastDate = fromDateKey(snapshotKey);
  const highestSales = Math.max(...data.salesThisWeek);
  const lastIndex = data.salesThisWeek.length - 1;

  data.salesThisWeek.forEach((sales, index) => {
    const isHighlighted = index === lastIndex;
    const barColumn = createDiv("bar-column");

    barColumn.appendChild(createDiv(isHighlighted ? "bar-value bar-value-highlighted" : "bar-value", money(sales)));

    // The tallest bar fills 82% of the plot so its value label still fits above it
    const bar = createDiv(isHighlighted ? "bar bar-highlighted" : "bar");
    bar.style.height = (sales / highestSales) * 82 + "%";
    barColumn.appendChild(bar);

    const barDate = new Date(lastDate);
    barDate.setDate(lastDate.getDate() - (lastIndex - index));

    barPlot.appendChild(barColumn);
    barLabels.appendChild(createDiv("bar-label", WEEKDAYS[barDate.getDay()]));
  });
}


/*********************************************************************************
STOCK HEALTH
*********************************************************************************/
function renderStockHealth(data) {
  const donutChart = selectElement("#stock-donut");
  const stockLegend = clearElement("#stock-legend");
  if (!donutChart || !stockLegend) return;

  const totalItems = STOCK_ROWS.reduce((total, row) => total + data.stockHealth[row.key], 0);
  const gradientStops = [];
  let startPercentage = 0;

  STOCK_ROWS.forEach((row) => {
    const count = data.stockHealth[row.key];
    const legendRow = createDiv("legend-row");
    const legendDot = createDiv("legend-dot " + row.dotClass);

    legendRow.appendChild(legendDot);
    legendRow.appendChild(createDiv("legend-label", row.label));
    legendRow.appendChild(createDiv("legend-value", count));
    stockLegend.appendChild(legendRow);

    // The ring colors come from the legend dots, so the colors only live in the CSS file
    const dotColor = getComputedStyle(legendDot).backgroundColor;
    const endPercentage = startPercentage + (count / totalItems) * 100;
    gradientStops.push(`${dotColor} ${startPercentage}% ${endPercentage}%`);
    startPercentage = endPercentage;
  });

  fill("#stock-total", totalItems);
  donutChart.style.backgroundImage = `conic-gradient(${gradientStops.join(", ")})`;
}


/*********************************************************************************
TOP SELLERS
*********************************************************************************/
function renderTopSellers(data) {
  const topSellersList = clearElement("#top-sellers-list");
  if (!topSellersList) return;

  const mostSold = Math.max(...data.topSellers.map((entry) => entry.sold));

  data.topSellers.forEach((entry, index) => {
    const topSellerRow = createDiv("top-seller-row");

    topSellerRow.appendChild(createDiv("top-seller-rank", index + 1));
    topSellerRow.appendChild(createDiv("top-seller-name", entry.name));
    topSellerRow.appendChild(createProgressTrack((entry.sold / mostSold) * 100));
    topSellerRow.appendChild(createDiv("top-seller-sold", `${entry.sold} sold`));

    topSellersList.appendChild(topSellerRow);
  });
}


/*********************************************************************************
TODAY'S ORDERS
*********************************************************************************/
function renderTodaysOrders(data) {
  const ordersBody = clearElement("#todays-orders-body");
  if (!ordersBody) return;

  data.todaysOrders.forEach((order) => {
    const tableRow = createDiv("table-row");
    const statusCell = createDiv("cell-status");

    statusCell.appendChild(createDiv("status-pill " + (STATUS_CLASSES[order.status] || ""), order.status));

    tableRow.appendChild(createDiv("cell-order-number", order.number));
    tableRow.appendChild(createDiv("cell-time", order.time));
    tableRow.appendChild(createDiv("cell-items", order.items));
    tableRow.appendChild(createDiv("cell-total", money(order.total)));
    tableRow.appendChild(statusCell);

    ordersBody.appendChild(tableRow);
  });
}


/*********************************************************************************
ORDERS BY TYPE
*********************************************************************************/
function renderOrdersByType(data) {
  const orderTypesList = clearElement("#order-types-list");
  if (!orderTypesList) return;

  const mostOrders = Math.max(...data.ordersByType.map((entry) => entry.count));

  fill("#order-types-subtitle", `Today, ${data.statistics.orders} orders (sample data)`);

  data.ordersByType.forEach((entry) => {
    const orderTypeRow = createDiv("order-type-row");

    orderTypeRow.appendChild(createDiv("order-type-name", entry.type));
    orderTypeRow.appendChild(createProgressTrack((entry.count / mostOrders) * 100));
    orderTypeRow.appendChild(createDiv("order-type-count", entry.count));

    orderTypesList.appendChild(orderTypeRow);
  });
}


/*********************************************************************************
SHOW A DATE
*********************************************************************************/
function showDate(requestedKey) {
  const snapshotKey = findSnapshotKey(requestedKey);
  const data = DASHBOARD[snapshotKey];

  renderBanner(requestedKey);
  renderStatistics(data);
  renderSalesChart(snapshotKey, data);
  renderStockHealth(data);
  renderTopSellers(data);
  renderTodaysOrders(data);
  renderOrdersByType(data);
}

window.addEventListener("hashchange", () => {
  showDate(getRequestedDateKey());
});

showDate(getRequestedDateKey());