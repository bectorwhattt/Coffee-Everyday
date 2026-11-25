(() => {
    "use strict";

    const header = document.getElementById("header");

    if (!header) return;

    const mobileViewport = window.matchMedia("(max-width: 640px)");
    const scrollThreshold = 6;

    let navigationToggle = null;
    let navigationBar = null;


    /*********************************************************************************
    MOBILE NAVIGATION
    *********************************************************************************/

    const menuIsOpen = () => {
        return header.classList.contains("navigation-open");
    };

    const openNavigation = () => {
        if (!mobileViewport.matches || !navigationToggle) return;

        header.classList.remove("header-hidden");
        header.classList.add("navigation-open");

        navigationToggle.setAttribute("aria-expanded", "true");
        navigationToggle.setAttribute("aria-label", "Close navigation");
    };

    const closeNavigation = () => {
        header.classList.remove("navigation-open");

        if (!navigationToggle) return;

        navigationToggle.setAttribute("aria-expanded", "false");
        navigationToggle.setAttribute("aria-label", "Open navigation");
    };

    const initializeNavigation = () => {
        const headerContent = header.querySelector(".header");

        if (!headerContent) return false;

        navigationBar = headerContent.querySelector(".navigation-bar");

        if (!navigationBar) return false;

        navigationBar.id = "navigation-bar";

        navigationToggle = document.createElement("button");

        navigationToggle.type = "button";
        navigationToggle.className = "navigation-toggle";

        navigationToggle.setAttribute("aria-label", "Open navigation");
        navigationToggle.setAttribute("aria-expanded", "false");
        navigationToggle.setAttribute("aria-controls", "navigation-bar");

        for (let index = 0; index < 3; index++) {
            const line = document.createElement("span");

            line.setAttribute("aria-hidden", "true");

            navigationToggle.appendChild(line);
        }

        headerContent.appendChild(navigationToggle);

        navigationToggle.addEventListener("click", () => {
            if (menuIsOpen()) {
                closeNavigation();
            } else {
                openNavigation();
            }
        });

        navigationBar.addEventListener("click", (event) => {
            if (event.target.closest("a")) {
                closeNavigation();
            }
        });

        return true;
    };


    /*********************************************************************************
    IMPORTED HEADER INITIALIZATION
    *********************************************************************************/

    if (!initializeNavigation()) {
        const headerObserver = new MutationObserver(() => {
            if (initializeNavigation()) {
                headerObserver.disconnect();
            }
        });

        headerObserver.observe(header, {
            childList: true,
            subtree: true
        });
    }


    /*********************************************************************************
    NAVIGATION EVENTS
    *********************************************************************************/

    document.addEventListener("click", (event) => {
        if (!menuIsOpen()) return;

        if (!header.contains(event.target)) {
            closeNavigation();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && menuIsOpen()) {
            closeNavigation();

            navigationToggle?.focus();
        }
    });

    mobileViewport.addEventListener("change", () => {
        if (!mobileViewport.matches) {
            closeNavigation();
        }
    });


    /*********************************************************************************
    HEADER SCROLL TRANSITION
    *********************************************************************************/

    const getScrollPosition = () => {
        const maximumScrollPosition = Math.max(
            0,
            document.documentElement.scrollHeight - window.innerHeight
        );

        return Math.min(
            Math.max(0, window.scrollY),
            maximumScrollPosition
        );
    };

    let previousScrollPosition = getScrollPosition();
    let scrollPending = false;

    const updateHeader = () => {
        const currentScrollPosition = getScrollPosition();

        const scrollDifference =
            currentScrollPosition - previousScrollPosition;

        if (menuIsOpen()) {
            header.classList.remove("header-hidden");

            previousScrollPosition = currentScrollPosition;
        } else if (currentScrollPosition <= scrollThreshold) {
            header.classList.remove("header-hidden");

            previousScrollPosition = currentScrollPosition;
        } else if (scrollDifference >= scrollThreshold) {
            header.classList.add("header-hidden");

            previousScrollPosition = currentScrollPosition;
        } else if (scrollDifference <= -scrollThreshold) {
            header.classList.remove("header-hidden");

            previousScrollPosition = currentScrollPosition;
        }

        scrollPending = false;
    };

    window.addEventListener("scroll", () => {
        if (scrollPending) return;

        scrollPending = true;

        window.requestAnimationFrame(updateHeader);
    }, { passive: true });
})();
