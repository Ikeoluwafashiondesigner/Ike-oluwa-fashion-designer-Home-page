/* =========================
   IKE STITCHES SCRIPT
========================= */

const path = window.location.pathname;

// =========================
// VIEW STYLES PAGE
// =========================
if (path.includes("view-styles.html")) {
  const styleCards = document.querySelectorAll(".style-card");
  const popup = document.getElementById("popupMessage");
  const goToOrderBtn = document.getElementById("goToOrder");
  let selectedStyles = [];

  styleCards.forEach((card) => {
    // Skip sold ones
    if (card.dataset.available === "false") {
      card.classList.add("unavailable");
      return;
    }

    let pressTimer;
    const startPress = () => {
      pressTimer = setTimeout(() => toggleSelect(card), 600);
    };
    const cancelPress = () => clearTimeout(pressTimer);

    card.addEventListener("mousedown", startPress);
    card.addEventListener("mouseup", cancelPress);
    card.addEventListener("mouseleave", cancelPress);
    card.addEventListener("touchstart", startPress);
    card.addEventListener("touchend", cancelPress);
  });

  function toggleSelect(card) {
    const name = card.dataset.name;
    const price = parseInt(card.dataset.price);
    const index = selectedStyles.findIndex((s) => s.name === name);

    if (index === -1) {
      selectedStyles.push({ name, price });
      card.classList.add("selected");
      showPopup("Added to Order ✅");
    } else {
      selectedStyles.splice(index, 1);
      card.classList.remove("selected");
      showPopup("Removed ❌");
    }

    goToOrderBtn.disabled = selectedStyles.length === 0;
  }

  function showPopup(msg) {
    popup.textContent = msg;
    popup.style.opacity = 1;
    setTimeout(() => (popup.style.opacity = 0), 1200);
  }

  goToOrderBtn.addEventListener("click", () => {
    localStorage.setItem("selectedStyles", JSON.stringify(selectedStyles));
    window.location.href = "book-order.html";
  });
}

// =========================
// BOOK ORDER PAGE
// =========================
if (path.includes("book-order.html")) {
  const selectedContainer = document.getElementById("selectedStyles");
  const totalPriceEl = document.getElementById("totalPrice");
  const resetForm = document.getElementById("resetForm");
  const savedStyles = JSON.parse(localStorage.getItem("selectedStyles")) || [];

  if (savedStyles.length > 0) {
    let total = 0;
    savedStyles.forEach((item) => {
      const div = document.createElement("div");
      div.className = "selected-item";
      div.innerHTML = `<p>👗 ${item.name} — ₦${item.price.toLocaleString()}</p>`;
      selectedContainer.appendChild(div);
      total += item.price;
    });
    totalPriceEl.textContent = total.toLocaleString();
  } else {
    selectedContainer.innerHTML =
      "<p>No styles selected. Go back to <a href='view-styles.html'>View Styles</a>.</p>";
  }

  // Reset
  if (resetForm) {
    resetForm.addEventListener("click", () => {
      localStorage.removeItem("selectedStyles");
      selectedContainer.innerHTML = "";
      totalPriceEl.textContent = "0";
    });
  }

  // Copy account number
  const copyBtn = document.getElementById("copyBtn");
  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      const acctNum = document.getElementById("acctNum").textContent.trim();
      navigator.clipboard.writeText(acctNum);
      copyBtn.textContent = "Copied!";
      setTimeout(() => (copyBtn.textContent = "Copy"), 2000);
    });
  }
}