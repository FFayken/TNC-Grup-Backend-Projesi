# TaskFlow — Proje Tanıtım Dokümanı

## 1. Amaç

TaskFlow, Node.js ile Backend Programlama eğitiminin bitirme projesidir. Eğitim boyunca öğrenilen Node.js, Express.js, REST API tasarımı, routing, middleware ve CRUD konularının gerçek hayata yakın bir senaryo üzerinde uygulanması amaçlanmıştır.

## 2. Senaryo

Bir yazılım şirketi; ekip içindeki görevleri, projeleri ve çalışanların sorumluluklarını tek bir sistem üzerinden takip etmek istemektedir. Bugüne kadar bu takip tablolar ve mesajlaşma uygulamaları üzerinden yürütüldüğü için:

- hangi görevin kime atandığı,
- hangi görevin hangi aşamada olduğu,
- hangi işlerin öncelikli olduğu

net olarak görülememektedir. TaskFlow, bu ihtiyaca yönelik olarak geliştirilmiş bir **REST API**'dir. Web veya mobil bir arayüz bu API'yi kullanarak görev yönetimi ekranları oluşturabilir.

## 3. Sistem Özeti

### Veri Modeli — Görev (Task)

| Alan | Tip | Açıklama |
|---|---|---|
| `id` | number | Otomatik artan benzersiz kimlik |
| `title` | string | Görev başlığı (zorunlu, 3–100 karakter) |
| `description` | string | Açıklama (en fazla 500 karakter) |
| `status` | `todo` \| `in-progress` \| `completed` | Görev durumu (varsayılan `todo`) |
| `priority` | `low` \| `medium` \| `high` | Öncelik (zorunlu) |
| `assignee` | string | Görevin atandığı çalışan (zorunlu) |
| `project` | string | Görevin ait olduğu proje (varsayılan `Genel`) |
| `dueDate` | string \| null | Teslim tarihi (YYYY-MM-DD) |
| `createdAt` / `updatedAt` | ISO tarih | Oluşturulma / güncellenme zamanı |

Veriler `src/data/tasks.json` dosyasında saklanır; böylece sunucu yeniden başlatıldığında kaybolmaz.

### Mimari

```
İstek → express.json() → Logger → Router → (Validation) → Controller → Service → JSON Depo
                                                                              ↓
Yanıt ←──────────────────────────────── notFound / errorHandler ←─────────────┘
```

- **Routes:** URL ve HTTP metodunu ilgili controller fonksiyonuna bağlar.
- **Controllers:** İstek parametrelerini okur, uygun HTTP durum kodu ile yanıt döner.
- **Services:** İş mantığı — filtreleme, arama, sıralama, sayfalama, CRUD.
- **Middlewares:**
  - `logger` — tüm istekleri method, endpoint, zaman damgası, durum kodu ve süreyle konsola ve `logs/requests.log` dosyasına kaydeder.
  - `validateTask` — POST/PUT/PATCH gövdesini doğrular, hatada `400` döner.
  - `notFound` — tanımsız rotalar için `404`.
  - `errorHandler` — bozuk JSON için `400`, beklenmeyen hatalar için `500`.

### Temel Özellikler

1. **Görev Yönetimi (CRUD):** Görev ekleme, tüm görevleri listeleme, görev detayı, güncelleme (PUT/PATCH) ve silme.
2. **Görev Atama ve Takip:** Her görev bir çalışana atanır; durum (`todo → in-progress → completed`) ve öncelik (`low/medium/high`) takip edilir.
3. **Filtreleme ve Arama (ek):** Duruma, önceliğe, projeye ve çalışana göre listeleme; anahtar kelime ile arama; sıralama ve sayfalama.
4. **Raporlama (ek):** Tamamlanan / bekleyen görev sayıları ve durum, öncelik, çalışan ve proje bazında genel özet.

## 4. Test

Tüm uç noktalar Postman koleksiyonu (`postman/TaskFlow.postman_collection.json`) ile test edilmiştir. Koleksiyon 17 istek ve 38 doğrulama içerir; son çalıştırmada tüm testler başarılıdır. Ekran görüntüleri `screenshots/` klasöründe, HTML rapor `docs/test-raporu.html` dosyasındadır.

## 5. Kullanılan Teknolojiler

- Node.js v24, Express.js 5
- nodemon (geliştirme), Newman + htmlextra (Postman koleksiyonunu komut satırından çalıştırma ve raporlama)
