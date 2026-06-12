# RetailView Analytics — Backend API

> **UAS Data Warehouse** | Node.js + Express.js + MySQL

---

## 📁 Struktur Folder

```
backend/
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── productController.js
│   │   ├── customerController.js
│   │   ├── timeController.js
│   │   ├── salesController.js
│   │   └── analyticsController.js
│   ├── routes/
│   │   ├── product.js
│   │   ├── customer.js
│   │   ├── time.js
│   │   ├── sales.js
│   │   └── analytics.js
│   ├── services/
│   │   ├── productService.js
│   │   ├── customerService.js
│   │   ├── timeService.js
│   │   ├── salesService.js
│   │   └── analyticsService.js
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   └── validator.js
│   ├── utils/
│   │   ├── response.js
│   │   └── pagination.js
│   ├── database/
│   │   ├── schema.sql            # CREATE TABLE star schema
│   │   ├── schema.js             # Runner schema.sql
│   │   ├── seed.sql              # Sample data
│   │   └── seed.js               # Runner seed.sql
│   └── app.js
├── server.js
├── .env
└── package.json
```

---

## 🗄️ Star Schema

```

| Tabel | Keterangan |
|-------|-----------|
| `dim_produk` | Dimensi produk (kode, nama, kategori, harga) |
| `dim_pelanggan` | Dimensi pelanggan (kode, nama, jenis kelamin, kota) |
| `dim_waktu` | Dimensi waktu (tanggal, tahun, bulan, kuartal) |
| `fact_penjualan` | Fakta transaksi penjualan |

---

## ⚙️ Setup & Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/nurwahyuam/RetailView-Analytics.git
cd RetailView-Analytics/backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Konfigurasi Database Aiven

Buka [aiven.io](https://aiven.io) → Login → pilih service **MySQL** → tab **Overview**.
Salin credential yang tersedia lalu buat file `.env` di folder `backend/`:

> Ganti `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` sesuai credential Aiven kamu.

### 4. Tambahkan SSL di `src/config/db.js`

Aiven MySQL **wajib menggunakan SSL**. Pastikan konfigurasi pool seperti ini:

```js
const pool = mysql.createPool({
  host              : process.env.DB_HOST,
  port              : parseInt(process.env.DB_PORT) || 3306,
  user              : process.env.DB_USER,
  password          : process.env.DB_PASSWORD,
  database          : process.env.DB_NAME,
  ssl               : { rejectUnauthorized: false },  // ← wajib untuk Aiven
  waitForConnections: true,
  connectionLimit   : 10,
  queueLimit        : 0,
  timezone          : '+07:00',
});
```

### 5. Buat Tabel (Schema)

```bash
npm run db:schema
```

Output yang diharapkan:
```
✅  Schema dw_penjualan berhasil dibuat
```

### 6. Isi Sample Data (Seed)

```bash
npm run db:seed
```

Output yang diharapkan:
```
✅  Seed data berhasil: 8 produk, 7 pelanggan, 12 waktu, 15 penjualan
```

### 7. Jalankan Server

```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

Output yang diharapkan:
```
✅  Database terhubung: defaultdb@mysql-xxxxx.aivencloud.com

╔══════════════════════════════════════════╗
║   UAS Data Warehouse - Toko Retail API   ║
╠══════════════════════════════════════════╣
║  Port  : 3000                            ║
║  Base  : http://localhost:3000/api/v1    ║
╚══════════════════════════════════════════╝
```

---

## 📡 Endpoint API

**Base URL:** `http://localhost:3000/api/v1`

### Health Check
| Method | Endpoint | Keterangan |
|--------|----------|-----------|
| GET | `/health` | Cek status server |

### dim_produk
| Method | Endpoint | Keterangan |
|--------|----------|-----------|
| GET | `/produk` | List semua produk |
| GET | `/produk?search=laptop` | Cari produk |
| GET | `/produk?kategori=Elektronik` | Filter kategori |
| GET | `/produk/:id` | Detail produk |
| POST | `/produk` | Tambah produk |
| PUT | `/produk/:id` | Update produk |
| DELETE | `/produk/:id` | Hapus produk |

### dim_pelanggan
| Method | Endpoint | Keterangan |
|--------|----------|-----------|
| GET | `/pelanggan` | List semua pelanggan |
| GET | `/pelanggan?kota=Surabaya` | Filter kota |
| GET | `/pelanggan/:id` | Detail pelanggan |
| POST | `/pelanggan` | Tambah pelanggan |
| PUT | `/pelanggan/:id` | Update pelanggan |
| DELETE | `/pelanggan/:id` | Hapus pelanggan |

### dim_waktu
| Method | Endpoint | Keterangan |
|--------|----------|-----------|
| GET | `/waktu` | List semua waktu |
| GET | `/waktu?tahun=2025` | Filter tahun |
| GET | `/waktu/:id` | Detail waktu |
| POST | `/waktu` | Tambah tanggal (auto-generate) |
| DELETE | `/waktu/:id` | Hapus waktu |

### fact_penjualan
| Method | Endpoint | Keterangan |
|--------|----------|-----------|
| GET | `/penjualan` | List semua transaksi |
| GET | `/penjualan?tahun=2025` | Filter tahun |
| GET | `/penjualan?bulan=1` | Filter bulan |
| GET | `/penjualan/:id` | Detail transaksi |
| POST | `/penjualan` | Tambah transaksi |
| PUT | `/penjualan/:id` | Update transaksi |
| DELETE | `/penjualan/:id` | Hapus transaksi |

### Analytics / Dashboard
| Method | Endpoint | Keterangan |
|--------|----------|-----------|
| GET | `/analytics/summary` | Ringkasan total penjualan |
| GET | `/analytics/per-produk` | Query 1: Penjualan per produk |
| GET | `/analytics/per-produk?kategori=Elektronik` | Query 1 + OLAP Slice |
| GET | `/analytics/trend-bulan` | Query 2: Tren per bulan |
| GET | `/analytics/trend-bulan?tahun=2025` | Tren filter tahun |
| GET | `/analytics/top-pelanggan` | Query 3: Top pelanggan |
| GET | `/analytics/kategori` | List kategori (untuk dropdown OLAP) |

---

## 📋 Request Body

### POST `/produk`
```json
{
  "kode_produk": "PRD-009",
  "nama_produk": "Flash Disk 64GB",
  "kategori": "Elektronik",
  "harga": 125000
}
```

### POST `/pelanggan`
```json
{
  "kode_pelanggan": "CST-008",
  "nama_pelanggan": "Rina Kartika",
  "jenis_kelamin": "P",
  "kota": "Surabaya"
}
```

### POST `/waktu`
```json
{
  "tanggal": "2025-06-09"
}
```
> `tahun`, `bulan`, `bulan_nama`, `kuartal` otomatis digenerate dari `tanggal`.

### POST `/penjualan`
```json
{
  "id_produk": 1,
  "id_pelanggan": 1,
  "id_waktu": 1,
  "jumlah": 3
}
```
> `harga_satuan` dan `total_harga` otomatis diambil dari harga produk.

---

## 📊 Standard JSON Response

### Success
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Data berhasil diambil",
  "data": {},
  "timestamp": "2025-06-09T10:00:00.000Z"
}
```

### Error Validasi
```json
{
  "success": false,
  "statusCode": 422,
  "message": "Validasi gagal",
  "errors": ["kode_produk wajib diisi"],
  "timestamp": "2025-06-09T10:00:00.000Z"
}
```

---

## 🧪 Testing Postman

1. Buka Postman
2. **Import** → pilih file `UAS_DW_Postman.postman_collection.json`
3. Set variable `base` = `http://localhost:3000/api/v1`
4. Jalankan urutan: **Health → Schema → Seed → CRUD → Analytics**

---

## 🛠️ Scripts

```bash
npm run dev        # Jalankan server development (nodemon)
npm start          # Jalankan server production
npm run db:schema  # Buat tabel di database
npm run db:seed    # Isi sample data
```