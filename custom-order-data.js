/* Extends the existing UPI submission payload with custom-design details and smooth payment handling. */
window.addEventListener('load', () => {
  function createOrderPayload() {
    const orderId = window.activeCheckoutOrderId || ('CVR-' + (crypto.getRandomValues ? crypto.getRandomValues(new Uint32Array(1))[0].toString(36).toUpperCase().slice(-6) : Math.floor(100000 + Math.random() * 900000)));
    const utr = (document.getElementById('premiumUtrInput')?.value || '').trim();

    const items = (window.cart || cart || []).map(item => {
      const design = (window.products || []).find(p => (item.designId && (p.designId === item.designId || String(p.id) === String(item.designId))) || String(p.id) === String(item.id)) || {};
      return {
        designId: item.designId || design.designId || '',
        designName: item.designName || design.n || '',
        collection: design.brand || item.collection || '',
        phoneBrand: item.phoneBrand || '',
        phoneModel: item.phoneModel || '',
        customizationType: item.customizationType || 'Keep design exactly as shown',
        customizationRequest: item.customizationRequest || '',
        personalText: item.personalText || '',
        referenceImage: item.referenceImage || '',
        customerNotes: item.customerNotes || '',
        title: item.designName || design.n || '',
        model: item.phoneModel || '',
        material: design.material || 'Premium printed finish',
        colour: design.colour || 'Custom print',
        quantity: item.q || 1,
        unitPrice: item.unitPrice || design.p || 349
      };
    });

    const subtotal = typeof window.cartTotal === 'function' ? window.cartTotal() : 499;
    const isCod = (window.selectedPremiumPayment || selectedPremiumPayment) === 'cod';
    const amountPaid = isCod ? Math.min(199, subtotal) : Math.round(subtotal * 0.9);
    const discount = isCod ? 0 : subtotal - amountPaid;

    return {
      orderId,
      createdAt: new Date().toISOString(),
      customerName: document.getElementById('pName')?.value.trim() || '',
      phone: (document.getElementById('pPhone')?.value || '').replace(/\D/g, ''),
      email: document.getElementById('pEmail')?.value.trim() || '',
      address: document.getElementById('pAddress')?.value.trim() || '',
      city: document.getElementById('pCity')?.value.trim() || '',
      state: document.getElementById('pState')?.value.trim() || '',
      pincode: document.getElementById('pPin')?.value.trim() || '',
      customer: {
        name: document.getElementById('pName')?.value.trim() || '',
        phone: (document.getElementById('pPhone')?.value || '').replace(/\D/g, ''),
        email: document.getElementById('pEmail')?.value.trim() || '',
        address: document.getElementById('pAddress')?.value.trim() || '',
        city: document.getElementById('pCity')?.value.trim() || '',
        state: document.getElementById('pState')?.value.trim() || '',
        pincode: document.getElementById('pPin')?.value.trim() || ''
      },
      paymentMethod: isCod ? 'COD' : 'UPI Prepaid',
      paymentStatus: isCod ? 'Advance Verification Pending' : 'Verification Pending',
      orderStatus: 'Order Placed',
      subtotal,
      discount,
      total: subtotal,
      amountPaid,
      amountRemaining: isCod ? subtotal - amountPaid : 0,
      utr,
      items
    };
  }

  window.registerCoverlyOrder = function() {
    const payload = createOrderPayload();
    const endpoint = window.coverlyOrderWebhook || '';

    // Save locally for instant tracking
    try {
      const existingOrders = JSON.parse(localStorage.getItem('coverlyOrders') || '[]');
      // Avoid duplicate entries if tapped multiple times
      const idx = existingOrders.findIndex(o => o.orderId === payload.orderId);
      if (idx >= 0) existingOrders[idx] = payload;
      else existingOrders.unshift(payload);
      localStorage.setItem('coverlyOrders', JSON.stringify(existingOrders.slice(0, 25)));
      localStorage.setItem('coverlyLastOrder', JSON.stringify(payload));
    } catch (_) {}

    // Clear cart
    try {
      localStorage.removeItem('coverlyCart');
      window.cart = [];
      if (typeof window.renderCart === 'function') window.renderCart();
      if (typeof window.syncCoverlyBadges === 'function') window.syncCoverlyBadges();
    } catch (_) {}

    // Transmit order to Google Sheets
    if (endpoint) {
      const body = JSON.stringify(payload);
      let sent = false;
      try {
        sent = navigator.sendBeacon(endpoint, new Blob([body], { type: 'text/plain;charset=UTF-8' }));
      } catch (_) {}
      if (!sent) {
        try {
          fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=UTF-8' }, body, mode: 'no-cors', keepalive: true });
        } catch (_) {}
      }
    }
    return payload;
  };

  window.premiumPay = function(action) {
    const payload = window.registerCoverlyOrder();
    if (action === 'confirm') {
      window.location.href = 'order-success.html';
      return;
    }

    // Launch UPI intent
    const mid = window.merchantUpiId || window.COVERLY_CONFIG?.MERCHANT_UPI_ID || 'paytm.s1i6534@pty';
    const paymentUri = `upi://pay?pa=${mid}&pn=Coverly&am=${payload.amountPaid}&cu=INR&tn=${payload.orderId}`;
    window.location.href = paymentUri;
  };
});
