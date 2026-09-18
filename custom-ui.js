/* Visible custom-case builder: select a brand, then type the exact phone model. */
window.addEventListener('load',()=>{
  const brands=['Samsung','Redmi','Xiaomi','POCO','Realme','Vivo','OPPO','Motorola','OnePlus','Google Pixel','Apple iPhone'];
  const modal=document.createElement('div');modal.id='customBuilder';modal.style.cssText='display:none;position:fixed;inset:0;z-index:99;background:#17261f99;padding:18px;overflow:auto';document.body.append(modal);
  window.startCustom = id => {
    const p = products.find(x => String(x.id) === String(id) || (x.designId && String(x.designId) === String(id))) || {};
    const price = p.p || p.price || 349;
    const designName = p.n || p.name || p.title || 'Custom Case';
    const designId = p.designId || ('CVR-' + String(p.id || Date.now()).slice(-6));
    modal.innerHTML = `<div class="custom-sheet"><button class="custom-close" onclick="customBuilder.style.display='none'" aria-label="Close">×</button><header class="builder-hero"><div><p class="eyebrow">CASE STUDIO</p><h2>${designName}</h2></div><span class="builder-price">₹${price}</span></header><p class="model-help">Made for every phone. Choose your brand, then tell us the exact model — we’ll handle the fit.</p><div class="builder-section"><div class="choose-row"><label><span>01 · Phone brand</span><select id="customBrand">${brands.map(x=>`<option>${x}</option>`).join('')}</select></label><label><span>02 · Exact phone model</span><input id="customModel" required maxlength="80" placeholder="Galaxy A15 or iPhone 15"></label></div></div><div class="builder-section personalise-section"><div class="section-title"><b>Make it yours</b><small>Optional — choose any that apply</small></div><div class="choices"><label><input type="checkbox" value="Keep design exactly as shown"><span>Keep as shown</span></label><label><input type="checkbox" value="Change colours"><span>Change colours</span></label><label><input type="checkbox" value="Add text"><span>Add text</span></label><label><input type="checkbox" value="Change background"><span>Change background</span></label></div><textarea id="customRequest" maxlength="500" placeholder="Describe your changes, colours or vibe…"></textarea><input id="personalText" maxlength="30" placeholder="Add a name, initials or short text (optional)"></div><p class="builder-notice"><b>Fit check:</b> every case is cut for the exact phone model you enter.</p><label class="confirm-model"><input id="modelConfirm" type="checkbox"><span>I checked my exact phone model.</span></label><button id="addCustom" class="builder-button">ADD TO BAG <span>· ₹${price}</span></button></div>`;
    addCustom.onclick = () => {
      const model = customModel.value.trim();
      if (!model) return alert('Please enter your exact phone model.');
      if (!modelConfirm.checked) return alert('Please confirm your phone model.');
      const types = [...modal.querySelectorAll('input[type=checkbox]:checked')].filter(x => x !== modelConfirm).map(x => x.value).join(', ') || 'Keep design exactly as shown';
      cart.push({
        id: designId,
        q: 1,
        designId: designId,
        designName: designName,
        unitPrice: price,
        price: price,
        image: p.image || '',
        collection: p.brand || p.collection || '',
        phoneBrand: customBrand.value,
        phoneModel: model,
        customizationType: types,
        customizationRequest: customRequest.value,
        personalText: personalText.value
      });
      localStorage.setItem('coverlyCart', JSON.stringify(cart));
      modal.style.display = 'none';
      renderCart();
      toggleCart(true);
    };
    modal.style.display = 'block';
  };
});
