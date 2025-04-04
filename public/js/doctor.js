document.addEventListener("DOMContentLoaded", function () {
  console.log("Doctor JS loaded");

  // Initialize tooltips
  const tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  // Schedule form validation
  const scheduleForm = document.getElementById("scheduleForm");
  if (scheduleForm) {
    scheduleForm.addEventListener("submit", function (event) {
      const dateInput = document.getElementById("scheduleDate");
      const timeInput = document.getElementById("timeType");
      const maxNumber = document.getElementById("maxNumber");

      // Validate date is not in the past
      const selectedDate = new Date(dateInput.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        event.preventDefault();
        alert("Please select a future date for scheduling.");
        return false;
      }

      // Validate max number
      if (parseInt(maxNumber.value) <= 0 || parseInt(maxNumber.value) > 20) {
        event.preventDefault();
        alert("Maximum patients should be between 1 and 20.");
        return false;
      }
    });
  }

  // Search functionality for schedules
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("keyup", function () {
      const searchTerm = this.value.toLowerCase();
      const tableRows = document.querySelectorAll("tbody tr");

      tableRows.forEach((row) => {
        const patientName = row
          .querySelector("td:nth-child(4)")
          .textContent.toLowerCase();
        if (patientName.includes(searchTerm)) {
          row.style.display = "";
        } else {
          row.style.display = "none";
        }
      });
    });
  }

  // Status filter for schedules
  const statusFilter = document.getElementById("statusFilter");
  if (statusFilter) {
    statusFilter.addEventListener("change", function () {
      const selectedStatus = this.value;
      const tableRows = document.querySelectorAll("tbody tr");

      if (!selectedStatus) {
        tableRows.forEach((row) => {
          row.style.display = "";
        });
        return;
      }

      tableRows.forEach((row) => {
        const statusCell = row.querySelector("td:nth-child(6)");
        const statusBadge = statusCell.querySelector(".badge");

        if (statusBadge) {
          const statusText = statusCell.textContent.trim();
          let statusCode = "";

          // Map status text to status code
          if (statusText === "New") statusCode = "S1";
          else if (statusText === "Confirmed") statusCode = "S2";
          else if (statusText === "Done") statusCode = "S3";
          else if (statusText === "Cancelled") statusCode = "S4";

          if (statusCode === selectedStatus) {
            row.style.display = "";
          } else {
            row.style.display = "none";
          }
        }
      });
    });
  }

  // Date filter for schedules
  const dateFilter = document.getElementById("dateFilter");
  if (dateFilter) {
    dateFilter.addEventListener("change", function () {
      const selectedDate = this.value;
      const tableRows = document.querySelectorAll("tbody tr");

      if (!selectedDate) {
        tableRows.forEach((row) => {
          row.style.display = "";
        });
        return;
      }

      tableRows.forEach((row) => {
        const dateCell = row.querySelector("td:nth-child(2)");
        const dateBadge = dateCell.querySelector(".badge");

        if (dateBadge) {
          const rowDate = dateBadge.textContent.trim();
          // Convert to YYYY-MM-DD format for comparison
          const [month, day, year] = rowDate.split("/");
          const formattedDate = `${year}-${month.padStart(
            2,
            "0"
          )}-${day.padStart(2, "0")}`;

          if (formattedDate === selectedDate) {
            row.style.display = "";
          } else {
            row.style.display = "none";
          }
        }
      });
    });
  }
});
