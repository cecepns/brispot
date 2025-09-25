import React, { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import './InputDataPage.css';

const API_BASE_URL = 'https://api-inventory.isavralabel.com/brispot/api';

function StepItem({ label, active }) {
  return (
    <div className={`step-item ${active ? 'active' : ''}`}>
      <span className="dot" />
      <span className="label">{label}</span>
    </div>
  );
}

export default function InputDataPage() {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const [mode, setMode] = useState('pengajuan');
  const [form, setForm] = useState({
    nama: '',
    nik: '',
    ttl: '',
    npwp: '',
    pekerjaan: '',
    nomorHp: '',
    nominalPengajuan: '',
    jangkaWaktu: '',
    angsuran: '',
    bunga: '',
    revisiNominal: '',
    status: 'Proses',
    foto: null,
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  const progressSteps = useMemo(
    () => [
      'Pemasukan Berkas',
      'BI Checking',
      'Analisis',
      'Pengiriman Link Melalui Wa',
      'Pencairan',
      'Permintaan Revisi',
      'Revisi Selesai',
    ],
    []
  );

  // Load data for edit mode
  useEffect(() => {
    if (editId) {
      setIsEditMode(true);
      setLoadingData(true);
      
      fetch(`${API_BASE_URL}/pengajuan/${editId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch data');
          }
          return response.json();
        })
        .then(data => {
          // In edit mode, force mode to 'revisi'
          setMode('revisi');
          setForm({
            nama: data.nama || '',
            nik: data.nik || '',
            ttl: data.ttl || '',
            npwp: data.npwp || '',
            pekerjaan: data.pekerjaan || '',
            nomorHp: data.nomor_hp || '',
            nominalPengajuan: data.nominal_pengajuan || '',
            jangkaWaktu: data.jangka_waktu || '',
            angsuran: data.angsuran || '',
            bunga: data.bunga || '',
            revisiNominal: data.revisi_nominal || '',
            status: data.status || 'Proses',
            foto: null,
          });
          
          // Set progress step
          const progressIndex = progressSteps.findIndex(step => step === data.progress);
          if (progressIndex !== -1) {
            setActiveStepIdx(progressIndex);
          }
        })
        .catch(error => {
          console.error('Error loading data:', error);
          setSubmitError('Gagal memuat data untuk diedit');
        })
        .finally(() => {
          setLoadingData(false);
        });
    }
  }, [editId, progressSteps]);


  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

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

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      // Validate required fields
      if (!form.nama || !form.nik || !form.ttl || !form.nominalPengajuan || !form.jangkaWaktu || !form.angsuran || !form.bunga) {
        throw new Error('Mohon lengkapi semua field yang wajib diisi');
      }

      // Prepare form data for API submission
      const formData = new FormData();
      formData.append('mode', mode);
      formData.append('nama', form.nama);
      formData.append('nik', form.nik);
      formData.append('ttl', form.ttl);
      formData.append('npwp', form.npwp);
      formData.append('pekerjaan', form.pekerjaan);
      formData.append('nomorHp', form.nomorHp);
      formData.append('nominalPengajuan', form.nominalPengajuan);
      formData.append('jangkaWaktu', form.jangkaWaktu);
      formData.append('angsuran', form.angsuran);
      formData.append('bunga', form.bunga);
      formData.append('revisiNominal', form.revisiNominal);
      formData.append('status', form.status);
      formData.append('progress', progressSteps[activeStepIdx]);
      
      if (form.foto) {
        formData.append('foto', form.foto);
      }

      const url = isEditMode ? `${API_BASE_URL}/pengajuan/${editId}` : `${API_BASE_URL}/pengajuan`;
      const method = isEditMode ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const result = await response.json();
      
      // Show success preview
      const payload = {
        ...form,
        mode,
        progress: progressSteps[activeStepIdx],
        createdAt: new Date().toISOString(),
        id: result.id,
      };
      setPreviewData(payload);
      setShowPreview(true);
      setSubmitSuccess(true);

      // Reset form
      setForm((prev) => ({
        ...prev,
        nama: '',
        nik: '',
        ttl: '',
        npwp: '',
        pekerjaan: '',
        nomorHp: '',
        nominalPengajuan: '',
        jangkaWaktu: '',
        angsuran: '',
        bunga: '',
        revisiNominal: '',
        foto: null,
      }));

    } catch (error) {
      console.error('Submit error:', error);
      setSubmitError(error.message || 'Terjadi kesalahan saat menyimpan data. Pastikan backend server berjalan di http://localhost:4000');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="briguna-wrapper">
      <header className="briguna-header">
        <img src="/icon.png" alt="BRIguna" className="header-icon" />
        <h1 className="header-title">BRIguna</h1>
        {isEditMode && (
          <div className="edit-badge">
            <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm">
              Mode Edit
            </span>
          </div>
        )}
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="grid grid-cols-2 bg-white/10 max-w-fit rounded">
            <button
              className={`mode-btn ${mode === 'pengajuan' ? 'active' : ''}`}
              onClick={() => { if (!isEditMode) setMode('pengajuan'); }}
              disabled={isEditMode}
            >
              Pengajuan
            </button>
            <button
              className={`mode-btn ${mode === 'revisi' ? 'active' : ''}`}
              onClick={() => { if (!isEditMode) setMode('revisi'); }}
              disabled={isEditMode}
            >
              Revisi
            </button>
          </div>
          {/* <button
            onClick={() => window.location.href = '/list-data'}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Lihat Data
          </button> */}
        </div>

        {loadingData && (
          <div className="flex justify-center items-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-white">Memuat data...</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <form className="form-panel md:col-span-2" onSubmit={handleSubmit}>
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
                <label>Nomor HP</label>
                <input
                  type="tel"
                  inputMode="tel"
                  placeholder="08xxxxxxxxxx"
                  value={form.nomorHp}
                  onChange={(e) => updateField('nomorHp', e.target.value)}
                  required
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
              <div
                className="status-btn"
              >
                {form.status || 'Proses'}
              </div>
              {/* <span className="status-value">{form.status}</span> */}
            </div>

            {submitError && (
              <div className="error-message" style={{ 
                background: '#fee2e2', 
                color: '#dc2626', 
                padding: '12px', 
                borderRadius: '8px', 
                marginBottom: '16px',
                border: '1px solid #fecaca'
              }}>
                <strong>Error:</strong> {submitError}
              </div>
            )}

            {submitSuccess && (
              <div className="success-message" style={{ 
                background: '#dcfce7', 
                color: '#166534', 
                padding: '12px', 
                borderRadius: '8px', 
                marginBottom: '16px',
                border: '1px solid #bbf7d0'
              }}>
                <strong>Berhasil!</strong> Data berhasil disimpan ke database.
              </div>
            )}

            <div className="actions">
              <button 
                type="submit" 
                className="primary" 
                disabled={isSubmitting || loadingData}
                style={{ opacity: (isSubmitting || loadingData) ? 0.6 : 1 }}
              >
                {isSubmitting ? (isEditMode ? 'Mengupdate...' : 'Menyimpan...') : (isEditMode ? 'Update' : 'Simpan')}
              </button>
              <button 
                type="button" 
                className="ghost" 
                onClick={() => {
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
                  setSubmitError(null);
                  setSubmitSuccess(false);
                }}
                disabled={isSubmitting || loadingData}
              >
                Reset
              </button>
            </div>
          </form>

          <aside className="progress-panel max-h-fit">
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
                {/* <button 
                  className="secondary" 
                  onClick={() => {
                    setShowPreview(false);
                    window.location.href = '/list-data';
                  }}
                >
                  Lihat Data
                </button> */}
                <button className="primary" onClick={() => setShowPreview(false)}>Selesai</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


