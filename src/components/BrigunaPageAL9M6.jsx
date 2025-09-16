import React, { useState } from 'react';
import './BrigunaPage.css';
import Icon from '../assets/icon.png';

const BrigunaPageAL9M6 = () => {
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
          Selamat <span className="highlight-name">ALFANES MARCELINO LAHAMENDU</span><br />
          Pinjaman Anda Berhasil Dicairkan
        </div>

        <div className="main-card-content">
          <div className="icon-container">
            <img src={Icon} alt="icon" />
          </div>

          <div className="amount-section">
            <div className="main-amount">Rp160,000,000</div>
            <div className="term-info">Jangka Waktu <span className="month">96 Bulan</span></div>
          </div>

          <div className="revision-section" onClick={openModal} style={{ cursor: 'pointer' }}>
            <hr/>
            <div className="revision-title">Detail Pinjaman</div>
            <hr/>
          </div>

          <div className="received-section">
            <div className="received-title">Uang yang Anda Terima</div>
            <div className="received-amount">Rp153,553,500</div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Rincian Biaya</h3>
            </div>
            <div className="modal-body">
              <div className="modal-row">
                <span>Revisi Plafon Pinjaman</span>
                <span>160,000,000</span>
              </div>
              <div className="modal-row">
                <span>Biaya Provisi</span>
                <span className="deduction">- 1,380,000</span>
              </div>
              <div className="modal-row">
                <span>Biaya Administrasi</span>
                <span className="deduction">- 250,000</span>
              </div>
              <div className="modal-row">
                <span>Biaya Premi Asuransi Jiwa</span>
                <span>0</span>
              </div>
              <div className="modal-row">
                <span>Angsuran Ditahan</span>
                <span className="deduction">- 2,316,500</span>
              </div>
              <div className="modal-row">
                <span>Dana Ditahan</span>
                <span className="deduction">- 2,500,000</span>
              </div>
              <div className="modal-row total-row">
                <span>Uang yang Anda Terima</span>
                <span className="total-amount">Rp153,553,500</span>
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

export default BrigunaPageAL9M6;


