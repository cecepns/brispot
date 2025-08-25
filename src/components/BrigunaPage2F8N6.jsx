import React, { useState } from 'react';
import './BrigunaPage.css';
import Icon from '../assets/icon.png';

const BrigunaPage2F8N6 = () => {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="briguna-container">
      <div className="header">
        <h1>BRIguna</h1>
      </div>

      <div className="main-card">
        <div className="section-title">Pencairan</div>

        <div className="congratulations">
          Selamat <span className="highlight-name">AMMAR SUBAGJA MS</span><br />
          Pinjaman Anda Berhasil Dicairkan
        </div>

        <div className="main-card-content">
          <div className="icon-container">
            <img src={Icon} alt="icon" />
          </div>

          <div className="amount-section">
            <div className="main-amount">Rp100,000,000</div>
            <div className="term-info">Jangka Waktu <span className="month">72 Bulan</span></div>
            <div className="term-info">Angsuran Per Bulan <span className="month">Rp1,799,100</span></div>
          </div>

          <div className="revision-section" onClick={openModal} style={{ cursor: 'pointer' }}>
            <hr/>
            <div className="revision-title">Detail Pinjaman</div>
            <hr/>
          </div>

          <div className="received-section">
            <div className="received-title">Uang yang Anda Terima</div>
            <div className="received-amount">Rp93,964,900</div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Sisa Pinjaman Sebelumnya & Rincian Biaya</h3>
            </div>
            <div className="modal-body">
              <div className="modal-row">
                <span>Plafon Pinjaman</span>
                <span>100,000,000</span>
              </div>
              <div className="modal-row">
                <span>Biaya Provisi</span>
                <span className="deduction">- 900,000</span>
              </div>
              <div className="modal-row">
                <span>Biaya Administrasi</span>
                <span className="deduction">- 150,000</span>
              </div>
              <div className="modal-row">
                <span>Biaya Premi Asuransi Jiwa</span>
                <span className="deduction">- 3,186,000</span>
              </div>
              <div className="modal-row">
                <span>Angsuran Ditahan</span>
                <span className="deduction">- 1,799,100</span>
              </div>
              <div className="modal-row total-row">
                <span>Total Uang Yang Diterima</span>
                <span className="total-amount">Rp93,964,900</span>
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-button" onClick={closeModal}>
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrigunaPage2F8N6;
