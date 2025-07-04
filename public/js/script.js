(() => {
  'use strict';

  document.addEventListener("DOMContentLoaded", function () {

    // ✅ Bootstrap validation
    const forms = document.querySelectorAll('.needs-validation');
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add('was-validated');
      }, false);
    });

    // ✅ Tax switch toggle
    const taxSwitch = document.getElementById("flexswitchCheckDefault");
    if (taxSwitch) {
      taxSwitch.addEventListener("click", () => {
        const taxInfos = document.getElementsByClassName("tax-info");
        for (let info of taxInfos) {
          info.style.display = taxSwitch.checked ? "inline" : "none";
        }
      });
    }

    // ✅ Filter scroll buttons
    const leftBtn = document.querySelector(".left-btn");
    const rightBtn = document.querySelector(".right-btn");
    const filtersContainer = document.querySelector(".filters-container");
    const filter = document.querySelector(".filter");
    if (leftBtn && rightBtn && filtersContainer && filter) {
      const filterWidth = filter.offsetWidth + 32;
      leftBtn.addEventListener("click", () => {
        filtersContainer.scrollLeft -= filterWidth;
      });
      rightBtn.addEventListener("click", () => {
        filtersContainer.scrollLeft += filterWidth;
      });
    }

  });

})();

// flatpickr for booking dates
flatpickr("#startDate", {
    dateFormat: "Y-m-d",
    disable: window.bookedRanges,
    onChange: function(selectedDates, dateStr) {
      document.getElementById("endDate").flatpickr.set("minDate", dateStr);
    }
  });

  flatpickr("#endDate", {
    dateFormat: "Y-m-d",
    disable: window.bookedRanges
  });

