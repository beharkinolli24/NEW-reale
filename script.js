// ----------------------------
// DARK / LIGHT TOGGLE
// ----------------------------
const themeBtn = document.getElementById('theme-toggle');
themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  document.body.classList.toggle('light');
});

// ----------------------------
// ARRAY ME ACCOUNT
// ----------------------------
const accountsData = [
  {
    id: 1,
    title: "MA x DEADKILLI #01",
    info: "21 Mythic • 50+ Legendary • EU • Level 75",
    price: "€180",
    cover: "images/account1-cover.jpg", // screenshot ose video e shkurtër
    video: "images/account1.mp4"       // video e plotë për modal
  },
  {
    id: 2,
    title: "MA x DEADKILLI #02",
    info: "18 Mythic • 40+ Legendary • NA • Level 70",
    price: "€150",
    cover: "images/account2-cover.jpg",
    video: "images/account2.mp4"
  }
  // SHTO ACCOUNT TE TJERE KETU
];

// ----------------------------
// GENERO CARDS AUTOMATIK
// ----------------------------
const grid = document.querySelector('.accounts-grid');

function generateCards() {
  grid.innerHTML = ""; // pastro grid
  accountsData.forEach(acc => {
    const div = document.createElement('div');
    div.classList.add('account-card');
    div.setAttribute('data-acc', acc.id);

    div.innerHTML = `
      <img src="${acc.cover}" alt="${acc.title}" class="cover-video">
      <h2>${acc.title}</h2>
      <button class="btn view-btn">View Details</button>
    `;

    grid.appendChild(div);
  });
}

// Fillojme gjenerimin e cards
generateCards();

// ----------------------------
// MODAL
// ----------------------------
const modal = document.getElementById('account-modal');
const modalVideo = modal.querySelector('video');
const modalTitle = document.getElementById('modal-title');
const modalInfo = document.getElementById('modal-info');
const modalPrice = document.getElementById('modal-price');
const closeBtn = modal.querySelector('.close');

// OPEN MODAL
grid.addEventListener('click', (e) => {
  if (e.target.classList.contains('view-btn')) {
    const accId = e.target.parentElement.getAttribute('data-acc');
    const data = accountsData.find(a => a.id == accId);

    modalTitle.textContent = data.title;
    modalInfo.textContent = data.info;
    modalPrice.textContent = data.price;

    modalVideo.querySelector('source').src = data.video;
    modalVideo.load();

    modal.style.display = 'block';
  }
});

// CLOSE MODAL
closeBtn.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', (e) => { 
  if (e.target == modal) modal.style.display = 'none'; 
});

// ----------------------------
// SHTO ACCOUNT TE RI
// Vetem shto nje objekt ne accountsData dhe thirr generateCards()
// ----------------------------
function addAccount(id, title, info, price, cover, video) {
  accountsData.push({id, title, info, price, cover, video});
  generateCards();
}
