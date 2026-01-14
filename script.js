// Dark/Light Toggle
const themeBtn = document.getElementById("theme-toggle");
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  document.body.classList.toggle("light");
});

// Accounts Data
const accountsData = [
  {
    id: 1,
    title: "MA x DEADKILLI #01",
    info: "21 Mythic • 50+ Legendary • EU • Level 75",
    price: "€180",
    cover: "images/account1-cover.jpg",
    video: "https://drive.google.com/file/d/1W_2ptZf4myj8b0cmYhyrb-Ml9X5-_8Fl/preview"
  },
  {
    id: 2,
    title: "MA x DEADKILLI #02",
    info: "18 Mythic • 40+ Legendary • NA • Level 70",
    price: "€150",
    cover: "images/account2-cover.jpg",
    video: "https://drive.google.com/file/d/1W_2ptZf4myj8b0cmYhyrb-Ml9X5-_8Fl/preview"
  },
  {
    id: 3,
    title: "MA x DEADKILLI #03",
    info: "15 Mythic • 35+ Legendary • AS • Level 65",
    price: "€130",
    cover: "images/account3-cover.jpg",
    video: "https://drive.google.com/file/d/1W_2ptZf4myj8b0cmYhyrb-Ml9X5-_8Fl/preview"
  }
];

// Generate Cards
const grid = document.querySelector(".accounts-grid");
function generateCards() {
  grid.innerHTML = "";
  accountsData.forEach(acc => {
    const div = document.createElement("div");
    div.classList.add("account-card");
    div.setAttribute("data-acc", acc.id);
    div.innerHTML = `
      <img src="${acc.cover}" alt="${acc.title}" class="cover-video">
      <h2>${acc.title}</h2>
      <button class="btn view-btn">View Details</button>
    `;
    grid.appendChild(div);
  });
}
generateCards();

// Modal
const modal = document.getElementById("account-modal");
const modalFrame = modal.querySelector("iframe");
const modalTitle = document.getElementById("modal-title");
const modalInfo = document.getElementById("modal-info");
const modalPrice = document.getElementById("modal-price");
const closeBtn = modal.querySelector(".close");

// Open Modal
grid.addEventListener("click", e => {
  if(e.target.classList.contains("view-btn")) {
    const accId = e.target.parentElement.getAttribute("data-acc");
    const data = accountsData.find(a => a.id == accId);

    modalTitle.textContent = data.title;
    modalInfo.textContent = data.info;
    modalPrice.textContent = data.price;

    modalFrame.src = data.video; // Google Drive iframe
    modal.style.display = "flex";
  }
});

// Close Modal
closeBtn.addEventListener("click", () => {
  modalFrame.src = "";
  modal.style.display = "none";
});
window.addEventListener("click", e => {
  if(e.target == modal){
    modalFrame.src = "";
    modal.style.display = "none";
  }
});
