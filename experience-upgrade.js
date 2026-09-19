/* Catalogue loading, image handling, zoom, and checkout/cart image fixes. */
(() => {
  document.body.classList.add('catalog-loading');
  document.body.insertAdjacentHTML('afterbegin', '<div id="catalogLoader" role="status" aria-live="polite"><div class="loader-badge">CUSTOM CASE STUDIO</div><div class="loader-mark">cover<i>ly</i></div><div class="loader-orbit"></div><strong>Loading fresh designs</strong><small>Getting the latest from our studio</small></div>');

  window.showDesignImage = id => {
    const design = products.find(product => product.id === id);
    if (!design) return;
    let lightbox = document.getElementById('designLightbox');
    if (!lightbox) {
      lightbox = document.createElement('div');
      lightbox.id = 'designLightbox';
      document.body.append(lightbox);
    }
    lightbox.innerHTML = `<button aria-label="Close image" onclick="designLightbox.classList.remove('show')">×</button><div class="lightbox-card">${design.image ? `<img src="${design.image}" alt="${design.n} enlarged design preview" onerror="this.onerror=null;this.style.display='none';if(this.nextElementSibling)this.nextElementSibling.style.display='grid';"><div class="lightbox-placeholder" style="display:none"><strong>${design.n}</strong><span>Design preview</span></div>` : `<div class="lightbox-placeholder"><strong>${design.n}</strong><span>Design preview</span></div>`}<p>${design.n}<small>${design.brand} · Works with all models</small></p></div>`;
    lightbox.classList.add('show');
  };

  window.addEventListener('load', () => {
    const originalRenderCart = window.renderCart;
    window.renderCart = () => {
      originalRenderCart();
      document.querySelectorAll('#cartItems .cart-item').forEach((element, index) => {
        const item = cart[index];
        if (!item) return;
        const design = products.find(product => (item.designId && (product.designId === item.designId || String(product.id) === String(item.designId))) || String(product.id) === String(item.id)) || {};
        const thumb = element.querySelector('.thumb');
        if (!thumb) return;
        const img = item.image || design.image;
        const name = item.designName || design.n || 'Custom case';
        thumb.innerHTML = img ? `<img src="${img}" alt="${name} design preview" loading="lazy" onerror="this.onerror=null;this.style.display='none';if(this.nextElementSibling)this.nextElementSibling.style.display='grid';"><span class="thumb-fallback" style="display:none">${name.slice(0, 2)}</span>` : `<span class="thumb-fallback">${name.slice(0, 2)}</span>`;
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
        if (!item) return;
        const design = products.find(product => (item.designId && (product.designId === item.designId || String(product.id) === String(item.designId))) || String(product.id) === String(item.id)) || {};
        const productLine = line.querySelector('.order-product');
        if (!productLine) return;
        productLine.querySelector('.checkout-thumb')?.remove();
        const img = item.image || design.image;
        const name = item.designName || design.n || 'Custom case';
        const price = item.unitPrice || design.p || 349;
        productLine.insertAdjacentHTML('afterbegin', img ? `<img class="checkout-thumb design-checkout-img" src="${img}" alt="${name} design preview" onerror="this.onerror=null;this.style.display='none';if(this.nextElementSibling)this.nextElementSibling.style.display='grid';"><span class="checkout-thumb design-thumb-fallback" style="display:none">${name.slice(0, 2)}</span>` : `<span class="checkout-thumb design-thumb-fallback">${name.slice(0, 2)}</span>`);
        const text = productLine.querySelector('span:last-child');
        if (text) {
          text.firstChild.textContent = name;
          const small = text.querySelector('small');
          if (small) small.textContent = `${item.phoneBrand || 'Your phone'} ${item.phoneModel || ''} · Custom case · ${item.q} × ₹${price}`.replace(/\s+/g, ' ').trim();
        }
      });
    };
    window.renderCart();
  });
})();
