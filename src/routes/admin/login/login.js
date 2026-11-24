(() => {
    "use strict";

    const loginPage = document.querySelector(".main");
    if (!loginPage) return;

    // Development samples only. Frontend credentials do not provide security.
    // Replace this demonstration with a server-side authentication endpoint.
    const sampleAccounts = Object.freeze({
        barista: Object.freeze({
            role: "barista",
            label: "Barista",
            email: "barista@coffeeeveryday.test",
            password: "BaristaDemo2026!"
        }),
        admin: Object.freeze({
            role: "admin",
            label: "Admin",
            email: "admin@coffeeeveryday.test",
            password: "AdminDemo2026!"
        })
    });

    let selectedRole = "barista";

    const roleButtons = loginPage.querySelectorAll("[data-account-role]");
    const loginForm = loginPage.querySelector("#login-sign-in-form");
    const emailInput = loginPage.querySelector("#login-email");
    const passwordInput = loginPage.querySelector("#login-password");
    const loginStatus = loginPage.querySelector("#login-sign-in-status");
    const submitButton = loginPage.querySelector("#login-submit");

    const setError = (input, message) => {
        const errorElement = loginPage.querySelector(`#${input.id}-error`);
        if (errorElement) errorElement.textContent = message;
        input.classList.toggle("login-input-invalid", Boolean(message));
        input.setAttribute("aria-invalid", String(Boolean(message)));
        return !message;
    };

    const clearErrors = () => {
        setError(emailInput, "");
        setError(passwordInput, "");
        loginStatus.textContent = "";
    };

    const validEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    const validateEmail = () => {
        const email = emailInput.value.trim();
        if (!email) return setError(emailInput, "Email address is required.");
        return setError(emailInput, validEmail(email) ? "" : "Enter a valid email address.");
    };

    const validatePassword = () => setError(
        passwordInput,
        passwordInput.value ? "" : "Password is required."
    );

    const selectRole = (role) => {
        if (!Object.hasOwn(sampleAccounts, role)) return;
        selectedRole = role;

        roleButtons.forEach((button) => {
            const active = button.dataset.accountRole === role;
            button.classList.toggle("login-account-option-active", active);
            button.setAttribute("aria-pressed", String(active));
        });

        const account = sampleAccounts[role];
        submitButton.textContent = `Log In as ${account.label}`;

        // Prevent credentials entered for one role from carrying into another.
        loginForm.reset();
        clearErrors();
    };

    roleButtons.forEach((button) => {
        button.addEventListener("click", () => selectRole(button.dataset.accountRole));
    });

    [emailInput, passwordInput].forEach((input) => {
        input.setAttribute("aria-invalid", "false");
        input.addEventListener("input", () => {
            setError(input, "");
            loginStatus.textContent = "";
        });
    });

    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const valid = [validateEmail(), validatePassword()].every(Boolean);
        if (!valid) {
            loginForm.querySelector(".login-input-invalid")?.focus();
            return;
        }

        const account = sampleAccounts[selectedRole];
        const email = emailInput.value.trim().toLowerCase();
        const matchesSelectedAccount = email === account.email && passwordInput.value === account.password;

        if (!matchesSelectedAccount) {
            loginStatus.textContent = "Incorrect demo credentials for the selected account type.";
            return;
        }

        // This confirms the SAMPLE credentials, not actual authentication.
        // Never grant role permissions or protect admin routes using this check.
        loginStatus.textContent = `${account.label} demo login successful. Connect a secure backend to enable real sign-in and role-based redirects.`;
        passwordInput.value = "";
    });

    selectRole(selectedRole);
})();
