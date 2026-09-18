window.addEventListener('load', () => {
  const hero = document.querySelector('.hero-copy');
  if (hero) {
    const eyebrow = hero.querySelector('.eyebrow');
    if (eyebrow) eyebrow.textContent = 'CUSTOM CASE STUDIO';
    const h1 = hero.querySelector('h1');
    if (h1) h1.innerHTML = 'Your design.<br>Your phone.<br><i>Your case.</i>';
    const p = hero.querySelector('p');
    if (p) {
      p.className = 'studio-sub';
      p.textContent = "Pick a design you love. It works with your phone — Android or iPhone. We'll make it just for you.";
    }
  }

  const tag = document.querySelector('.tag');
  if (tag) tag.innerHTML = 'DESIGNED<br>FOR YOUR PHONE<br>✓';

  const baseRenderCart = window.renderCart;
  if (typeof baseRenderCart === 'function' && !baseRenderCart.__customEnhanced) {
    const enhancedRenderCart = () => {
      baseRenderCart();
      document.querySelectorAll('#cartItems .cart-item').forEach((el, index) => {
        const item = (window.cart || [])[index];
        if (!item || !item.phoneModel) return;
        const info = el.querySelector('div[style="flex:1"]');
        if (info && !el.querySelector('.cart-custom')) {
          const small = info.querySelector('small');
          if (small) {
            small.insertAdjacentHTML('afterend', `
              <span class="cart-custom" style="display:block;font-size:11px;color:var(--muted);margin-top:4px">
                <b>${item.phoneBrand || ''} ${item.phoneModel}</b>
                ${item.personalText ? `<br>Text: "${item.personalText}"` : ''}
                ${item.customizationRequest ? `<br>Custom: ${item.customizationRequest}` : ''}
              </span>
            `);
          }
        }
      });
    };
    enhancedRenderCart.__customEnhanced = true;
    window.renderCart = enhancedRenderCart;
    window.renderCart();
  }
});
