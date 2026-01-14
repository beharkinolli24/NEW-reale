// Dark/Light Toggle
const themeBtn = document.getElementById('theme-toggle');
themeBtn.addEventListener('click',()=>{
  document.body.classList.toggle('dark');
  document.body.classList.toggle('light');
});

// Data accounts
const accountsData=[
  {
    id:1,
    title:"MA x DEADKILLI #01",
    info:"21 Mythic • 50+ Legendary • EU • Level 75",
    price:"€180",
    cover:"images/BANNER.jpg",  // cover mbetet logo/banner
    driveId:"18L8lWZVPSI6cTYOMhHirqQiKVfiAnSG5",
    topSale:true
  },
  {
    id:2,
    title:"MA x DEADKILLI #02",
    info:"18 Mythic • 40+ Legendary • NA • Level 70",
    price:"€150",
    cover:"images/account2-thumb.jpg",
    driveId:"1Y2EXAMPLEID2",
    topSale:false
  },
  {
    id:3,
    title:"MA x DEADKILLI #03",
    info:"15 Mythic • 35+ Legendary • AS • Level 65",
    price:"€130",
    cover:"images/account3-thumb.jpg",
    driveId:"1Y3EXAMPLEID3",
    topSale:false
  }
];

// Gjenero cards me cover (logo/foto)
const grid=document.querySelector('.accounts-grid');
accountsData.forEach(acc=>{
  const div=document.createElement('div');
  div.classList.add('account-card');
  div.setAttribute('data-acc',acc.id);

  div.innerHTML=`
    ${acc.topSale?'<div class="top-sale">Top Sale</div>':''}
    <img src="${acc.cover}" alt="${acc.title}">
    <h2>${acc.title}</h2>
    <button class="btn view-btn">View Details</button>
  `;
  grid.appendChild(div);
});

// Modal (video nga Drive)
const modal=document.getElementById('account-modal');
const modalVideo=document.getElementById('modal-video');
const modalTitle=document.getElementById('modal-title');
const modalInfo=document.getElementById('modal-info');
const modalPrice=document.getElementById('modal-price');
const closeBtn=modal.querySelector('.close');

grid.addEventListener('click',(e)=>{
  if(e.target.classList.contains('view-btn')){
    const accId=e.target.parentElement.getAttribute('data-acc');
    const data=accountsData.find(a=>a.id==accId);
    modalTitle.textContent=data.title;
    modalInfo.textContent=data.info;
    modalPrice.textContent=data.price;
    // video hapet në modal vetëm
    modalVideo.src=`https://drive.google.com/file/d/${data.driveId}/preview`;
    modal.style.display='block';
  }
});

// Close modal
closeBtn.addEventListener('click',()=>modal.style.display='none');
window.addEventListener('click',e=>{if(e.target==modal) modal.style.display='none';});
