-- Create database (optional)
CREATE DATABASE IF NOT EXISTS `brispot` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `brispot`;

-- Table: pengajuan
CREATE TABLE IF NOT EXISTS `pengajuan` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `mode` VARCHAR(20) NOT NULL DEFAULT 'pengajuan',
  `nama` VARCHAR(255) NOT NULL,
  `nik` VARCHAR(32) NOT NULL,
  `ttl` VARCHAR(255) NOT NULL,
  `npwp` VARCHAR(64) DEFAULT NULL,
  `pekerjaan` VARCHAR(255) DEFAULT NULL,
  `nomor_hp` VARCHAR(32) DEFAULT NULL,
  `nominal_pengajuan` BIGINT DEFAULT NULL,
  `jangka_waktu` INT DEFAULT NULL,
  `angsuran` BIGINT DEFAULT NULL,
  `bunga` DECIMAL(6,2) DEFAULT NULL,
  `revisi_nominal` BIGINT DEFAULT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'Proses',
  `progress` VARCHAR(100) DEFAULT NULL,
  `foto_path` VARCHAR(512) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_nik` (`nik`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


