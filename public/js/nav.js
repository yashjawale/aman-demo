const toggle = document.querySelector(".toggle");
const menu = document.querySelector(".menu");
const burger = document.querySelector(".burger-cont");

/* Toggle Mobile Menu */

function toggleMenu() {
  if (menu.classList.contains("active")) {
    menu.classList.remove("active");

    // adds the menu (hamburger) icon
    // toggle.querySelector("a").innerHTML = `<i class="fas fa-bars"></i>`;
  } else {
    menu.classList.add("active");

    // adds the close (X) icon
    // toggle.querySelector("a").innerHTML = `<i class="fas fa-times"></i>`;
  }

  burger.classList.toggle("toggle-burger");
}

/* Event Listener */
toggle.addEventListener("click", toggleMenu, false);

/* For Submenu Items */

const items = document.querySelectorAll(".item");

/* Activate Submenu */
function toggleItem() {
  if (this.classList.contains("submenu-active")) {
    this.classList.remove("submenu-active");
  } else if (menu.querySelector(".submenu-active")) {
    menu.querySelector(".submenu-active").classList.remove("submenu-active");
    this.classList.add("submenu-active");
  } else {
    this.classList.add("submenu-active");
  }
}

/* Event Listeners */

if (document.documentElement.clientWidth < 1160) {
  // Check if user is on PC, disable click toggle functionality
  for (let item of items) {
    if (item.querySelector(".submenu")) {
      item.addEventListener("click", toggleItem, false);
      item.addEventListener("keypress", toggleItem, false);
    }
  }
}

/* Close Submenu from Anywhere */

function closeSubmenu(e) {
  let isClickInside = menu.contains(e.target);

  if (!isClickInside && menu.querySelector(".submenu-active")) {
    menu.querySelector(".submenu-active").classList.remove("submenu-active");
  }
}

/* Event Listener */
document.addEventListener("click", closeSubmenu, false);

/** LOADING SPINNER */

const preloader = document.querySelector("#spinner-cont");

// const fadeEffect = setInterval(() => {
// 	// if we don't set opacity 1 in CSS, then
// 	// it will be equaled to "" -- that's why
// 	// we check it, and if so, set opacity to 1
// 	if (!preloader.style.opacity) {
// 		preloader.style.opacity = 1;
// 	}
// 	if (preloader.style.opacity > 0) {
// 		preloader.style.opacity -= 0.025;
// 	} else {
// 		clearInterval(fadeEffect);
// 	}
// }, 25);

window.addEventListener("load", () =>
  preloader.classList.add("spinner-loaded")
);

// FOOTER YEAR

var thisYear = new Date().getFullYear();
let yearContainer = document.querySelector("#copyright-year");
let startYear = parseInt(yearContainer.textContent);
if (thisYear > startYear) {
  yearContainer.textContent += `-${thisYear}`;
}
