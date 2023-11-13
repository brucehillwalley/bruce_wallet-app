//? selectors
const ekleBtn = document.getElementById("ekle-btn");
const gelirInput = document.getElementById("gelir-input");
const ekleFormu = document.getElementById("ekle-formu");

//?variables

let gelirler = 0;
let harcamaListesi = [];

//?hesap tablosu

const gelirinizTd = document.getElementById("geliriniz");
const giderinizTd = document.getElementById("gideriniz");
const kalanTd = document.getElementById("kalan");

//?harcama formu
const harcamaFormu = document.getElementById("harcama-formu");
const miktarInput = document.getElementById("miktar");
const tarihInput = document.getElementById("tarih");
const harcamaAlaniInput = document.getElementById("harcama-alani");

//?harcama Tablosu
const harcamaBody = document.querySelector("#harcama-body");
const temizleBtn = document.querySelector("#temizle-btn");

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
  tarihInput.valueAsDate = new Date();
});

harcamaFormu.addEventListener("submit", (e) => {
  e.preventDefault(); //reload u engeller
  const yeniHarcama = {
    id: new Date().getTime(),
    tarih: tarihInput.value,
    alan: harcamaAlaniInput.value,
    miktar: miktarInput.value,
  };
  console.log(yeniHarcama);
  harcamaFormu.reset();
  tarihInput.valueAsDate = new Date();

  harcamaListesi.push(yeniHarcama);
  localStorage.setItem("harcamalar", JSON.stringify(harcamaListesi));
  harcamayiDomaYaz(yeniHarcama);
});

//? harcamayı doma yaz

const harcamayiDomaYaz = ({ id, miktar, tarih, alan }) => {
  //! 1.yöntem tehlikeli inner html kulllanmamak lazım
  // const {id,miktar,tarih,alan}=yeniHarcama
  // harcamaBody.innerHTML += `
  // <tr>
  // <td>${tarih}</td>
  // <td>${alan}</td>
  // <td>${miktar}</td>
  // <td><i id=${id} class="fa-solid fa-trash-can text-danger"  type="button"></i></td>

  // </tr>
  // `

  const tr = document.createElement("tr");

  //? DRY DONT REPEAT YOURSELF!
  const appendTd = (content) => {
    const td = document.createElement("td");
    td.textContent = content;
    return td;
  };

  const createLastTd = () => {
    const td = document.createElement("td");
    const iElement = document.createElement("i");
    iElement.id=id;
    iElement.className="fa-solid fa-trash-can text-danger"
    iElement.type="button";
    td.appendChild(iElement);
    return td;
  
  };

  tr.append(appendTd(tarih), appendTd(alan), appendTd(miktar),createLastTd());

//   harcamaBody.append(tr)//?harcamayı sona ekler
  harcamaBody.prepend(tr)//?harcamayı öne ekler
};
