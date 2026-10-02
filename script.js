const $ = s => document.querySelector(s);
const content = $("#content");

const defaultData = {
  appointments: [
    ["BABS-250612-001","Juan Dela Cruz","Cebu Lechon (Whole)","Jun 12, 2025 • 10:00 AM","10","Pending"],
    ["BABS-250612-002","Maria Santos","Lechon Belly Roll","Jun 12, 2025 • 11:30 AM","6","Confirmed"],
    ["BABS-250612-003","Jose Reyes","Porchetta","Jun 12, 2025 • 1:00 PM","8","Pending"],
    ["BABS-250612-004","Ana Lim","Cebu Lechon (Half)","Jun 12, 2025 • 3:00 PM","12","Confirmed"],
    ["BABS-250612-005","Mark Villanueva","Cebu Lechon (Whole)","Jun 12, 2025 • 4:30 PM","15","Pending"]
  ],
  orders: [
    ["#ORD-0001","Juan Dela Cruz","1x Cebu Lechon (Whole)","₱5,500","Preparing"],
    ["#ORD-0002","Maria Santos","2x Lechon Belly Roll","₱8,250","Completed"],
    ["#ORD-0003","Jose Reyes","1x Porchetta","₱3,750","Preparing"],
    ["#ORD-0004","Ana Lim","1x Cebu Lechon (Half)","₱4,200","Completed"],
    ["#ORD-0005","Carla Diaz","1x Lechon Sig (1kg)","₱650","Preparing"]
  ],
  customers: [
    ["CUST-001","Juan Dela Cruz","09XX XXX XXXX","juan@email.com","5"],
    ["CUST-002","Maria Santos","09XX XXX XXXX","maria@email.com","3"],
    ["CUST-003","Jose Reyes","09XX XXX XXXX","jose@email.com","4"],
    ["CUST-004","Ana Lim","09XX XXX XXXX","ana@email.com","6"],
    ["CUST-005","Mark Villanueva","09XX XXX XXXX","mark@email.com","2"]
  ],
  menu: [
    ["Cebu Lechon (Whole)","₱7,500","lechon-whole.jpg"],
    ["Cebu Lechon (Half)","₱3,800","lechon-half.jpg"],
    ["Lechon Belly Roll","₱2,500","lechon-roll.jpg"],
    ["Porchetta","₱2,800","porchetta.jpg"],
    ["Lechon Sig (1kg)","₱650","lechon-sig.jpg"],
    ["Other / Custom Request","Price Varies","lechon-whole.jpg"]
  ]
};
let data = JSON.parse(localStorage.getItem("babsiData") || "null") || defaultData;
function save(){localStorage.setItem("babsiData",JSON.stringify(data));}
function esc(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function status(s){let c=s.toLowerCase().replace(/\s+/g,""); return `<span class="badge ${c}">${esc(s)}</span>`}
function toast(msg){let t=document.createElement("div");t.className="toast";t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.remove(),2200)}
function openModal(html){$("#modal").innerHTML=html;$("#modalBackdrop").classList.add("show")}
function closeModal(){$("#modalBackdrop").classList.remove("show")}
$("#modalBackdrop").addEventListener("click",e=>{if(e.target.id==="modalBackdrop")closeModal()});

const pages = {
dashboard(){
 return `<div class="banner"><div style="position:relative;z-index:2"><h2>› &nbsp;Babsi Baliuag Cebu Lechon</h2><p>Crispy. Juicy. Always Delicious!</p><small>Manage your appointments, orders and menu in one system.</small></div><img class="food" src="assets/lechon-whole.jpg"></div>
 <div class="stats">
  <div class="stat"><div class="sicon">▣</div><div><b>12</b><small>Appointments Today</small></div></div>
  <div class="stat"><div class="sicon">🛒</div><div><b>18</b><small>Orders Today</small></div></div>
  <div class="stat"><div class="sicon">♙</div><div><b>156</b><small>Total Customers</small></div></div>
  <div class="stat"><div class="sicon">₱</div><div><b>₱32,450</b><small>Total Sales Today</small></div></div>
 </div>
 <div class="grid2">
  <div class="card"><div class="card-head"><h3>Recent Appointments</h3><button class="link" onclick="go('appointments')">View All</button></div>${appointmentTable(4)}</div>
  <div class="card"><div class="card-head"><h3>Recent Orders</h3><button class="link" onclick="go('orders')">View All</button></div>${orderTable(4)}</div>
 </div>`;
},
appointments(){
 return `<div class="toolbar"><h2>Appointments</h2><div class="toolbar-right"><input class="search" id="appointmentSearch" placeholder="Search customer, service or date..."><button class="primary" onclick="appointmentForm()">＋ New Appointment</button></div></div>
 <div class="card"><div class="tabs"><button class="tab active">All</button><button class="tab">Pending</button><button class="tab">Confirmed</button><button class="tab">Cancelled</button></div><div id="appointmentTable">${appointmentTable(data.appointments.length)}</div></div>`;
},
orders(){
 return `<div class="toolbar"><h2>Orders</h2><div class="toolbar-right"><input class="search" id="orderSearch" placeholder="Search order..."><button class="primary" onclick="orderForm()">＋ New Order</button></div></div>
 <div class="card"><div class="tabs"><button class="tab active">All</button><button class="tab">Preparing</button><button class="tab">Completed</button><button class="tab">Cancelled</button></div><div id="orderTable">${orderTable(data.orders.length)}</div></div>`;
},
customers(){
 return `<div class="toolbar"><h2>Customers</h2><div class="toolbar-right"><input class="search" id="customerSearch" placeholder="Search customer..."><button class="primary" onclick="customerForm()">＋ Add Customer</button></div></div>
 <div class="card"><div id="customerTable">${customerTable()}</div></div>`;
},
menu(){
 return `<div class="toolbar"><h2>Menu Management</h2><div class="toolbar-right"><input class="search" id="menuSearch" placeholder="Search menu item..."><button class="primary" onclick="menuForm()">＋ Add Menu Item</button></div></div>
 <div class="menu-grid" id="menuGrid">${menuGrid()}</div>`;
},
reports(){
 return `<div class="toolbar"><h2>Reports</h2><div class="toolbar-right"><select class="search"><option>Jun 1, 2025 - Jun 12, 2025</option><option>This Month</option><option>This Year</option></select><button class="primary" onclick="toast('Report generated successfully!')">Generate Report</button></div></div>
 <div class="report-grid"><div class="report-stat"><b>₱285,760</b><small>Total Sales</small></div><div class="report-stat"><b>156</b><small>Total Appointments</small></div><div class="report-stat"><b>198</b><small>Total Orders</small></div><div class="report-stat"><b>142</b><small>Total Customers</small></div></div>
 <div class="grid2" style="margin-top:15px"><div class="card"><div class="card-head"><h3>Sales Overview</h3><span class="legend">Daily sales</span></div><div class="chart"><svg viewBox="0 0 600 230" preserveAspectRatio="none"><path d="M20 195 L100 155 L180 170 L260 120 L340 135 L420 95 L500 105 L575 55" fill="none" stroke="#df2020" stroke-width="4"/><path d="M20 195 L100 155 L180 170 L260 120 L340 135 L420 95 L500 105 L575 55 L575 220 L20 220Z" fill="#ffe4e4" opacity=".8"/></svg></div></div>
 <div class="card"><div class="card-head"><h3>Top Selling Menu Items</h3></div><div class="bars">${[[42,"Cebu Lechon (Whole)"],[35,"Lechon Belly Roll"],[28,"Porchetta"],[24,"Cebu Lechon (Half)"],[19,"Lechon Sig"]].map(x=>`<div class="bar" style="height:${x[0]*3}px"><span>${x[1]}</span></div>`).join("")}</div></div></div>`;
},
settings(){
 return `<div class="settings-grid">
 <div class="form-card"><h3>Business Information</h3><div class="form-row"><div class="field"><label>Business Name</label><input id="bizName" value="Babsi Baliuag Cebu Lechon"></div><div class="field"><label>Address</label><input value="Baliuag, Bulacan, Philippines"></div></div><div class="form-row"><div class="field"><label>Phone Number</label><input value="09XX XXX XXXX"></div><div class="field"><label>Email</label><input value="babsi@cebulechon.com"></div></div><div class="field"><label>Operating Hours</label><input value="8:00 AM - 6:00 PM"></div><div class="field"><label>Business Description</label><textarea>Serving the best Cebu Lechon, Lechon Belly Roll and Porchetta in Baliuag.</textarea></div><button class="primary" onclick="toast('Settings saved!')">Save Changes</button></div>
 <div class="form-card"><h3>System Settings</h3><div class="field"><label>Currency</label><select><option>Philippine Peso (₱)</option></select></div><div class="field"><label>Default Appointment Status</label><select><option>Pending</option><option>Confirmed</option></select></div><div class="field"><label>Notifications</label><select><option>Enabled</option><option>Disabled</option></select></div><div class="field"><label>Administrator Email</label><input value="admin@babsi.com"></div><button class="secondary" onclick="toast('System preferences updated!')">Update Preferences</button></div>
 </div>`;
},
logout(){
 return `<div class="card" style="min-height:500px;display:grid;place-items:center;background:#ddd"><div class="modal" style="text-align:center;max-width:390px"><img src="assets/logo.png" style="width:65px;height:65px;border-radius:50%"><h2>Log Out</h2><p style="font-size:12px;color:#777">Are you sure you want to log out?</p><div class="modal-actions" style="justify-content:center"><button class="secondary" onclick="go('dashboard')">Cancel</button><button class="primary" onclick="toast('You have been logged out.');go('landing')">Log Out</button></div></div></div>`;
},
landing(){
 return `<div class="landing"><div class="landing-hero"><img src="assets/lechon-whole.jpg"><div style="position:relative;z-index:2"><h2>Crispy. Juicy.<br>Always Delicious.</h2><p>Babsi Baliuag Cebu Lechon<br>Order for your appointment online, fast and easy.</p><div class="landing-actions"><button class="primary" onclick="go('appointments')">Book Appointment</button><button class="secondary" onclick="go('orders')">Order Now</button></div></div></div><div class="landing-features"><div class="feature">▣<b>Easy Booking</b><small>Book in just a few clicks.</small></div><div class="feature">🛒<b>Order Online</b><small>Choose your favorite lechon.</small></div><div class="feature">🚚<b>Pickup or Delivery</b><small>Get your order on schedule.</small></div></div></div>`;
}
};

function appointmentTable(limit){
 const rows=data.appointments.slice(0,limit);
 return `<div class="table-wrap"><table class="table"><thead><tr><th>Booking ID</th><th>Customer</th><th>Service / Item</th><th>Date & Time</th><th>People</th><th>Status</th><th>Action</th></tr></thead><tbody>${rows.map((r,i)=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td>${r[4]}</td><td>${status(r[5])}</td><td class="actions"><button onclick="appointmentForm(${i})">✎</button><button onclick="deleteItem('appointments',${i})">♧</button></td></tr>`).join("")}</tbody></table></div>`;
}
function orderTable(limit){
 return `<div class="table-wrap"><table class="table"><thead><tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total Amount</th><th>Status</th><th>Action</th></tr></thead><tbody>${data.orders.slice(0,limit).map((r,i)=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td>${status(r[4])}</td><td class="actions"><button onclick="orderForm(${i})">✎</button><button onclick="deleteItem('orders',${i})">♧</button></td></tr>`).join("")}</tbody></table></div>`;
}
function customerTable(){
 return `<div class="table-wrap"><table class="table"><thead><tr><th>ID</th><th>Name</th><th>Phone Number</th><th>Email</th><th>Total Bookings</th><th>Action</th></tr></thead><tbody>${data.customers.map((r,i)=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td>${r[4]}</td><td class="actions"><button onclick="customerForm(${i})">✎</button><button onclick="deleteItem('customers',${i})">♧</button></td></tr>`).join("")}</tbody></table></div>`;
}
function menuGrid(){
 return data.menu.map((r,i)=>`<div class="menu-card"><img src="assets/${r[2]}" alt=""><h4>${esc(r[0])}</h4><p class="price">${esc(r[1])}</p><div class="menu-bottom">${status("Available")}<span class="actions"><button onclick="menuForm(${i})">✎</button><button onclick="deleteItem('menu',${i})">♧</button></span></div></div>`).join("");
}

function appointmentForm(i){
 const r=data.appointments[i]||["","", "Cebu Lechon (Whole)","",1,"Pending"];
 openModal(`<h2>${i==null?"New Appointment":"Edit Appointment"}</h2>
 <div class="form-row"><div class="field"><label>Booking ID</label><input id="f0" value="${esc(r[0]||"BABS-"+Date.now())}"></div><div class="field"><label>Customer</label><input id="f1" value="${esc(r[1])}"></div></div>
 <div class="field"><label>Service / Item</label><select id="f2">${["Cebu Lechon (Whole)","Cebu Lechon (Half)","Lechon Belly Roll","Porchetta","Lechon Sig (1kg)","Other / Custom Request"].map(x=>`<option ${x==r[2]?"selected":""}>${x}</option>`).join("")}</select></div>
 <div class="form-row"><div class="field"><label>Date & Time</label><input id="f3" value="${esc(r[3])}"></div><div class="field"><label>People</label><input id="f4" type="number" value="${r[4]||1}"></div></div>
 <div class="field"><label>Status</label><select id="f5"><option>Pending</option><option>Confirmed</option><option>Cancelled</option></select></div>
 <div class="modal-actions"><button class="secondary" onclick="closeModal()">Cancel</button><button class="primary" onclick="saveAppointment(${i==null?-1:i})">Save Appointment</button></div>`);
}
function saveAppointment(i){let r=[...["f0","f1","f2","f3","f4","f5"].map(id=>$("#"+id).value)];if(i<0)data.appointments.unshift(r);else data.appointments[i]=r;save();closeModal();render("appointments");toast("Appointment saved!")}
function orderForm(i){
 const r=data.orders[i]||["#ORD-"+String(Date.now()).slice(-5),"","1x Cebu Lechon (Whole)","₱0","Preparing"];
 openModal(`<h2>${i==null?"New Order":"Edit Order"}</h2><div class="form-row"><div class="field"><label>Order ID</label><input id="f0" value="${esc(r[0])}"></div><div class="field"><label>Customer</label><input id="f1" value="${esc(r[1])}"></div></div><div class="field"><label>Items</label><input id="f2" value="${esc(r[2])}"></div><div class="form-row"><div class="field"><label>Total Amount</label><input id="f3" value="${esc(r[3])}"></div><div class="field"><label>Status</label><select id="f4"><option>Preparing</option><option>Completed</option><option>Cancelled</option></select></div></div><div class="modal-actions"><button class="secondary" onclick="closeModal()">Cancel</button><button class="primary" onclick="saveOrder(${i==null?-1:i})">Save Order</button></div>`);
}
function saveOrder(i){let r=["f0","f1","f2","f3","f4"].map(id=>$("#"+id).value);if(i<0)data.orders.unshift(r);else data.orders[i]=r;save();closeModal();render("orders");toast("Order saved!")}
function customerForm(i){
 const r=data.customers[i]||["CUST-"+String(Date.now()).slice(-4),"","","",0];
 openModal(`<h2>${i==null?"Add Customer":"Edit Customer"}</h2><div class="field"><label>Customer ID</label><input id="f0" value="${esc(r[0])}"></div><div class="field"><label>Name</label><input id="f1" value="${esc(r[1])}"></div><div class="form-row"><div class="field"><label>Phone</label><input id="f2" value="${esc(r[2])}"></div><div class="field"><label>Email</label><input id="f3" value="${esc(r[3])}"></div></div><div class="field"><label>Total Bookings</label><input id="f4" type="number" value="${r[4]||0}"></div><div class="modal-actions"><button class="secondary" onclick="closeModal()">Cancel</button><button class="primary" onclick="saveCustomer(${i==null?-1:i})">Save Customer</button></div>`);
}
function saveCustomer(i){let r=["f0","f1","f2","f3","f4"].map(id=>$("#"+id).value);if(i<0)data.customers.unshift(r);else data.customers[i]=r;save();closeModal();render("customers");toast("Customer saved!")}
function menuForm(i){
 const r=data.menu[i]||["","","lechon-whole.jpg"];
 openModal(`<h2>${i==null?"Add Menu Item":"Edit Menu Item"}</h2><div class="field"><label>Menu Item</label><input id="f0" value="${esc(r[0])}"></div><div class="field"><label>Price</label><input id="f1" value="${esc(r[1])}"></div><div class="field"><label>Image</label><select id="f2">${["lechon-whole.jpg","lechon-half.jpg","lechon-roll.jpg","porchetta.jpg","lechon-sig.jpg"].map(x=>`<option ${x==r[2]?"selected":""}>${x}</option>`).join("")}</select></div><div class="modal-actions"><button class="secondary" onclick="closeModal()">Cancel</button><button class="primary" onclick="saveMenu(${i==null?-1:i})">Save Item</button></div>`);
}
function saveMenu(i){let r=["f0","f1","f2"].map(id=>$("#"+id).value);if(i<0)data.menu.unshift(r);else data.menu[i]=r;save();closeModal();render("menu");toast("Menu item saved!")}
function deleteItem(type,i){if(confirm("Delete this item?")){data[type].splice(i,1);save();render(currentPage);toast("Deleted successfully.")}}
function filterTable(inputId, tableId){
 const q=$("#"+inputId).value.toLowerCase();document.querySelectorAll(`#${tableId} tbody tr`).forEach(tr=>tr.style.display=tr.textContent.toLowerCase().includes(q)?"":"none");
}
function go(page){render(page);if(window.innerWidth<650)$("#sidebar").classList.remove("open")}
let currentPage="dashboard";
function render(page){
 currentPage=page;
 const labels={dashboard:["Dashboard","Welcome, Owner / Admin!"],appointments:["Appointments","Manage bookings and schedules"],orders:["Orders","Manage customer orders"],customers:["Customers","Manage your customer records"],menu:["Menu Management","Manage products, prices and availability"],reports:["Reports","Sales and business analytics"],settings:["Settings","Business and system configuration"],logout:["Log Out",""],landing:["BABSI Cebu Lechon","Crispy. Juicy. Always Delicious."]};
 $("#pageTitle").textContent=labels[page]?.[0]||"Dashboard";$("#pageSubtitle").textContent=labels[page]?.[1]||"";
 content.innerHTML=pages[page]();
 document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.page===page));
 if(page==="appointments") $("#appointmentSearch")?.addEventListener("input",()=>filterTable("appointmentSearch","appointmentTable"));
 if(page==="orders") $("#orderSearch")?.addEventListener("input",()=>filterTable("orderSearch","orderTable"));
 if(page==="customers") $("#customerSearch")?.addEventListener("input",()=>filterTable("customerSearch","customerTable"));
 if(page==="menu") $("#menuSearch")?.addEventListener("input",()=>{let q=$("#menuSearch").value.toLowerCase();document.querySelectorAll(".menu-card").forEach(x=>x.style.display=x.textContent.toLowerCase().includes(q)?"":"none")});
}
document.querySelectorAll(".nav-item").forEach(b=>b.addEventListener("click",()=>go(b.dataset.page)));
$("#mobileMenu").addEventListener("click",()=>$("#sidebar").classList.toggle("open"));
render("dashboard");
