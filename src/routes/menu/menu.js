const PESO = "\u20B1";

const MENU = {
  coffee: {
    hero: {
      title: 'Coffee, <em>classic</em> &amp; special.',
      sub: "From a simple americano to our barista blends, every cup is made to order. Hot or iced, it is your call.",
    },
    favSub: "Our most loved coffee, all in one place.",
    favorites: [
      { name: "Salted Caramel", price: 170, img: "images/salted-caramel.jpg" },
      { name: "Caramel Macchiato", price: 150, img: "images/caramel-macchiato.jpg" },
      { name: "Biscoffee", price: 120, img: "images/biscoffee.jpg" },
      { name: "C.E. Barista Blend", price: 200, img: "images/barista-blend.jpg" },
    ],
    sections: [
      {
        title: "Coffee Classics",
        tag: "Hot 12oz / Iced 16oz",
        img: "images/coffee-classics.png",
        items: [
          ["Americano", 120], ["Cafe Latte", 150], ["Cappuccino", 150], ["French Vanilla", 170],
          ["Salted Caramel", 170], ["Spanish Latte", 180], ["Caramel Macchiato", 180], ["Cafe Mocha", 180],
          ["Dark Choco Mocha", 180], ["White Mocha", 170], ["Hazelnut Mocha", 170],
        ],
      },
      {
        title: "Coffee Specials",
        tag: "Iced only / 16oz",
        img: "images/coffee-specials.png",
        items: [
          ["Coffee Jelly", 180], ["Dirty Matcha", 200], ["Brown Sugar Brulee", 190], ["Toffeedamia", 190],
          ["Roasted Almondamia", 190], ["Biscoffee", 200], ["Oreo Matcha", 200], ["C.E. Barista Blend", 220],
        ],
      },
    ],
    addons: [
      { name: "Espresso", note: "Per extra shot.", price: 40 },
      { name: "Sub to oat milk", note: "A dairy-free swap.", price: 50 },
      { name: "Whipping cream", note: "A generous swirl on top.", price: 30 },
      { name: "Seasalt cream", note: "A salty sweet cream cap.", price: 40 },
      { name: "Flavored syrup", note: "Per pump.", price: 20 },
      { name: "Cold foam", note: "Ube cloud or strawberry cloud.", price: 30 },
    ],
    cta: {
      text: "Hungry? Check out our pasta and meals.",
      actions: [
        { label: "Bakes", tab: "pastries", dark: true },
        { label: "Snacks & meals", tab: "snacks" },
      ],
    },
  },

  "non-coffee": {
    hero: {
      title: 'Cold, creamy &amp; <em>sweet</em>.',
      sub: "Milk-based drinks, frappes, and frizzy sodas for the days that call for something a little more fun.",
    },
    favSub: "Our most loved drinks, all in one place.",
    favorites: [
      { name: "Matcha Latte", price: 170, img: "images/matcha-latte.jpg" },
      { name: "Mocha Frappe", price: 150, img: "images/mocha-frappe.jpg" },
      { name: "Milky Strawberry", price: 120, img: "images/milky-strawberry.jpg" },
      { name: "Seasalt Frappe", price: 200, img: "images/seasalt-frappe.jpg" },
    ],
    sections: [
      {
        title: "Non-coffee, milk-based",
        tag: "Hot 12oz / Iced 16oz",
        img: "images/milk-based.png",
        items: [
          ["Signature Choco", 150], ["Milky Strawberry", 150], ["Dark Chocolate", 150], ["Matcha Latte", 170],
          ["Berry Matcha", 190], ["Oreo Milk", 150], ["Nutella Latte", 150], ["Biscoff Latte", 150],
        ],
      },
      {
        title: "Frappes & Milkshakes",
        img: "images/frappes.png",
        items: [
          ["Vanilla Milkshake", 170], ["Strawberries & Cream", 170], ["Oreos & Cream", 170], ["Biscoff Frappe", 180],
          ["Oreo Matcha", 200], ["Matcha Frappe", 190], ["Dark Mocha Frappe", 190], ["Java Chip Frappe", 190],
          ["Seasalt Frappe", 190],
        ],
      },
      {
        title: "Soda Pop Series",
        img: "images/soda-pop.png",
        items: [["Strawberry Fizz", 100], ["Blue Lemonade", 100], ["Mango Yakult Tea", 100]],
      },
    ],
    cta: {
      text: "Hungry? Check out our pasta and meals.",
      actions: [
        { label: "Bakes", tab: "pastries", dark: true },
        { label: "Back to coffee", tab: "coffee" },
      ],
    },
  },

  pastries: {
    hero: {
      title: 'Fresh <em>bakes</em> and pasta.',
      sub: "Tasty pastries, warm cookies, sandwiches, and pasta to pair with your cup of coffee.",
    },
    favSub: "Our most loved bakes, in one place.",
    favorites: [
      { name: "Choco Chip Cookies", price: 90, img: "images/choco-chip-cookies.jpg" },
      { name: "Butter Croissant", price: 70, img: "images/butter-croissant.jpg" },
      { name: "Spam Sandwich", price: 170, img: "images/spam-sandwich.jpg" },
      { name: "Carbonara Buldak", price: 160, img: "images/carbonara-buldak.jpg" },
    ],
    sections: [
      {
        title: "Bread & Pastries",
        img: "images/bread-pastries.png",
        items: [["Butter Croissant", 70], ["Pain au Chocolat", 80], ["Choco Chip Cookies", 90], ["White Chocochip Cookies", 90]],
      },
      {
        title: "Sandwiches",
        img: "images/sandwiches.png",
        items: [["Ham & Egg Sandwich", 160], ["Spam Sandwich", 170], ["Chicken Fillet Sandwich", 180]],
      },
      {
        title: "Pastas & Buldak",
        img: "images/pastas.png",
        items: [
          ["Creamy Sausage & Shrimp Cajun", 250], ["Shrimp Aglio Olio", 220], ["Cheesy Tuna Pesto", 220],
          ["Classic Mom's Spaghetti", 200], ["Carbonara Buldak", 160],
        ],
      },
    ],
    cta: {
      text: "Still hungry? We have snacks and rice meals for you.",
      actions: [
        { label: "Snack & rice", tab: "snacks", dark: true },
        { label: "Back to drinks", tab: "coffee" },
      ],
    },
  },

  snacks: {
    hero: {
      title: 'Hearty <em>bites</em> &amp; rice meals.',
      sub: "Crispy snacks to share and filling rice meals for when a coffee just is not enough.",
    },
    favSub: "Our most loved snacks and meals, all in one place.",
    favorites: [
      { name: "French Fries", price: 90, img: "images/french-fries.jpg" },
      { name: "Chicken Tenders", price: 160, img: "images/chicken-tenders.jpg" },
      { name: "Allday Spam Rice", price: 180, img: "images/spam-rice.jpg" },
      { name: "Sausage Delight", price: 160-200, img: "images/sausage-delight.jpg" },
    ],
    sections: [
      {
        title: "Snacks",
        img: "images/snacks.png",
        items: [
          ["French Fries (salted / cheese)", 90], ["Twister Fries", 110], ["Mojos", 120], ["Pica Platter", 199],
          ["4 pcs Nuggets & Fries", 140], ["3 pcs Chicken Tenders with dip", 160], ["Chicken Popcorn", 110],
        ],
      },
      {
        title: "Rice meals",
        img: "images/rice-meals.png",
        items: [
          ["Allday Spam Rice", 180], ["Sausage Delight, 1 pc", 160], ["Sausage Delight, 2 pcs", 200],
          ["Chicken Pastil (spicy / original)", 170], ["Tori Katsu with Cabbage Salad", 180],
          ["2-pc. Mushroom Burger Steak", 220], ["Chicken Pepperoni Steak", 270], ["4-pc. Nuggets with Rice", 160],
        ],
      },
    ],
    cta: {
      text: "Come sip and dine with us.",
      actions: [
        { label: "Find us", href: "#", dark: true },
        { label: "View menu", tab: "coffee" },
      ],
    },
  },
};

const GRAB_URL = "https://app.grab.com/s/joOMQISo";

/* ---------- helpers ---------- */
const $ = (sel) => document.querySelector(sel);
const money = (n) => `${PESO} ${n}`;

function imageEl(src, alt, className = "") {
  const img = document.createElement("img");
  img.src = src;
  img.alt = alt;
  img.loading = "lazy";
  if (className) img.className = className;
  img.addEventListener("error", () => {
    const ph = document.createElement("div");
    ph.className = "ph";
    ph.textContent = alt;
    img.replaceWith(ph);
  });
  return img;
}

/* ---------- renderers ---------- */
function renderFavorites(data) {
  const grid = $("#fav-grid");
  if (!grid) { console.warn("[menu] #fav-grid not found in the HTML"); return; }
  grid.innerHTML = "";
  data.favorites.forEach((f) => {
    const card = document.createElement("article");
    card.className = "fav-card";
    const wrap = document.createElement("div");
    wrap.className = "fav-img";
    wrap.appendChild(imageEl(f.img, f.name));
    card.appendChild(wrap);
    card.insertAdjacentHTML(
      "beforeend",
      `<h4>${f.name}</h4><span class="price">${money(f.price)}</span>`
    );
    grid.appendChild(card);
  });
}

function renderSections(data) {
  const root = $("#sections");
  if (!root) { console.warn("[menu] #sections not found in the HTML"); return; }
  root.innerHTML = "";
  data.sections.forEach((s, i) => {
    const reverse = i % 2 === 1;
    const sec = document.createElement("section");
    sec.className = "menu-section" + (reverse ? " reverse" : "");

    const rows = s.items
      .map(([n, p]) => `<li><span>${n}</span><span>${money(p)}</span></li>`)
      .join("");

    const media = document.createElement("div");
    media.className = "section-media";
    media.appendChild(imageEl(s.img, s.title));

    const body = document.createElement("div");
    body.className = "section-body";
    body.innerHTML =
      (s.tag ? `<span class="size-tag">${s.tag}</span>` : "") +
      `<ul class="menu-list">${rows}</ul>` +
      `<a class="btn btn-dark btn-sm grab" href="${GRAB_URL}" target="_blank" rel="noopener">Order on Grab</a>`;

    sec.insertAdjacentHTML("beforeend", `<h3>${s.title}</h3>`);
    sec.appendChild(media);
    sec.appendChild(body);
    root.appendChild(sec);
  });
}

function renderAddons(data) {
  const wrap = $("#addons");
  const grid = $("#addons-grid");
  if (!wrap || !grid) { if (data.addons) console.warn("[menu] #addons / #addons-grid not found in the HTML"); return; }
  if (!data.addons) { wrap.hidden = true; return; }
  wrap.hidden = false;
  grid.innerHTML = data.addons
    .map(
      (a) => `<div class="addon"><h4>${a.name}</h4><p>${a.note}</p><span class="price">${money(a.price)}</span></div>`
    )
    .join("");
}

function renderCta(data) {
  fill("#cta-text", data.cta.text);
  const box = $("#cta-actions");
  if (!box) { console.warn("[menu] #cta-actions not found in the HTML"); return; }
  box.innerHTML = "";
  data.cta.actions.forEach((a) => {
    const el = document.createElement("a");
    el.className = "btn " + (a.dark ? "btn-dark" : "btn-outline");
    el.textContent = a.label;
    el.href = a.tab ? `#${a.tab}` : a.href || "#";
    box.appendChild(el);
  });
}

/* ---------- tab switching ---------- */
function fill(sel, value, asHTML = false) {
  const el = $(sel);
  if (!el) { console.warn(`[menu] Element ${sel} not found in the HTML`); return; }
  if (asHTML) el.innerHTML = value; else el.textContent = value;
}

function showTab(tab, { scroll = false } = {}) {
  if (!MENU[tab]) tab = "coffee";
  const data = MENU[tab];

  fill("#hero-title", data.hero.title, true);
  fill("#hero-sub", data.hero.sub);
  fill("#fav-sub", data.favSub);

  document.querySelectorAll(".chip").forEach((c) => {
    const active = c.dataset.tab === tab;
    c.classList.toggle("active", active);
    c.setAttribute("aria-selected", active);
  });

  renderFavorites(data);
  renderSections(data);
  renderAddons(data);
  renderCta(data);

  const main = document.querySelector("main");
  if (main) {
    main.classList.remove("fade-in");
    void main.offsetWidth;
    main.classList.add("fade-in");
  }

  document.title = `Menu | Coffee Everyday`;
  if (scroll) window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ---------- events ---------- */
function setHash(tab) {
  try {
    history.replaceState(null, "", `#${tab}`);
  } catch (e) {
  }
}

document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    showTab(chip.dataset.tab);
    setHash(chip.dataset.tab);
  });
});

window.addEventListener("hashchange", () => {
  const tab = location.hash.slice(1);
  if (MENU[tab]) showTab(tab, { scroll: true });
});

const toggle = document.querySelector(".nav-toggle");
const nav = $("#site-nav");
if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });
}

showTab("coffee");
setHash("coffee");