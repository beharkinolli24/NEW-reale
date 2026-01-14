// Dark/Light Toggle
const themeBtn = document.getElementById('theme-toggle');
themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  document.body.classList.toggle('light');
});

// Modal
const modal = document.getElementById('account-modal');
const modalVideo = modal.querySelector('video');
const modalTitle = document.getElementById('modal-title');
const modalInfo = document.getElementById('modal-info');
const modalPrice = document.getElementById('modal-price');
const closeBtn = modal.querySelector('.close');

// Account data
const accountsData = {
  1: { title: "MA x DEADKILLI #01", info: "21 Mythic • 50+ Legendary • EU • Level 75", price: "€180", video: "images/account1.mp4" },
  2: { title: "MA x DEADKILLI #02", info: "18 Mythic • 40+ Legendary • NA • Level 70", price: "€150", video: "images/account2.mp4" },
  3: { title: "MA x DEADKILLI #03", info: "15 Mythic • 35+ Legendary • AS • Level 65", price: "€130", video: "images/account3.mp4" }
};

// Open modal
document.querySelectorAll('.view-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const accId = e.target.parentElement.getAttribute('data-acc');
    const data = accountsData[accId];
    modalTitle.textContent = data.title;
    modalInfo.textContent = data.info;
    modalPrice.textContent = data.price;
    modalVideo.querySelector('source').src = data.video;
    modalVideo.load();
    modal.style.display = 'block';
  });
});

// Close modal
closeBtn.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', (e) => { if(e.target == modal) modal.style.display = 'none'; });
