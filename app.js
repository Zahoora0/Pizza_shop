function getCart() {
  return JSON.parse(localStorage.getItem("cartItems")) || [];
}
function setCart(items) {
  localStorage.setItem("cartItems", JSON.stringify(items));
}
function cartCount() {
  return getCart().reduce((s, i) => s + (i.qty || 0), 0);
}
function updateCartCount() {
  document.querySelectorAll(".cart-count").forEach(el => el.textContent = cartCount());
}
function money(n) {
  return "$" + Number(n).toFixed(2);
}

function getMenu() {
  const existing = JSON.parse(localStorage.getItem("menuItems"));
  if (existing && Array.isArray(existing) && existing.length) return existing;

  const seed = [
    { id: crypto.randomUUID(), name: "Classic Pepperoni", price: 14.99, desc: "Premium pepperoni, rich tomato sauce, mozzarella.", active: true, category: "Pizza", img: "IMG/pepperoni.png" },
    { id: crypto.randomUUID(), name: "Golden Cheese Pie", price: 13.99, desc: "Mozzarella layers with a golden finish.", active: true, category: "Pizza", img: "IMG/cheese.png" },
    { id: crypto.randomUUID(), name: "Garden Supreme", price: 15.99, desc: "Olives, peppers, onions, herbs.", active: true, category: "Pizza", img: "IMG/garden.png" }
  ];
  localStorage.setItem("menuItems", JSON.stringify(seed));
  return seed;
}
function setMenu(items) {
  localStorage.setItem("menuItems", JSON.stringify(items));
}
function validateMenuItem({ name, price }) {
  const n = (name || "").trim();
  const p = Number(price);
  if (!n) return "Name is required.";
  if (!Number.isFinite(p) || p <= 0) return "Price must be a number greater than 0.";
  return "";
}

function getSession() {
  return JSON.parse(localStorage.getItem("session")) || null;
}
function setSession(session) {
  localStorage.setItem("session", JSON.stringify(session));
}
function logout() {
  localStorage.removeItem("session");
}
function requireAdmin() {
  const s = getSession();
  if (!s || s.role !== "admin") location.href = "login.html";
}

function createOrderFromCart() {
  const cart = getCart();
  if (!cart.length) return null;

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const taxRate = 0.08;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  const order = {
    id: "ORD-" + Math.random().toString(16).slice(2, 8).toUpperCase(),
    createdAt: new Date().toISOString(),
    items: cart,
    subtotal,
    tax,
    total,
    statusIndex: 0,
    statuses: ["Order Received", "Preparing", "Baking", "Out for Delivery", "Delivered"],
    payment: null
  };

  localStorage.setItem("currentOrder", JSON.stringify(order));
  return order;
}
function getOrder() {
  return JSON.parse(localStorage.getItem("currentOrder")) || null;
}
function setOrder(order) {
  localStorage.setItem("currentOrder", JSON.stringify(order));
}
function makeKey(name, size, crust, toppings) {
  return `${name}|${size}|${crust}|${toppings}`;
}

function addItemFromElement(el) {
  const name = el.dataset.item;
  const price = Number(el.dataset.price);

  if (!name || !Number.isFinite(price)) return;

  const size = el.dataset.size || "Medium";
  const crust = el.dataset.crust || "Classic";
  const toppings = el.dataset.toppings || "Cheese";

  const cart = getCart();
  const key = makeKey(name, size, crust, toppings);

  const existing = cart.find(i => i.key === key);
  if (existing) {
    existing.qty = (existing.qty || 0) + 1;
  } else {
    cart.push({
      key,
      name,
      price,
      qty: 1,
      options: { size, crust, toppings }
    });
  }

  setCart(cart);
  updateCartCount();
}

document.addEventListener("click", (e) => {
  const btn = e.target.closest(".add-to-cart, .add-to-cart-menu");
  if (!btn) return;

  
  if (btn.tagName === "A") e.preventDefault();

  addItemFromElement(btn);

  
  if (btn.tagName === "A") {
    const href = btn.getAttribute("href");
    if (href) window.location.href = href;
  }
});

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
});
