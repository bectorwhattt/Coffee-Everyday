const mainContainer = document.querySelector(".main");
const filterTabs = mainContainer.querySelectorAll(".filter-tab");
const orderRows = mainContainer.querySelectorAll(".order-row");

// expand/collapse an order's details
orderRows.forEach(function (orderRow) {
    const orderToggle = orderRow.querySelector(".order-toggle");

    orderToggle.addEventListener("click", function () {
        const isExpanded = orderRow.classList.toggle("expanded");
        orderToggle.setAttribute("aria-expanded", isExpanded);
    });
});

// filter orders by status
filterTabs.forEach(function (filterTab) {
    filterTab.addEventListener("click", function () {
        const selectedFilter = filterTab.dataset.filter;

        filterTabs.forEach(function (tab) {
            tab.classList.remove("active");
        });
        filterTab.classList.add("active");

        orderRows.forEach(function (orderRow) {
            const matchesFilter = selectedFilter === "all" || orderRow.dataset.status === selectedFilter;
            orderRow.style.display = matchesFilter ? "" : "none";
        });
    });
});
