/* Extends the existing UPI submission payload with custom-design details. */
window.addEventListener('load',()=>{
  window.premiumPay=function(){
    const endpoint=window.coverlyOrderWebhook||'',error=document.getElementById('premiumPaymentError');
    if(!endpoint){error.textContent='Payment setup is incomplete. Please contact support.';error.style.display='block';return}
    const button=document.querySelector('#premiumPayment .premium-continue');
    const orderId='CVR-'+Date.now().toString(36).toUpperCase();
    const items=cart.map(item=>{const design=products.find(p=>p.id===item.id)||{};return {designId:item.designId||design.designId||'',designName:item.designName||design.n||'',collection:design.brand||'',phoneBrand:item.phoneBrand||'',phoneModel:item.phoneModel||'',customizationType:item.customizationType||'Keep design exactly as shown',customizationRequest:item.customizationRequest||'',personalText:item.personalText||'',referenceImage:item.referenceImage||'',customerNotes:item.customerNotes||'',title:item.designName||design.n||'',model:item.phoneModel||'',material:design.material||'',colour:design.colour||'',quantity:item.q,unitPrice:design.p||0}});
    const subtotal=cartTotal(),isCod=window.selectedPremiumPayment==='cod',amountPaid=isCod?Math.min(199,subtotal):Math.round(subtotal*.9),discount=isCod?0:subtotal-amountPaid;
    const payload={orderId,createdAt:new Date().toISOString(),customer:{name:document.getElementById('pName').value.trim(),phone:document.getElementById('pPhone').value.replace(/\D/g,''),email:document.getElementById('pEmail').value.trim(),address:document.getElementById('pAddress').value.trim(),city:document.getElementById('pCity').value.trim(),state:document.getElementById('pState').value.trim(),pincode:document.getElementById('pPin')?.value.trim()||''},paymentMethod:isCod?'COD':'UPI Prepaid',paymentStatus:isCod?'Advance Verification Pending':'Verification Pending',orderStatus:'Order Placed',subtotal,discount,total:subtotal,amountPaid,amountRemaining:isCod?subtotal-amountPaid:0,items};
    button.disabled=true;button.querySelector('span').textContent='…';
    const body=JSON.stringify(payload);let sent=false;try{sent=navigator.sendBeacon(endpoint,new Blob([body],{type:'text/plain;charset=UTF-8'}))}catch(_){}if(!sent){try{fetch(endpoint,{method:'POST',headers:{'Content-Type':'text/plain;charset=UTF-8'},body,mode:'no-cors',keepalive:true})}catch(_){}}
    const paymentUri=`upi://pay?pa=${merchantUpiId}&pn=Coverly&am=${amountPaid}&cu=INR&tn=${orderId}`;
    window.location.href=paymentUri;
  };
});
