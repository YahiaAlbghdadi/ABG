(function () {
  "use strict";

  // Current year in footer
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Hero rotating service word
  var rotator = document.getElementById("heroRotator");
  if (rotator) {
    var words = ["Bilanzierung", "Buchhaltung", "Personalverrechnung", "Unternehmensberatung"];
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var idx = 0;

    if (!reduceMotion) {
      setInterval(function () {
        rotator.classList.add("is-swapping");
        setTimeout(function () {
          idx = (idx + 1) % words.length;
          rotator.textContent = words[idx];
          rotator.classList.remove("is-swapping");
        }, 320);
      }, 2400);
    }
  }

  // Mobile nav toggle
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
    });
    // Close menu when a link is clicked
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Header shadow on scroll + back-to-top visibility
  var header = document.querySelector(".header");
  var toTop = document.getElementById("toTop");
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle("scrolled", y > 8);
    if (toTop) toTop.classList.toggle("show", y > 500);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Reveal on scroll
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  // Appointment booking form
  var bookingForm = document.getElementById("bookingForm");
  var bkDate = document.getElementById("bkDate");
  var bkTime = document.getElementById("bkTime");
  var timeslotsWrap = document.getElementById("timeslots");
  var bookingStatus = document.getElementById("bookingStatus");

  if (bkDate) {
    var today = new Date();
    var minDate = today.toISOString().slice(0, 10);
    bkDate.min = minDate;

    // Weekdays only: skip Saturday/Sunday when a weekend date is picked
    bkDate.addEventListener("input", function () {
      if (!bkDate.value) return;
      var picked = new Date(bkDate.value + "T00:00:00");
      var day = picked.getDay();
      if (day === 0 || day === 6) {
        if (bookingStatus) {
          bookingStatus.textContent = "Bitte wählen Sie einen Werktag (Montag–Freitag).";
          bookingStatus.className = "form__status err";
        }
        bkDate.value = "";
      } else if (bookingStatus) {
        bookingStatus.textContent = "";
        bookingStatus.className = "form__status";
      }
    });
  }

  if (timeslotsWrap && bkTime) {
    var slotButtons = timeslotsWrap.querySelectorAll(".timeslot");
    slotButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        slotButtons.forEach(function (b) { b.classList.remove("is-selected"); });
        btn.classList.add("is-selected");
        bkTime.value = btn.dataset.time;
      });
    });
  }

  if (bookingForm) {
    bookingForm.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!bkTime.value) {
        if (bookingStatus) {
          bookingStatus.textContent = "Bitte wählen Sie eine Uhrzeit aus.";
          bookingStatus.className = "form__status err";
        }
        return;
      }
      if (!bookingForm.checkValidity()) {
        bookingForm.reportValidity();
        return;
      }

      var service = document.getElementById("bkService").value;
      var date = bkDate.value;
      var formattedDate = date
        ? new Date(date + "T00:00:00").toLocaleDateString("de-AT", {
            weekday: "long", year: "numeric", month: "long", day: "numeric"
          })
        : "";

      if (bookingStatus) {
        bookingStatus.textContent =
          "Danke! Ihr Termin für " + (service || "ein Gespräch") + " am " +
          formattedDate + " um " + bkTime.value + " Uhr wurde angefragt. Wir bestätigen ihn in Kürze.";
        bookingStatus.className = "form__status ok";
      }

      bookingForm.reset();
      timeslotsWrap.querySelectorAll(".timeslot").forEach(function (b) {
        b.classList.remove("is-selected");
      });
      bkTime.value = "";
    });
  }

  // Contact form (client-side demo handling)
  var form = document.getElementById("contactForm");
  var status = document.getElementById("formStatus");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var name = (document.getElementById("name") || {}).value || "";
      if (status) {
        status.textContent = "Danke, " + name.trim().split(" ")[0] +
          "! Ihre Nachricht wurde vorgemerkt. Wir melden uns in Kürze.";
        status.className = "form__status ok";
      }
      form.reset();
    });
  }
})();
