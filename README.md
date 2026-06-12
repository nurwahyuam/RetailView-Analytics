# RetailView Analytics

> **UAS Data Warehouse** — Sistem Informasi Penjualan Toko Retail Online
> Mata Kuliah: Data Warehouse | Semester 6 | UPN "Veteran" Jawa Timur

---

## 📁 Struktur Project

```
RetailView-Analytics/
├── backend/                      # REST API Node.js + Express.js
│   ├── src/
│   │   ├── config/               # Konfigurasi database
│   │   ├── controllers/          # Handler request & response
│   │   ├── routes/               # Definisi endpoint API
│   │   ├── services/             # Business logic & query SQL
│   │   ├── middleware/           # Validator & error handler
│   │   ├── utils/                # Helper response & pagination
│   │   ├── database/             # Schema SQL & seed data
│   │   └── app.js
│   ├── server.js
│   ├── .env                      # Konfigurasi environment (tidak di-push)
│   └── package.json
│
└── frontend/                     # Tampilan website (HTML/CSS/JS)
```

---

## 🗄️ Database — Star Schema

Database menggunakan **Star Schema** dengan MySQL di Aiven Cloud.

```
          dim_produk
               |
dim_pelanggan ─┼─ fact_penjualan
               |
           dim_waktu
```

| Tabel | Keterangan |
|-------|-----------|
| `dim_produk` | Dimensi produk (kode, nama, kategori, harga) |
| `dim_pelanggan` | Dimensi pelanggan (kode, nama, jenis kelamin, kota) |
| `dim_waktu` | Dimensi waktu (tanggal, tahun, bulan, kuartal) |
| `fact_penjualan` | Fakta transaksi penjualan |

---

## 🛠️ Teknologi

| Bagian | Teknologi |
|--------|----------|
| Backend | Node.js, Express.js |
| Database | MySQL (Aiven Cloud) |
| ORM/Query | mysql2 |
| Environment | dotenv |
| Dev Tool | nodemon |

---

## ⚙️ Cara Menjalankan

### Prasyarat
- Node.js v18+
- Akun [Aiven](https://aiven.io) dengan service MySQL aktif

---

### 1. Clone Repository

```bash
git clone https://github.com/nurwahyuam/RetailView-Analytics.git
cd RetailView-Analytics
```

---

### 2. Setup Backend

```bash
cd backend
npm install
```

---

### 3. Konfigurasi `.env`

Buat file `.env` di dalam folder `backend/`:

> Credential diambil dari halaman **Overview** service MySQL di Aiven.

---

### 4. Aktifkan SSL di `src/config/db.js`

Aiven MySQL wajib menggunakan SSL. Pastikan bagian pool seperti ini:

```js
const pool = mysql.createPool({
  host    : process.env.DB_HOST,
  port    : parseInt(process.env.DB_PORT) || 3306,
  user    : process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl     : { rejectUnauthorized: false },  // ← wajib untuk Aiven
  waitForConnections: true,
  connectionLimit   : 10,
  queueLimit        : 0,
  timezone          : '+07:00',
});
```

---

### 5. Buat Tabel & Isi Data

```bash
# Buat tabel star schema
npm run db:schema

# Isi sample data
npm run db:seed
```

---

### 6. Jalankan Server

```bash
npm run dev
```

Server berjalan di:
```
http://localhost:3000/api/v1
```

---

### 7. Jalankan Frontend

Buka folder `frontend/` lalu buka file `index.html` di browser, atau gunakan ekstensi **Live Server** di VS Code.

---

## 📡 Endpoint API

Base URL: `http://localhost:3000/api/v1`

| Method | Endpoint | Keterangan |
|--------|----------|-----------|
| GET | `/health` | Cek status server |
| GET/POST/PUT/DELETE | `/produk` | CRUD dimensi produk |
| GET/POST/PUT/DELETE | `/pelanggan` | CRUD dimensi pelanggan |
| GET/POST/DELETE | `/waktu` | CRUD dimensi waktu |
| GET/POST/PUT/DELETE | `/penjualan` | CRUD fakta penjualan |
| GET | `/analytics/summary` | Ringkasan total penjualan |
| GET | `/analytics/per-produk` | Total penjualan per produk |
| GET | `/analytics/trend-bulan` | Tren penjualan per bulan |
| GET | `/analytics/top-pelanggan` | Pelanggan belanja tertinggi |
| GET | `/analytics/kategori` | List kategori (OLAP Slice) |

> Detail lengkap endpoint tersedia di folder `backend/` → `UAS_DW_Postman.postman_collection.json`

---

## 👥 Tim Pengembang

| Nama | NIM |
|------|-----|
| Nurwahyu Akbar Maulidy | 23081010064 |
| Nurwahyu Akbar Maulidy | 23081010064 |
| Nurwahyu Akbar Maulidy | 23081010064 |
| Nurwahyu Akbar Maulidy | 23081010064 |

---

## 📄 Lisensi

Project ini dibuat untuk keperluan **UAS Mata Kuliah Data Warehouse**
Fakultas Ilmu Komputer — UPN "Veteran" Jawa Timur