-- ============================================================
-- UAS Data Warehouse - Sample Data
-- ============================================================

USE dw_penjualan;

-- dim_produk (minimal 5 record)
INSERT INTO dim_produk (kode_produk, nama_produk, kategori, harga) VALUES
('PRD-001', 'Laptop Asus VivoBook',  'Elektronik',  8500000.00),
('PRD-002', 'Mouse Wireless Logitech','Elektronik',  250000.00),
('PRD-003', 'Keyboard Mechanical',   'Elektronik',   750000.00),
('PRD-004', 'Kaos Polos Cotton',     'Pakaian',       85000.00),
('PRD-005', 'Kemeja Batik Slim Fit', 'Pakaian',      185000.00),
('PRD-006', 'Headset Gaming RGB',    'Elektronik',   450000.00),
('PRD-007', 'Celana Jeans Slim',     'Pakaian',      250000.00),
('PRD-008', 'Smartwatch Series 5',   'Elektronik',  1200000.00);

-- dim_pelanggan (minimal 5 record)
INSERT INTO dim_pelanggan (kode_pelanggan, nama_pelanggan, jenis_kelamin, kota) VALUES
('CST-001', 'Budi Santoso',    'L', 'Surabaya'),
('CST-002', 'Siti Aisyah',     'P', 'Malang'),
('CST-003', 'Agus Wijaya',     'L', 'Jakarta'),
('CST-004', 'Dewi Rahayu',     'P', 'Bandung'),
('CST-005', 'Rizky Firmansyah','L', 'Yogyakarta'),
('CST-006', 'Nur Hidayah',     'P', 'Surabaya'),
('CST-007', 'Fajar Nugroho',   'L', 'Semarang');

-- dim_waktu (minimal 5 record)
INSERT INTO dim_waktu (tanggal, tahun, bulan, bulan_nama, kuartal) VALUES
('2025-01-15', 2025, 1,  'Januari',   1),
('2025-02-20', 2025, 2,  'Februari',  1),
('2025-03-10', 2025, 3,  'Maret',     1),
('2025-04-05', 2025, 4,  'April',     2),
('2025-05-18', 2025, 5,  'Mei',       2),
('2025-06-22', 2025, 6,  'Juni',      2),
('2025-07-09', 2025, 7,  'Juli',      3),
('2025-08-14', 2025, 8,  'Agustus',   3),
('2025-09-30', 2025, 9,  'September', 3),
('2025-10-11', 2025, 10, 'Oktober',   4),
('2025-11-25', 2025, 11, 'November',  4),
('2025-12-31', 2025, 12, 'Desember',  4);

-- fact_penjualan (minimal 10 record)
-- total_harga = jumlah × harga_satuan
INSERT INTO fact_penjualan (id_produk, id_pelanggan, id_waktu, jumlah, harga_satuan, total_harga) VALUES
(1, 1,  1, 1, 8500000.00, 8500000.00),
(2, 2,  1, 2,  250000.00,  500000.00),
(3, 3,  2, 1,  750000.00,  750000.00),
(4, 4,  2, 3,   85000.00,  255000.00),
(5, 5,  3, 2,  185000.00,  370000.00),
(1, 6,  4, 1, 8500000.00, 8500000.00),
(6, 7,  4, 1,  450000.00,  450000.00),
(7, 1,  5, 2,  250000.00,  500000.00),
(8, 2,  5, 1, 1200000.00, 1200000.00),
(2, 3,  6, 4,  250000.00, 1000000.00),
(3, 4,  7, 2,  750000.00, 1500000.00),
(5, 5,  8, 3,  185000.00,  555000.00),
(6, 6,  9, 1,  450000.00,  450000.00),
(4, 7, 10, 5,   85000.00,  425000.00),
(8, 1, 11, 2, 1200000.00, 2400000.00);
