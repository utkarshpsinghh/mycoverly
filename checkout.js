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
      ${c.discount ? `<p><span>Prepaid discount (10% OFF)</span><b>−${Rs(c.discount)}</b></p>` : ''}
      <p><span>${c.method === 'COD' ? 'Pay now (COD advance deposit)' : 'Amount payable now'}</span><b>${Rs(c.paid)}</b></p>
      ${c.remaining ? `<p><span>Remaining due on delivery</span><b>${Rs(c.remaining)}</b></p>` : ''}
    </div>`;
  }
}

document.addEventListener('change', e => {
  if (e.target && e.target.name === 'method') render();
});

function generateOrderId() {
  return 'CVR-' + (crypto.getRandomValues ? crypto.getRandomValues(new Uint32Array(1))[0].toString(36).toUpperCase().slice(-6) : Math.floor(100000 + Math.random() * 900000));
}

function encodeParams(o) {
  return Object.entries(o).map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');
}

let activeOrderData = null;
let chkUpiLaunched = false;

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
      const upiParams = encodeParams({
        pa: merchantId,
        pn: merchantName,
        am: c.paid.toFixed(2),
        cu: 'INR',
        tn: orderId
      });
      const upiUrl = 'upi://pay?' + upiParams;
      const qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=' + encodeURIComponent(upiUrl);

      activeOrderData = {
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
        utr: '',
        paymentStatus: c.method === 'COD' ? 'Advance Verification Pending' : 'Verification Pending',
        orderStatus: 'Order Placed'
      };

      chkUpiLaunched = false;

      if (paymentContent) {
        paymentContent.innerHTML = `<div class="payment" style="text-align:center;padding:8px 4px">
          <p class="eyebrow" style="margin:0 0 6px;color:var(--muted);font-family:'DM Mono',monospace;letter-spacing:.08em;font-size:11px">${c.method === 'COD' ? 'COD ADVANCE DEPOSIT' : 'PREPAID UPI (10% OFF)'}</p>
          <h2 style="font-size:32px;letter-spacing:-.04em;margin:0 0 4px;color:var(--ink)">Pay ${Rs(c.paid)}</h2>
          <div style="font-size:12px;font-family:'DM Mono',monospace;color:var(--muted);margin-bottom:20px">Order ID: <b>${orderId}</b></div>

          <div style="margin-bottom:14px">
            <button type="button" class="button" id="chkUpiBtn" onclick="handleChkPayClick('${upiUrl}')" style="display:flex;align-items:center;justify-content:center;gap:8px;font-size:14px;padding:16px;border-radius:6px">
              <span id="chkUpiText">Pay with UPI App (GPay / PhonePe / Paytm)</span> <span id="chkUpiArrow">→</span>
            </button>
            <p id="chkUpiNote" style="display:none;font-size:12px;color:var(--pine);font-weight:700;margin:12px 0 4px">
              ✓ UPI app launched. Once payment is done, tap above to confirm your order!
            </p>
          </div>

          <div style="margin-top:14px;border-top:1px solid var(--line);padding-top:14px">
            <button type="button" class="button secondary" style="font-size:12px;padding:9px 16px;width:auto;margin:0 auto 12px;border-radius:4px" onclick="toggleChkQr()">
              <span id="chkQrLabel">Scan QR ▾</span>
            </button>
            <div id="chkQrBox" style="display:none;background:#fff;border:1px solid var(--line);border-radius:8px;padding:16px;margin-top:8px">
              <img src="${qrUrl}" alt="UPI QR code" style="width:170px;height:170px;display:block;margin:0 auto 10px">
              <div class="upi-id" style="font-size:12px;margin-bottom:12px">${merchantId}</div>
              <button class="button" type="button" style="padding:12px 16px;font-size:13px" onclick="finalizeCheckout()">
                I have completed payment · Confirm Order →
              </button>
            </div>
          </div>
        </div>`;
      }
      if (paymentDialog && typeof paymentDialog.showModal === 'function') {
        paymentDialog.showModal();
      }
    });
  }
});

function handleChkPayClick(upiUrl) {
  if (chkUpiLaunched) {
    finalizeCheckout();
    return;
  }
  chkUpiLaunched = true;
  const btnText = document.getElementById('chkUpiText');
  const btnArrow = document.getElementById('chkUpiArrow');
  const note = document.getElementById('chkUpiNote');

  if (btnText) btnText.textContent = "✓ I've completed payment — Confirm Order";
  if (btnArrow) btnArrow.textContent = "→";
  if (note) note.style.display = 'block';

  // Open UPI app without interrupting it
  window.location.href = upiUrl;
}

function toggleChkQr() {
  const box = document.getElementById('chkQrBox');
  const label = document.getElementById('chkQrLabel');
  if (!box) return;
  const isHidden = box.style.display === 'none';
  box.style.display = isHidden ? 'block' : 'none';
  if (label) {
    label.textContent = isHidden ? 'Hide QR ▴' : 'Scan QR ▾';
  }
}

function finalizeCheckout() {
  if (!activeOrderData) return;
  const order = activeOrderData;

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
