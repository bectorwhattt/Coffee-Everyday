const mainContainer = document.querySelector(".main");

const adjustmentsCard = mainContainer.querySelector(".adjustments-card");

const adjustmentForm = mainContainer.querySelector("#adjustment-form");
const itemSelect = mainContainer.querySelector("#item-select");
const typeSelect = mainContainer.querySelector("#type-select");
const quantityInput = mainContainer.querySelector("#quantity-input");
const unitSelect = mainContainer.querySelector("#unit-select");
const reasonSelect = mainContainer.querySelector("#reason-select");
const cancelAdjustmentButton = mainContainer.querySelector("#cancel-adjustment-button");
const saveAdjustmentButton = mainContainer.querySelector("#save-adjustment-button");

const openAddAdjustmentButton = mainContainer.querySelector("#open-add-adjustment-button");
const adjustmentsBody = mainContainer.querySelector("#adjustments-body");

// Sample data only, replace with real data later. Newest adjustments are listed first.
let adjustments = [
    { id: 2, date: "2026-11-19", item: "Coffee Beans", type: "Stock in", quantity: 1, unit: "kg", reason: "Audit Gain" },
    { id: 1, date: "2026-11-18", item: "Powdered Sugar", type: "Stock out", quantity: 3, unit: "Packets", reason: "Spilled/Damaged" }
];

// The reasons that can be picked depend on the type of adjustment
const REASONS = {
    "Stock in": ["Audit Gain", "System Restock"],
    "Stock out": ["Audit Loss", "Spoilage/Expired", "Spilled/Damaged", "Order/Error", "Staff Meal"]
};

const TYPE_CLASSES = { "Stock in": "status-stock-in", "Stock out": "status-stock-out" };


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

function formatLongDate(dateKey) {
    return fromDateKey(dateKey).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function getNextAdjustmentId() {
    return adjustments.reduce(function (highest, adjustment) {
        return Math.max(highest, adjustment.id);
    }, 0) + 1;
}

function createOption(value, label, isPlaceholder) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;

    if (isPlaceholder) {
        option.disabled = true;
        option.selected = true;
    }

    return option;
}


/*********************************************************************************
ADJUSTMENTS TABLE
*********************************************************************************/
function createAdjustmentRow(adjustment) {
    const row = createDiv("adjustment-row");
    const typeCell = createDiv("cell-type");

    typeCell.appendChild(createDiv("status-pill " + (TYPE_CLASSES[adjustment.type] || ""), adjustment.type));

    row.appendChild(createDiv("cell-date", formatLongDate(adjustment.date)));
    row.appendChild(createDiv("cell-item", adjustment.item));
    row.appendChild(typeCell);
    row.appendChild(createDiv("cell-quantity", adjustment.quantity));
    row.appendChild(createDiv("cell-unit", adjustment.unit));
    row.appendChild(createDiv("cell-reason", adjustment.reason));

    return row;
}

function renderAdjustments() {
    adjustmentsBody.innerHTML = "";

    if (adjustments.length === 0) {
        adjustmentsBody.appendChild(createDiv("adjustments-empty", "No adjustments yet"));
    }

    adjustments.forEach(function (adjustment) {
        adjustmentsBody.appendChild(createAdjustmentRow(adjustment));
    });
}


/*********************************************************************************
ADJUSTMENT FORM (ADD ONLY)
*********************************************************************************/
// Fill the reason dropdown with the reasons of the chosen type, locked until a type is picked
function renderReasonOptions() {
    const reasons = REASONS[typeSelect.value] || [];

    reasonSelect.innerHTML = "";
    reasonSelect.appendChild(createOption("", "Reason", true));

    reasons.forEach(function (reason) {
        reasonSelect.appendChild(createOption(reason, reason, false));
    });

    reasonSelect.disabled = reasons.length === 0;
}

function resetAdjustmentForm() {
    itemSelect.selectedIndex = 0;
    typeSelect.selectedIndex = 0;
    quantityInput.value = "";
    unitSelect.selectedIndex = 0;

    renderReasonOptions();

    [itemSelect, typeSelect, quantityInput, reasonSelect].forEach(clearInvalid);
}

function openAddForm() {
    resetAdjustmentForm();

    adjustmentForm.classList.add("open");
    adjustmentsCard.classList.add("form-open");

    itemSelect.focus();
}

function closeForm() {
    adjustmentForm.classList.remove("open");
    adjustmentsCard.classList.remove("form-open");

    resetAdjustmentForm();
}

function saveAdjustment() {
    const quantity = Number(quantityInput.value);
    let isValid = true;

    if (!itemSelect.value) {
        flagInvalid(itemSelect);
        isValid = false;
    }

    if (!typeSelect.value) {
        flagInvalid(typeSelect);
        isValid = false;
    }

    if (!(quantity > 0)) {
        flagInvalid(quantityInput);
        isValid = false;
    }

    if (!reasonSelect.value) {
        flagInvalid(reasonSelect);
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    adjustments.unshift({
        id: getNextAdjustmentId(),
        date: toDateKey(new Date()),
        item: itemSelect.value,
        type: typeSelect.value,
        quantity: quantity,
        unit: unitSelect.value,
        reason: reasonSelect.value
    });

    closeForm();
    renderAdjustments();
}

// Changing the type changes which reasons are available
typeSelect.addEventListener("change", renderReasonOptions);

openAddAdjustmentButton.addEventListener("click", openAddForm);
cancelAdjustmentButton.addEventListener("click", closeForm);
saveAdjustmentButton.addEventListener("click", saveAdjustment);

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closeForm();
    }
});

// Remove the warning outline as soon as the person fixes a field
[itemSelect, typeSelect, quantityInput, reasonSelect].forEach(function (field) {
    field.addEventListener("input", function () {
        clearInvalid(field);
    });
});

renderAdjustments();


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
