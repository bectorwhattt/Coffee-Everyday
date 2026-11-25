// Scoped to the main div so imported components are never affected
const mainContainer = document.querySelector(".main");

/*********************************************************************************
SAMPLE DATA (replace with real data later)
*********************************************************************************/
const COLOR = {
    dark: "var(--rp-dark)",
    terra: "var(--rp-terra)",
    pink: "var(--rp-pink)",
    green: "var(--rp-green)",
    red: "var(--rp-red)",
    slate: "var(--rp-slate)"
};

const kpiCards = [
    { label: "Total Profit", value: 158150, change: "+8.2% vs Oct", trend: "positive", color: COLOR.terra },
    { label: "Total Expenses", value: 87200, change: "+5.1% vs Oct", trend: "neutral", color: COLOR.pink },
    { label: "Total Loss (Adjustment)", value: 4490, change: "-12.4% vs Oct", trend: "positive", color: COLOR.red },
    { label: "Total Gain (Adjustment)", value: 2260, change: "+6.0% vs Oct", trend: "positive", color: COLOR.green }
];

const salesPeriods = {
    weekly: {
        unit: "week",
        labels: ["Nov 1\u20137", "Nov 8\u201314", "Nov 15\u201321", "Nov 22\u201325"],
        profit: [38200, 42700, 45900, 31350],
        expenses: [21400, 23100, 24800, 17900],
        loss: [1290, 980, 1500, 720],
        gain: [600, 450, 820, 390],
        profitMax: 50000, profitStep: 10000,
        adjustMax: 2000, adjustStep: 500
    },
    monthly: {
        unit: "month",
        labels: ["Jul", "Aug", "Sep", "Oct", "Nov"],
        profit: [121000, 134500, 142300, 146150, 158150],
        expenses: [70200, 76400, 81000, 82970, 87200],
        loss: [3900, 4600, 4100, 5100, 4490],
        gain: [1800, 2100, 2400, 2000, 2260],
        profitMax: 200000, profitStep: 50000,
        adjustMax: 6000, adjustStep: 2000
    }
};

// Each ranking tab has its own labels; rows are { name, qty, amount, profit }
const rankingData = {
    products: {
        noun: "products",
        total: 24,
        chartTitle: "Top 6 products",
        subtitle: "Sales amount vs profit \u00B7 \u20B1",
        cols: { name: "PRODUCT", qty: "QTY ORDERED", amount: "SALES AMOUNT", profit: "PROFIT" },
        legend: ["Sales Amount", "Profit"],
        rows: [
            { name: "Americano", qty: 520, amount: 78000, profit: 46800 },
            { name: "Spanish Latte", qty: 412, amount: 74160, profit: 40800 },
            { name: "Cafe Mocha", qty: 365, amount: 65700, profit: 35100 },
            { name: "Caramel Macchiato", qty: 340, amount: 61200, profit: 32900 },
            { name: "Matcha Latte", qty: 290, amount: 55100, profit: 29200 },
            { name: "Java Chip Frappe", qty: 255, amount: 48450, profit: 25600 },
            { name: "Iced Matcha", qty: 230, amount: 41400, profit: 22100 },
            { name: "Salted Caramel", qty: 210, amount: 37800, profit: 20300 },
            { name: "Cold Brew", qty: 180, amount: 27000, profit: 15100 },
            { name: "Fudge Brownie", qty: 195, amount: 18525, profit: 9800 }
        ]
    },
    categories: {
        noun: "categories",
        chartTitle: "Top categories",
        subtitle: "Sales amount vs profit \u00B7 \u20B1",
        cols: { name: "CATEGORY", qty: "QTY ORDERED", amount: "SALES AMOUNT", profit: "PROFIT" },
        legend: ["Sales Amount", "Profit"],
        rows: [
            { name: "Hot Coffee", qty: 980, amount: 142300, profit: 78100 },
            { name: "Iced Coffee", qty: 760, amount: 118900, profit: 64200 },
            { name: "Non-Coffee", qty: 540, amount: 74300, profit: 38500 },
            { name: "Pastries", qty: 410, amount: 41800, profit: 21900 },
            { name: "Add-ons", qty: 300, amount: 12600, profit: 9100 }
        ]
    },
    purchased: {
        noun: "items",
        chartTitle: "Top purchased items",
        subtitle: "Amount spent vs value used \u00B7 \u20B1",
        cols: { name: "ITEM", qty: "QTY PURCHASED", amount: "AMOUNT SPENT", profit: "VALUE USED" },
        legend: ["Amount Spent", "Value Used"],
        rows: [
            { name: "Arabica Beans", qty: 120, amount: 54000, profit: 48200 },
            { name: "Fresh Milk", qty: 480, amount: 36000, profit: 33500 },
            { name: "Matcha Powder", qty: 40, amount: 28000, profit: 21000 },
            { name: "Caramel Syrup", qty: 60, amount: 19800, profit: 15600 },
            { name: "Paper Cups", qty: 3000, amount: 15000, profit: 12400 }
        ]
    },
    suppliers: {
        noun: "suppliers",
        chartTitle: "Top suppliers",
        subtitle: "Amount spent vs amount paid \u00B7 \u20B1",
        cols: { name: "SUPPLIER", qty: "ORDERS", amount: "AMOUNT SPENT", profit: "AMOUNT PAID" },
        legend: ["Amount Spent", "Amount Paid"],
        rows: [
            { name: "Bean Source Co.", qty: 8, amount: 66000, profit: 66000 },
            { name: "Dairy Fresh", qty: 12, amount: 41500, profit: 38000 },
            { name: "Matcha House", qty: 5, amount: 32000, profit: 28000 },
            { name: "Pack & Co.", qty: 6, amount: 24500, profit: 24500 },
            { name: "Syrup Lab", qty: 4, amount: 19800, profit: 15000 }
        ]
    }
};

const paymentMethods = [
    { name: "Cash", amount: 112860, color: COLOR.dark },
    { name: "GCash", amount: 93230, color: COLOR.terra },
    { name: "Maya", amount: 24540, color: COLOR.pink },
    { name: "Card", amount: 14720, color: COLOR.slate }
];

// Orders per hour, starting at startHour (24h clock)
const ordersByHour = {
    startHour: 7,
    values: [18, 34, 52, 71, 64, 58, 47, 39, 44, 51, 60, 55, 38, 24, 12]
};

const ordersByDay = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    values: [136, 126, 131, 149, 187, 228, 204]
};

const RANKING_VISIBLE_ROWS = 6;


/*********************************************************************************
HELPERS
*********************************************************************************/
function createEl(tag, className, text) {
    const element = document.createElement(tag);
    if (className) {
        element.className = className;
    }
    if (text !== undefined) {
        element.textContent = text;
    }
    return element;
}

function createDiv(className, text) {
    return createEl("div", className, text);
}

function formatCurrency(value) {
    return "\u20B1" + value.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

// 1300 -> "1.3k", 50000 -> "50k", 980 -> "980"
function formatCompact(value) {
    if (value >= 1000) {
        return (value / 1000).toFixed(1).replace(/\.0$/, "") + "k";
    }
    return String(value);
}

// Wires up a group of buttons where exactly one is active
function bindToggleGroup(container, buttonSelector, dataKey, onChange) {
    container.addEventListener("click", function (event) {
        const button = event.target.closest(buttonSelector);
        if (!button || !container.contains(button)) return;

        container.querySelectorAll(buttonSelector).forEach(function (item) {
            item.classList.toggle("active", item === button);
        });
        onChange(button.dataset[dataKey]);
    });
}

function renderLegend(container, items) {
    container.textContent = "";
    items.forEach(function (item) {
        const legendItem = createDiv("legend-item");
        const dot = createDiv("legend-dot");
        dot.style.backgroundColor = item.color;

        legendItem.appendChild(dot);
        legendItem.appendChild(createEl("span", "", item.label));
        container.appendChild(legendItem);
    });
}

// Column chart with y-axis, gridlines and optional value labels.
// groups: [{ label, values: [one value per series] }]
function renderColumnChart(container, options) {
    container.textContent = "";

    const yAxis = createDiv("col-y");
    const plot = createDiv("col-plot");
    const groupsRow = createDiv("col-groups");
    const labelsRow = createDiv("col-x");

    for (let tick = 0; tick <= options.max; tick += options.step) {
        const position = (tick / options.max) * 100 + "%";

        const tickLabel = createDiv("col-tick", formatCompact(tick));
        tickLabel.style.bottom = position;
        yAxis.appendChild(tickLabel);

        const gridLine = createDiv("col-grid");
        gridLine.style.bottom = position;
        plot.appendChild(gridLine);
    }

    options.groups.forEach(function (group, groupIndex) {
        const groupElement = createDiv("col-group");
        const isPeak = options.peakIndex === groupIndex;

        group.values.forEach(function (value, seriesIndex) {
            const column = createDiv("col");
            column.style.height = (value / options.max) * 100 + "%";
            column.style.flexBasis = options.barWidth + "px";
            column.style.backgroundColor = isPeak ? COLOR.dark : options.colors[seriesIndex];
            column.title = group.label + ": " + value.toLocaleString("en-US");

            if (isPeak) {
                column.classList.add("is-peak");
            }
            if (options.valueMode === "all" || (options.valueMode === "peak" && isPeak)) {
                column.appendChild(createDiv("col-value", formatCompact(value)));
            }

            groupElement.appendChild(column);
        });

        groupsRow.appendChild(groupElement);
        labelsRow.appendChild(createDiv("col-x-label", group.label));
    });

    plot.appendChild(groupsRow);
    container.appendChild(yAxis);
    container.appendChild(plot);
    container.appendChild(labelsRow);
}

function indexOfMax(values) {
    return values.indexOf(Math.max.apply(null, values));
}


/*********************************************************************************
TOOLBAR (period tabs + date range)
*********************************************************************************/
function formatShortDate(date) {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getRangeLabel(period) {
    const today = new Date();
    const year = today.getFullYear();

    if (period === "today") {
        return formatShortDate(today) + ", " + year;
    }

    let start;
    if (period === "week") {
        // Week starts on Monday
        start = new Date(today);
        start.setDate(today.getDate() - ((today.getDay() + 6) % 7));
    } else {
        start = new Date(year, today.getMonth(), 1);
    }
    return formatShortDate(start) + " \u2013 " + formatShortDate(today) + ", " + year;
}

function setRangeLabel(label) {
    mainContainer.querySelectorAll(".js-range").forEach(function (element) {
        element.textContent = label;
    });
}

// Sample data does not change per period yet; hook your data fetch in here
bindToggleGroup(mainContainer.querySelector("#period-tabs"), ".period-tab", "period", function (period) {
    // "Custom" keeps the current label until a date picker is added
    if (period !== "custom") {
        setRangeLabel(getRangeLabel(period));
    }
});

setRangeLabel(getRangeLabel("month"));


/*********************************************************************************
SALES ANALYSIS
*********************************************************************************/
function renderKpis() {
    const kpiRow = mainContainer.querySelector("#kpi-row");
    kpiRow.textContent = "";

    kpiCards.forEach(function (card) {
        const kpiCard = createDiv("kpi-card");
        const label = createDiv("kpi-label");
        const dot = createDiv("kpi-dot");
        dot.style.backgroundColor = card.color;

        label.appendChild(dot);
        label.appendChild(createEl("span", "", card.label));

        kpiCard.appendChild(label);
        kpiCard.appendChild(createDiv("kpi-value", formatCurrency(card.value)));
        kpiCard.appendChild(createDiv("kpi-change " + card.trend, card.change));

        kpiRow.appendChild(kpiCard);
    });
}

function renderBreakdownTable(period) {
    const table = mainContainer.querySelector("#breakdown-table");
    table.textContent = "";

    const header = createDiv("grid-row head");
    [capitalize(period.unit), "PROFIT", "EXPENSES", "LOSS", "GAIN"].forEach(function (heading, index) {
        header.appendChild(createDiv(index === 0 ? "" : "num", index === 0 ? heading.toUpperCase() : heading));
    });
    table.appendChild(header);

    period.labels.forEach(function (label, index) {
        const row = createDiv("grid-row");
        row.appendChild(createDiv("", label));
        [period.profit, period.expenses, period.loss, period.gain].forEach(function (series) {
            row.appendChild(createDiv("num", formatCurrency(series[index])));
        });
        table.appendChild(row);
    });
}

function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

function renderSalesAnalysis(periodKey) {
    const period = salesPeriods[periodKey];

    mainContainer.querySelector("#profit-subtitle").textContent = "Per " + period.unit + " \u00B7 \u20B1";
    mainContainer.querySelector("#adjust-subtitle").textContent = "Loss vs Gain per " + period.unit + " \u00B7 \u20B1";
    mainContainer.querySelector("#breakdown-label").textContent = "View " + periodKey + " breakdown table";

    renderLegend(mainContainer.querySelector("#profit-legend"), [
        { label: "Profit", color: COLOR.terra },
        { label: "Expenses", color: COLOR.pink }
    ]);
    renderLegend(mainContainer.querySelector("#adjust-legend"), [
        { label: "Loss", color: COLOR.red },
        { label: "Gain", color: COLOR.green }
    ]);

    renderColumnChart(mainContainer.querySelector("#profit-chart"), {
        groups: period.labels.map(function (label, index) {
            return { label: label, values: [period.profit[index], period.expenses[index]] };
        }),
        colors: [COLOR.terra, COLOR.pink],
        max: period.profitMax,
        step: period.profitStep,
        barWidth: 36,
        valueMode: "all"
    });

    renderColumnChart(mainContainer.querySelector("#adjust-chart"), {
        groups: period.labels.map(function (label, index) {
            return { label: label, values: [period.loss[index], period.gain[index]] };
        }),
        colors: [COLOR.red, COLOR.green],
        max: period.adjustMax,
        step: period.adjustStep,
        barWidth: 22,
        valueMode: "all"
    });

    renderBreakdownTable(period);
}

bindToggleGroup(mainContainer.querySelector("#sales-granularity"), ".seg-btn", "value", renderSalesAnalysis);


/*********************************************************************************
RANKINGS
*********************************************************************************/
const rankingState = { tab: "products", sort: "amount", expanded: false };

function getSortedRankingRows() {
    return rankingData[rankingState.tab].rows.slice().sort(function (a, b) {
        return b[rankingState.sort] - a[rankingState.sort];
    });
}

function renderRankingBars(dataset, topRows) {
    const list = mainContainer.querySelector("#ranking-bars");
    list.textContent = "";

    const maxValue = Math.max.apply(null, topRows.map(function (row) {
        return Math.max(row.amount, row.profit);
    }));

    topRows.forEach(function (row) {
        const barRow = createDiv("hbar-row");
        const bars = createDiv("hbar-bars");

        [["amount", COLOR.dark], ["profit", COLOR.terra]].forEach(function (metric) {
            const line = createDiv("hbar-line");
            const bar = createDiv("hbar");
            // Leave room at the end of the track for the value label
            bar.style.width = (row[metric[0]] / maxValue) * 84 + "%";
            bar.style.backgroundColor = metric[1];

            line.appendChild(bar);
            line.appendChild(createDiv("hbar-value", formatCurrency(row[metric[0]])));
            bars.appendChild(line);
        });

        barRow.appendChild(createDiv("hbar-name", row.name));
        barRow.appendChild(bars);
        list.appendChild(barRow);
    });
}

function renderRankingTable(dataset, rows) {
    const table = mainContainer.querySelector("#ranking-table");
    table.textContent = "";

    const header = createDiv("grid-row head");
    header.appendChild(createDiv("", "#"));
    header.appendChild(createDiv("", dataset.cols.name));
    header.appendChild(createDiv("num cell-qty", dataset.cols.qty));

    ["amount", "profit"].forEach(function (key) {
        const cell = createDiv("num" + (rankingState.sort === key ? " is-sorted" : ""), dataset.cols[key]);
        if (rankingState.sort === key) {
            cell.appendChild(createEl("span", "chev"));
        }
        header.appendChild(cell);
    });
    table.appendChild(header);

    const visibleRows = rankingState.expanded ? rows : rows.slice(0, RANKING_VISIBLE_ROWS);

    visibleRows.forEach(function (row, index) {
        const tableRow = createDiv("grid-row" + (index < 3 ? " top" : ""));

        tableRow.appendChild(createDiv("rank-no", index + 1));
        tableRow.appendChild(createDiv("", row.name));
        tableRow.appendChild(createDiv("num cell-qty", row.qty.toLocaleString("en-US")));
        tableRow.appendChild(createDiv("num strong", formatCurrency(row.amount)));
        tableRow.appendChild(createDiv("num", formatCurrency(row.profit)));

        table.appendChild(tableRow);
    });

    if (rows.length > RANKING_VISIBLE_ROWS) {
        const total = dataset.total || rows.length;
        const moreButton = createEl("button", "rank-more");
        moreButton.type = "button";
        moreButton.setAttribute("aria-expanded", String(rankingState.expanded));
        moreButton.appendChild(createEl("span", "", rankingState.expanded ? "Show less" : "Show all " + total + " " + dataset.noun));
        moreButton.appendChild(createEl("span", "chev"));

        moreButton.addEventListener("click", function () {
            rankingState.expanded = !rankingState.expanded;
            renderRankings();
        });
        table.appendChild(moreButton);
    }
}

function renderRankings() {
    const dataset = rankingData[rankingState.tab];
    const rows = getSortedRankingRows();
    const topRows = rows.slice(0, RANKING_VISIBLE_ROWS);

    mainContainer.querySelector("#ranking-chart-title").textContent =
        dataset.chartTitle.replace("Top 6", "Top " + topRows.length);
    mainContainer.querySelector("#ranking-chart-subtitle").textContent = dataset.subtitle;

    renderLegend(mainContainer.querySelector("#ranking-legend"), [
        { label: dataset.legend[0], color: COLOR.dark },
        { label: dataset.legend[1], color: COLOR.terra }
    ]);

    renderRankingBars(dataset, topRows);
    renderRankingTable(dataset, rows);
}

bindToggleGroup(mainContainer.querySelector("#ranking-tabs"), ".ranking-tab", "tab", function (tab) {
    rankingState.tab = tab;
    rankingState.expanded = false;
    renderRankings();
});

bindToggleGroup(mainContainer.querySelector("#ranking-sort"), ".seg-btn", "value", function (sort) {
    rankingState.sort = sort;
    renderRankings();
});


/*********************************************************************************
PAYMENT METHOD BREAKDOWN
*********************************************************************************/
function renderPayments() {
    const total = paymentMethods.reduce(function (sum, method) {
        return sum + method.amount;
    }, 0);

    // Build the donut as a conic-gradient, one stop pair per method
    let progress = 0;
    const stops = paymentMethods.map(function (method) {
        const start = progress;
        progress += (method.amount / total) * 100;
        return method.color + " " + start + "% " + progress + "%";
    });

    mainContainer.querySelector("#payment-donut").style.background = "conic-gradient(" + stops.join(", ") + ")";
    mainContainer.querySelector("#payment-total").textContent = formatCurrency(total);

    const list = mainContainer.querySelector("#payment-list");
    list.textContent = "";

    paymentMethods.forEach(function (method) {
        const row = createDiv("payment-row");
        const dot = createDiv("payment-dot");
        dot.style.backgroundColor = method.color;

        row.appendChild(dot);
        row.appendChild(createDiv("payment-name", method.name));
        row.appendChild(createDiv("payment-amount", formatCurrency(method.amount)));
        row.appendChild(createDiv("payment-percent", ((method.amount / total) * 100).toFixed(1) + "%"));

        list.appendChild(row);
    });
}


/*********************************************************************************
PEAK HOURS & DAYS
*********************************************************************************/
// 7 -> "7a", 13 -> "1p"
function formatHourLabel(hour) {
    return ((hour % 12) || 12) + (hour >= 12 ? "p" : "a");
}

// 10 -> "10\u201311 AM", 11 -> "11 AM\u201312 PM"
function formatHourRange(hour) {
    const end = hour + 1;
    const startSuffix = hour >= 12 ? "PM" : "AM";
    const endSuffix = end >= 12 && end < 24 ? "PM" : "AM";
    const startText = (hour % 12) || 12;
    const endText = (end % 12) || 12;

    if (startSuffix === endSuffix) {
        return startText + "\u2013" + endText + " " + startSuffix;
    }
    return startText + " " + startSuffix + "\u2013" + endText + " " + endSuffix;
}

function renderPeakCharts() {
    const hourPeak = indexOfMax(ordersByHour.values);
    mainContainer.querySelector("#hour-peak").textContent =
        "Peak: " + formatHourRange(ordersByHour.startHour + hourPeak);

    renderColumnChart(mainContainer.querySelector("#hour-chart"), {
        groups: ordersByHour.values.map(function (value, index) {
            return { label: formatHourLabel(ordersByHour.startHour + index), values: [value] };
        }),
        colors: [COLOR.pink],
        max: 80,
        step: 40,
        barWidth: 22,
        valueMode: "peak",
        peakIndex: hourPeak
    });

    const dayPeak = indexOfMax(ordersByDay.values);
    mainContainer.querySelector("#day-peak").textContent = "Peak: " + [
        "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
    ][dayPeak];

    renderColumnChart(mainContainer.querySelector("#day-chart"), {
        groups: ordersByDay.labels.map(function (label, index) {
            return { label: label, values: [ordersByDay.values[index]] };
        }),
        colors: [COLOR.pink],
        max: 250,
        step: 100,
        barWidth: 36,
        valueMode: "all",
        peakIndex: dayPeak
    });
}


/*********************************************************************************
EXPORT (downloads the current ranking table as CSV)
*********************************************************************************/
mainContainer.querySelector("#export-btn").addEventListener("click", function () {
    const dataset = rankingData[rankingState.tab];
    const lines = [[dataset.cols.name, dataset.cols.qty, dataset.cols.amount, dataset.cols.profit]];

    getSortedRankingRows().forEach(function (row) {
        lines.push([row.name, row.qty, row.amount, row.profit]);
    });

    const csv = lines.map(function (line) {
        return line.map(function (cell) {
            return '"' + String(cell).replace(/"/g, '""') + '"';
        }).join(",");
    }).join("\n");

    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    link.download = "report-" + rankingState.tab + ".csv";
    link.click();
    URL.revokeObjectURL(link.href);
});


/*********************************************************************************
INITIAL RENDER
*********************************************************************************/
renderKpis();
renderSalesAnalysis("weekly");
renderRankings();
renderPayments();
renderPeakCharts();


/*********************************************************************************
HAMBURGER MENU (SIDEBAR DRAWER)
*********************************************************************************/
// Header and sidebar live outside .main, so these use document, not mainContainer
(function () {
    const menuButton = document.querySelector(".menu-btn");
    const overlay = document.querySelector(".nav-overlay");
    const desktopQuery = window.matchMedia("(min-width: 1025px)");

    if (!menuButton || !overlay) return;

    function setNavOpen(isOpen) {
        document.body.classList.toggle("nav-open", isOpen);
        menuButton.setAttribute("aria-expanded", String(isOpen));
    }

    menuButton.addEventListener("click", function () {
        setNavOpen(!document.body.classList.contains("nav-open"));
    });

    overlay.addEventListener("click", function () {
        setNavOpen(false);
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") setNavOpen(false);
    });

    // Close the drawer when the window grows back to desktop
    desktopQuery.addEventListener("change", function (event) {
        if (event.matches) setNavOpen(false);
    });
})();