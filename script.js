const products = [
 {id:1,name:"Studio Wireless Headphones",category:"Electronics",price:2499,old:3299,rating:4.8,desc:"Comfortable over-ear headphones with clear sound, soft ear cushions and a clean everyday design.",image:"https://images.unsplash.com/photo-150?auto=format&fit=crop&w=700&q=80"},
 {id:2,name:"Minimal Everyday Backpack",category:"Accessories",price:1499,old:1899,rating:4.6,desc:"A practical everyday backpack with a spacious main compartment and a minimal silhouette.",image:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=80"},
 {id:3,name:"Classic Analog Watch",category:"Fashion",price:1899,old:2499,rating:4.7,desc:"A versatile analog watch designed to pair easily with casual and formal outfits.",image:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80"},
 {id:4,name:"Ceramic Table Lamp",category:"Home",price:1299,old:1599,rating:4.5,desc:"A warm, understated table lamp that adds a soft glow to your reading corner or bedside.",image:"https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=700&q=80"},
 {id:5,name:"Everyday Running Shoes",category:"Fashion",price:2799,old:3499,rating:4.8,desc:"Lightweight everyday shoes with a cushioned feel for walks, errands and casual wear.",image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80"},
 {id:6,name:"Smart Fitness Band",category:"Electronics",price:2199,old:2799,rating:4.4,desc:"A simple fitness companion for tracking daily activity and keeping your routine on track.",image:"https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=700&q=80"},
 {id:7,name:"Insulated Travel Bottle",category:"Home",price:699,old:899,rating:4.6,desc:"A reusable bottle for keeping your favourite drink close at work, class or on the move.",image:"https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=700&q=80"},
 {id:8,name:"Classic Sunglasses",category:"Accessories",price:999,old:1299,rating:4.3,desc:"A timeless frame shape that works with everyday outfits and weekend plans.",image:"https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=80"}
];
const money = n => "₹" + n.toLocaleString("en-IN");
let cart = JSON.parse(localStorage.getItem("shopzone-cart") || "[]");
let wishlist = JSON.parse(localStorage.getItem("shopzone-wishlist") || "[]");
let activeCategory = "All", searchTerm = "";
const $ = id => document.getElementById(id);
const save = () => {localStorage.setItem("shopzone-cart",JSON.stringify(cart));localStorage.setItem("shopzone-wishlist",JSON.stringify(wishlist));updateCounts();};
const product = id => products.find(p=>p.id===Number(id));
function updateCounts(){ $("cartCount").textContent=cart.reduce((s,x)=>s+x.qty,0);$("wishlistCount").textContent=wishlist.length;$("drawerCartCount").textContent=`(${cart.reduce((s,x)=>s+x.qty,0)})`; }
function renderProducts(){
 let list=products.filter(p=>(activeCategory==="All"||p.category===activeCategory)&&(p.name.toLowerCase().includes(searchTerm)||p.category.toLowerCase().includes(searchTerm)));
 const sort=$("sortSelect").value;
 if(sort==="low")list.sort((a,b)=>a.price-b.price);if(sort==="high")list.sort((a,b)=>b.price-a.price);if(sort==="rating")list.sort((a,b)=>b.rating-a.rating);
 $("resultCount").textContent=`${list.length} products`;
 $("emptyState").classList.toggle("hidden",list.length!==0);
 $("productGrid").innerHTML=list.map(p=>`<article class="product-card" data-open="${p.id}">
  <div class="product-image"><button class="heart-btn ${wishlist.includes(p.id)?"saved":""}" data-wish="${p.id}" aria-label="Add ${p.name} to wishlist">${wishlist.includes(p.id)?"♥":"♡"}</button><img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.src='https://placehold.co/600x600/f1f3f5/65717e?text=ShopZone'"></div>
  <div class="product-info"><div class="product-category">${p.category}</div><div class="product-name">${p.name}</div><div class="rating">★ ${p.rating.toFixed(1)} <span style="color:#9aa0a6">· Demo rating</span></div><div class="product-price">${money(p.price)} <span class="old-price">${money(p.old)}</span></div><button class="add-btn" data-add="${p.id}">ADD TO CART</button></div></article>`).join("");
}
function openDrawer(which){$("overlay").classList.remove("hidden");const el=$(which);el.classList.add("open");el.setAttribute("aria-hidden","false");}
function closeDrawers(){document.querySelectorAll(".drawer").forEach(d=>{d.classList.remove("open");d.setAttribute("aria-hidden","true")});$("overlay").classList.add("hidden");}
function addToCart(id){id=Number(id);const found=cart.find(x=>x.id===id);if(found)found.qty++;else cart.push({id,qty:1});save();renderCart();toast("Added to cart");}
function renderCart(){
 const wrap=$("cartItems");
 if(!cart.length){wrap.innerHTML='<div class="drawer-empty">Your cart is empty.<br><br>Find something you like and add it here.</div>';$("cartBottom").classList.add("hidden");}
 else{wrap.innerHTML=cart.map(x=>{const p=product(x.id);return `<div class="cart-row"><img src="${p.image}" alt="${p.name}" onerror="this.src='https://placehold.co/100x100?text=Item'"><div><h4>${p.name}</h4><p>${money(p.price)}</p><div class="quantity"><button data-qty="${p.id}" data-delta="-1">−</button><span>${x.qty}</span><button data-qty="${p.id}" data-delta="1">+</button></div><button class="remove-btn" data-remove="${p.id}">Remove</button></div><strong>${money(p.price*x.qty)}</strong></div>`}).join("");$("cartBottom").classList.remove("hidden");}
 $("cartSubtotal").textContent=money(cart.reduce((s,x)=>s+product(x.id).price*x.qty,0));updateCounts();
}
function renderWishlist(){
 $("wishlistItems").innerHTML=wishlist.length?wishlist.map(id=>{const p=product(id);return `<div class="cart-row"><img src="${p.image}" alt="${p.name}"><div><h4>${p.name}</h4><p>${money(p.price)}</p><button class="remove-btn" data-unwish="${id}">Remove</button></div><button class="add-btn" data-add="${id}">Add</button></div>`}).join(""):'<div class="drawer-empty">You have no saved items yet.</div>';
}
function toggleWish(id){id=Number(id);wishlist=wishlist.includes(id)?wishlist.filter(x=>x!==id):[...wishlist,id];save();renderProducts();renderWishlist();}
function showProduct(id){const p=product(id);$("productDetails").innerHTML=`<div class="detail-layout"><img src="${p.image}" alt="${p.name}" onerror="this.src='https://placehold.co/600x600?text=ShopZone'"><div><div class="product-category">${p.category}</div><h2>${p.name}</h2><div class="rating">★ ${p.rating.toFixed(1)} · Demo rating</div><div class="detail-price">${money(p.price)} <span class="old-price">${money(p.old)}</span></div><p>${p.desc}</p><button class="primary-btn" data-add="${p.id}">Add to cart <span>→</span></button></div></div>`;$("productModal").classList.remove("hidden");}
function toast(message){let t=document.createElement("div");t.textContent=message;t.style.cssText="position:fixed;bottom:25px;left:50%;transform:translateX(-50%);background:#20252b;color:white;padding:12px 18px;border-radius:4px;font-size:12px;z-index:30";document.body.appendChild(t);setTimeout(()=>t.remove(),1500);}
function openCheckout(){if(!cart.length)return;closeDrawers();$("checkoutPage").classList.remove("hidden");$("checkoutItems").innerHTML=cart.map(x=>`<div class="summary-row"><span>${product(x.id).name} × ${x.qty}</span><strong>${money(product(x.id).price*x.qty)}</strong></div>`).join("");$("checkoutTotal").textContent=money(cart.reduce((s,x)=>s+product(x.id).price*x.qty,0));window.scrollTo(0,0);}
document.addEventListener("click",e=>{
 const add=e.target.closest("[data-add]");if(add){e.stopPropagation();addToCart(add.dataset.add);if(!$("productModal").classList.contains("hidden"))$("productModal").classList.add("hidden");return;}
 const wish=e.target.closest("[data-wish]");if(wish){e.stopPropagation();toggleWish(wish.dataset.wish);return;}
 const unwish=e.target.closest("[data-unwish]");if(unwish){toggleWish(unwish.dataset.unwish);return;}
 const qty=e.target.closest("[data-qty]");if(qty){const item=cart.find(x=>x.id===Number(qty.dataset.qty));item.qty+=Number(qty.dataset.delta);if(item.qty<=0)cart=cart.filter(x=>x!==item);save();renderCart();return;}
 const rem=e.target.closest("[data-remove]");if(rem){cart=cart.filter(x=>x.id!==Number(rem.dataset.remove));save();renderCart();return;}
 const card=e.target.closest("[data-open]");if(card)showProduct(card.dataset.open);
});
$("categories").addEventListener("click",e=>{const b=e.target.closest("[data-category]");if(!b)return;activeCategory=b.dataset.category;document.querySelectorAll(".category").forEach(x=>x.classList.toggle("active",x===b));renderProducts();});
$("sortSelect").addEventListener("change",renderProducts);
$("searchForm").addEventListener("submit",e=>{e.preventDefault();searchTerm=$("searchInput").value.trim().toLowerCase();renderProducts();$("shop").scrollIntoView({behavior:"smooth"});});
$("searchInput").addEventListener("input",()=>{searchTerm=$("searchInput").value.trim().toLowerCase();renderProducts();});
$("shopNow").onclick=()=>$("shop").scrollIntoView({behavior:"smooth"});
$("cartNav").onclick=()=>{renderCart();openDrawer("cartDrawer")};
$("wishlistNav").onclick=()=>{renderWishlist();openDrawer("wishlistDrawer")};
$("overlay").onclick=closeDrawers;
document.querySelectorAll(".close-drawer").forEach(b=>b.onclick=closeDrawers);
$("modalClose").onclick=()=>$("productModal").classList.add("hidden");
$("productModal").addEventListener("click",e=>{if(e.target===$("productModal"))$("productModal").classList.add("hidden")});
$("checkoutBtn").onclick=openCheckout;
$("backToStore").onclick=()=>$("checkoutPage").classList.add("hidden");
$("checkoutForm").addEventListener("submit",e=>{e.preventDefault();if(!cart.length)return;const data=new FormData(e.target);const orderId="SZ"+Date.now().toString().slice(-7);$("orderMessage").textContent=`Order ${orderId} is confirmed for ${data.get("name")}. This is a prototype confirmation; no payment was taken.`;cart=[];save();renderCart();$("checkoutPage").classList.add("hidden");$("successModal").classList.remove("hidden");});
$("continueShopping").onclick=()=>{$("successModal").classList.add("hidden");window.scrollTo({top:0,behavior:"smooth"});};
updateCounts();renderProducts();renderCart();renderWishlist();
