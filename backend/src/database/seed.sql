-- ============================================================
-- RetailView Analytics - Sample Data Seed
-- ============================================================

USE retailview_dw;

-- ============================================================
-- SEED: dim_product
-- ============================================================
INSERT INTO dim_product (product_code, product_name, category, sub_category, brand, unit, cost_price, selling_price) VALUES
('PRD-001', 'Indomie Goreng 85g',         'Makanan',    'Mie Instan',    'Indomie',   'pcs',  1200.00,  3500.00),
('PRD-002', 'Aqua Galon 19L',             'Minuman',    'Air Mineral',   'Aqua',      'galon',15000.00, 25000.00),
('PRD-003', 'Susu Ultra Milk 250ml',      'Minuman',    'Susu',          'Ultra',     'pcs',   4500.00,  7000.00),
('PRD-004', 'Rinso Anti Noda 800g',       'Kebutuhan',  'Detergen',      'Rinso',     'pcs',  12000.00, 19500.00),
('PRD-005', 'Minyak Goreng Bimoli 2L',    'Makanan',    'Minyak',        'Bimoli',    'btl',  22000.00, 32000.00),
('PRD-006', 'Teh Botol Sosro 450ml',      'Minuman',    'Teh',           'Sosro',     'btl',   3000.00,  5500.00),
('PRD-007', 'Good Day Kopi Susu 240ml',   'Minuman',    'Kopi',          'Good Day',  'kaleng',4500.00,  8000.00),
('PRD-008', 'Sabun Lifebuoy 80g',         'Kebutuhan',  'Sabun Mandi',   'Lifebuoy',  'pcs',   3000.00,  5000.00),
('PRD-009', 'Beras Premium 5kg',          'Makanan',    'Beras',         'Rose Brand','sak',  55000.00, 78000.00),
('PRD-010', 'Pampers Popok M-32',         'Bayi',       'Popok',         'Pampers',   'pcs',  65000.00, 95000.00);

-- ============================================================
-- SEED: dim_customer
-- ============================================================
INSERT INTO dim_customer (customer_code, customer_name, gender, age_group, city, province, segment, email, phone) VALUES
('CST-001', 'Budi Santoso',    'Laki-laki', '26-35', 'Surabaya',  'Jawa Timur',  'Member',    'budi@email.com',    '08123456701'),
('CST-002', 'Siti Rahayu',     'Perempuan', '36-45', 'Malang',    'Jawa Timur',  'Retail',    'siti@email.com',    '08123456702'),
('CST-003', 'Agus Wahyudi',    'Laki-laki', '46-55', 'Jakarta',   'DKI Jakarta', 'Wholesale', 'agus@email.com',    '08123456703'),
('CST-004', 'Dewi Lestari',    'Perempuan', '26-35', 'Bandung',   'Jawa Barat',  'Online',    'dewi@email.com',    '08123456704'),
('CST-005', 'Eko Prasetyo',    'Laki-laki', '17-25', 'Yogyakarta','DI Yogyakarta','Retail',   'eko@email.com',     '08123456705'),
('CST-006', 'Fitri Handayani', 'Perempuan', '36-45', 'Semarang',  'Jawa Tengah', 'Member',    'fitri@email.com',   '08123456706'),
('CST-007', 'Galih Permana',   'Laki-laki', '26-35', 'Surabaya',  'Jawa Timur',  'Retail',    'galih@email.com',   '08123456707'),
('CST-008', 'Hani Setiawan',   'Perempuan', '17-25', 'Depok',     'Jawa Barat',  'Online',    'hani@email.com',    '08123456708'),
('CST-009', 'Irfan Maulana',   'Laki-laki', '56+',   'Bekasi',    'Jawa Barat',  'Wholesale', 'irfan@email.com',   '08123456709'),
('CST-010', 'Juwita Sari',     'Perempuan', '46-55', 'Tangerang', 'Banten',      'Retail',    'juwita@email.com',  '08123456710');

-- ============================================================
-- SEED: dim_store
-- ============================================================
INSERT INTO dim_store (store_code, store_name, store_type, city, province, region, address, manager_name, phone) VALUES
('STR-001', 'RetailView Surabaya Pusat',  'Supermarket',  'Surabaya',   'Jawa Timur',  'Jawa Timur',  'Jl. Pemuda No.1, Surabaya',           'Rudi Hartono',  '031-1234501'),
('STR-002', 'RetailView Malang Raya',     'Minimarket',   'Malang',     'Jawa Timur',  'Jawa Timur',  'Jl. Semeru No.10, Malang',            'Sari Dewi',     '0341-234502'),
('STR-003', 'RetailView Jakarta Utara',   'Hypermarket',  'Jakarta',    'DKI Jakarta', 'Jabodetabek', 'Jl. Danau Sunter No.5, Jakarta Utara', 'Bimo Prasetyo', '021-3456503'),
('STR-004', 'RetailView Bandung Indah',   'Supermarket',  'Bandung',    'Jawa Barat',  'Jawa Barat',  'Jl. Dago No.22, Bandung',             'Indah Cahyani', '022-4567504'),
('STR-005', 'RetailView Yogya Central',   'Minimarket',   'Yogyakarta', 'DI Yogyakarta','DIY',        'Jl. Malioboro No.50, Yogyakarta',     'Wahyu Nugroho', '0274-567505'),
('STR-006', 'RetailView Online Store',    'Online',       'Jakarta',    'DKI Jakarta', 'Nasional',    'Platform Digital RetailView',         'Admin Online',  '021-9999506'),
('STR-007', 'RetailView Semarang Besar',  'Supermarket',  'Semarang',   'Jawa Tengah', 'Jawa Tengah', 'Jl. Pandanaran No.8, Semarang',       'Teguh Santoso', '024-6780507'),
('STR-008', 'RetailView Depok Mas',       'Minimarket',   'Depok',      'Jawa Barat',  'Jabodetabek', 'Jl. Margonda No.100, Depok',          'Lisa Anggraeni','021-7891508');

-- ============================================================
-- SEED: dim_time (2024 - per bulan)
-- ============================================================
INSERT INTO dim_time (full_date, day_of_week, day_name, day_of_month, day_of_year, week_of_year, month_number, month_name, quarter, semester, year_number, is_weekend) VALUES
('2024-01-15', 2, 'Senin',    15,  15,  3,  1,  'Januari',  1, 1, 2024, 0),
('2024-02-10', 7, 'Minggu',   10,  41,  6,  2,  'Februari', 1, 1, 2024, 1),
('2024-03-20', 4, 'Rabu',     20,  80,  12, 3,  'Maret',    1, 1, 2024, 0),
('2024-04-05', 6, 'Sabtu',    5,   96,  14, 4,  'April',    2, 1, 2024, 1),
('2024-05-12', 1, 'Minggu',   12,  133, 19, 5,  'Mei',      2, 1, 2024, 1),
('2024-06-18', 3, 'Selasa',   18,  170, 25, 6,  'Juni',     2, 1, 2024, 0),
('2024-07-22', 2, 'Senin',    22,  204, 30, 7,  'Juli',     3, 2, 2024, 0),
('2024-08-08', 5, 'Kamis',    8,   221, 32, 8,  'Agustus',  3, 2, 2024, 0),
('2024-09-14', 7, 'Minggu',   14,  258, 37, 9,  'September',3, 2, 2024, 1),
('2024-10-10', 5, 'Kamis',    10,  284, 41, 10, 'Oktober',  4, 2, 2024, 0),
('2024-11-25', 2, 'Senin',    25,  330, 48, 11, 'November', 4, 2, 2024, 0),
('2024-12-31', 3, 'Selasa',   31,  366, 53, 12, 'Desember', 4, 2, 2024, 0);

-- ============================================================
-- SEED: fact_sales
-- ============================================================
INSERT INTO fact_sales (invoice_no, time_id, product_id, customer_id, store_id, quantity, unit_price, discount_pct, discount_amt, subtotal, tax_pct, tax_amt, total_amount, payment_method) VALUES
('INV-2024-001',  1, 1, 1, 1, 10, 3500.00,  5.00,  1750.00,  33250.00, 11.00,  3657.50,  36907.50,  'QRIS'),
('INV-2024-002',  1, 2, 2, 1,  2,25000.00,  0.00,     0.00,  50000.00, 11.00,  5500.00,  55500.00,  'Tunai'),
('INV-2024-003',  2, 5, 3, 3, 50,32000.00, 10.00, 160000.00,1440000.00,11.00,158400.00,1598400.00, 'Transfer'),
('INV-2024-004',  2, 9, 4, 4,  5,78000.00,  0.00,     0.00, 390000.00, 11.00, 42900.00, 432900.00,  'Kartu Kredit'),
('INV-2024-005',  3, 3, 5, 5, 20, 7000.00,  0.00,     0.00, 140000.00, 11.00, 15400.00, 155400.00,  'QRIS'),
('INV-2024-006',  3, 4, 6, 7,  8,19500.00,  5.00,  7800.00, 148200.00, 11.00, 16302.00, 164502.00,  'E-Wallet'),
('INV-2024-007',  4, 6, 7, 2, 30, 5500.00,  0.00,     0.00, 165000.00, 11.00, 18150.00, 183150.00,  'Tunai'),
('INV-2024-008',  4,10, 8, 6,  3,95000.00, 15.00, 42750.00, 242250.00, 11.00, 26647.50, 268897.50,  'Kartu Kredit'),
('INV-2024-009',  5, 7, 9, 3, 24, 8000.00,  0.00,     0.00, 192000.00, 11.00, 21120.00, 213120.00,  'Transfer'),
('INV-2024-010',  5, 8,10, 8, 15, 5000.00,  0.00,     0.00,  75000.00, 11.00,  8250.00,  83250.00,  'QRIS'),
('INV-2024-011',  6, 1, 1, 1, 20, 3500.00,  5.00,  3500.00,  66500.00, 11.00,  7315.00,  73815.00,  'E-Wallet'),
('INV-2024-012',  6, 9, 3, 3, 10,78000.00,  0.00,     0.00, 780000.00, 11.00, 85800.00, 865800.00,  'Transfer'),
('INV-2024-013',  7, 5, 2, 4, 30,32000.00, 10.00, 96000.00, 864000.00, 11.00, 95040.00, 959040.00,  'Kartu Kredit'),
('INV-2024-014',  7, 2, 4, 5,  4,25000.00,  0.00,     0.00, 100000.00, 11.00, 11000.00, 111000.00,  'QRIS'),
('INV-2024-015',  8, 3, 6, 7, 12, 7000.00,  0.00,     0.00,  84000.00, 11.00,  9240.00,  93240.00,  'Tunai'),
('INV-2024-016',  8, 4, 5, 2,  6,19500.00,  5.00,  5850.00, 111150.00, 11.00, 12226.50, 123376.50,  'E-Wallet'),
('INV-2024-017',  9, 6, 7, 1, 48, 5500.00,  0.00,     0.00, 264000.00, 11.00, 29040.00, 293040.00,  'Transfer'),
('INV-2024-018',  9,10, 8, 6,  5,95000.00, 20.00, 95000.00, 380000.00, 11.00, 41800.00, 421800.00,  'Kartu Kredit'),
('INV-2024-019', 10, 7, 9, 3, 36, 8000.00,  0.00,     0.00, 288000.00, 11.00, 31680.00, 319680.00,  'QRIS'),
('INV-2024-020', 10, 8,10, 8, 20, 5000.00,  0.00,     0.00, 100000.00, 11.00, 11000.00, 111000.00,  'Tunai'),
('INV-2024-021', 11, 1, 2, 1, 15, 3500.00,  0.00,     0.00,  52500.00, 11.00,  5775.00,  58275.00,  'E-Wallet'),
('INV-2024-022', 11, 9, 4, 4,  8,78000.00,  5.00, 31200.00, 592800.00, 11.00, 65208.00, 658008.00,  'Transfer'),
('INV-2024-023', 12, 5, 3, 3, 40,32000.00, 15.00,192000.00,1088000.00,11.00,119680.00,1207680.00,  'Kartu Kredit'),
('INV-2024-024', 12, 2, 1, 5,  6,25000.00,  0.00,     0.00, 150000.00, 11.00, 16500.00, 166500.00,  'QRIS');
