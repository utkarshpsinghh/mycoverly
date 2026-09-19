/* Coverly Custom Case Studio: Polished, interactive case builder */
window.addEventListener('load', () => {
  const PHONE_SUGGESTIONS = {
    'Apple iPhone': ['iPhone 16 Pro Max', 'iPhone 16 Pro', 'iPhone 16 Plus', 'iPhone 16', 'iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15 Plus', 'iPhone 15', 'iPhone 14 Pro Max', 'iPhone 14 Pro', 'iPhone 14', 'iPhone 13', 'iPhone 12', 'iPhone 11'],
    'Samsung': ['Galaxy S25 Ultra', 'Galaxy S25', 'Galaxy S24 Ultra', 'Galaxy S24+', 'Galaxy S24', 'Galaxy S23 Ultra', 'Galaxy S23', 'Galaxy A55 5G', 'Galaxy A35 5G', 'Galaxy A15', 'Galaxy M35', 'Galaxy M34'],
    'OnePlus': ['OnePlus 13', 'OnePlus 13R', 'OnePlus 12', 'OnePlus 12R', 'OnePlus 11', 'OnePlus Nord 4', 'OnePlus Nord CE4', 'OnePlus Nord CE3 Lite'],
    'Google Pixel': ['Pixel 9 Pro XL', 'Pixel 9 Pro', 'Pixel 9', 'Pixel 8a', 'Pixel 8 Pro', 'Pixel 8', 'Pixel 7a', 'Pixel 7 Pro'],
    'Xiaomi': ['Xiaomi 14 Ultra', 'Xiaomi 14 Civi', 'Xiaomi 14', 'Xiaomi 13 Pro'],
    'Redmi': ['Redmi Note 14 Pro+', 'Redmi Note 14 Pro', 'Redmi Note 14', 'Redmi Note 13 Pro+', 'Redmi Note 13 Pro', 'Redmi Note 13', 'Redmi 13', 'Redmi 12'],
    'Realme': ['Realme 13 Pro+', 'Realme 13', 'Realme 12 Pro+', 'Realme 12', 'Realme C67', 'Realme C55'],
    'Vivo': ['Vivo X100 Pro', 'Vivo V40 Pro', 'Vivo V40', 'Vivo V30 Pro', 'Vivo V30', 'Vivo T3 5G', 'Vivo Y200', 'Vivo Y29'],
    'OPPO': ['OPPO Reno 12 Pro', 'OPPO Reno 12', 'OPPO Reno 11', 'OPPO F27 Pro+', 'OPPO K12x', 'OPPO A79'],
    'Motorola': ['Moto Edge 50 Ultra', 'Moto Edge 50 Pro', 'Moto Edge 50 Fusion', 'Moto G85', 'Moto G84', 'Moto G64', 'Moto G34'],
    'POCO': ['POCO X7 Pro', 'POCO X6 Pro', 'POCO X6', 'POCO M6 Pro', 'POCO F6'],
    'Nothing': ['Nothing Phone (2a) Plus', 'Nothing Phone (2a)', 'Nothing Phone (2)', 'Nothing Phone (1)', 'CMF Phone 1'],
    'Other': []
  };

  let modal = document.getElementById('customBuilder');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'customBuilder';
    modal.style.cssText = 'display:none;position:fixed;inset:0;z-index:99;overflow:auto';
    document.body.append(modal);
  }

  // Close modal when clicking on backdrop
  modal.addEventListener('click', e => {
    if (e.target === modal) modal.style.display = 'none';
  });

  window.toggleModelGuidance = () => {
    const box = document.getElementById('modelGuidanceBox');
    const btn = document.getElementById('modelHelpBtn');
    if (!box) return;
    const isHidden = box.style.display === 'none';
    box.style.display = isHidden ? 'block' : 'none';
    if (btn) btn.textContent = isHidden ? 'How to find your model ▴ (Hide guide)' : 'Not sure about your exact model? View model finder guide ▾';
  };

  window.handleOptionToggle = el => {
    const orig = document.getElementById('optOriginal');
    if (el.id === 'optOriginal') {
      if (el.checked) {
        document.getElementById('optText').checked = false;
        document.getElementById('optColor').checked = false;
        document.getElementById('optNote').checked = false;
      }
    } else {
      if (el.checked && orig) {
        orig.checked = false;
      }
    }
  };

  window.updateCharCounter = el => {
    const counter = document.getElementById('personalCharCount');
    if (counter) counter.textContent = `${el.value.length}/25`;
  };

  window.startCustom = id => {
    const p = (window.products || []).find(x => String(x.id) === String(id) || (x.designId && String(x.designId) === String(id))) || {};
    const price = Number(p.p || p.price || 349);
    const designName = p.n || p.name || p.title || 'Custom Phone Case';
    const designId = p.designId || ('CVR-' + String(p.id || Date.now()).slice(-6));
    const collection = p.brand || p.collection || 'Custom Studio';

    modal.innerHTML = `
      <div class="custom-sheet" role="dialog" aria-modal="true" aria-labelledby="builderDesignTitle">
        <button class="custom-close" onclick="document.getElementById('customBuilder').style.display='none'" aria-label="Close modal">×</button>

        <!-- Header with Design Info & Price -->
        <header class="builder-hero">
          <div class="builder-thumb-col">
            ${p.image ? `<img class="builder-thumb-img" src="${p.image}" alt="${designName}">` : `<div class="builder-thumb-fallback">Coverly</div>`}
          </div>
          <div class="builder-meta-col">
            <span class="builder-pill">${collection}</span>
            <h2 id="builderDesignTitle">${designName}</h2>
            <div class="builder-subtext">Precision crafted for your phone · Free pan-India delivery</div>
          </div>
          <div class="builder-price-col">
            <div class="builder-price-val">₹${price}</div>
            <div class="builder-price-tag">10% OFF with UPI</div>
          </div>
        </header>

        <!-- Progress Steps -->
        <div class="builder-progress">
          <span class="step-pill active"><b>1</b> Phone model</span>
          <span class="step-pill"><b>2</b> Customization</span>
          <span class="step-pill"><b>3</b> Fit guarantee</span>
        </div>

        <!-- Section 1: Numbered Phone Fields -->
        <div class="builder-section">
          <div class="section-title">
            <b>01 · Phone Specifications <span class="required-star">*</span></b>
            <small>Select your brand, then enter your exact model</small>
          </div>

          <div class="choose-row">
            <label class="builder-field">
              <span>Brand *</span>
              <select id="customBrand">
                ${Object.keys(PHONE_SUGGESTIONS).map(b => `<option value="${b}">${b}</option>`).join('')}
              </select>
            </label>

            <label class="builder-field">
              <span>Exact Phone Model *</span>
              <input id="customModel" required maxlength="80" placeholder="e.g. iPhone 16 Pro, Galaxy S24, Nord 4" autocomplete="off" list="phoneSuggestions">
              <datalist id="phoneSuggestions"></datalist>
            </label>
          </div>

          <!-- Model-Finder Guidance -->
          <div class="model-finder-wrap">
            <button type="button" id="modelHelpBtn" class="model-help-toggle" onclick="toggleModelGuidance()">
              Not sure about your exact model? View model finder guide ▾
            </button>
            <div id="modelGuidanceBox" class="model-guidance-box" style="display:none">
              <div class="guidance-grid">
                <div class="guidance-card">
                  <div class="guidance-title">On iPhone</div>
                  <p>Open <b>Settings</b> → Tap <b>General</b> → Tap <b>About</b> → See <b>Model Name</b> (e.g. iPhone 15 Pro).</p>
                </div>
                <div class="guidance-card">
                  <div class="guidance-title">On Android (Samsung, OnePlus, etc.)</div>
                  <p>Open <b>Settings</b> → Scroll down to <b>About Phone</b> (or <i>About Device</i>) → Check <b>Model Name</b>.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 2: Clearer Optional Customization Controls -->
        <div class="builder-section personalise-section">
          <div class="section-title">
            <b>02 · Personalize Your Case (Optional)</b>
            <small>Leave as original or select your preferences</small>
          </div>

          <div class="custom-options-grid">
            <label class="opt-pill">
              <input type="checkbox" id="optOriginal" value="Keep design exactly as shown" checked onchange="handleOptionToggle(this)">
              <span>Keep as shown</span>
            </label>
            <label class="opt-pill">
              <input type="checkbox" id="optText" value="Add custom text / monogram" onchange="handleOptionToggle(this)">
              <span>Add text / name</span>
            </label>
            <label class="opt-pill">
              <input type="checkbox" id="optColor" value="Adjust colors or background" onchange="handleOptionToggle(this)">
              <span>Color adjustments</span>
            </label>
            <label class="opt-pill">
              <input type="checkbox" id="optNote" value="Special instructions" onchange="handleOptionToggle(this)">
              <span>Special note</span>
            </label>
          </div>

          <!-- Personal Text Input -->
          <div class="builder-field" style="margin-top:14px">
            <div class="field-header">
              <span>Personal Text / Name (Optional)</span>
              <small id="personalCharCount" class="char-count">0/25</small>
            </div>
            <input id="personalText" maxlength="25" placeholder="Add a name, initials, or year (e.g. 'Alex', 'R.K.', '1998')" oninput="updateCharCounter(this)">
            <small class="field-hint">We'll place your text tastefully to harmonize with the artwork.</small>
          </div>

          <!-- Special Request Textarea -->
          <div class="builder-field" style="margin-top:14px">
            <span>Color or Customization Requests (Optional)</span>
            <textarea id="customRequest" maxlength="350" placeholder="e.g. Please use a soft cream background instead of white, or make colors slightly warmer."></textarea>
          </div>
        </div>

        <!-- Section 3: Fit Guarantee & Confirmation Language -->
        <div class="builder-section guarantee-section">
          <div class="fit-guarantee-card">
            <div class="fit-badge">✓ 100% PRECISION FIT GUARANTEE</div>
            <p>Every case is custom-milled to order. Precision cutouts align with your lenses, speakers, microphones, and charging port with responsive button action.</p>
          </div>

          <label class="confirm-model-label">
            <input id="modelConfirm" type="checkbox" checked required>
            <span>
              <b>I confirm my phone brand and model are accurate.</b>
              <small>Coverly verifies compatibility and manufactures to this exact model specification.</small>
            </span>
          </label>
        </div>

        <!-- Action Button -->
        <button id="addCustom" class="builder-button" type="button">
          ADD TO BAG · ₹${price} →
        </button>
        <p class="builder-subnote">10% instant discount on prepaid UPI at checkout · Free delivery across India</p>
      </div>
    `;

    // Populate phone suggestions
    const brandSelect = document.getElementById('customBrand');
    const modelInput = document.getElementById('customModel');
    const suggestions = document.getElementById('phoneSuggestions');

    const updateDatalist = () => {
      const list = PHONE_SUGGESTIONS[brandSelect.value] || [];
      if (suggestions) {
        suggestions.innerHTML = list.map(m => `<option value="${m}">`).join('');
      }
    };
    brandSelect.addEventListener('change', updateDatalist);
    updateDatalist();

    // Add to bag button click
    const addBtn = document.getElementById('addCustom');
    addBtn.onclick = () => {
      const model = modelInput.value.trim();
      const modelConfirm = document.getElementById('modelConfirm');

      if (!model || model.length < 2) {
        alert('Please enter your exact phone model (e.g. iPhone 15, Galaxy S24, OnePlus 12).');
        modelInput.focus();
        return;
      }
      if (!modelConfirm || !modelConfirm.checked) {
        alert('Please check the confirmation box to verify your phone model.');
        modelConfirm.focus();
        return;
      }

      // Collect chosen customization options
      const optOriginal = document.getElementById('optOriginal');
      const optText = document.getElementById('optText');
      const optColor = document.getElementById('optColor');
      const optNote = document.getElementById('optNote');

      const selectedTypes = [];
      if (optText && optText.checked) selectedTypes.push('Add text / name');
      if (optColor && optColor.checked) selectedTypes.push('Color adjustments');
      if (optNote && optNote.checked) selectedTypes.push('Special note');
      if (selectedTypes.length === 0 && optOriginal && optOriginal.checked) selectedTypes.push('Original design');

      const customizationType = selectedTypes.join(', ') || 'Original design';
      const customRequestVal = (document.getElementById('customRequest')?.value || '').trim();
      const personalTextVal = (document.getElementById('personalText')?.value || '').trim();

      cart.push({
        id: designId,
        q: 1,
        designId: designId,
        designName: designName,
        unitPrice: price,
        price: price,
        image: p.image || '',
        collection: collection,
        phoneBrand: brandSelect.value,
        phoneModel: model,
        customizationType: customizationType,
        customizationRequest: customRequestVal,
        personalText: personalTextVal
      });

      try {
        localStorage.setItem('coverlyCart', JSON.stringify(cart));
      } catch (err) {}

      modal.style.display = 'none';
      if (typeof window.renderCart === 'function') window.renderCart();
      if (typeof window.toggleCart === 'function') window.toggleCart(true);
    };

    modal.style.display = 'block';
    modelInput.focus();
  };
});
