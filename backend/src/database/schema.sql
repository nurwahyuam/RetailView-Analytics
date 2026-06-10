-- ============================================================
-- RetailView Analytics - Data Warehouse Schema
-- Star Schema Design
-- ============================================================

CREATE DATABASE IF NOT EXISTS retailview_dw
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE retailview_dw;

-- ============================================================
-- DIMENSION TABLES
-- ============================================================

-- Dimension: Product
CREATE TABLE IF NOT EXISTS dim_product (
  product_id    INT           NOT NULL AUTO_INCREMENT,
  product_code  VARCHAR(50)   NOT NULL UNIQUE,
  product_name  VARCHAR(200)  NOT NULL,
  category      VARCHAR(100)  NOT NULL,
  sub_category  VARCHAR(100)  NOT NULL,
  brand         VARCHAR(100)  NOT NULL,
  unit          VARCHAR(20)   NOT NULL DEFAULT 'pcs',
  cost_price    DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  selling_price DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  is_active     TINYINT(1)   NOT NULL DEFAULT 1,
  created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (product_id),
  INDEX idx_product_code    (product_code),
  INDEX idx_product_category (category),
  INDEX idx_product_brand   (brand)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dimension: Customer
CREATE TABLE IF NOT EXISTS dim_customer (
  customer_id   INT           NOT NULL AUTO_INCREMENT,
  customer_code VARCHAR(50)   NOT NULL UNIQUE,
  customer_name VARCHAR(200)  NOT NULL,
  gender        ENUM('Laki-laki','Perempuan','Lainnya') NOT NULL DEFAULT 'Lainnya',
  age_group     ENUM('17-25','26-35','36-45','46-55','56+') NOT NULL DEFAULT '26-35',
  city          VARCHAR(100)  NOT NULL,
  province      VARCHAR(100)  NOT NULL,
  segment       ENUM('Retail','Wholesale','Online','Member') NOT NULL DEFAULT 'Retail',
  email         VARCHAR(150)  DEFAULT NULL,
  phone         VARCHAR(20)   DEFAULT NULL,
  is_active     TINYINT(1)   NOT NULL DEFAULT 1,
  created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (customer_id),
  INDEX idx_customer_code    (customer_code),
  INDEX idx_customer_city    (city),
  INDEX idx_customer_segment (segment)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dimension: Store
CREATE TABLE IF NOT EXISTS dim_store (
  store_id     INT          NOT NULL AUTO_INCREMENT,
  store_code   VARCHAR(50)  NOT NULL UNIQUE,
  store_name   VARCHAR(200) NOT NULL,
  store_type   ENUM('Supermarket','Minimarket','Hypermarket','Online','Outlet') NOT NULL DEFAULT 'Minimarket',
  city         VARCHAR(100) NOT NULL,
  province     VARCHAR(100) NOT NULL,
  region       VARCHAR(100) NOT NULL,
  address      TEXT         DEFAULT NULL,
  manager_name VARCHAR(150) DEFAULT NULL,
  phone        VARCHAR(20)  DEFAULT NULL,
  is_active    TINYINT(1)  NOT NULL DEFAULT 1,
  created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (store_id),
  INDEX idx_store_code   (store_code),
  INDEX idx_store_city   (city),
  INDEX idx_store_region (region)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dimension: Time
CREATE TABLE IF NOT EXISTS dim_time (
  time_id      INT         NOT NULL AUTO_INCREMENT,
  full_date    DATE        NOT NULL UNIQUE,
  day_of_week  TINYINT     NOT NULL COMMENT '1=Senin, 7=Minggu',
  day_name     VARCHAR(15) NOT NULL,
  day_of_month TINYINT     NOT NULL,
  day_of_year  SMALLINT    NOT NULL,
  week_of_year TINYINT     NOT NULL,
  month_number TINYINT     NOT NULL,
  month_name   VARCHAR(15) NOT NULL,
  quarter      TINYINT     NOT NULL COMMENT '1-4',
  semester     TINYINT     NOT NULL COMMENT '1-2',
  year_number  SMALLINT    NOT NULL,
  is_weekend   TINYINT(1) NOT NULL DEFAULT 0,
  is_holiday   TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (time_id),
  INDEX idx_full_date    (full_date),
  INDEX idx_year_month   (year_number, month_number),
  INDEX idx_year_quarter (year_number, quarter)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- FACT TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS fact_sales (
  sales_id      BIGINT        NOT NULL AUTO_INCREMENT,
  invoice_no    VARCHAR(50)   NOT NULL,
  time_id       INT           NOT NULL,
  product_id    INT           NOT NULL,
  customer_id   INT           NOT NULL,
  store_id      INT           NOT NULL,
  quantity      INT           NOT NULL DEFAULT 1,
  unit_price    DECIMAL(15,2) NOT NULL,
  discount_pct  DECIMAL(5,2)  NOT NULL DEFAULT 0.00 COMMENT 'Persentase diskon 0-100',
  discount_amt  DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  subtotal      DECIMAL(15,2) NOT NULL,
  tax_pct       DECIMAL(5,2)  NOT NULL DEFAULT 11.00 COMMENT 'PPN 11%',
  tax_amt       DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  total_amount  DECIMAL(15,2) NOT NULL,
  payment_method ENUM('Tunai','Kartu Kredit','Transfer','QRIS','E-Wallet') NOT NULL DEFAULT 'Tunai',
  created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (sales_id),
  CONSTRAINT fk_sales_time     FOREIGN KEY (time_id)     REFERENCES dim_time(time_id),
  CONSTRAINT fk_sales_product  FOREIGN KEY (product_id)  REFERENCES dim_product(product_id),
  CONSTRAINT fk_sales_customer FOREIGN KEY (customer_id) REFERENCES dim_customer(customer_id),
  CONSTRAINT fk_sales_store    FOREIGN KEY (store_id)    REFERENCES dim_store(store_id),
  INDEX idx_invoice_no   (invoice_no),
  INDEX idx_time_id      (time_id),
  INDEX idx_product_id   (product_id),
  INDEX idx_customer_id  (customer_id),
  INDEX idx_store_id     (store_id),
  INDEX idx_created_at   (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
