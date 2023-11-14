// Pasta grafiği oluşturmak için Chart.js kütüphanesini kullanın
const olusturPastaGrafigi = () => {
    // Harcama alanlarından sadece isimleri al
    const harcamaIsimleri = harcamaListesi.map((harcama) => harcama.alan);
    // Harcama miktarlarını al
    const harcamaMiktarlari = harcamaListesi.map((harcama) => Number(harcama.miktar));
  
    // Canvas elementini seçin
    const ctx = document.getElementById("myChart").getContext("2d");
  
    // Pasta grafiğini oluşturun
    const myChart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: harcamaIsimleri,
        datasets: [
          {
            label: "Harcama Miktarları",
            data: harcamaMiktarlari,
            backgroundColor: [
              "#FF6384", // Renk 1
              "#36A2EB", // Renk 2
              "#FFCE56", // Renk 3
              // ... Daha fazla renk eklenebilir
            ],
          },
        ],
      },
    });
  };
  
  // Hesapla ve güncelle fonksiyonunu çağırarak pasta grafiğini güncelleyin
  hesaplaVeGuncelle();
  olusturPastaGrafigi();
  