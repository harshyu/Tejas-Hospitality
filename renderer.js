const api = window.api;
let menu = [];
let cart = [];
function money(x){ return '₹' + x.toFixed(2); }
async function init(){
  menu = await api.loadMenu();
  renderMenu();
  renderCart();
}
function renderMenu(){
  const el = document.getElementById('menu-list');
  el.innerHTML = '';
  menu.forEach(item => {
    const div = document.createElement('div');
    div.className = 'item';
    div.innerHTML = `<span>${item.name} <small style="color:#666">(${item.category})</small></span><strong>${money(item.price)}</strong>`;
    div.onclick = () => addToCart(item);
    el.appendChild(div);
  });
}
function addToCart(item){
  const existing = cart.find(c=>c.id===item.id);
  if(existing){ existing.qty += 1; }
  else{ cart.push({ id: item.id, name: item.name, price: item.price, qty: 1 }); }
  renderCart();
}
function renderCart(){
  const el = document.getElementById('cart');
  el.innerHTML = '';
  cart.forEach(row => {
    const div = document.createElement('div');
    div.className = 'cart-row';
    div.innerHTML = `<div>${row.name} x${row.qty}</div><div>${money(row.price*row.qty)} <button data-id="${row.id}" class="btn-dec">-</button> <button data-id="${row.id}" class="btn-inc">+</button> <button data-id="${row.id}" class="btn-rem">x</button></div>`;
    el.appendChild(div);
  });
  document.querySelectorAll('.btn-inc').forEach(b=>b.onclick=(e)=>changeQty(e.target.dataset.id,1));
  document.querySelectorAll('.btn-dec').forEach(b=>b.onclick=(e)=>changeQty(e.target.dataset.id,-1));
  document.querySelectorAll('.btn-rem').forEach(b=>b.onclick=(e)=>removeItem(e.target.dataset.id));
  updateTotals();
}
function changeQty(id, delta){
  const item = cart.find(c=>c.id==id);
  if(!item) return;
  item.qty += delta;
  if(item.qty<=0) cart = cart.filter(c=>c.id!=id);
  renderCart();
}
function removeItem(id){
  cart = cart.filter(c=>c.id!=id);
  renderCart();
}
function updateTotals(){
  const subtotal = cart.reduce((s,i)=>s + i.price*i.qty, 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;
  document.getElementById('subtotal').innerText = money(subtotal);
  document.getElementById('tax').innerText = money(tax);
  document.getElementById('total').innerText = money(total);
}
document.getElementById('btn-clear').onclick = ()=>{ cart = []; renderCart(); };
document.getElementById('btn-save').onclick = async ()=>{
  if(cart.length===0){ alert('Cart empty'); return; }
  const subtotal = cart.reduce((s,i)=>s + i.price*i.qty, 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;
  const invoice = { items: cart, subtotal, tax, total };
  const res = await api.saveInvoice(invoice);
  alert('Saved invoice ID: ' + res.id);
};
document.getElementById('btn-export').onclick = async ()=>{
  if(cart.length===0){ alert('Cart empty'); return; }
  const subtotal = cart.reduce((s,i)=>s + i.price*i.qty, 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;
  const invoice = { items: cart, subtotal, tax, total, id: Date.now() };
  const res = await api.exportPdf(invoice);
  if(!res.canceled) alert('PDF saved: ' + res.filePath);
};
init();
