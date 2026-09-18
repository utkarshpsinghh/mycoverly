let cart = JSON.parse(localStorage.getItem('coverlyCart') || '[]');
// Sanitize any stale or corrupt mock entries
cart = cart.filter(item => {
  if (!item) return false;
  const n = (item.designName || item.title || item.name || '').toLowerCase();
  return !n.includes('rugged clear case') && !n.includes('galaxy a16 rugged');
});
try { localStorage.setItem('coverlyCart', JSON.stringify(cart)); } catch(e) {}

let products = window.products || [];
const Rs = x => '₹' + Math.round(Number(x) || 0).toLocaleString('en-IN');

function resolveItem(x) {
  const p = (products && products.length)
    ? (products.find(prod => (x.designId && (prod.designId === x.designId || String(prod.id) === String(x.designId))) || String(prod.id) === String(x.id) || prod.id === x.id) || {})
    : {};
  const name = x.designName || p.n || p.name || 'Custom Phone Case';
  const brand = x.phoneBrand || p.brand || 'Coverly';
  const model = x.phoneModel ? `${x.phoneBrand ? x.phoneBrand + ' ' : ''}${x.phoneModel}`.trim() : (p.model || 'Custom Case');
  const price = Number(x.unitPrice || x.price || p.p || p.price || 349);
  const image = x.image || p.image || '';
  const type = x.customizationType || x.type || p.type || 'Standard Matte';

  return {
    id: x.designId || x.id || p.id || 'CVR-CUSTOM',
    designId: x.designId || x.id || p.designId || 'CVR-CUSTOM',
    name,
    designName: name,
    brand,
    model,
    price,
    type,
    image,
    quantity: Number(x.q) || 1
  };
}

const subtotal = () => cart.reduce((s, x) => s + (resolveItem(x).price * (x.q || 1)), 0);

const calc = () => {
  const s = subtotal();
  const codRadio = document.querySelector('[name=method]:checked');
  const cod = codRadio ? codRadio.value === 'cod' : false;
  const paid = cod ? Math.min(199, s) : Math.round(s * 0.9);
  return {
    subtotal: s,
    discount: cod ? 0 : s - paid,
    paid,
    remaining: cod ? s - paid : 0,
    method: cod ? 'COD' : 'UPI Prepaid'
  };
};

function render() {
  if (!cart.length) {
    location.href = 'index.html';
    return;
  }
  const orderItems = document.getElementById('orderItems');
  const calculation = document.getElementById('calculation');
  if (orderItems) {
    orderItems.innerHTML = cart.map(x => {
      const p = resolveItem(x);
      return `<div class="order-line">
        <span>${p.designName}<small>${p.model} · ${p.type} × ${x.q}</small></span>
        <b>${Rs(p.price * x.q)}</b>
      </div>`;
    }).join('');
  }
  if (calculation) {
    const c = calc();
    calculation.innerHTML = `<div class="calculation">
      <p><span>Subtotal</span><b>${Rs(c.subtotal)}</b></p>
      ${c.discount ? `<p><span>Prepaid discount</span><b>−${Rs(c.discount)}</b></p>` : ''}
      <p><span>${c.method === 'COD' ? 'Pay now (COD advance)' : 'Amount payable now'}</span><b>${Rs(c.paid)}</b></p>
      ${c.remaining ? `<p><span>Remaining on delivery</span><b>${Rs(c.remaining)}</b></p>` : ''}
    </div>`;
  }
}

document.addEventListener('change', e => {
  if (e.target && e.target.name === 'method') render();
});

function generateOrderId() {
  return 'CVR-' + (crypto.getRandomValues ? crypto.getRandomValues(new Uint32Array(1))[0].toString().slice(-6) : Math.floor(100000 + Math.random() * 900000));
}

function encodeParams(o) {
  return Object.entries(o).map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');
}

document.addEventListener('DOMContentLoaded', () => {
  render();
  const form = document.getElementById('checkoutForm');
  const paymentDialog = document.getElementById('paymentDialog');
  const paymentContent = document.getElementById('paymentContent');

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const fd = new FormData(form);
      const c = calc();
      const orderId = generateOrderId();
      const merchantId = (window.COVERLY_CONFIG && window.COVERLY_CONFIG.MERCHANT_UPI_ID) || 'paytm.s1i6534@pty';
      const merchantName = (window.COVERLY_CONFIG && window.COVERLY_CONFIG.MERCHANT_NAME) || 'Coverly';
      const upi = encodeParams({
        pa: merchantId,
        pn: merchantName,
        am: c.paid.toFixed(2),
        cu: 'INR',
        tn: orderId
      });
      const qr = 'https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=' + encodeURIComponent('upi://pay?' + upi);

      if (paymentContent) {
        paymentContent.innerHTML = `<div class="payment">
          <p class="eyebrow">${c.method}</p>
          <h2>Pay ${Rs(c.paid)}</h2>
          <p class="notice">Scan with Google Pay, PhonePe, Paytm, BHIM or another supported UPI app. Your payment is not verified automatically.</p>
          <img src="${qr}" alt="UPI QR code for ${Rs(c.paid)}">
          <div class="upi-id">${merchantId}</div>
          <div class="action-row">
            <a class="button" href="upi://pay?${upi}">OPEN UPI APP</a>
            <button class="button secondary" type="button" onclick="navigator.clipboard.writeText('${merchantId}')">COPY UPI ID</button>
          </div>
          <form class="utr" id="utrForm">
            <label>UTR / Transaction Reference Number *<input name="utr" required placeholder="Enter UTR / transaction ID"></label>
            <button class="button" type="submit">CONFIRM PAYMENT</button>
          </form>
        </div>`;
      }
      if (paymentDialog && typeof paymentDialog.showModal === 'function') {
        paymentDialog.showModal();
      }
      const utrForm = document.getElementById('utrForm');
      if (utrForm) {
        utrForm.addEventListener('submit', x => submitOrder(x, fd, c, orderId));
      }
    });
  }
});

function submitOrder(e, fd, c, orderId) {
  e.preventDefault();
  const utrForm = document.getElementById('utrForm');
  const utrValue = utrForm ? (new FormData(utrForm).get('utr') || '') : '';
  const order = {
    orderId,
    createdAt: new Date().toISOString(),
    customerName: fd.get('name') || '',
    phone: fd.get('phone') || '',
    email: fd.get('email') || '',
    address: `${fd.get('address') || ''}, ${fd.get('area') || ''}`.trim(),
    city: fd.get('city') || '',
    state: fd.get('state') || '',
    pincode: fd.get('pincode') || '',
    items: cart.map(x => resolveItem(x)),
    subtotal: c.subtotal,
    discount: c.discount,
    total: c.method === 'COD' ? c.subtotal : c.paid,
    paymentMethod: c.method,
    amountPaid: c.paid,
    amountRemaining: c.remaining,
    utr: utrValue,
    paymentStatus: c.method === 'COD' ? 'Advance Verification Pending' : 'Verification Pending',
    orderStatus: 'Order Placed'
  };

  try { localStorage.setItem('coverlyLastOrder', JSON.stringify(order)); } catch(err) {}

  let orders = [];
  try { orders = JSON.parse(localStorage.getItem('coverlyOrders') || '[]'); } catch(err) {}
  orders.push(order);
  try { localStorage.setItem('coverlyOrders', JSON.stringify(orders)); } catch(err) {}

  const endpoint = window.coverlyOrderWebhook;
  if (endpoint) {
    try {
      fetch(endpoint, {
        method: 'POST',
        mode: 'no-cors',
        keepalive: true,
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(order)
      }).catch(() => {});
    } catch(err) {}
  }

  try { localStorage.removeItem('coverlyCart'); } catch(err) {}
  location.href = 'order-success.html';
}
