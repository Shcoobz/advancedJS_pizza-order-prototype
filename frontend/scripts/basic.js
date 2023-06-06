/*!
* Basic8 Template v1.02
* Copyright (c) 2020 Career Platform AI Srl & Its Licensors. All rights reserved.
*/
// Sticky headder and arrow navigation
var navig = document.getElementById("navig");
var navigitems = document.getElementById("navigitems");
var nextarrow = document.getElementById("nextarrow");

if(navig) var navpos = navig.offsetTop;

function stickyHeader() {
  if (window.pageYOffset > navpos) {
    if(navig) navig.classList.add("stickynavig");
    if(navigitems) navigitems.classList.add("showHamburger");
    if(nextarrow) nextarrow.classList.add("hide");
    removeMobileMenu();
  } else {
    if(navig) navig.classList.remove("stickynavig");
    if(navigitems) navigitems.classList.remove("showHamburger");
    if(nextarrow) nextarrow.classList.remove("hide");
  }
}
/* mobile menu */
function toggleMobileMenu() {
  if(navigitems) var mobilenavig = navigitems.classList.contains("mobileopen");
  if (mobilenavig) {
    if(navigitems) navigitems.classList.remove("mobileopen");
  } else {
    if(navigitems) navigitems.classList.add("mobileopen");
  }
}
function removeMobileMenu() {
  if(navigitems) {
    var mobilenavig = navigitems.classList.contains("mobileopen");
    if (mobilenavig) {
      if(navigitems) navigitems.classList.remove("mobileopen");
    }
  }
}
window.onresize = function() {
  removeMobileMenu()
};
window.addEventListener("click", function(event) {
  if (event.target.matches('.icoham')) {
  } else {
    removeMobileMenu();
  }
});
window.onscroll = function() {
  stickyHeader()
};
window.onload = function() {
  stickyHeader()
};
