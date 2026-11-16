# TaskFlow API Dokümantasyonu

**Temel adres:** `http://localhost:3000`
**Veri formatı:** JSON (`Content-Type: application/json`)

Tüm yanıtlar şu yapıdadır:

```json
{ "success": true, "data": { } }                 // başarılı
{ "success": false, "message": "...", "errors": [] } // hatalı
```

## Durum Kodları

| Kod | Anlamı |
|---|---|
| 200 OK | İstek başarılı |
| 201 Created | Görev oluşturuldu |
| 400 Bad Request | Doğrulama hatası, geçersiz id veya bozuk JSON |
| 404 Not Found | Görev veya endpoint bulunamadı |
| 500 Internal Server Error | Beklenmeyen sunucu hatası |

---

## Görevler

### `GET /tasks` — Görevleri listele

Sorgu parametreleri (hepsi opsiyonel, birlikte kullanılabilir):

| Parametre | Örnek | Açıklama |
|---|---|---|
| `status` | `completed` | `todo`, `in-progress`, `completed` |
| `priority` | `high` | `low`, `medium`, `high` |
| `project` | `TaskFlow` | Proje adı (büyük/küçük harf duyarsız) |
| `sort` | `createdAt`, `-dueDate` | Sıralama alanı; başına `-` konursa azalan. Alanlar: `createdAt`, `updatedAt`, `dueDate`, `priority`, `title`, `id` |
| `page`, `limit` | `page=1&limit=10` | Sayfalama (limit en fazla 100) |

```http
GET /tasks?status=completed&page=1&limit=2
```

```json
{
  "success": true,
  "count": 2,
  "data": [ { "id": 1, "title": "Backend klasör yapısını oluştur", "status": "completed", "...": "..." }, { "id": 2, "...": "..." } ],
  "pagination": { "page": 1, "limit": 2, "total": 3, "totalPages": 2 }
}
```

Sayfalama yoksa `pagination` yerine `total` döner.

### `GET /tasks/:id` — Görev detayı

```http
GET /tasks/1
```

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Backend klasör yapısını oluştur",
    "description": "routes, controllers, services ve middlewares klasörlerini hazırla.",
    "status": "completed",
    "priority": "high",
    "assignee": "musa",
    "project": "TaskFlow",
    "dueDate": "2026-11-10",
    "createdAt": "2026-11-03T09:00:00.000Z",
    "updatedAt": "2026-11-05T15:30:00.000Z"
  }
}
```

Bulunamazsa `404`: `{ "success": false, "message": "99 numaralı görev bulunamadı." }`

### `POST /tasks` — Görev ekle

| Alan | Zorunlu | Kural |
|---|---|---|
| `title` | ✔ | 3–100 karakter |
| `priority` | ✔ | `low`, `medium`, `high` |
| `assignee` | ✔ | Metin (küçük harfe çevrilerek saklanır) |
| `description` | | En fazla 500 karakter |
| `status` | | Varsayılan `todo` |
| `project` | | Varsayılan `Genel` |
| `dueDate` | | Geçerli tarih, örn. `2026-12-31` |

```http
POST /tasks
Content-Type: application/json

{
  "title": "Postman ile CRUD testi yap",
  "description": "Tüm uç noktaları Postman üzerinden doğrula.",
  "priority": "high",
  "assignee": "musa",
  "project": "TaskFlow",
  "dueDate": "2026-11-30"
}
```

Yanıt `201 Created`:

```json
{ "success": true, "message": "Görev oluşturuldu.", "data": { "id": 9, "status": "todo", "...": "..." } }
```

Doğrulama hatası `400 Bad Request`:

```json
{
  "success": false,
  "message": "Doğrulama hatası.",
  "errors": [
    "title 3-100 karakter arasında olmalıdır.",
    "priority alanı zorunludur.",
    "assignee alanı zorunludur."
  ]
}
```

### `PUT /tasks/:id` — Görevi tamamen güncelle

POST ile aynı gövde ve kurallar. Gönderilmeyen opsiyonel alanlar varsayılana döner (`status` gönderilmezse mevcut değer korunur). `createdAt` değişmez.

### `PATCH /tasks/:id` — Görevi kısmen güncelle

Sadece gönderilen alanlar değişir; alanlar zorunlu değildir ama gönderilirse aynı kurallarla doğrulanır.

```http
PATCH /tasks/9
Content-Type: application/json

{ "status": "completed" }
```

### `DELETE /tasks/:id` — Görevi sil

```json
{ "success": true, "message": "Görev silindi.", "data": { "id": 9, "...": "..." } }
```

### `GET /tasks/search?keyword=backend` — Arama

Başlık, açıklama ve proje adında (Türkçe karakter duyarlı, büyük/küçük harf duyarsız) arama yapar. `keyword` yoksa `400`.

### `GET /tasks/assignee/:name` — Çalışana göre listele

```http
GET /tasks/assignee/musa
```

`/tasks` ile aynı filtre, sıralama ve sayfalama parametrelerini destekler.

---

## Raporlar

### `GET /reports/completed`

```json
{ "success": true, "completedCount": 3, "data": [ ... ] }
```

### `GET /reports/pending`

`todo` ve `in-progress` durumundaki görevler.

```json
{ "success": true, "pendingCount": 5, "data": [ ... ] }
```

### `GET /reports/summary`

```json
{
  "success": true,
  "data": {
    "totalTasks": 8,
    "completedTasks": 3,
    "pendingTasks": 5,
    "overdueTasks": 0,
    "completionRate": 38,
    "byStatus":   { "todo": 3, "in-progress": 2, "completed": 3 },
    "byPriority": { "low": 2, "medium": 3, "high": 3 },
    "byAssignee": { "musa": 2, "ayse": 2, "zeynep": 2, "emre": 2 },
    "byProject":  { "TaskFlow": 5, "Mobil Uygulama": 1, "Altyapı": 2 }
  }
}
```

`overdueTasks`: teslim tarihi geçmiş ve tamamlanmamış görev sayısı.

---

## Logger Çıktısı

Her istek konsola ve `logs/requests.log` dosyasına şu formatta yazılır:

```
[2026-11-16T13:11:09.804Z] POST /tasks -> 201 (4 ms)
[2026-11-16T13:11:09.907Z] GET /tasks -> 200 (3 ms)
```
