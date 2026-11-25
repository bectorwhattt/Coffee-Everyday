/*
 * contact.js — Coffee Everyday contact page
 * Progressive enhancement only. If this file fails to load, the page stays
 * fully usable: the mobile menu still toggles via the CSS :checked state,
 * the form still submits (browser-native validation), and every section is
 * visible (the .reveal elements only hide when <html class="js"> is set).
 */
(function () {
  "use strict";

  /* Mark JS as available so the .reveal opacity rules engage */
  document.documentElement.classList.add("js");

  /* -----------------------------------------------------------------
   * Mobile navigation
   * --------------------------------------------------------------- */
  var navToggle = document.getElementById("nav-toggle");
  var navLabel = document.querySelector(".nav-toggle-label");
  var navBar = document.getElementById("navigation-bar");

  function isMobileMenu() {
    // Matches the @media (max-width: 640px) breakpoint where the
    // hamburger label is actually displayed.
    return window.matchMedia("(max-width: 640px)").matches;
  }

  function openMenu() {
    if (!navToggle) return;
    navToggle.checked = true;
    if (navLabel) navLabel.setAttribute("aria-expanded", "true");
    document.body.classList.add("nav-open");
  }

  function closeMenu() {
    if (!navToggle) return;
    navToggle.checked = false;
    if (navLabel) navLabel.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
  }

  function menuIsOpen() {
    return !!navToggle && navToggle.checked && isMobileMenu();
  }

  if (navToggle && navLabel) {
    // Keep aria-expanded in sync with the checkbox for any toggle.
    navToggle.addEventListener("change", function () {
      if (navToggle.checked) {
        navLabel.setAttribute("aria-expanded", "true");
        if (isMobileMenu()) document.body.classList.add("nav-open");
      } else {
        navLabel.setAttribute("aria-expanded", "false");
        document.body.classList.remove("nav-open");
      }
    });

    // Close after picking a destination.
    if (navBar) {
      navBar.addEventListener("click", function (e) {
        if (e.target.tagName === "A") closeMenu();
      });
    }

    // Close when clicking *genuinely outside* the toggle + panel.
    // IMPORTANT: a click on the <label> fires its own synthetic click on the
    // associated checkbox, which bubbles here with e.target = the INPUT (a
    // sibling of the label, not a child). So we must ignore the checkbox too,
    // otherwise opening the menu immediately closes it. The checkbox handles
    // its own toggle via the `change` listener above.
    document.addEventListener("click", function (e) {
      if (!menuIsOpen()) return;
      var target = e.target;
      if (target.closest && target.closest(
        ".navigation-bar, .nav-toggle-label, .nav-toggle"
      )) return;
      closeMenu();
    });

    // Escape closes the menu and returns focus to the hamburger.
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menuIsOpen()) {
        closeMenu();
        if (navLabel) navLabel.focus();
      }
    });

    // Tidy up if the viewport grows past mobile while the menu is open.
    window.addEventListener("resize", function () {
      if (!isMobileMenu()) closeMenu();
    });
  }

  /* -----------------------------------------------------------------
   * Contact form — client-side validation + feedback
   * The form has no real backend, so we validate, show a friendly
   * status, and reset. Swap the success branch for a fetch() when a
   * real endpoint is wired up.
   * --------------------------------------------------------------- */
  var form = document.getElementById("contact-form");
  var statusEl = document.getElementById("contact-form-status");

  function setStatus(msg, kind) {
    if (!statusEl) return;
    statusEl.textContent = msg || "";
    statusEl.classList.remove("is-success", "is-error");
    if (kind) statusEl.classList.add("is-" + kind);
  }

  function clearInvalid() {
    var fields = form.querySelectorAll(".contact-form-field.invalid");
    Array.prototype.forEach.call(fields, function (f) {
      f.classList.remove("invalid");
    });
  }

  function markInvalid(input) {
    if (!input) return;
    var field = input.closest(".contact-form-field");
    if (field) field.classList.add("invalid");
  }

  function validEmail(value) {
    // Pragmatic RFC-5321-ish check; good enough for client side.
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      clearInvalid();

      var name = form.querySelector("#contact-name");
      var email = form.querySelector("#contact-email");
      var message = form.querySelector("#contact-message-input");

      var ok = true;

      if (!name.value.trim()) { markInvalid(name); ok = false; }
      if (!validEmail(email.value.trim())) { markInvalid(email); ok = false; }
      if (!message.value.trim()) { markInvalid(message); ok = false; }

      if (!ok) {
        setStatus("Please fill in your name, a valid email, and a message.", "error");
        var firstBad = form.querySelector(".contact-form-field.invalid input, .contact-form-field.invalid textarea");
        if (firstBad) firstBad.focus();
        return;
      }

      // Simulated send. Replace with a real request when a backend exists.
      var button = form.querySelector(".contact-submit-button");
      var label = form.querySelector(".contact-submit-label");
      if (button) button.disabled = true;
      if (label) label.textContent = "Sending…";

      window.setTimeout(function () {
        setStatus("Thanks, " + name.value.trim() + "! Your message has been sent — we'll reply within a day.", "success");
        form.reset();
        if (button) button.disabled = false;
        if (label) label.textContent = "Send message";
      }, 600);
    });

    // Remove the red border as soon as the user fixes a field.
    form.addEventListener("input", function (e) {
      var t = e.target;
      var field = t.closest ? t.closest(".contact-form-field") : null;
      if (field) field.classList.remove("invalid");
    }, true);
  }

  /* -----------------------------------------------------------------
   * Scroll reveal — IntersectionObserver, gracefully degrades
   * --------------------------------------------------------------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    reveals.forEach(function (el) { io.observe(el); });
  } else {
    // No IO support (or very old browsers): just show everything.
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }
})();