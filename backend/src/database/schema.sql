-- ============================================================
-- UAS Data Warehouse - Toko Retail Online
-- Star Schema sesuai soal
-- Database: dw_penjualan
-- ============================================================

CREATE DATABASE IF NOT EXISTS defaultdb
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE defaultdb;

-- ============================================================
-- DIMENSION: dim_produk
-- ============================================================
CREATE TABLE IF NOT EXISTS dim_produk (
  id_produk    INT            NOT NULL AUTO_INCREMENT,
  kode_produk  VARCHAR(20)    NOT NULL UNIQUE,
  nama_produk  VARCHAR(100)   NOT NULL,
  kategori     VARCHAR(50)    NOT NULL,
  harga        DECIMAL(10,2)  NOT NULL DEFAULT 0.00,
  PRIMARY KEY (id_produk),
  INDEX idx_kategori (kategori)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- DIMENSION: dim_pelanggan
-- ============================================================
CREATE TABLE IF NOT EXISTS dim_pelanggan (
  id_pelanggan    INT          NOT NULL AUTO_INCREMENT,
  kode_pelanggan  VARCHAR(20)  NOT NULL UNIQUE,
  nama_pelanggan  VARCHAR(100) NOT NULL,
  jenis_kelamin   ENUM('L','P') NOT NULL DEFAULT 'L',
  kota            VARCHAR(50)  NOT NULL,
  PRIMARY KEY (id_pelanggan),
  INDEX idx_kota (kota)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- DIMENSION: dim_waktu
-- ============================================================
CREATE TABLE IF NOT EXISTS dim_waktu (
  id_waktu    INT         NOT NULL AUTO_INCREMENT,
  tanggal     DATE        NOT NULL UNIQUE,
  tahun       INT         NOT NULL,
  bulan       INT         NOT NULL,
  bulan_nama  VARCHAR(20) NOT NULL,
  kuartal     INT         NOT NULL,
  PRIMARY KEY (id_waktu),
  INDEX idx_tahun_bulan (tahun, bulan)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- FACT: fact_penjualan
-- ============================================================
CREATE TABLE IF NOT EXISTS fact_penjualan (
  id_penjualan  INT            NOT NULL AUTO_INCREMENT,
  id_produk     INT            NOT NULL,
  id_pelanggan  INT            NOT NULL,
  id_waktu      INT            NOT NULL,
  jumlah        INT            NOT NULL DEFAULT 1,
  harga_satuan  DECIMAL(10,2)  NOT NULL,
  total_harga   DECIMAL(10,2)  NOT NULL,
  PRIMARY KEY (id_penjualan),
  CONSTRAINT fk_penjualan_produk    FOREIGN KEY (id_produk)    REFERENCES dim_produk(id_produk),
  CONSTRAINT fk_penjualan_pelanggan FOREIGN KEY (id_pelanggan) REFERENCES dim_pelanggan(id_pelanggan),
  CONSTRAINT fk_penjualan_waktu     FOREIGN KEY (id_waktu)     REFERENCES dim_waktu(id_waktu),
  INDEX idx_id_produk    (id_produk),
  INDEX idx_id_pelanggan (id_pelanggan),
  INDEX idx_id_waktu     (id_waktu)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
