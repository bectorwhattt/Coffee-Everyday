/*********************************************************************************
HEADER SCROLL TRANSITION
*********************************************************************************/

(() => {
    "use strict";

    const header = document.getElementById("header");

    if (!header) return;

    const scrollThreshold = 6;

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

        if (currentScrollPosition <= scrollThreshold) {
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
