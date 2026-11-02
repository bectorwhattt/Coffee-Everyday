const PESO = "\u20B1";
const GRAB_URL = "https://app.grab.com/s/joOMQISo";

const MENU = {
  coffee: {
    hero: {
      title: 'Coffee, <em>classic</em> &amp; special.',
      subtitle: "From a simple americano to our barista blends, every cup is made to order. Hot or iced, it is your call.",
    },
    favoriteSubtitle: "Our most loved coffee, all in one place.",
    favorites: [
      { name: "Salted Caramel", price: 170, image: "images/salted-caramel.jpg" },
      { name: "Caramel Macchiato", price: 150, image: "images/caramel-macchiato.jpg" },
      { name: "Biscoffee", price: 120, image: "images/biscoffee.jpg" },
      { name: "C.E. Barista Blend", price: 200, image: "images/barista-blend.jpg" },
    ],
    sections: [
      {
        title: "Coffee Classics",
        tag: "Hot 12oz / Iced 16oz",
        image: "images/coffee-classics.png",
        items: [
          ["Americano", 120], ["Cafe Latte", 150], ["Cappuccino", 150], ["French Vanilla", 170],
          ["Salted Caramel", 170], ["Spanish Latte", 180], ["Caramel Macchiato", 180], ["Cafe Mocha", 180],
          ["Dark Choco Mocha", 180], ["White Mocha", 170], ["Hazelnut Mocha", 170],
        ],
      },
      {
        title: "Coffee Specials",
        tag: "Iced only / 16oz",
        image: "images/coffee-specials.png",
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
    callToAction: {
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
      subtitle: "Milk-based drinks, frappes, and frizzy sodas for the days that call for something a little more fun.",
    },
    favoriteSubtitle: "Our most loved drinks, all in one place.",
    favorites: [
      { name: "Matcha Latte", price: 170, image: "images/matcha-latte.jpg" },
      { name: "Mocha Frappe", price: 150, image: "images/mocha-frappe.jpg" },
      { name: "Milky Strawberry", price: 120, image: "images/milky-strawberry.jpg" },
      { name: "Seasalt Frappe", price: 200, image: "images/seasalt-frappe.jpg" },
    ],
    sections: [
      {
        title: "Non-coffee, milk-based",
        tag: "Hot 12oz / Iced 16oz",
        image: "images/milk-based.png",
        items: [
          ["Signature Choco", 150], ["Milky Strawberry", 150], ["Dark Chocolate", 150], ["Matcha Latte", 170],
          ["Berry Matcha", 190], ["Oreo Milk", 150], ["Nutella Latte", 150], ["Biscoff Latte", 150],
        ],
      },
      {
        title: "Frappes & Milkshakes",
        image: "images/frappes.png",
        items: [
          ["Vanilla Milkshake", 170], ["Strawberries & Cream", 170], ["Oreos & Cream", 170], ["Biscoff Frappe", 180],
          ["Oreo Matcha", 200], ["Matcha Frappe", 190], ["Dark Mocha Frappe", 190], ["Java Chip Frappe", 190],
          ["Seasalt Frappe", 190],
        ],
      },
      {
        title: "Soda Pop Series",
        image: "images/soda-pop.png",
        items: [["Strawberry Fizz", 100], ["Blue Lemonade", 100], ["Mango Yakult Tea", 100]],
      },
    ],
    callToAction: {
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
      subtitle: "Tasty pastries, warm cookies, sandwiches, and pasta to pair with your cup of coffee.",
    },
    favoriteSubtitle: "Our most loved bakes, in one place.",
    favorites: [
      { name: "Choco Chip Cookies", price: 90, image: "images/choco-chip-cookies.jpg" },
      { name: "Butter Croissant", price: 70, image: "images/butter-croissant.jpg" },
      { name: "Spam Sandwich", price: 170, image: "images/spam-sandwich.jpg" },
      { name: "Carbonara Buldak", price: 160, image: "images/carbonara-buldak.jpg" },
    ],
    sections: [
      {
        title: "Bread & Pastries",
        image: "images/bread-pastries.png",
        items: [["Butter Croissant", 70], ["Pain au Chocolat", 80], ["Choco Chip Cookies", 90], ["White Chocochip Cookies", 90]],
      },
      {
        title: "Sandwiches",
        image: "images/sandwiches.png",
        items: [["Ham & Egg Sandwich", 160], ["Spam Sandwich", 170], ["Chicken Fillet Sandwich", 180]],
      },
      {
        title: "Pastas & Buldak",
        image: "images/pastas.png",
        items: [
          ["Creamy Sausage & Shrimp Cajun", 250], ["Shrimp Aglio Olio", 220], ["Cheesy Tuna Pesto", 220],
          ["Classic Mom's Spaghetti", 200], ["Carbonara Buldak", 160],
        ],
      },
    ],
    callToAction: {
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
      subtitle: "Crispy snacks to share and filling rice meals for when a coffee just is not enough.",
    },
    favoriteSubtitle: "Our most loved snacks and meals, all in one place.",
    favorites: [
      { name: "French Fries", price: 90, image: "images/french-fries.jpg" },
      { name: "Chicken Tenders", price: 160, image: "images/chicken-tenders.jpg" },
      { name: "Allday Spam Rice", price: 180, image: "images/spam-rice.jpg" },
      { name: "Sausage Delight", price: "160 - 200", image: "images/sausage-delight.jpg" },
    ],
    sections: [
      {
        title: "Snacks",
        image: "images/snacks.png",
        items: [
          ["French Fries (salted / cheese)", 90], ["Twister Fries", 110], ["Mojos", 120], ["Pica Platter", 199],
          ["4 pcs Nuggets & Fries", 140], ["3 pcs Chicken Tenders with dip", 160], ["Chicken Popcorn", 110],
        ],
      },
      {
        title: "Rice meals",
        image: "images/rice-meals.png",
        items: [
          ["Allday Spam Rice", 180], ["Sausage Delight, 1 pc", 160], ["Sausage Delight, 2 pcs", 200],
          ["Chicken Pastil (spicy / original)", 170], ["Tori Katsu with Cabbage Salad", 180],
          ["2-pc. Mushroom Burger Steak", 220], ["Chicken Pepperoni Steak", 270], ["4-pc. Nuggets with Rice", 160],
        ],
      },
    ],
    callToAction: {
      text: "Come sip and dine with us.",
      actions: [
        { label: "Find us", href: "#", dark: true },
        { label: "View menu", tab: "coffee" },
      ],
    },
  },
};

const selectElement = (selector) => document.querySelector(selector);
const money = (amount) => `${PESO} ${amount}`;

function fill(selector, value, asHTML = false) {
  const element = selectElement(selector);
  if (!element) { console.warn(`[menu] Element ${selector} not found in the HTML`); return; }
  if (asHTML) element.innerHTML = value; else element.textContent = value;
}

function createImage(source, alternativeText) {
  const image = document.createElement("img");
  image.src = source;
  image.alt = alternativeText;
  image.loading = "lazy";
  image.addEventListener("error", () => {
    const placeholder = document.createElement("div");
    placeholder.className = "placeholder";
    placeholder.textContent = alternativeText;
    image.replaceWith(placeholder);
  });
  return image;
}

function renderFavorites(data) {
  const grid = selectElement("#favorite-grid");
  if (!grid) { console.warn("[menu] #favorite-grid not found in the HTML"); return; }
  grid.innerHTML = "";
  data.favorites.forEach((favorite) => {
    const card = document.createElement("div");
    card.className = "favorite-card";
    const imageWrapper = document.createElement("div");
    imageWrapper.className = "favorite-image";
    imageWrapper.appendChild(createImage(favorite.image, favorite.name));
    card.appendChild(imageWrapper);
    card.insertAdjacentHTML(
      "beforeend",
      `<h4>${favorite.name}</h4><span class="price">${money(favorite.price)}</span>`
    );
    grid.appendChild(card);
  });
}

function renderSections(data) {
  const root = selectElement("#sections");
  if (!root) { console.warn("[menu] #sections not found in the HTML"); return; }
  root.innerHTML = "";
  data.sections.forEach((section, index) => {
    const reverse = index % 2 === 1;
    const sectionElement = document.createElement("div");
    sectionElement.className = "menu-section" + (reverse ? " reverse" : "");

    const rows = section.items
      .map(([name, price]) => `<li><span>${name}</span><span>${money(price)}</span></li>`)
      .join("");

    const media = document.createElement("div");
    media.className = "section-media";
    media.appendChild(createImage(section.image, section.title));

    const body = document.createElement("div");
    body.className = "section-body";
    body.innerHTML =
      (section.tag ? `<span class="size-tag">${section.tag}</span>` : "") +
      `<ul class="menu-list">${rows}</ul>` +
      `<a class="button button-dark button-small grab" href="${GRAB_URL}" target="_blank" rel="noopener">Order on Grab</a>`;

    sectionElement.insertAdjacentHTML("beforeend", `<h3>${section.title}</h3>`);
    sectionElement.appendChild(media);
    sectionElement.appendChild(body);
    root.appendChild(sectionElement);
  });
}

function renderAddons(data) {
  const wrapper = selectElement("#addons");
  const grid = selectElement("#addons-grid");
  if (!wrapper || !grid) { if (data.addons) console.warn("[menu] #addons / #addons-grid not found in the HTML"); return; }
  if (!data.addons) { wrapper.hidden = true; return; }
  wrapper.hidden = false;
  grid.innerHTML = data.addons
    .map(
      (addon) => `<div class="addon"><h4>${addon.name}</h4><p>${addon.note}</p><span class="price">${money(addon.price)}</span></div>`
    )
    .join("");
}

function renderCallToAction(data) {
  fill("#call-to-action-text", data.callToAction.text);
  const box = selectElement("#call-to-action-actions");
  if (!box) { console.warn("[menu] #call-to-action-actions not found in the HTML"); return; }
  box.innerHTML = "";
  data.callToAction.actions.forEach((action) => {
    const link = document.createElement("a");
    link.className = "button " + (action.dark ? "button-dark" : "button-outline");
    link.textContent = action.label;
    link.href = action.tab ? `#${action.tab}` : action.href || "#";
    box.appendChild(link);
  });
}

function showTab(tab, { scroll = false } = {}) {
  if (!MENU[tab]) tab = "coffee";
  const data = MENU[tab];

  fill("#hero-title", data.hero.title, true);
  fill("#hero-subtitle", data.hero.subtitle);
  fill("#favorite-subtitle", data.favoriteSubtitle);

  document.querySelectorAll(".chip").forEach((chip) => {
    const active = chip.dataset.tab === tab;
    chip.classList.toggle("active", active);
    chip.setAttribute("aria-selected", active);
  });

  renderFavorites(data);
  renderSections(data);
  renderAddons(data);
  renderCallToAction(data);

  const main = selectElement(".main");
  if (main) {
    main.classList.remove("fade-in");
    void main.offsetWidth;
    main.classList.add("fade-in");
  }

  if (scroll) window.scrollTo({ top: 0, behavior: "smooth" });
}

function setHash(tab) {
  try {
    history.replaceState(null, "", `#${tab}`);
  } catch (error) {
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

const navigationToggle = selectElement(".navigation-toggle");
const navigation = selectElement("#site-navigation");
if (navigationToggle && navigation) {
  navigationToggle.addEventListener("click", () => {
    const open = navigation.classList.toggle("open");
    navigationToggle.setAttribute("aria-expanded", open);
  });
}

showTab("coffee");
setHash("coffee");