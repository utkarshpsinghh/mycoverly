/* Progressive catalogue loading for large Google Sheets collections. */
(()=>{
  const style=document.createElement('link');style.rel='stylesheet';style.href='load-more.css';document.head.append(style);
  const install=()=>{
    const PAGE_SIZE=12;
    let visible=PAGE_SIZE;
    const grid=()=>document.getElementById('products');
    const update=()=>{
      const productGrid=grid();if(!productGrid)return;
      const cards=[...productGrid.querySelectorAll('.product')];
      const old=document.getElementById('catalogPagination');if(old)old.remove();
      const control=document.getElementById('coverlyLoadMore')||document.createElement('div');
      control.id='coverlyLoadMore';control.className='load-more-flow';
      if(!cards.length){control.remove();return}
      const shown=Math.min(visible,cards.length);
      cards.forEach((card,index)=>{card.style.display='';card.hidden=index>=visible});
      const remaining=Math.max(0,cards.length-shown);
      control.innerHTML=`<span>Showing <b>${shown}</b> of <b>${cards.length}</b> designs</span>${remaining?'<button type="button">Load more <i>↓</i></button>':'<small>You’ve seen every design ✦</small>'}`;
      control.querySelector('button')?.addEventListener('click',()=>{visible+=PAGE_SIZE;update();document.getElementById('coverlyLoadMore')?.scrollIntoView({behavior:'smooth',block:'nearest'})});
      if(!control.isConnected)productGrid.parentElement.append(control);
    };
    const baseRender=window.renderProducts;
    if(!baseRender||baseRender.__coverlyLoadMore)return;
    const progressiveRender=()=>{visible=PAGE_SIZE;baseRender();update()};
    progressiveRender.__coverlyLoadMore=true;
    window.renderProducts=progressiveRender;
    window.updateCatalogPagination=update;
    update();
  };
  window.addEventListener('load',install);
  window.addEventListener('coverlydesignsready',install);
})();
