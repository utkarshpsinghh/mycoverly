/* Catalogue loading, image handling, zoom, and checkout/cart image fixes. */
(() => {
  document.body.classList.add('catalog-loading');
  document.body.insertAdjacentHTML('afterbegin', '<div id="catalogLoader" role="status"><div class="loader-mark">COVER<span>LY</span></div><div class="loader-orbit"></div><strong>Loading fresh designs</strong><small>Getting the latest from our studio</small></div>');

  window.showDesignImage = id => {
    const design = products.find(product => product.id === id);
    if (!design) return;
    let lightbox = document.getElementById('designLightbox');
    if (!lightbox) {
      lightbox = document.createElement('div');
      lightbox.id = 'designLightbox';
      document.body.append(lightbox);
    }
    lightbox.innerHTML = `<button aria-label="Close image" onclick="designLightbox.classList.remove('show')">×</button><div class="lightbox-card">${design.image ? `<img src="${design.image}" alt="${design.n} enlarged design preview">` : `<div class="lightbox-placeholder"><strong>${design.n}</strong><span>Design preview</span></div>`}<p>${design.n}<small>${design.brand} · Works with all models</small></p></div>`;
    lightbox.classList.add('show');
  };

  window.addEventListener('load', () => {
    const originalRenderCart = window.renderCart;
    window.renderCart = () => {
      originalRenderCart();
      document.querySelectorAll('#cartItems .cart-item').forEach((element, index) => {
        const item = cart[index];
        const design = item && products.find(product => product.id === item.id);
        const thumb = element.querySelector('.thumb');
        if (!design || !thumb) return;
        thumb.innerHTML = design.image ? `<img src="${design.image}" alt="${design.n} design preview" loading="lazy">` : `<span class="thumb-fallback">${design.n.slice(0, 2)}</span>`;
        thumb.classList.add('design-thumb');
      });
    };

    const originalPremiumSummary = window.premiumSummary;
    window.premiumSummary = () => {
      originalPremiumSummary();
      const summaryTitle = document.querySelector('.order-summary h3');
      if (summaryTitle) summaryTitle.textContent = 'Made for your phone.';
      document.querySelectorAll('#premiumItems .order-line').forEach((line, index) => {
        const item = cart[index];
        const design = item && products.find(product => product.id === item.id);
        const productLine = line.querySelector('.order-product');
        if (!design || !productLine) return;
        productLine.querySelector('.checkout-thumb')?.remove();
        productLine.insertAdjacentHTML('afterbegin', design.image ? `<img class="checkout-thumb design-checkout-img" src="${design.image}" alt="${design.n} design preview">` : `<span class="checkout-thumb design-thumb-fallback">${design.n.slice(0, 2)}</span>`);
        const text = productLine.querySelector('span:last-child');
        if (text) {
          text.firstChild.textContent = design.n;
          const small = text.querySelector('small');
          if (small) small.textContent = `${item.phoneBrand || 'Your phone'} ${item.phoneModel || ''} · Custom case · ${item.q} × ₹${design.p}`.replace(/\s+/g, ' ').trim();
        }
      });
    };
    window.renderCart();
  });
})();
