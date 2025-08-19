import React from 'react';
import './BrigunaPage.css';
import Icon from '../assets/icon.png';

const BrigunaPage9X3M5 = () => {
  return (
    <div className="briguna-container">
      <div className="header">
        <h1>BRIguna</h1>
      </div>

      <div className="main-card">
        <div className="section-title">Pencairan</div>

        <div className="congratulations">
          Selamat <span className="highlight-name">IBRHA PRATAMA OLII</span><br />
          Pinjaman Anda Berhasil Dicairkan
        </div>

        <div className="main-card-content">
          <div className="icon-container">
            <img src={Icon} alt="icon" />
          </div>

          <div className="amount-section">
            <div className="main-amount">Rp120,000,000</div>
            <div className="term-info">Jangka Waktu <strong>72 Bulan</strong></div>
          </div>

          <div className="revision-section">
            <div className="revision-title">Revisi</div>
          </div>

          <div className="received-section">
            <div className="received-title">Uang yang Anda Terima</div>
            <div className="received-amount">Rp112,607,200</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrigunaPage9X3M5;
