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
const kalanTh = document.getElementById("kalanTh");

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
  //? prevent yapmazsak form olduğu için değerleri submit yapar göndermeye çalışır formu sıfırlar hesaplamalarımızda kullanamayız
  e.preventDefault(); // Prevent page refresh on form submit

  gelirler += Number(gelirInput.value); // Add entered amount to total income

  // console.log(gelirler); // Log total income to console
  localStorage.setItem("gelirler", gelirler); // Save total income to local storage
  gelirinizTd.innerText = gelirler; // Update total income display on page
  ekleFormu.reset(); // Reset form inputs
  hesaplaVeGuncelle(); // Re-calculate and update the result
  grafikOlustur();
});

window.addEventListener("load", () => {
  gelirler = Number(localStorage.getItem("gelirler")) || 0;
  //* || ilk trueyu arar null gelmesine karşı yaptık 0 olarak sayı döndürsün null döndürmesin
  gelirinizTd.innerText = gelirler;
  tarihInput.valueAsDate = new Date(); //? girilen günün tarihi default olarak verilmiş oluyor
  harcamaListesi = JSON.parse(localStorage.getItem("harcamalar")) || [];
  harcamaListesi.forEach((harcama) => harcamayiDomaYaz(harcama));
  hesaplaVeGuncelle();
  grafikOlustur();
});

harcamaFormu.addEventListener("submit", (e) => {
  e.preventDefault(); //reload u engeller
  const yeniHarcama = {
    id: new Date().getTime(),
    // tarih: tarihInput.value, her bir nesne epoch tan uniq id alır
    tarih: new Date(tarihInput.value).toLocaleDateString(),
    //? tarih gösterimini yerel gösterime ayarladık
    alan: harcamaAlaniInput.value,
    miktar: miktarInput.value,
  };
  console.log(yeniHarcama);

  harcamaFormu.reset();
  tarihInput.valueAsDate = new Date();

  harcamaListesi.push(yeniHarcama);
  localStorage.setItem("harcamalar", JSON.stringify(harcamaListesi));
  harcamayiDomaYaz(yeniHarcama);
  hesaplaVeGuncelle();
  grafikOlustur();
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
  //? istenmeyen kod çalıştırılabilir

  //? create element yöntemi ile DOM a ekleme
  const tr = document.createElement("tr"); //? tr elementi oluşturur

  //? tr elementinin ilk üç öğesi oluşturulur
  //? DRY DONT REPEAT YOURSELF!
  const appendTd = (content) => {
    const td = document.createElement("td");
    td.textContent = content;
    return td;
  };

  const createLastTd = () => {
    const td = document.createElement("td");
    const iElement = document.createElement("i");
    iElement.id = id;
    iElement.className = "fa-solid fa-trash-can text-danger";
    iElement.type = "button";
    td.appendChild(iElement);
    return td;
  };
  //? td oluşturarak tr ye aşağıda fonksiyonları çağırarak ekledik
  tr.append(appendTd(tarih), appendTd(alan), appendTd(miktar), createLastTd());

  //   harcamaBody.append(tr)//?harcamayı sona ekler
  harcamaBody.prepend(tr); //?harcamayı öne ekler
};

const hesaplaVeGuncelle = () => {
  // gelirinizTd.innerText=gelirler
  gelirinizTd.innerText = new Intl.NumberFormat().format(gelirler);
  const giderler = harcamaListesi.reduce(
    (toplam, harcama) => toplam + Number(harcama.miktar),
    0
  );

  // giderinizTd.innerText=giderler
  giderinizTd.innerText = new Intl.NumberFormat().format(giderler); //? gider toplamını ekrana yaz 1.000 formatında
  kalanTd.innerText = new Intl.NumberFormat().format(gelirler - giderler);

  const borclu = gelirler - giderler < 0;

  //? eksiye geçilmesi durumunda kırmızı gözükecek
  //? text-danger classı eklenecek
  kalanTd.classList.toggle("text-danger", borclu);
  kalanTh.classList.toggle("text-danger", borclu);
  grafikOlustur();
};

harcamaBody.addEventListener("click", (e) => {
  console.log(e.target);

  if (e.target.classList.contains("fa-trash-can")) {
    e.target.parentElement.parentElement.remove();
  }
  //? silinen harcamanın id sini alır
  const id = e.target.id;
  // console.log(id);
  //? silinen harcamayı array den çıkarır
  harcamaListesi = harcamaListesi.filter((harcama) => harcama.id != id);
  //?yeni array i local e update eder
  localStorage.setItem("harcamalar", JSON.stringify(harcamaListesi));
  //?silindikten sonra yeniden hesapla
  hesaplaVeGuncelle();
  grafikOlustur();
});

temizleBtn.addEventListener("click", () => {
  if (confirm("Silmek istediğinize emin misiniz?")) {
    harcamaListesi = []; //tüm harcamaları listeden siler
    gelirler = 0; //geliri sıfırlar
    // localStorage.clear() // tüm local storage siler
    localStorage.removeItem("gelirler"); // sadece gelirleri siler
    localStorage.removeItem("harcamalar"); // sadece gelirleri siler
    harcamaBody.innerHTML = ""; // DOM dan harcamları siler
    hesaplaVeGuncelle();
    grafikOlustur();
  }
});

const grafikOlustur = () => {
  const data = JSON.parse(localStorage.getItem("harcamalar"));
  const labels = data.map((item) => item.alan);
  const values = data.map((item) => item.miktar);

  const ctx = document.getElementById("myChart").getContext("2d");

  const myChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Harcama Miktarı",
          data: values,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Harcama Grafiği",
        },
      },
    },
  });
};
