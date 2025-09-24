import React, { useMemo, useState } from 'react';
import './InputDataPage.css';

function StepItem({ label, active }) {
  return (
    <div className={`step-item ${active ? 'active' : ''}`}>
      <span className="dot" />
      <span className="label">{label}</span>
    </div>
  );
}

export default function InputDataPage() {
  const [mode, setMode] = useState('pengajuan');
  const [form, setForm] = useState({
    nama: '',
    nik: '',
    ttl: '',
    npwp: '',
    pekerjaan: '',
    nominalPengajuan: '',
    jangkaWaktu: '',
    angsuran: '',
    bunga: '',
    revisiNominal: '',
    status: 'Proses',
    foto: null,
  });

  const progressSteps = useMemo(
    () => [
      'Pemasukan Berkas',
      'BI Checking',
      'Analisis',
      'Pengiriman Link Melalui Wa',
      'Pencairan / Revisi',
    ],
    []
  );

  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  function formatCurrencyId(value) {
    if (value === null || value === undefined || value === '') return '-';
    const numeric = Number(value);
    if (Number.isNaN(numeric)) return String(value);
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(numeric);
  }

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handlePhotoChange(e) {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, foto: file }));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      ...form,
      mode,
      progress: progressSteps[activeStepIdx],
      createdAt: new Date().toISOString(),
    };
    setPreviewData(payload);
    setShowPreview(true);
    // reset minimal fields but keep mode
    setForm((prev) => ({
      ...prev,
      nama: '',
      nik: '',
      ttl: '',
      npwp: '',
      pekerjaan: '',
      nominalPengajuan: '',
      jangkaWaktu: '',
      angsuran: '',
      bunga: '',
      revisiNominal: '',
      foto: null,
    }));
  }

  return (
    <div className="briguna-wrapper">
      <header className="briguna-header">
        <img src="/icon.png" alt="BRIguna" className="header-icon" />
        <h1 className="header-title">BRIguna</h1>
      </header>

      <div className="content">
        <div className="mode-switch">
          <button
            className={`mode-btn ${mode === 'pengajuan' ? 'active' : ''}`}
            onClick={() => setMode('pengajuan')}
          >
            Pengajuan
          </button>
          <button
            className={`mode-btn ${mode === 'revisi' ? 'active' : ''}`}
            onClick={() => setMode('revisi')}
          >
            Revisi
          </button>
        </div>

        <div className="panels">
          <form className="form-panel" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="field">
                <label>Nama</label>
                <input
                  type="text"
                  value={form.nama}
                  onChange={(e) => updateField('nama', e.target.value)}
                  required
                />
              </div>

              <div className="field">
                <label>NIK</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={form.nik}
                  onChange={(e) => updateField('nik', e.target.value)}
                  required
                />
              </div>

              <div className="field">
                <label>TTL</label>
                <input
                  type="text"
                  placeholder="Tempat, Tanggal Lahir"
                  value={form.ttl}
                  onChange={(e) => updateField('ttl', e.target.value)}
                  required
                />
              </div>

              <div className="field">
                <label>NPWP</label>
                <input
                  type="text"
                  value={form.npwp}
                  onChange={(e) => updateField('npwp', e.target.value)}
                />
              </div>

              <div className="field">
                <label>Pekerjaan</label>
                <input
                  type="text"
                  value={form.pekerjaan}
                  onChange={(e) => updateField('pekerjaan', e.target.value)}
                />
              </div>

              <div className="field">
                <label>Nominal Pengajuan</label>
                <input
                  type="number"
                  value={form.nominalPengajuan}
                  onChange={(e) => updateField('nominalPengajuan', e.target.value)}
                  required
                />
              </div>

              <div className="field">
                <label>Jangka Waktu (bulan)</label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={form.jangkaWaktu}
                  onChange={(e) => updateField('jangkaWaktu', e.target.value)}
                  required
                />
              </div>

              <div className="field">
                <label>Angsuran</label>
                <input
                  type="number"
                  value={form.angsuran}
                  onChange={(e) => updateField('angsuran', e.target.value)}
                  required
                />
              </div>

              {mode === 'revisi' && (
                <div className="field">
                  <label>Revisi Nominal</label>
                  <input
                    type="number"
                    value={form.revisiNominal}
                    onChange={(e) => updateField('revisiNominal', e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="field">
                <label>Bunga (%)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.bunga}
                  onChange={(e) => updateField('bunga', e.target.value)}
                  required
                />
              </div>

              <div className="field photo-field">
                <label>Foto</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="photo-input"
                />
                {form.foto && (
                  <div className="photo-preview">
                    <img 
                      src={URL.createObjectURL(form.foto)} 
                      alt="Preview" 
                      className="preview-image"
                    />
                    <span className="photo-name">{form.foto.name}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="status-row">
              <span className="status-label">Status Pengajuan:</span>
              <button
                type="button"
                className="status-btn"
                onClick={() => updateField('status', 'Proses')}
              >
                Proses
              </button>
              {/* <span className="status-value">{form.status}</span> */}
            </div>

            <div className="actions">
              <button type="submit" className="primary">Simpan</button>
              <button type="reset" className="ghost" onClick={() => window.location.reload()}>
                Reset
              </button>
            </div>
          </form>

          <aside className="progress-panel">
            <h3>Progress Pengajuan</h3>
            <div className="steps">
              {progressSteps.map((label, idx) => (
                <div key={label} onClick={() => setActiveStepIdx(idx)}>
                  <StepItem label={label} active={idx <= activeStepIdx} />
                </div>
              ))}
            </div>

            <div className="legend">
              <span className="legend-item">
                <span className="legend-dot active" /> Selesai/aktif
              </span>
              <span className="legend-item">
                <span className="legend-dot" /> Belum
              </span>
            </div>
          </aside>
        </div>
        {showPreview && previewData && (
          <div className="modal-overlay" role="dialog" aria-modal="true">
            <div className="modal-card animate-pop">
              <div className="modal-header">
                <div className="brand">
                  <img src="/icon.png" alt="BRIguna" className="brand-icon" />
                  <div className="brand-text">
                    <h2>BRIguna</h2>
                    <span className="brand-sub">Ringkasan {previewData.mode === 'revisi' ? 'Revisi' : 'Pengajuan'}</span>
                  </div>
                </div>
                <div className="header-right">
                  {previewData.foto && (
                    <div className="modal-photo-preview">
                      <img 
                        src={URL.createObjectURL(previewData.foto)} 
                        alt="Foto" 
                        className="modal-photo"
                      />
                    </div>
                  )}
                  <span className={`badge ${previewData.mode === 'revisi' ? 'badge-warning' : 'badge-info'}`}>
                    {previewData.mode}
                  </span>
                  <button className="close-btn" onClick={() => setShowPreview(false)} aria-label="Tutup">✕</button>
                </div>
              </div>

              <div className="modal-body">
                <div className="chips">
                  <span className="chip">Status: {previewData.status}</span>
                  <span className="chip">Progress: {previewData.progress}</span>
                </div>

                <div className="summary-row">
                  <div className="summary-col">
                    <div className="label">Nama</div>
                    <div className="value">{previewData.nama || '-'}</div>
                  </div>
                  <div className="summary-col">
                    <div className="label">NIK</div>
                    <div className="value">{previewData.nik || '-'}</div>
                  </div>
                  <div className="summary-col">
                    <div className="label">TTL</div>
                    <div className="value">{previewData.ttl || '-'}</div>
                  </div>
                </div>

                <div className="summary-row">
                  <div className="summary-col">
                    <div className="label">NPWP</div>
                    <div className="value">{previewData.npwp || '-'}</div>
                  </div>
                  <div className="summary-col">
                    <div className="label">Pekerjaan</div>
                    <div className="value">{previewData.pekerjaan || '-'}</div>
                  </div>
                  <div className="summary-col">
                    <div className="label">Dibuat</div>
                    <div className="value">{new Date(previewData.createdAt).toLocaleString()}</div>
                  </div>
                </div>

                <div className="amount-card glow">
                  <div className="amount-value">{formatCurrencyId(previewData.nominalPengajuan)}</div>
                  <div className="term-info">Jangka Waktu <strong>{previewData.jangkaWaktu || '-'} Bulan</strong></div>
                </div>

                {previewData.mode === 'revisi' && (
                  <div className="revision-card">
                    <div className="revision-title">Revisi</div>
                    <div className="revision-amount">{formatCurrencyId(previewData.revisiNominal)}</div>
                  </div>
                )}

                <div className="details-grid">
                  <div className="detail-item">
                    <div className="label">Angsuran</div>
                    <div className="value">{formatCurrencyId(previewData.angsuran)}</div>
                  </div>
                  <div className="detail-item">
                    <div className="label">Bunga</div>
                    <div className="value">{previewData.bunga || '-'}%</div>
                  </div>
                  <div className="detail-item">
                    <div className="label">Status</div>
                    <div className="value status-pill">{previewData.status}</div>
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button className="ghost" onClick={() => setShowPreview(false)}>Kembali</button>
                <button className="primary" onClick={() => setShowPreview(false)}>Selesai</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


