/*********************************************************************************
LOADING SEPARATED HTML COMPONENTS
*********************************************************************************/

async function loadHTML(elementID, filePath) {
    const response = await fetch(filePath);

    if (!response.ok) {
        throw new Error(`Failed to load ${filePath}`);
    }

    const html = await response.text();

    document.getElementById(elementID).innerHTML = html;
}

loadHTML("header", "../../components/header.html");
loadHTML("footer", "../../components/footer.html");



