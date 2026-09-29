const menuButton=document.querySelector('.menu-button');
const nav=document.querySelector('.nav');
menuButton?.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')==='true';menuButton.setAttribute('aria-expanded',String(!open));nav?.classList.toggle('is-open',!open)});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menuButton?.setAttribute('aria-expanded','false');nav?.classList.remove('is-open')}));

const slides=[...document.querySelectorAll('.hero-slide')];let slideIndex=0;
if(slides.length>1){setInterval(()=>{slides[slideIndex].classList.remove('is-active');slideIndex=(slideIndex+1)%slides.length;slides[slideIndex].classList.add('is-active')},4800)}

const coin=document.querySelector('.coin');
let coinTimer;
function spinCoin(){if(!coin)return;coin.classList.remove('is-spinning');void coin.offsetWidth;coin.classList.add('is-spinning');clearTimeout(coinTimer);coinTimer=setTimeout(()=>coin.classList.remove('is-spinning'),1500)}
coin?.addEventListener('click',spinCoin);
let touchStart=0;coin?.addEventListener('pointerdown',e=>touchStart=e.clientX);coin?.addEventListener('pointerup',e=>{if(Math.abs(e.clientX-touchStart)>14)spinCoin()});

for(const stage of document.querySelectorAll('[data-portrait]')){
  const img=stage.querySelector('img');let dragging=false,startX=0,rot=0,moved=false;
  stage.addEventListener('pointerdown',e=>{dragging=true;moved=false;startX=e.clientX;stage.setPointerCapture?.(e.pointerId)});
  stage.addEventListener('pointermove',e=>{if(!dragging||!img)return;const dx=e.clientX-startX;if(Math.abs(dx)>3)moved=true;rot=Math.max(-36,Math.min(36,dx*.24));img.style.transform=`rotateY(${rot}deg) translateZ(8px)`});
  stage.addEventListener('pointerup',()=>{dragging=false;if(img)img.style.transform='';if(!moved){stage.classList.remove('is-spinning');void stage.offsetWidth;stage.classList.add('is-spinning');setTimeout(()=>stage.classList.remove('is-spinning'),1300)}});
  stage.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();stage.click()}});
  stage.addEventListener('click',e=>{if(e.detail===0){stage.classList.remove('is-spinning');void stage.offsetWidth;stage.classList.add('is-spinning');setTimeout(()=>stage.classList.remove('is-spinning'),1300)}})
}

const observer=new IntersectionObserver(entries=>{for(const e of entries){if(e.isIntersecting)e.target.classList.add('seen')}},{threshold:.08});
document.querySelectorAll('.film-card,.member,.session-card').forEach(el=>observer.observe(el));
