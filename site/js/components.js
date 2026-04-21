/* Do.Qix Component Loader
   Loads shared header and footer into every page.
   Usage: Add <header id="site-header"></header> and <footer id="site-footer"></footer>
   in your HTML where the components should appear. */

(function () {
  var basePath = document.currentScript.getAttribute("data-base") || ".";

  function loadComponent(id, file) {
    var el = document.getElementById(id);
    if (!el) return;
    fetch(basePath + "/components/" + file)
      .then(function (r) { return r.text(); })
      .then(function (html) {
        var temp = document.createElement("div");
        temp.innerHTML = html;
        var component = temp.firstElementChild;
        el.replaceWith(component);
        if (id === "site-header") setActiveNav();
      });
  }

  function setActiveNav() {
    var page = location.pathname.split("/").pop() || "index.html";
    var links = document.querySelectorAll(".nav-link");
    links.forEach(function (link) {
      var href = link.getAttribute("href");
      if (href === page) {
        link.classList.add("active");
      }
    });
  }

  loadComponent("site-header", "header.html");
  loadComponent("site-footer", "footer.html");
})();
