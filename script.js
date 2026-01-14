// Dark/Light Toggle
const themeBtn = document.getElementById('theme-toggle');
themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  document.body.classList.toggle('light');
});

// Accounts Data
const accountsData = [
  { id:1, title:"MA x DEADKILLI #01", info:"21 Mythic • 50+ Legendary • EU • Level 75", price:"€180", cover:"images/account1-cover.mp4", video:"images/account1.mp4" },
  { id:2, title:"MA x DEADKILLI #02", info:"18 Mythic • 40+ Legendary • NA • Level 70", price:"€150", cover:"images/account2-cover.mp4", video:"images/account2.mp4" },
  { id:3, title:"MA x DEADKILLI #03", info:"15 Mythic • 35+ Legendary • AS • Level 65", price:"€130", cover:"images/account3-cover.mp4", video:"images/account3.mp4" }
];

// Generate Cards
const grid = document.querySelector('.accounts-grid');
accountsData.forEach(acc => {
  const div = document.createElement('div');
  div.classList.add('account-card');
  div.setAttribute('data-acc', acc.id);
  div.innerHTML = `
    <video autoplay muted loop playsinline class="cover-video">
      <source src="${acc.cover}" type="video/mp4">
    </video>
    <h2>${acc.title}</h2>
    <button class="btn view-btn">View Details</button>
  `;
  grid.appendChild(div);
});

// Modal
const modal = document.getElementById('account-modal');
const modalVideo = modal.querySelector('video');
const modalTitle = document.getElementById('modal-title');
const modalInfo = document.getElementById('modal-info');
const modalPrice = document.getElementById('modal-price');
const closeBtn = modal.querySelector('.close');
const contactBtn = document.getElementById('contact-btn');

// Open Modal
grid.addEventListener('click', e => {
  if(e.target.classList.contains('view-btn')){
    const accId = e.target.parentElement.getAttribute('data-acc');
    const data = accountsData.find(a => a.id == accId);
    modalTitle.textContent = data.title;
    modalInfo.textContent = data.info;
    modalPrice.textContent = data.price;
    modalVideo.querySelector('source').src = data.video;
    modalVideo.load();

    // Contact Link
    contactBtn.href = "https://www.instagram.com/deadkilli.pm"; // Ose WhatsApp me mesazh: "https://wa.me/NUMRI?text=Hello,%20I%20want%20to%20buy%20"+encodeURIComponent(data.title)

    modal.style.display = 'block';
  }
});

// Close Modal
closeBtn.addEventListener('click', ()=>modal.style.display='none');
window.addEventListener('click', e => { if(e.target==modal) modal.style.display='none'; });
