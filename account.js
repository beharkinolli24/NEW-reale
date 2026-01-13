// Merr parametrit e URL
const urlParams = new URLSearchParams(window.location.search);
const accId = urlParams.get('acc');

// Data e accounts
const accountsData = {
  "1": {
    name: "MA x DEADKILLI #01",
    img: "images/account1-1.jpg",
    info: "21 Mythic • 50+ Legendary • EU • Level 75",
    price: "€180"
  },
  "2": {
    name: "MA x DEADKILLI #02",
    img: "images/account2-1.jpg",
    info: "18 Mythic • 40+ Legendary • NA • Level 70",
    price: "€150"
  },
  "3": {
    name: "MA x DEADKILLI #03",
    img: "images/account3-1.jpg",
    info: "15 Mythic • 35+ Legendary • AS • Level 65",
    price: "€130"
  }
};

const buyBtn = document.getElementById('buy-btn');

// Shfaq account dhe setup link për kontakt
if (accountsData[accId]) {
  const data = accountsData[accId];

  document.getElementById('account-img').src = data.img;
  document.getElementById('account-name').textContent = data.name;
  document.getElementById('account-info').textContent = data.info;
  document.getElementById('account-price').textContent = data.price;

  // Mailto link
  const email = "beharkinolli25@gmail.com";
  const subject = encodeURIComponent("PUBG Account Order");
  const body = encodeURIComponent(`Hi, I want to buy ${data.name} - ${data.info} - ${data.price}`);
  buyBtn.href = `mailto:${email}?subject=${subject}&body=${body}`;

  // Opsionale WhatsApp link
  // const waNumber = "355123456789";
  // buyBtn.href = `https://wa.me/${waNumber}?text=${body}`;

} else {
  document.querySelector('.account-detail').innerHTML = "<p>Account not found!</p>";
}
