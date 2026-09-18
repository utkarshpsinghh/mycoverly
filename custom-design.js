/* Design-first catalogue. Existing checkout and payment stay unchanged. */
(()=>{
 const designs=window.COVERLY_DESIGNS||[];
 window.addEventListener('load',()=>{
  products.splice(0);
  designs.forEach((design,i)=>products.push({id:i+1,designId:design.id,n:design.name,title:design.name,brand:design.collection,model:'Custom design',material:'Premium printed finish',style:design.collection,p:design.price,old:design.oldPrice,c:'c'+(i%8+1),colour:'Custom print',colours:['Custom print'],tag:design.collection,image:design.image,description:design.description,tags:design.tags||[]}));
  const collections=[...new Set(designs.map(x=>x.collection))];
  renderProducts=()=>{const q=document.getElementById('search').value.toLowerCase(),collection=document.getElementById('modelFilter').value,items=products.filter(p=>(collection==='All'||p.brand===collection)&&`${p.n} ${p.brand} ${(p.tags||[]).join(' ')}`.toLowerCase().includes(q));document.getElementById('products').innerHTML=items.map(p=>`<article class="product"><div class="image"><span class="pill">${p.brand}</span><span class="model-compatible">All models</span>${p.image?`<img class="cover-photo" src="${p.image}" alt="${p.n} design preview" loading="lazy">`:`<div class="photo-placeholder"><strong>${p.n}</strong>Original design preview</div>`}</div><div class="info"><small>${p.brand}</small><span class="name">${p.n}</span><span class="price">₹${p.p} <span class="old">₹${p.old}</span></span><button class="add" onclick="startCustom(${p.id})">MAKE THIS CASE</button></div></article>`).join('')||'<p class="empty">No designs match that search.</p>'};
  document.querySelector('#models .eyebrow').textContent='Design collections';
  document.querySelector('#models h2').textContent='Explore by vibe';
  document.getElementById('modelFilter').innerHTML='<option value="All">All collections</option>'+collections.map(x=>`<option value="${x}">${x}</option>`).join('');
  document.getElementById('colourFilter').innerHTML='<option value="All">All colours</option><option>Dark</option><option>Pastel</option><option>Chrome</option>';
  document.getElementById('styleFilter').innerHTML='<option value="All">All styles</option><option>Minimal</option><option>Bold</option><option>Illustrated</option>';
  document.querySelector('.hero h1').innerHTML='YOUR DESIGN.<br>YOUR PHONE.<br>YOUR CASE.';
  document.querySelector('.hero p').textContent="Choose a design you love, tell us your phone model, and we'll make it specially for you.";
  document.querySelector('.cta').textContent='CREATE YOUR CASE';
  renderBrands=()=>{document.getElementById('brandGrid').innerHTML=collections.map(collection=>`<button class="brand" onclick="document.getElementById('modelFilter').value='${collection}';renderProducts();document.querySelector('#shop').scrollIntoView({behavior:'smooth'})">${collection}<small>Explore designs</small></button>`).join('')};
  document.getElementById('filters').innerHTML=collections.map(collection=>`<button onclick="document.getElementById('modelFilter').value='${collection}';renderProducts()">${collection}</button>`).join('');
  resetFilters=()=>{document.getElementById('search').value='';document.getElementById('modelFilter').value='All';renderProducts()};
  renderBrands();renderProducts();
 });
})();
