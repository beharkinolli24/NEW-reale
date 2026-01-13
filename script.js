// Dark / Light toggle
const toggle = document.getElementById('theme-toggle');
toggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  document.body.classList.toggle('light');
});

// Load account details based on query parameter
const params = new URLSearchParams(window.location.search);
const acc = params.get('acc');

const accounts = {
  "1": {
    img: "images/account1-1.jpg",
    title: "MA x DEADKILLI #01",
    info: "21 Mythic • 50+ Legendary • EU • Level 75",
    price: "€180",
    buy: "https://wa.me/NUMRI_JUAJ?text=Hello,%20I%20want%20to%20buy%20MA%20x%20DEADKILLI%20#01"
  },
  "2": {
    img: "images/account2-1.jpg",
    title: "MA x DEADKILLI #02",
    info: "18 Mythic • 40+ Legendary • NA • Level 70",
    price: "€150",
    buy: "https://wa.me/NUMRI_JUAJ?text=Hello,%20I%20want%20to%20buy%20MA%20x%20DEADKILLI%20#02"
  },
  "3": {
    img: "images/account3-1.jpg",
    title: "MA x DEADKILLI #03",
    info: "15 Mythic • 35+ Legendary • AS • Level 65",
    price: "€130",
    buy: "https://wa.me/NUMRI_JUAJ?text=Hello,%20I%20want%20to%20buy%20MA%20x%20DEADKILLI%20#03"
  }
};

if(acc && accounts[acc]) {
  document.getElementById('acc-img').src = accounts[acc].img;
  document.getElementById('acc-title').innerText = accounts[acc].title;
  document.getElementById('acc-info').innerText = accounts[acc].info;
  document.getElementById('acc-price').innerText = accounts[acc].price;
  document.getElementById('buy-btn').href = accounts[acc].buy;
}
