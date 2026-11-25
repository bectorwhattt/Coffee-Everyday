const mainContainer = document.querySelector(".main");

const openPanelButton = mainContainer.querySelector("#open-panel-button");
const closePanelButton = mainContainer.querySelector("#close-panel-button");
const panelOverlay = mainContainer.querySelector("#panel-overlay");
const panel = mainContainer.querySelector("#category-panel");
const panelTitle = mainContainer.querySelector("#panel-title");
const panelSubtitle = mainContainer.querySelector("#panel-subtitle");

const filterTabs = mainContainer.querySelectorAll(".filter-tab");
const categoryCountHeader = mainContainer.querySelector("#category-count-header");
const categoriesBody = mainContainer.querySelector("#categories-body");

const categoryNameInput = mainContainer.querySelector("#category-name-input");
const categoryForSelect = mainContainer.querySelector("#category-for-select");

const deleteCategoryButton = mainContainer.querySelector("#delete-category-button");
const cancelCategoryButton = mainContainer.querySelector("#cancel-category-button");
const saveCategoryButton = mainContainer.querySelector("#save-category-button");

const editIcon =
    '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M12 20h9"></path>' +
    '<path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>' +
    "</svg>";

// Sample data only, replace with real data later.
// "type" is what the category is for ("items" or "recipes"), "count" is how many of them use it.
let categories = [
    { id: 1, name: "Coffee, Frappe, & Tea", type: "items", count: 1 },
    { id: 2, name: "Syrups, Sauces, & Sweeteners", type: "items", count: 1 },
    { id: 3, name: "Cooking Oils, Culinary Sauces & Seasonings", type: "items", count: 1 },
    { id: 4, name: "Espresso Drinks", type: "recipes", count: 5 },
    { id: 5, name: "Frappes", type: "recipes", count: 3 },
    { id: 6, name: "Pastries", type: "recipes", count: 2 }
];

const FILTER_LABELS = { items: "Items", recipes: "Recipes" };

// Which filter pill is selected, and which panel mode is used ("add" or "edit")
let activeFilter = "items";
let formMode = "add";
let editingCategoryId = null;


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

function getNextCategoryId() {
    return categories.reduce(function (highest, category) {
        return Math.max(highest, category.id);
    }, 0) + 1;
}


/*********************************************************************************
PANEL
*********************************************************************************/
function openPanel() {
    panel.classList.add("open");
    panel.classList.toggle("editing", formMode === "edit");
    panelOverlay.classList.add("open");
    panel.setAttribute("aria-hidden", "false");

    panelTitle.textContent = formMode === "edit" ? "Edit category" : "Add category";
    panelSubtitle.textContent = formMode === "edit"
        ? "Update the details of this category."
        : "Add a new category for items or recipes.";

    clearInvalid(categoryNameInput);

    // A hidden panel can't take focus yet, so wait for the slide-in to start
    window.setTimeout(function () {
        categoryNameInput.focus({ preventScroll: true });
    }, 50);
}

function closePanel() {
    panel.classList.remove("open", "editing");
    panelOverlay.classList.remove("open");
    panel.setAttribute("aria-hidden", "true");

    formMode = "add";
    editingCategoryId = null;
    clearInvalid(categoryNameInput);
}

function openAddPanel() {
    formMode = "add";
    editingCategoryId = null;

    categoryNameInput.value = "";
    categoryForSelect.value = activeFilter;

    openPanel();
}

function openEditPanel(category) {
    formMode = "edit";
    editingCategoryId = category.id;

    categoryNameInput.value = category.name;
    categoryForSelect.value = category.type;

    openPanel();
}

openPanelButton.addEventListener("click", openAddPanel);
closePanelButton.addEventListener("click", closePanel);
cancelCategoryButton.addEventListener("click", closePanel);
panelOverlay.addEventListener("click", closePanel);

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closePanel();
    }
});


/*********************************************************************************
CATEGORIES TABLE
*********************************************************************************/
function createCategoryRow(category) {
    const row = createDiv("category-row");
    const actionCell = createDiv("cell-action");
    const editButton = document.createElement("button");

    editButton.className = "edit-button";
    editButton.type = "button";
    editButton.setAttribute("aria-label", "Edit " + category.name);
    editButton.innerHTML = editIcon;
    editButton.addEventListener("click", function () {
        openEditPanel(category);
    });

    actionCell.appendChild(editButton);

    row.appendChild(createDiv("cell-category-name", category.name));
    row.appendChild(createDiv("cell-category-count", category.count));
    row.appendChild(actionCell);

    return row;
}

function updateFilterCounts() {
    filterTabs.forEach(function (filterTab) {
        const filterKey = filterTab.dataset.filter;
        const count = categories.filter(function (category) {
            return category.type === filterKey;
        }).length;

        filterTab.textContent = FILTER_LABELS[filterKey] + " (" + count + ")";
        filterTab.classList.toggle("active", filterKey === activeFilter);
    });
}

function renderCategories() {
    categoriesBody.innerHTML = "";
    categoryCountHeader.textContent = FILTER_LABELS[activeFilter];

    const visibleCategories = categories.filter(function (category) {
        return category.type === activeFilter;
    });

    if (visibleCategories.length === 0) {
        categoriesBody.appendChild(createDiv("categories-empty", "No categories yet"));
    }

    visibleCategories.forEach(function (category) {
        categoriesBody.appendChild(createCategoryRow(category));
    });

    updateFilterCounts();
}

// Switch between item categories and recipe categories
filterTabs.forEach(function (filterTab) {
    filterTab.addEventListener("click", function () {
        activeFilter = filterTab.dataset.filter;
        renderCategories();
    });
});


/*********************************************************************************
SAVE / DELETE CATEGORY
*********************************************************************************/
function isDuplicateName(name, type) {
    return categories.some(function (category) {
        return category.id !== editingCategoryId
            && category.type === type
            && category.name.toLowerCase() === name.toLowerCase();
    });
}

function saveCategory() {
    const name = categoryNameInput.value.trim();
    const type = categoryForSelect.value;

    if (name === "" || isDuplicateName(name, type)) {
        flagInvalid(categoryNameInput);
        return;
    }

    if (formMode === "edit") {
        const category = categories.find(function (current) {
            return current.id === editingCategoryId;
        });

        category.name = name;
        category.type = type;
    } else {
        categories.push({ id: getNextCategoryId(), name: name, type: type, count: 0 });
    }

    // Jump to the tab of the saved category so it is visible right away
    activeFilter = type;

    closePanel();
    renderCategories();
}

function deleteCategory() {
    const category = categories.find(function (current) {
        return current.id === editingCategoryId;
    });

    if (!category) {
        return;
    }

    const usageNote = category.count > 0
        ? " It is used by " + category.count + " " + category.type + "."
        : "";

    if (!window.confirm("Delete \"" + category.name + "\"?" + usageNote)) {
        return;
    }

    categories = categories.filter(function (current) {
        return current.id !== category.id;
    });

    closePanel();
    renderCategories();
}

saveCategoryButton.addEventListener("click", saveCategory);
deleteCategoryButton.addEventListener("click", deleteCategory);

// Save with Enter while typing the name
categoryNameInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        saveCategory();
    }
});

// Remove the warning outline as soon as the person fixes the field
categoryNameInput.addEventListener("input", function () {
    clearInvalid(categoryNameInput);
});

renderCategories();


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