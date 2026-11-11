/* V-Best product pages: cart, quantity, colours, WhatsApp inquiry, ad pixel */
(function () {
  var PIXEL_ID = "677322691667443", GOOGLE_TAG = "";

  // ---- Facebook / Instagram pixel (same pixel as the rest of your site) ----
  if (PIXEL_ID) {
    !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v;
      s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', PIXEL_ID); fbq('track', 'PageView');
  }
  // ---- Google tag (only if you filled GOOGLE_TAG_ID in the generator) ----
  if (GOOGLE_TAG) {
    var g = document.createElement('script'); g.async = true; g.src = 'https://www.googletagmanager.com/gtag/js?id=' + GOOGLE_TAG; document.head.appendChild(g);
    window.dataLayer = window.dataLayer || []; window.gtag = function () { dataLayer.push(arguments); };
    gtag('js', new Date()); gtag('config', GOOGLE_TAG);
  }

  function cartCount() {
    try { var c = JSON.parse(localStorage.getItem('cart') || '[]'); var el = document.getElementById('cart-count'); if (el) el.textContent = c.length; } catch (e) {}
  }
  cartCount();

  var root = document.getElementById('vbProduct');
  if (!root || !root.getAttribute('data-id')) return;      // not a product page
  var d = {
    id: root.getAttribute('data-id'), name: root.getAttribute('data-name'), price: root.getAttribute('data-price'),
    priceNum: Number(root.getAttribute('data-price-num')) || 0, url: root.getAttribute('data-url'),
    img: root.getAttribute('data-img'), imgAbs: root.getAttribute('data-img-abs'), wa: root.getAttribute('data-wa')
  };
  var qty = 1, color = '';
  function fmt(n) { return '\u20A6' + Math.round(n).toLocaleString('en-US'); }
  function track(ev, extra) {
    var o = { content_ids: [d.id], content_type: 'product', content_name: d.name, value: d.priceNum * qty, currency: 'NGN' };
    if (window.fbq) { try { fbq('track', ev, o); } catch (e) {} }
  }
  track('ViewContent');
  if (window.gtag && d.priceNum) { gtag('event', 'view_item', { currency: 'NGN', value: d.priceNum, items: [{ item_id: d.id, item_name: d.name, price: d.priceNum }] }); }

  var inq = document.getElementById('inquiryBtn');
  function updateInquiry() {
    if (!inq) return;
    var m = "Hello, I'm interested in " + d.name + (color ? ' (Colour: ' + color + ')' : '') + (qty > 1 ? ' (Quantity: ' + qty + ')' : '') +
      (d.price ? ' priced at ' + d.price : '') + '\n' + d.url + (d.imgAbs ? '\n' + d.imgAbs : '');
    inq.href = 'https://wa.me/' + d.wa + '?text=' + encodeURIComponent(m);
  }
  if (inq) inq.addEventListener('click', function () { track('Contact'); });

  var qtyNum = document.getElementById('qtyNum'), qtyTotal = document.getElementById('qtyTotal');
  function setQty(n) {
    qty = Math.max(1, Math.min(99, n));
    if (qtyNum) qtyNum.textContent = qty;
    if (qtyTotal) qtyTotal.textContent = (qty > 1 && d.priceNum) ? 'Total: ' + fmt(d.priceNum * qty) : '';
    updateInquiry();
  }
  var qbs = document.querySelectorAll('.qty-btn');
  for (var i = 0; i < qbs.length; i++) {
    qbs[i].addEventListener('click', function () { setQty(qty + (this.getAttribute('data-act') === 'inc' ? 1 : -1)); });
  }

  var cbs = document.querySelectorAll('.color-btn'), sel = document.getElementById('colorSel');
  for (var j = 0; j < cbs.length; j++) {
    cbs[j].addEventListener('click', function () {
      var c = this.getAttribute('data-color');
      color = (color === c) ? '' : c;
      for (var k = 0; k < cbs.length; k++) { cbs[k].classList.toggle('active', cbs[k].getAttribute('data-color') === color); }
      if (sel) sel.textContent = color ? 'Selected: ' + color + ' \u2713' : '';
      updateInquiry();
    });
  }

  var main = document.getElementById('mainImg'), ths = document.querySelectorAll('.thumbs img');
  for (var t = 0; t < ths.length; t++) {
    ths[t].addEventListener('click', function () {
      if (main) main.src = this.getAttribute('data-full');
      for (var u = 0; u < ths.length; u++) { ths[u].classList.toggle('active', ths[u] === this); }
    });
  }

  var add = document.getElementById('addBtn');
  if (add) add.addEventListener('click', function () {
    var cart = [];
    try { cart = JSON.parse(localStorage.getItem('cart') || '[]'); } catch (e) {}
    var item = { name: color ? d.name + ' (Colour: ' + color + ')' : d.name, price: d.price, image: d.img, qty: qty };
    if (color) item.color = color;
    cart.push(item);
    try { localStorage.setItem('cart', JSON.stringify(cart)); } catch (e) {}
    cartCount();
    track('AddToCart');
    if (window.gtag && d.priceNum) { gtag('event', 'add_to_cart', { currency: 'NGN', value: d.priceNum * qty, items: [{ item_id: d.id, item_name: d.name, price: d.priceNum, quantity: qty }] }); }
    alert('Added to cart!');
  });
})();
