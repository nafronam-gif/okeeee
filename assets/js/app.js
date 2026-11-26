const ADMIN="6285122638727";
const initial=[
{id:1,name:"Joki Rank Push",service:"Rank Push",rank:"Heroic",price:15000,icon:"🏆",desc:"Layanan push rank sesuai target yang disepakati.",discount:"POPULAR"},
{id:2,name:"Joki Win Rate",service:"Win Rate",rank:"All Rank",price:10000,icon:"🎯",desc:"Tingkatkan win rate dengan layanan permainan.",discount:"HOT"},
{id:3,name:"Joki Level Up",service:"Level Up",rank:"All Level",price:12000,icon:"⚡",desc:"Bantu tingkatkan level akun Free Fire.",discount:""},
{id:4,name:"Paket Push Heroic",service:"Paket",rank:"Diamond - Heroic",price:35000,icon:"💎",desc:"Paket target rank sesuai kesepakatan.",discount:"BEST"},
{id:5,name:"Joki Custom",service:"Custom",rank:"Custom",price:20000,icon:"🎮",desc:"Layanan sesuai permintaan pelanggan.",discount:""},
{id:6,name:"Joki Rank Master",service:"Rank Push",rank:"Master",price:25000,icon:"👑",desc:"Paket layanan menuju rank Master.",discount:""}
];
let products=JSON.parse(localStorage.getItem("jp_products")||"null")||initial;
let category="Semua";
let orders=JSON.parse(localStorage.getItem("jp_orders")||"[]");
let applications=JSON.parse(localStorage.getItem("jp_applications")||"[]");
let profile=JSON.parse(localStorage.getItem("jp_profile")||"null");
function money(n){return new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(n)}
function safe(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function cardHTML(p){
const imgSrc = p.image ? p.image : `./images/services/${p.service.toLowerCase().replace(/\s+/g, "_")}.webp`;
const fallback = `this.onerror=null; this.src="./images/services/default.webp";`;
return `<article class="product" onclick="openOrder(${p.id})">
<div class="product-image">
<img src="${imgSrc}" alt="${safe(p.name)}" onerror="${fallback}" draggable="false" class="product-img">
${p.discount?`<span class="discount">${safe(p.discount)}</span>`:""}
</div>
<div class="product-info"><h3>${safe(p.name)}</h3><p class="sub">${safe(p.desc)}</p>
<div class="product-tags"><span>${safe(p.service)}</span><span>${safe(p.rank)}</span></div>
<div class="product-bottom"><div class="price"><small>Mulai dari</small><strong>${money(p.price)}</strong></div><button class="buy" onclick="event.stopPropagation();openOrder(${p.id})">Pesan</button></div></div></article>`;
}
function renderProducts(){
let q=(document.getElementById("search").value||"").toLowerCase();
let list=products.filter(p=>(category==="Semua"||p.service===category)&&(p.name+" "+p.service+" "+p.rank).toLowerCase().includes(q));
let out=list.length?list.map(cardHTML).join(""):`<div class="empty" style="grid-column:1/-1">Produk tidak ditemukan.</div>`;
document.getElementById("productGrid").innerHTML=out;
document.getElementById("serviceGrid").innerHTML=products.map(cardHTML).join("");
}
function filterCategory(c,b){category=c;document.querySelectorAll(".categories button").forEach(x=>x.classList.remove("active"));if(b)b.classList.add("active");renderProducts()}
function navigate(id,b){
document.querySelectorAll(".view").forEach(x=>x.classList.remove("active"));
document.getElementById(id).classList.add("active");
document.querySelectorAll(".side-item").forEach(x=>x.classList.remove("active"));
if(b)b.classList.add("active");
if(id==="transactions")renderTransactions();
if(id==="profile")renderProfile();
window.scrollTo({top:0,behavior:"smooth"});
}
function openModal(title,form){
document.getElementById("modalTitle").textContent=title;
["orderForm","joinForm","loginForm"].forEach(x=>document.getElementById(x).classList.add("hidden"));
document.getElementById(form).classList.remove("hidden");
document.getElementById("modal").classList.add("show");
}
function closeModal(){document.getElementById("modal").classList.remove("show")}
function openOrder(id){
let p=products.find(x=>x.id===id);
if(!p)return;
document.getElementById("selectedPlayer").value=p.name;
document.getElementById("service").value=p.service==="Paket"?"Rank Push":p.service;
openModal("Buat Pesanan","orderForm");
}
function openJoin(){openModal("Daftar Menjadi Penjoki","joinForm")}
function openLogin(){openModal("Masuk JOKIPLACE","loginForm")}
function submitOrder(e){
e.preventDefault();
let d={id:Date.now(),name:document.getElementById("customer").value,phone:document.getElementById("phone").value,player:document.getElementById("selectedPlayer").value,service:document.getElementById("service").value,current:document.getElementById("currentRank").value,target:document.getElementById("targetRank").value,note:document.getElementById("notes").value,status:"Menunggu konfirmasi",date:new Date().toLocaleString("id-ID")};
orders.unshift(d);localStorage.setItem("jp_orders",JSON.stringify(orders));
let msg=`Halo Admin JOKIPLACE, saya ingin memesan.%0A%0ANama: ${encodeURIComponent(d.name)}%0AWhatsApp: ${encodeURIComponent(d.phone)}%0APenjoki: ${encodeURIComponent(d.player)}%0ALayanan: ${encodeURIComponent(d.service)}%0ARank: ${encodeURIComponent(d.current)}%0ATarget: ${encodeURIComponent(d.target)}%0ACatatan: ${encodeURIComponent(d.note)}%0A%0AMohon informasi pembayaran.`;
window.open("https://wa.me/"+ADMIN+"?text="+msg,"_blank");
closeModal();e.target.reset();
}
function submitJoin(e){
e.preventDefault();
let d={id:Date.now(),name:document.getElementById("jName").value,phone:document.getElementById("jPhone").value,rank:document.getElementById("jRank").value,service:document.getElementById("jService").value,price:Number(document.getElementById("jPrice").value),description:document.getElementById("jDesc").value,status:"Menunggu review",date:new Date().toLocaleString("id-ID")};
applications.unshift(d);localStorage.setItem("jp_applications",JSON.stringify(applications));
let msg=`Halo Admin JOKIPLACE, saya ingin mendaftar sebagai penjoki.%0A%0ANama: ${encodeURIComponent(d.name)}%0ANomor: ${encodeURIComponent(d.phone)}%0ARank: ${encodeURIComponent(d.rank)}%0ALayanan: ${encodeURIComponent(d.service)}%0AHarga: ${encodeURIComponent(money(d.price))}%0ADeskripsi: ${encodeURIComponent(d.description)}`;
window.open("https://wa.me/"+ADMIN+"?text="+msg,"_blank");
closeModal();e.target.reset();alert("Pendaftaran tersimpan secara lokal dan WhatsApp admin dibuka.");
}
function submitLogin(e){
e.preventDefault();
profile={name:document.getElementById("loginName").value,phone:document.getElementById("loginPhone").value};
localStorage.setItem("jp_profile",JSON.stringify(profile));closeModal();renderProfile();alert("Profil lokal berhasil disimpan.");
}
function renderProfile(){
document.getElementById("profileName").textContent=profile?profile.name:"Pengunjung JOKIPLACE";
document.getElementById("profilePhone").textContent=profile?profile.phone:"Belum masuk sebagai pengguna.";
}
function renderTransactions(){
let el=document.getElementById("transactionList");
el.innerHTML=orders.length?orders.map(o=>`<div class="order-card"><strong>${safe(o.player)}</strong><br>Pesanan: ${safe(o.service)}<br>Target: ${safe(o.current)} &rarr; ${safe(o.target)}<br>Status: ${safe(o.status)}<br>Tanggal: ${safe(o.date)}</div>`).join(""):`<div class="empty">Belum ada transaksi. Yuk cari penjoki dulu!</div>`;
}
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal()});
renderProducts();renderProfile();






let currentMode = "br";



let currentMode = "br";

function switchMode(mode) {
    currentMode = mode;
    document.getElementById("tabBr").classList.remove("active");
    document.getElementById("tabCs").classList.remove("active");
    
    if (mode === "br") {
        document.getElementById("tabBr").classList.add("active");
        document.getElementById("calcBr").style.display = "block";
        document.getElementById("calcCs").style.display = "none";
        renderPriceList("br");
    } else {
        document.getElementById("tabCs").classList.add("active");
        document.getElementById("calcBr").style.display = "none";
        document.getElementById("calcCs").style.display = "block";
        renderPriceList("cs");
    }
    document.getElementById("calcPriceResult").textContent = "Rp 0";
}

function renderPriceList(mode) {
    const container = document.getElementById("priceList");
    if (mode === "br") {
        container.innerHTML = `
            <div class="price-card"><div class="price-card-top"><span>🛡️</span><p>Gold</p></div><div class="price-card-bottom"><strong>Rp 3.000</strong><span>/ Tier</span></div></div>
            <div class="price-card"><div class="price-card-top"><span>💠</span><p>Platinum</p></div><div class="price-card-bottom"><strong>Rp 5.000</strong><span>/ Tier</span></div></div>
            <div class="price-card"><div class="price-card-top"><span>💎</span><p>Diamond</p></div><div class="price-card-bottom"><strong>Rp 8.000</strong><span>/ Tier</span></div></div>
            <div class="price-card"><div class="price-card-top"><span>🔥</span><p>Heroic</p></div><div class="price-card-bottom"><strong>Rp 12.000</strong><span>/ Tier</span></div></div>
            <div class="price-card"><div class="price-card-top"><span>👑</span><p>Master</p></div><div class="price-card-bottom"><strong>Rp 18.000</strong><span>/ Tier</span></div></div>
        `;
    } else {
        container.innerHTML = `
            <div class="price-card"><div class="price-card-top"><span>🥉</span><p>Bronze</p></div><div class="price-card-bottom"><strong>Rp 500</strong><span>/ Point</span></div></div>
            <div class="price-card"><div class="price-card-top"><span>🥈</span><p>Silver</p></div><div class="price-card-bottom"><strong>Rp 500</strong><span>/ Point</span></div></div>
            <div class="price-card"><div class="price-card-top"><span>🛡️</span><p>Gold</p></div><div class="price-card-bottom"><strong>Rp 500</strong><span>/ Point</span></div></div>
            <div class="price-card"><div class="price-card-top"><span>💠</span><p>Platinum</p></div><div class="price-card-bottom"><strong>Rp 1.000</strong><span>/ Point</span></div></div>
            <div class="price-card"><div class="price-card-top"><span>💎</span><p>Diamond</p></div><div class="price-card-bottom"><strong>Rp 1.500</strong><span>/ Point</span></div></div>
            <div class="price-card"><div class="price-card-top"><span>🔥</span><p>Heroic</p></div><div class="price-card-bottom"><strong>Rp 2.000</strong><span>/ Point</span></div></div>
            <div class="price-card"><div class="price-card-top"><span>👑</span><p>Master</p></div><div class="price-card-bottom"><strong>Rp 3.000</strong><span>/ Point</span></div></div>
        `;
    }
}

function hitungHargaJoki() {
    const res = document.getElementById("calcPriceResult");
    if (currentMode === "br") {
        const sRank = document.getElementById("calcStartRank").value;
        const sTier = parseInt(document.getElementById("calcStartTier").value);
        const tRank = document.getElementById("calcEndRank").value;
        const tTier = parseInt(document.getElementById("calcEndTier").value);

        if (!sRank || !tRank) { alert("Pilih Rank Awal dan Rank Tujuan terlebih dahulu."); return; }

        const rankOrder = ["Gold", "Platinum", "Diamond", "Heroic", "Master"];
        const priceMap = { "Gold": 3000, "Platinum": 5000, "Diamond": 8000, "Heroic": 12000, "Master": 18000 };

        const sIndex = rankOrder.indexOf(sRank);
        const tIndex = rankOrder.indexOf(tRank);

        if (sIndex > tIndex || (sIndex === tIndex && sTier >= tTier)) {
            alert("Rank tujuan harus lebih tinggi dari rank awal."); 
            return;
        }

        let total = 0;
        for (let i = sIndex; i <= tIndex; i++) {
            let currentPrice = priceMap[rankOrder[i]];
            if (i === sIndex) {
                total += (5 - sTier) * currentPrice;
            } else if (i === tIndex) {
                total += (tTier - 1) * currentPrice;
            } else {
                total += 5 * currentPrice;
            }
        }
        res.textContent = new Intl.NumberFormat("id-ID", {style:"currency",currency:"IDR",maximumFractionDigits:0}).format(total);

    } else {
        const sRank = document.getElementById("csStartRank").value;
        const sPoint = parseInt(document.getElementById("csStartPoint").value) || 0;
        const tRank = document.getElementById("csEndRank").value;
        const tPoint = parseInt(document.getElementById("csEndPoint").value) || 0;

        if (!sRank || !tRank) { alert("Pilih Rank Awal dan Rank Tujuan terlebih dahulu."); return; }

        const rankOrder = ["Bronze", "Silver", "Gold", "Platinum", "Diamond", "Heroic", "Master"];
        const priceMap = { "Bronze": 500, "Silver": 500, "Gold": 500, "Platinum": 1000, "Diamond": 1500, "Heroic": 2000, "Master": 3000 };

        const sIndex = rankOrder.indexOf(sRank);
        const tIndex = rankOrder.indexOf(tRank);

        if (sIndex > tIndex || (sIndex === tIndex && sPoint >= tPoint)) {
            alert("Rank tujuan harus lebih tinggi dari rank awal."); 
            return;
        }

        let total = 0;
        for (let i = sIndex; i <= tIndex; i++) {
            let currentPrice = priceMap[rankOrder[i]];
            if (i === sIndex) {
                total += (100 - sPoint) * currentPrice;
            } else if (i === tIndex) {
                total += tPoint * currentPrice;
            } else {
                total += 100 * currentPrice;
            }
        }
        res.textContent = new Intl.NumberFormat("id-ID", {style:"currency",currency:"IDR",maximumFractionDigits:0}).format(total);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    renderPriceList("br");
}); else {
        btnCS.style.borderColor = "#0f6cff";
        btnCS.style.boxShadow = "0 8px 20px rgba(15,108,255,0.15)";
        btnCS.querySelector("span:first-child").nextElementSibling.querySelector("span:first-child").style.color = "#0f6cff";
        
        btnBR.style.borderColor = "#e5e7eb";
        btnBR.style.boxShadow = "none";
        btnBR.querySelector("span:first-child").nextElementSibling.querySelector("span:first-child").style.color = "#1a1f36";

        document.getElementById("calcBoxBR").style.display = "none";
        document.getElementById("calcBoxCS").style.display = "block";
        document.getElementById("priceBoxBR").style.display = "none";
        document.getElementById("priceBoxCS").style.display = "block";
    }
}

function hitungBR() {
    const res = document.getElementById("calcPriceResultBR");
    const sRank = document.getElementById("calcStartRank").value;
    const sTier = parseInt(document.getElementById("calcStartTier").value);
    const tRank = document.getElementById("calcEndRank").value;
    const tTier = parseInt(document.getElementById("calcEndTier").value);

    if (!sRank || !tRank) { alert("Pilih Rank Awal dan Rank Tujuan terlebih dahulu."); return; }

    const rankOrder = ["Gold", "Platinum", "Diamond", "Heroic", "Master"];
    const priceMap = { "Gold": 3000, "Platinum": 5000, "Diamond": 8000, "Heroic": 12000, "Master": 18000 };

    const sIndex = rankOrder.indexOf(sRank);
    const tIndex = rankOrder.indexOf(tRank);

    if (sIndex > tIndex || (sIndex === tIndex && sTier >= tTier)) {
        alert("Rank tujuan harus lebih tinggi dari rank awal."); 
        return;
    }

    let total = 0;
    for (let i = sIndex; i <= tIndex; i++) {
        let currentPrice = priceMap[rankOrder[i]];
        if (i === sIndex) {
            total += (5 - sTier) * currentPrice;
        } else if (i === tIndex) {
            total += (tTier - 1) * currentPrice;
        } else {
            total += 5 * currentPrice;
        }
    }
    res.textContent = new Intl.NumberFormat("id-ID", {style:"currency",currency:"IDR",maximumFractionDigits:0}).format(total);
}

function hitungCS() {
    const res = document.getElementById("calcPriceResultCS");
    const sRank = document.getElementById("csStartRank").value;
    const sPoint = parseInt(document.getElementById("csStartPoint").value) || 0;
    const tRank = document.getElementById("csEndRank").value;
    const tPoint = parseInt(document.getElementById("csEndPoint").value) || 0;

    if (!sRank || !tRank) { alert("Pilih Rank Awal dan Rank Tujuan terlebih dahulu."); return; }

    const rankOrder = ["Bronze", "Silver", "Gold", "Platinum", "Diamond", "Heroic", "Master"];
    const priceMap = { "Bronze": 500, "Silver": 500, "Gold": 500, "Platinum": 1000, "Diamond": 1500, "Heroic": 2000, "Master": 3000 };

    const sIndex = rankOrder.indexOf(sRank);
    const tIndex = rankOrder.indexOf(tRank);

    if (sIndex > tIndex || (sIndex === tIndex && sPoint >= tPoint)) {
        alert("Rank tujuan harus lebih tinggi dari rank awal."); 
        return;
    }

    let total = 0;
    for (let i = sIndex; i <= tIndex; i++) {
        let currentPrice = priceMap[rankOrder[i]];
        if (i === sIndex) {
            total += (100 - sPoint) * currentPrice;
        } else if (i === tIndex) {
            total += tPoint * currentPrice;
        } else {
            total += 100 * currentPrice;
        }
    }
    res.textContent = new Intl.NumberFormat("id-ID", {style:"currency",currency:"IDR",maximumFractionDigits:0}).format(total);
} else {
        document.getElementById("tabCs").classList.add("active");
        document.getElementById("calcBr").style.display = "none";
        document.getElementById("calcCs").style.display = "flex";
    }
    document.getElementById("calcPriceResult").textContent = "Rp 0";
}




let currentMode = "br";

function switchMode(mode) {
    currentMode = mode;
    document.getElementById("tabBr").classList.remove("active");
    document.getElementById("tabCs").classList.remove("active");
    
    if (mode === "br") {
        document.getElementById("tabBr").classList.add("active");
        document.getElementById("calcBr").style.display = "block";
        document.getElementById("calcCs").style.display = "none";
        renderPriceList("br");
    } else {
        document.getElementById("tabCs").classList.add("active");
        document.getElementById("calcBr").style.display = "none";
        document.getElementById("calcCs").style.display = "block";
        renderPriceList("cs");
    }
    document.getElementById("calcPriceResult").textContent = "Rp 0";
}

function renderPriceList(mode) {
    const container = document.getElementById("priceList");
    if (mode === "br") {
        container.innerHTML = `
            <div class="price-card"><div class="price-card-top"><span>🛡️</span><p>Gold</p></div><div class="price-card-bottom"><strong>Rp 3.000</strong><span>/ Tier</span></div></div>
            <div class="price-card"><div class="price-card-top"><span>💠</span><p>Platinum</p></div><div class="price-card-bottom"><strong>Rp 5.000</strong><span>/ Tier</span></div></div>
            <div class="price-card"><div class="price-card-top"><span>💎</span><p>Diamond</p></div><div class="price-card-bottom"><strong>Rp 8.000</strong><span>/ Tier</span></div></div>
            <div class="price-card"><div class="price-card-top"><span>🔥</span><p>Heroic</p></div><div class="price-card-bottom"><strong>Rp 12.000</strong><span>/ Tier</span></div></div>
            <div class="price-card"><div class="price-card-top"><span>👑</span><p>Master</p></div><div class="price-card-bottom"><strong>Rp 18.000</strong><span>/ Tier</span></div></div>
        `;
    } else {
        container.innerHTML = `
            <div class="price-card"><div class="price-card-top"><span>🥉</span><p>Bronze</p></div><div class="price-card-bottom"><strong>Rp 500</strong><span>/ Point</span></div></div>
            <div class="price-card"><div class="price-card-top"><span>🥈</span><p>Silver</p></div><div class="price-card-bottom"><strong>Rp 500</strong><span>/ Point</span></div></div>
            <div class="price-card"><div class="price-card-top"><span>🛡️</span><p>Gold</p></div><div class="price-card-bottom"><strong>Rp 500</strong><span>/ Point</span></div></div>
            <div class="price-card"><div class="price-card-top"><span>💠</span><p>Platinum</p></div><div class="price-card-bottom"><strong>Rp 1.000</strong><span>/ Point</span></div></div>
            <div class="price-card"><div class="price-card-top"><span>💎</span><p>Diamond</p></div><div class="price-card-bottom"><strong>Rp 1.500</strong><span>/ Point</span></div></div>
            <div class="price-card"><div class="price-card-top"><span>🔥</span><p>Heroic</p></div><div class="price-card-bottom"><strong>Rp 2.000</strong><span>/ Point</span></div></div>
            <div class="price-card"><div class="price-card-top"><span>👑</span><p>Master</p></div><div class="price-card-bottom"><strong>Rp 3.000</strong><span>/ Point</span></div></div>
        `;
    }
}

function hitungHargaJoki() {
    const res = document.getElementById("calcPriceResult");
    if (currentMode === "br") {
        const sRank = document.getElementById("calcStartRank").value;
        const sTier = parseInt(document.getElementById("calcStartTier").value);
        const tRank = document.getElementById("calcEndRank").value;
        const tTier = parseInt(document.getElementById("calcEndTier").value);

        if (!sRank || !tRank) { alert("Pilih Rank Awal dan Rank Tujuan terlebih dahulu."); return; }

        const rankOrder = ["Gold", "Platinum", "Diamond", "Heroic", "Master"];
        const priceMap = { "Gold": 3000, "Platinum": 5000, "Diamond": 8000, "Heroic": 12000, "Master": 18000 };

        const sIndex = rankOrder.indexOf(sRank);
        const tIndex = rankOrder.indexOf(tRank);

        if (sIndex > tIndex || (sIndex === tIndex && sTier >= tTier)) {
            alert("Rank tujuan harus lebih tinggi dari rank awal."); 
            return;
        }

        let total = 0;
        for (let i = sIndex; i <= tIndex; i++) {
            let currentPrice = priceMap[rankOrder[i]];
            if (i === sIndex) {
                total += (5 - sTier) * currentPrice;
            } else if (i === tIndex) {
                total += (tTier - 1) * currentPrice;
            } else {
                total += 5 * currentPrice;
            }
        }
        res.textContent = new Intl.NumberFormat("id-ID", {style:"currency",currency:"IDR",maximumFractionDigits:0}).format(total);

    } else {
        const sRank = document.getElementById("csStartRank").value;
        const sPoint = parseInt(document.getElementById("csStartPoint").value) || 0;
        const tRank = document.getElementById("csEndRank").value;
        const tPoint = parseInt(document.getElementById("csEndPoint").value) || 0;

        if (!sRank || !tRank) { alert("Pilih Rank Awal dan Rank Tujuan terlebih dahulu."); return; }

        const rankOrder = ["Bronze", "Silver", "Gold", "Platinum", "Diamond", "Heroic", "Master"];
        const priceMap = { "Bronze": 500, "Silver": 500, "Gold": 500, "Platinum": 1000, "Diamond": 1500, "Heroic": 2000, "Master": 3000 };

        const sIndex = rankOrder.indexOf(sRank);
        const tIndex = rankOrder.indexOf(tRank);

        if (sIndex > tIndex || (sIndex === tIndex && sPoint >= tPoint)) {
            alert("Rank tujuan harus lebih tinggi dari rank awal."); 
            return;
        }

        let total = 0;
        for (let i = sIndex; i <= tIndex; i++) {
            let currentPrice = priceMap[rankOrder[i]];
            if (i === sIndex) {
                total += (100 - sPoint) * currentPrice;
            } else if (i === tIndex) {
                total += tPoint * currentPrice;
            } else {
                total += 100 * currentPrice;
            }
        }
        res.textContent = new Intl.NumberFormat("id-ID", {style:"currency",currency:"IDR",maximumFractionDigits:0}).format(total);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    renderPriceList("br");
}); else {
        btnCS.style.borderColor = "#0f6cff";
        btnCS.style.boxShadow = "0 8px 20px rgba(15,108,255,0.15)";
        btnCS.querySelector("span:first-child").nextElementSibling.querySelector("span:first-child").style.color = "#0f6cff";
        
        btnBR.style.borderColor = "#e5e7eb";
        btnBR.style.boxShadow = "none";
        btnBR.querySelector("span:first-child").nextElementSibling.querySelector("span:first-child").style.color = "#1a1f36";

        document.getElementById("calcBoxBR").style.display = "none";
        document.getElementById("calcBoxCS").style.display = "block";
        document.getElementById("priceBoxBR").style.display = "none";
        document.getElementById("priceBoxCS").style.display = "block";
    }
}

function hitungBR() {
    const res = document.getElementById("calcPriceResultBR");
    const sRank = document.getElementById("calcStartRank").value;
    const sTier = parseInt(document.getElementById("calcStartTier").value);
    const tRank = document.getElementById("calcEndRank").value;
    const tTier = parseInt(document.getElementById("calcEndTier").value);

    if (!sRank || !tRank) { alert("Pilih Rank Awal dan Rank Tujuan terlebih dahulu."); return; }

    const rankOrder = ["Gold", "Platinum", "Diamond", "Heroic", "Master"];
    const priceMap = { "Gold": 3000, "Platinum": 5000, "Diamond": 8000, "Heroic": 12000, "Master": 18000 };

    const sIndex = rankOrder.indexOf(sRank);
    const tIndex = rankOrder.indexOf(tRank);

    if (sIndex > tIndex || (sIndex === tIndex && sTier >= tTier)) {
        alert("Rank tujuan harus lebih tinggi dari rank awal."); 
        return;
    }

    let total = 0;
    for (let i = sIndex; i <= tIndex; i++) {
        let currentPrice = priceMap[rankOrder[i]];
        if (i === sIndex) {
            total += (5 - sTier) * currentPrice;
        } else if (i === tIndex) {
            total += (tTier - 1) * currentPrice;
        } else {
            total += 5 * currentPrice;
        }
    }
    res.textContent = new Intl.NumberFormat("id-ID", {style:"currency",currency:"IDR",maximumFractionDigits:0}).format(total);
}

function hitungCS() {
    const res = document.getElementById("calcPriceResultCS");
    const sRank = document.getElementById("csStartRank").value;
    const sPoint = parseInt(document.getElementById("csStartPoint").value) || 0;
    const tRank = document.getElementById("csEndRank").value;
    const tPoint = parseInt(document.getElementById("csEndPoint").value) || 0;

    if (!sRank || !tRank) { alert("Pilih Rank Awal dan Rank Tujuan terlebih dahulu."); return; }

    const rankOrder = ["Bronze", "Silver", "Gold", "Platinum", "Diamond", "Heroic", "Master"];
    const priceMap = { "Bronze": 500, "Silver": 500, "Gold": 500, "Platinum": 1000, "Diamond": 1500, "Heroic": 2000, "Master": 3000 };

    const sIndex = rankOrder.indexOf(sRank);
    const tIndex = rankOrder.indexOf(tRank);

    if (sIndex > tIndex || (sIndex === tIndex && sPoint >= tPoint)) {
        alert("Rank tujuan harus lebih tinggi dari rank awal."); 
        return;
    }

    let total = 0;
    for (let i = sIndex; i <= tIndex; i++) {
        let currentPrice = priceMap[rankOrder[i]];
        if (i === sIndex) {
            total += (100 - sPoint) * currentPrice;
        } else if (i === tIndex) {
            total += tPoint * currentPrice;
        } else {
            total += 100 * currentPrice;
        }
    }
    res.textContent = new Intl.NumberFormat("id-ID", {style:"currency",currency:"IDR",maximumFractionDigits:0}).format(total);
} else {
        document.getElementById("btnModeCS").classList.add("active");
        document.getElementById("calcBoxBR").style.display = "none";
        document.getElementById("calcBoxCS").style.display = "block";
        document.getElementById("priceBoxBR").style.display = "none";
        document.getElementById("priceBoxCS").style.display = "block";
    }
}

function hitungBR() {
    const res = document.getElementById("calcPriceResultBR");
    const sRank = document.getElementById("calcStartRank").value;
    const sTier = parseInt(document.getElementById("calcStartTier").value);
    const tRank = document.getElementById("calcEndRank").value;
    const tTier = parseInt(document.getElementById("calcEndTier").value);

    if (!sRank || !tRank) { alert("Pilih Rank Awal dan Rank Tujuan terlebih dahulu."); return; }

    const rankOrder = ["Gold", "Platinum", "Diamond", "Heroic", "Master"];
    const priceMap = { "Gold": 3000, "Platinum": 5000, "Diamond": 8000, "Heroic": 12000, "Master": 18000 };

    const sIndex = rankOrder.indexOf(sRank);
    const tIndex = rankOrder.indexOf(tRank);

    if (sIndex > tIndex || (sIndex === tIndex && sTier >= tTier)) {
        alert("Rank tujuan harus lebih tinggi dari rank awal."); 
        return;
    }

    let total = 0;
    for (let i = sIndex; i <= tIndex; i++) {
        let currentPrice = priceMap[rankOrder[i]];
        if (i === sIndex) {
            total += (5 - sTier) * currentPrice;
        } else if (i === tIndex) {
            total += (tTier - 1) * currentPrice;
        } else {
            total += 5 * currentPrice;
        }
    }
    res.textContent = new Intl.NumberFormat("id-ID", {style:"currency",currency:"IDR",maximumFractionDigits:0}).format(total);
}

function hitungCS() {
    const res = document.getElementById("calcPriceResultCS");
    const sRank = document.getElementById("csStartRank").value;
    const sPoint = parseInt(document.getElementById("csStartPoint").value) || 0;
    const tRank = document.getElementById("csEndRank").value;
    const tPoint = parseInt(document.getElementById("csEndPoint").value) || 0;

    if (!sRank || !tRank) { alert("Pilih Rank Awal dan Rank Tujuan terlebih dahulu."); return; }

    const rankOrder = ["Bronze", "Silver", "Gold", "Platinum", "Diamond", "Heroic", "Master"];
    const priceMap = { "Bronze": 500, "Silver": 500, "Gold": 500, "Platinum": 1000, "Diamond": 1500, "Heroic": 2000, "Master": 3000 };

    const sIndex = rankOrder.indexOf(sRank);
    const tIndex = rankOrder.indexOf(tRank);

    if (sIndex > tIndex || (sIndex === tIndex && sPoint >= tPoint)) {
        alert("Rank tujuan harus lebih tinggi dari rank awal."); 
        return;
    }

    let total = 0;
    for (let i = sIndex; i <= tIndex; i++) {
        let currentPrice = priceMap[rankOrder[i]];
        if (i === sIndex) {
            total += (100 - sPoint) * currentPrice;
        } else if (i === tIndex) {
            total += tPoint * currentPrice;
        } else {
            total += 100 * currentPrice;
        }
    }
    res.textContent = new Intl.NumberFormat("id-ID", {style:"currency",currency:"IDR",maximumFractionDigits:0}).format(total);
}

        const rankOrder = ["Gold", "Platinum", "Diamond", "Heroic", "Master"];
        const priceMap = { "Gold": 3000, "Platinum": 5000, "Diamond": 8000, "Heroic": 12000, "Master": 18000 };

        const sIndex = rankOrder.indexOf(sRank);
        const tIndex = rankOrder.indexOf(tRank);

        if (sIndex > tIndex || (sIndex === tIndex && sTier >= tTier)) {
            alert("Rank tujuan harus lebih tinggi dari rank awal."); 
            return;
        }

        let total = 0;
        for (let i = sIndex; i <= tIndex; i++) {
            let currentPrice = priceMap[rankOrder[i]];
            if (i === sIndex) {
                total += (5 - sTier) * currentPrice;
            } else if (i === tIndex) {
                total += (tTier - 1) * currentPrice;
            } else {
                total += 5 * currentPrice;
            }
        }
        res.textContent = new Intl.NumberFormat("id-ID", {style:"currency",currency:"IDR",maximumFractionDigits:0}).format(total);

    } else {
        const sRank = document.getElementById("csStartRank").value;
        const sPoint = parseInt(document.getElementById("csStartPoint").value) || 0;
        const tRank = document.getElementById("csEndRank").value;
        const tPoint = parseInt(document.getElementById("csEndPoint").value) || 0;

        if (!sRank || !tRank) { alert("Pilih Rank Awal dan Rank Tujuan terlebih dahulu."); return; }

        const rankOrder = ["Bronze", "Silver", "Gold", "Platinum", "Diamond", "Heroic", "Master"];
        const priceMap = { "Bronze": 500, "Silver": 500, "Gold": 500, "Platinum": 1000, "Diamond": 1500, "Heroic": 2000, "Master": 3000 };

        const sIndex = rankOrder.indexOf(sRank);
        const tIndex = rankOrder.indexOf(tRank);

        if (sIndex > tIndex || (sIndex === tIndex && sPoint >= tPoint)) {
            alert("Rank tujuan harus lebih tinggi dari rank awal."); 
            return;
        }

        let total = 0;
        for (let i = sIndex; i <= tIndex; i++) {
            let currentPrice = priceMap[rankOrder[i]];
            if (i === sIndex) {
                total += (100 - sPoint) * currentPrice;
            } else if (i === tIndex) {
                total += tPoint * currentPrice;
            } else {
                total += 100 * currentPrice;
            }
        }
        res.textContent = new Intl.NumberFormat("id-ID", {style:"currency",currency:"IDR",maximumFractionDigits:0}).format(total);
    }
}

// ... (Kode Partikel tetap ada di bawahnya)

    const rankOrder = ["Gold", "Platinum", "Diamond", "Heroic", "Master"];
    const priceMap = {
        "Gold": 3000, "Platinum": 5000, "Diamond": 8000,
        "Heroic": 12000, "Master": 18000
    };

    const sIndex = rankOrder.indexOf(sRank);
    const tIndex = rankOrder.indexOf(tRank);

    if (sIndex > tIndex || (sIndex === tIndex && sTier >= tTier)) {
        alert("Rank tujuan harus lebih tinggi dari rank awal."); 
        return;
    }

    let total = 0;
    for (let i = sIndex; i <= tIndex; i++) {
        let currentPrice = priceMap[rankOrder[i]];
        
        if (i === sIndex) {
            total += (5 - sTier) * currentPrice;
        } else if (i === tIndex) {
            total += (tTier - 1) * currentPrice;
        } else {
            total += 5 * currentPrice;
        }
    }

    res.textContent = new Intl.NumberFormat("id-ID", {style:"currency",currency:"IDR",maximumFractionDigits:0}).format(total);
}

document.addEventListener("DOMContentLoaded", function() {
    const sTierSelect = document.getElementById("calcStartTier");
    const eTierSelect = document.getElementById("calcEndTier");
    if(sTierSelect) sTierSelect.value = "1";
    if(eTierSelect) eTierSelect.value = "1";
});










}


// Notifikasi Pop-up
document.addEventListener("DOMContentLoaded", function() {
    const notif = document.getElementById("purchase-notification");
    if(notif) {
        setTimeout(() => {
            notif.style.transform = "translateY(0)";
            setTimeout(() => {
                notif.style.transform = "translateY(150%)";
            }, 5000);
        }, 2000);
    }
});


}


}

if (typeof tsParticles !== 'undefined') {
    tsParticles.load("tsparticles", {
        fpsLimit: 60,
        interactivity: {
            events: {
                onHover: { enable: true, mode: "grab" },
                resize: true
            },
            modes: {
                grab: {
                    distance: 140,
                    links: { opacity: 0.6 }
                }
            }
        },
        particles: {
            color: { value: "#0f6cff" },
            links: {
                color: "#0f6cff",
                distance: 150,
                enable: true,
                opacity: 0.2,
                width: 1
            },
            move: {
                direction: "none",
                enable: true,
                outModes: { default: "bounce" },
                random: false,
                speed: 1,
                straight: false
            },
            number: {
                density: { enable: true, area: 800 },
                value: 60
            },
            opacity: { value: 0.4 },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 4 } }
        },
        detectRetina: true
    });
}




