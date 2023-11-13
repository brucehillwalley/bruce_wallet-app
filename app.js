//? selectors
const ekleBtn = document.getElementById("ekle-btn");
const gelirInput = document.getElementById("gelir-input");
const ekleFormu = document.getElementById("ekle-formu");

//?variables

let gelirler = 0;
let harcamaListesi=[]

//?hesap tablosu

const gelirinizTd = document.getElementById("geliriniz");
const giderinizTd = document.getElementById("gideriniz");
const kalanTd = document.getElementById("kalan");

//?harcama formu
const harcamaFormu=document.getElementById("harcama-formu")
const miktarInput=document.getElementById("miktar")
const tarihInput=document.getElementById("tarih")
const harcamaAlaniInput=document.getElementById("harcama-alani")

//?harcama Tablosu
const harcamaBody=document.querySelector("#harcama-body")
const temizleBtn=document.querySelector("#temizle-btn")

//?ekle formu

ekleFormu.addEventListener("submit", (e) => {
  e.preventDefault();

  gelirler += Number(gelirInput.value);

  console.log(gelirler);
  localStorage.setItem("gelirler", gelirler);
  gelirinizTd.innerText = gelirler;
  ekleFormu.reset();
});

window.addEventListener("load", () => {
  gelirler = Number(localStorage.getItem("gelirler")) || 0;
  //* || ilk trueyu arar null gelmesine karşı yaptık 0 olarak sayı döndürsün null döndürmesin
  gelirinizTd.innerText = gelirler;
});


harcamaFormu.addEventListener("submit", (e)=>{
e.preventDefault() //reload u engeller 
const yeniHarcama = {}
})