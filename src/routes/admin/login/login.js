(() => {
    "use strict";

    const loginPage = document.querySelector(".main");

    if (!loginPage) return;

    const accountDestinations = Object.freeze({
        barista: {
            label: "Barista",
            destination: "../../barista/checkout/checkout.html"
        },

        admin: {
            label: "Admin",
            destination: "../dashboard/dashboard.html"
        }
    });

    let selectedRole = "barista";

    const roleButtons = loginPage.querySelectorAll("[data-account-role]");
    const loginForm = loginPage.querySelector("#login-sign-in-form");
    const submitButton = loginPage.querySelector("#login-submit");


    // ACCOUNT SELECTION
    const selectRole = (role) => {
        if (!Object.hasOwn(accountDestinations, role)) return;

        selectedRole = role;

        roleButtons.forEach((button) => {
            const active = button.dataset.accountRole === selectedRole;

            button.classList.toggle("login-account-option-active", active);
            button.setAttribute("aria-pressed", String(active));
        });

        submitButton.textContent =
            `Log In as ${accountDestinations[selectedRole].label}`;
    };

    roleButtons.forEach((button) => {
        button.addEventListener("click", () => {
            selectRole(button.dataset.accountRole);
        });
    });


    // PAGE REDIRECTION
    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();

        // Temporary redirection for frontend demonstration only.
        // Replace with server-side authentication during backend integration.
        window.location.assign(
            accountDestinations[selectedRole].destination
        );
    });


    // INITIALIZATION
    selectRole(selectedRole);
})();
