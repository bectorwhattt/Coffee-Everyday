const mainContainer = document.querySelector(".main");

const categoriesCard = mainContainer.querySelector(".categories-card");

const categoryForm = mainContainer.querySelector("#category-form");
const categoryFormTitle = mainContainer.querySelector("#category-form-title");
const deleteCategoryButton = mainContainer.querySelector("#delete-category-button");
const categoryNameInput = mainContainer.querySelector("#category-name-input");
const categoryForSelect = mainContainer.querySelector("#category-for-select");
const cancelCategoryButton = mainContainer.querySelector("#cancel-category-button");
const saveCategoryButton = mainContainer.querySelector("#save-category-button");

const filterTabs = mainContainer.querySelectorAll(".filter-tab");
const openAddCategoryButton = mainContainer.querySelector("#open-add-category-button");

const categoryCountHeader = mainContainer.querySelector("#category-count-header");
const categoriesBody = mainContainer.querySelector("#categories-body");

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

// Which filter pill is selected, and which form mode is open ("closed", "add" or "edit")
let activeFilter = "items";
let formMode = "closed";
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
FILTER TABS
*********************************************************************************/
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

// Switch between item categories and recipe categories
filterTabs.forEach(function (filterTab) {
    filterTab.addEventListener("click", function () {
        activeFilter = filterTab.dataset.filter;
        closeForm();
    });
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
    editButton.classList.toggle("active", formMode === "edit" && editingCategoryId === category.id);

    // Clicking the edit button of the category being edited closes the form
    editButton.addEventListener("click", function () {
        if (formMode === "edit" && editingCategoryId === category.id) {
            closeForm();
        } else {
            openEditForm(category);
        }
    });

    actionCell.appendChild(editButton);

    row.appendChild(createDiv("cell-category-name", category.name));
    row.appendChild(createDiv("cell-category-count", category.count));
    row.appendChild(actionCell);

    return row;
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


/*********************************************************************************
CATEGORY FORM (ADD / EDIT)
*********************************************************************************/
function showForm() {
    categoryForm.classList.add("open");
    categoryForm.classList.toggle("editing", formMode === "edit");
    categoriesCard.classList.add("form-open");
    categoryFormTitle.textContent = formMode === "edit" ? "Edit category" : "Add category";

    clearInvalid(categoryNameInput);
    renderCategories();
    categoryNameInput.focus();
}

function openAddForm() {
    formMode = "add";
    editingCategoryId = null;

    categoryNameInput.value = "";
    categoryForSelect.value = activeFilter;

    showForm();
}

function openEditForm(category) {
    formMode = "edit";
    editingCategoryId = category.id;

    categoryNameInput.value = category.name;
    categoryForSelect.value = category.type;

    showForm();
}

function closeForm() {
    formMode = "closed";
    editingCategoryId = null;

    categoryForm.classList.remove("open", "editing");
    categoriesCard.classList.remove("form-open");

    clearInvalid(categoryNameInput);
    renderCategories();
}

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

    closeForm();
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
        return current.id !== editingCategoryId;
    });

    closeForm();
}

openAddCategoryButton.addEventListener("click", openAddForm);
cancelCategoryButton.addEventListener("click", closeForm);
saveCategoryButton.addEventListener("click", saveCategory);
deleteCategoryButton.addEventListener("click", deleteCategory);

// Save with Enter while typing the name
categoryNameInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        saveCategory();
    }
});

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && formMode !== "closed") {
        closeForm();
    }
});

// Remove the warning outline as soon as the person fixes the field
categoryNameInput.addEventListener("input", function () {
    clearInvalid(categoryNameInput);
});

renderCategories();
