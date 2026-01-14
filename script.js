// ----------------------------
// DARK / LIGHT TOGGLE
// ----------------------------
const themeBtn = document.getElementById("theme-toggle");
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  document.body.classList.toggle("light");
});

// ----------------------------
// ACCOUNT DATA
// ----------------------------
const accountsData = [
  {
    id: 1,
    title: "MA x DEADKILLI #01",
    info: "21 Mythic • 50+ Legendary • EU • Level 75",
    price: "€180",
    cover: "images/account1-cover.jpg",
    video: "images/account1.mp4"
  },
  {
    id: 2,
    title: "MA x DEADKILLI #02",
    info: "18 Mythic • 40+ Legendary • NA • Level 70",
    price: "€150",
    cover: "images/account2-cover.jpg",
    video: "images/account2.mp4"
  }
];

// ----------------------------
// GENERATE CARDS
// ----------------------------
const grid = document.querySelector(".accounts-grid");

function generateCards() {
  grid.innerHTML = "";
  accountsData.forEach(acc => {
    const card = document.createElement("div");
    card.className = "account-card";
    card.dataset.id = acc.id;

    card.innerHTML = `
      <img src="${acc.cover}" alt="${acc.title}">
      <h2>${acc.title}</h2>
      <button class="btn view-btn">View Details</button>
    `;

    grid.appendChild(card);
  });
}

generateCards();

// ----------------------------
// MODAL
// ----------------------------
const modal = document.getElementById("account-modal");
const modalVideo = modal.querySelector("video");
const modalTitle = document.getElementById("modal-title");
const modalInfo = document.getElementById("modal-info");
const modalPrice = document.getElementById("modal-price");
const closeBtn = modal.querySelector(".close");

// OPEN MODAL (STABLE VERSION)
grid.addEventListener("click", e => {
  if (!e.target.classList.contains("view-btn")) return;

  const id = e.target.parentElement.dataset.id;
  const acc = accountsData.find(a => a.id == id);

  modalTitle.textContent = acc.title;
  modalInfo.textContent = acc.info;
  modalPrice.textContent = acc.price;

  // RESET VIDEO (SHUME E RENDESISHME)
  modalVideo.pause();
  modalVideo.src = acc.video;
  modalVideo.load();
  modalVideo.play();

  modal.style.display = "flex";
});

// CLOSE MODAL
closeBtn.onclick = () => {
  modalVideo.pause();
  modalVideo.src = "";
  modal.style.display = "none";
};

window.onclick = e => {
  if (e.target === modal) {
    modalVideo.pause();
    modalVideo.src = "";
    modal.style.display = "none";
  }
};
