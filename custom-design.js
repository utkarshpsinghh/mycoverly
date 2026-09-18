/* Design-first catalogue. It waits for Google Sheets before showing cards. */
(()=>{
  let booted = false;

  function getEstimatedDeliveryText() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const d1 = new Date(now.getTime() + 2 * 86400000);
    const d2 = new Date(now.getTime() + 3 * 86400000);
    return `Estimated delivery: ${d1.getDate()} ${months[d1.getMonth()]} – ${d2.getDate()} ${months[d2.getMonth()]}`;
  }
  window.getEstimatedDeliveryText = getEstimatedDeliveryText;

  function boot() {
    if (booted || !window.COVERLY_DESIGNS_READY || document.readyState !== 'complete') return;
    booted = true;
    const designs = window.COVERLY_DESIGNS || [];
    products.splice(0);
    designs.forEach((design, i) => products.push({
      id: i + 1,
      designId: design.id,
      n: design.name,
      title: design.name,
      brand: design.collection,
      model: 'Custom design',
      material: 'Premium printed finish',
      style: design.collection,
      p: design.price,
      old: design.oldPrice,
      c: 'c' + (i % 8 + 1),
      colour: 'Custom print',
      colours: ['Custom print'],
      tag: design.collection,
      image: design.image,
      description: design.description,
      tags: design.tags || []
    }));

    const collections = [...new Set(designs.map(x => x.collection))];

    renderProducts = () => {
      const q = document.getElementById('search').value.toLowerCase();
      const collection = document.getElementById('modelFilter').value;
      const items = products.filter(p => (collection === 'All' || p.brand === collection) && `${p.n} ${p.brand} ${(p.tags || []).join(' ')}`.toLowerCase().includes(q));

      const deliveryHtml = getEstimatedDeliveryText();

      document.getElementById('products').innerHTML = items.map(p => `
        <article class="product design-card">
          <button class="image design-zoom" onclick="showDesignImage(${p.id})" aria-label="Enlarge ${p.n} preview">
            <span class="pill">${p.brand}</span>
            <span class="model-compatible">All models</span>
            ${p.image ? `<img class="cover-photo" src="${p.image}" alt="${p.n} design preview" loading="lazy">` : `<div class="photo-placeholder"><strong>${p.n}</strong><span>Design preview unavailable</span></div>`}
            <span class="zoom-hint">⌕</span>
          </button>
          <div class="info">
            <small class="design-collection">${p.brand}</small>
            <h3 class="name">${p.n}</h3>
            <p class="design-delivery">${deliveryHtml}</p>
            <span class="price">₹${p.p} <span class="old">₹${p.old}</span></span>
            <button class="add make-case-btn" onclick="startCustom(${p.id})">MAKE THIS CASE</button>
          </div>
        </article>
      `).join('') || '<div class="no-designs"><b>No designs published yet.</b><span>Add active designs in your Google Sheet, then refresh this page.</span></div>';
    };

    const eyebrow = document.querySelector('#models .eyebrow');
    if (eyebrow) eyebrow.textContent = 'Design collections';
    const h2 = document.querySelector('#models h2');
    if (h2) h2.textContent = 'Explore by vibe';

    const modelFilter = document.getElementById('modelFilter');
    if (modelFilter) {
      modelFilter.innerHTML = '<option value="All">All collections</option>' + collections.map(x => `<option value="${x}">${x}</option>`).join('');
    }

    const colFilter = document.getElementById('colourFilter');
    if (colFilter) colFilter.style.display = 'none';
    const styFilter = document.getElementById('styleFilter');
    if (styFilter) styFilter.style.display = 'none';

    renderBrands = () => {
      const grid = document.getElementById('brandGrid');
      if (!grid) return;
      grid.innerHTML = collections.length ? collections.map(collection => `
        <button class="brand" onclick="document.getElementById('modelFilter').value='${collection}';renderProducts();document.querySelector('#shop').scrollIntoView({behavior:'smooth'})">
          ${collection}
          <small>Explore designs</small>
        </button>
      `).join('') : '<p class="empty">Your design collections will appear here.</p>';
    };

    const filters = document.getElementById('filters');
    if (filters) {
      filters.innerHTML = collections.map(collection => `<button onclick="document.getElementById('modelFilter').value='${collection}';renderProducts()">${collection}</button>`).join('');
    }

    resetFilters = () => {
      const search = document.getElementById('search');
      if (search) search.value = '';
      if (modelFilter) modelFilter.value = 'All';
      renderProducts();
    };

    renderBrands();
    renderProducts();
    document.body.classList.remove('catalog-loading');
    document.getElementById('catalogLoader')?.remove();
  }

  window.addEventListener('coverlydesignsready', boot);
  window.addEventListener('load', boot);
})();
