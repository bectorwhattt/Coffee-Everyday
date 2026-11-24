/*********************************************************************************
LOADING SEPARATED HTML COMPONENTS
*********************************************************************************/

async function loadHTML(elementID, filePath) {
    const container = document.getElementById(elementID);
    if (!container) return;

    const response = await fetch(filePath);

    if (!response.ok) {
        throw new Error(`Failed to load ${filePath}`);
    }

    const html = await response.text();
    container.innerHTML = html;
}

function highlightActiveNavLink() {
    const currentFile = window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll("#admin-navLinks a");

    navLinks.forEach((link) => {
        const href = link.getAttribute("href");
        if (!href) return;

        const linkFile = href.split("/").pop();
        const frame = link.querySelector(".frame");

        if (linkFile === currentFile) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
            if (frame) frame.classList.add("active");
        }
    });
}

async function initLayout() {
    await Promise.all([
        loadHTML("header", "../../components/header.html"),
        loadHTML("footer", "../../components/footer.html"),
        loadHTML("admin-navigation-bar", "../../../components/admin-navbar.html"),
        loadHTML("admin-header", "../../../components/admin-header.html"),
    ]);

    // Runs only after #navLinks has been injected into the DOM
    highlightActiveNavLink();
}

initLayout();