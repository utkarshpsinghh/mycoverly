window.addEventListener('load',()=>{
  const hero=document.querySelector('.hero-copy');
  hero.querySelector('.eyebrow').textContent='CUSTOM CASE STUDIO';
  hero.querySelector('h1').innerHTML='Your design.<br>Your phone.<br><i>Your case.</i>';
  hero.querySelector('p').className='studio-sub';
  hero.querySelector('p').textContent="Pick a design you love. It works with your phone — Android or iPhone. We'll make it just for you.";
  hero.querySelector('.cta').textContent='EXPLORE DESIGNS →';
  hero.querySelector('.cta').insertAdjacentHTML('afterend','<div class="compatibility">One design, made for your exact phone</div>');
  document.querySelector('.hero').insertAdjacentHTML('afterend','<section class="studio-steps" aria-label="How Coverly works"><div class="studio-step"><b>01</b><div><strong>Pick a design</strong><span>Find a vibe you love.</span></div></div><div class="studio-step"><b>02</b><div><strong>Tell us your phone</strong><span>Android or iPhone — type your exact model.</span></div></div><div class="studio-step"><b>03</b><div><strong>Make it yours</strong><span>Add text or a change request, then we create it.</span></div></div></section>');
  document.querySelector('#shop .toolbar').insertAdjacentHTML('beforebegin','<div class="studio-note"><b>Every design works with your phone.</b> Select a design first; you’ll choose your exact Android or iPhone model on the next screen.</div>');
  const baseRenderCart=window.renderCart;
  window.renderCart=()=>{baseRenderCart();document.querySelectorAll('#cartItems .cart-item').forEach((el,index)=>{const item=cart[index];if(!item||!item.phoneModel)return;const info=el.querySelector('div[style="flex:1"]');if(info)info.querySelector('small').outerHTML=`<span class="cart-custom">${item.phoneBrand} ${item.phoneModel}${item.customizationRequest?`<br>Custom: ${item.customizationRequest}`:''}${item.personalText?`<br>Text: ${item.personalText}`:''}</span>`})};
  window.renderCart();
});
