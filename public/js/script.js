(() => {
  'use strict';

  document.addEventListener("DOMContentLoaded", function () {

    // Bootstrap validation
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

    // Tax switch toggle
    const taxSwitch = document.getElementById("flexswitchCheckDefault");
    if (taxSwitch) {
      taxSwitch.addEventListener("click", () => {
        const taxInfos = document.getElementsByClassName("tax-info");
        for (let info of taxInfos) {
          info.style.display = taxSwitch.checked ? "inline" : "none";
        }
      });
    }

    //Filter scroll buttons
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

    function updateArrowVisibility() {
    const scrollLeft = filtersContainer.scrollLeft;
    const scrollWidth = filtersContainer.scrollWidth;
    const clientWidth = filtersContainer.clientWidth;

    // Hide left arrow if at the far left
    leftBtn.style.display = scrollLeft <= 0 ? 'none' : 'block';

    // Hide right arrow if at the far right
    rightBtn.style.display = (scrollLeft + clientWidth >= scrollWidth - 1) ? 'none' : 'block';
  }

  // Attach scroll listener
  filtersContainer.addEventListener('scroll', updateArrowVisibility);
  // Initial visibility check
  updateArrowVisibility();

  // Also re-check after clicking
  leftBtn.addEventListener("click", () => {
    filtersContainer.scrollLeft -= filterWidth;
    setTimeout(updateArrowVisibility, 300); // wait for scroll animation
  });

  rightBtn.addEventListener("click", () => {
    filtersContainer.scrollLeft += filterWidth;
    setTimeout(updateArrowVisibility, 300); // wait for scroll animation
  });
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

