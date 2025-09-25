import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './InputDataPage.css';
import Logo from '../assets/logo.jpeg';

const API_BASE_URL = 'https://api-inventory.isavralabel.com/brispot/api';

function formatCurrencyId(value) {
  if (value === null || value === undefined || value === '') return '-';
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return String(value);
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(numeric);
}

function formatDate(dateString) {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function StatusBadge({ status }) {
  const getStatusColor = (statusValue) => {
    switch ((statusValue || '').toLowerCase()) {
      case 'selesai': return 'bg-green-100 text-green-800';
      case 'proses': return 'bg-yellow-100 text-yellow-800';
      case 'ditolak': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`px-2 py-1 max-w-fit rounded-full text-xs font-medium ${getStatusColor(status)}`}>
      {status || 'Proses'}
    </span>
  );
}

function ProgressBadge({ progress }) {
  if (!progress) return null;
  return (
    <span className="px-2 py-1 max-w-fit rounded-full text-xs font-medium bg-blue-100 text-blue-800">
      {progress}
    </span>
  );
}

export default function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDetail = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/pengajuan/${id}`);
      if (!response.ok) {
        if (response.status === 404) throw new Error('Data tidak ditemukan');
        throw new Error(`Server error: ${response.status}`);
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat memuat data');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  // const updateProgress = async (progress, status) => {
  //   if (!id) return;
  //   try {
  //     const response = await fetch(`${API_BASE_URL}/pengajuan/${id}/progress`, {
  //       method: 'PATCH',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ progress, status })
  //     });
  //     if (!response.ok) throw new Error('Gagal memperbarui progress');
  //     const updated = await response.json();
  //     setData(updated);
  //   } catch (err) {
  //     setError(err.message);
  //   }
  // };

  return (
    <div className="briguna-wrapper">
      <header className="briguna-header">
        <img src={Logo} alt="BRIguna" className="header-icon" />
        <h1 className="header-title">Admin - BRIguna Digital</h1>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Detail Pengajuan</h2>
            {/* <p className="text-gray-300">ID: {id}</p> */}
          </div>
          <div className="flex gap-2">
            {/* <button onClick={() => navigate(-1)} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg">Kembali</button> */}
            {data && (
              <button onClick={() => navigate(`/input-data?edit=${data.id}`)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">Edit</button>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong>Error:</strong> {error}
          </div>
        )}

        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Memuat detail...</p>
          </div>
        ) : data ? (
          <section className="bg-white rounded-lg shadow overflow-hidden">
            <div className="modal-header px-6 py-4 flex items-center justify-between border-b">
              <div className="brand flex items-center gap-3">
                <img src="/icon.png" alt="BRIguna" className="brand-icon h-10 w-10" />
                <div className="brand-text">
                  <h2 className="text-xl font-semibold">{data.nama}</h2>
                  <span className="brand-sub text-sm text-white">{data.nik}</span>
                </div>
              </div>
              <div className="header-right flex items-center gap-3">
                {data.foto_path && (
                  <div className="modal-photo-preview w-14 h-14 rounded-full overflow-hidden">
                    <img src={`https://api-inventory.isavralabel.com/brispot/${data.foto_path}`} alt="Foto" className="modal-photo w-full h-full object-cover" />
                  </div>
                )}
                <StatusBadge status={data.status} />
              </div>
            </div>

            <div className="modal-body p-6">
              <div className="chips mb-4 flex gap-2">
                <span className="chip bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">Mode: {data.mode}</span>
                <span className="chip bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Progress: {data.progress || '-'}</span>
              </div>

              <div className="summary-row grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="summary-col">
                  <div className="label text-gray-500 text-sm">Nama</div>
                  <div className="value">{data.nama || '-'}</div>
                </div>
                <div className="summary-col">
                  <div className="label text-gray-500 text-sm">NIK</div>
                  <div className="value">{data.nik || '-'}</div>
                </div>
                <div className="summary-col">
                  <div className="label text-gray-500 text-sm">TTL</div>
                  <div className="value">{data.ttl || '-'}</div>
                </div>
              </div>

              <div className="summary-row grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="summary-col">
                  <div className="label text-gray-500 text-sm">NPWP</div>
                  <div className="value">{data.npwp || '-'}</div>
                </div>
                <div className="summary-col">
                  <div className="label text-gray-500 text-sm">Pekerjaan</div>
                  <div className="value">{data.pekerjaan || '-'}</div>
                </div>
                <div className="summary-col">
                  <div className="label text-gray-500 text-sm">Dibuat</div>
                  <div className="value">{formatDate(data.created_at)}</div>
                </div>
              </div>

              <div className="amount-card glow bg-blue-50 rounded-lg p-4 mb-6">
                <div className="amount-value text-2xl font-semibold">{formatCurrencyId(data.nominal_pengajuan)}</div>
                <div className="term-info text-sm text-gray-600">Jangka Waktu <strong>{data.jangka_waktu || '-'} Bulan</strong></div>
              </div>

              {!!data.revisi_nominal && (
                <div className="revision-card bg-orange-50 rounded-lg p-4 mb-6">
                  <div className="revision-title text-sm text-orange-700">Revisi</div>
                  <div className="revision-amount text-lg font-semibold text-orange-800">{formatCurrencyId(data.revisi_nominal)}</div>
                </div>
              )}

              <div className="details-grid grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="detail-item">
                  <div className="label text-gray-500 text-sm">Angsuran</div>
                  <div className="value">{formatCurrencyId(data.angsuran)}</div>
                </div>
                <div className="detail-item">
                  <div className="label text-gray-500 text-sm">Bunga</div>
                  <div className="value">{data.bunga || '-'}%</div>
                </div>
                <div className="detail-item">
                  <div className="label text-gray-500 text-sm">Status</div>
                  <div className="value status-pill"><StatusBadge status={data.status} /></div>
                </div>
              </div>

              {/* <div className="progress-update-section">
                <h4 className="text-lg font-semibold mb-3">Update Progress</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select 
                    className="px-3 py-2 border border-gray-300 rounded-lg bg-transparent"
                    onChange={(e) => {
                      if (e.target.value) updateProgress(e.target.value, data.status);
                    }}
                    defaultValue=""
                  >
                    <option value="">Pilih Progress</option>
                    <option value="Pemasukan Berkas">Pemasukan Berkas</option>
                    <option value="BI Checking">BI Checking</option>
                    <option value="Analisis">Analisis</option>
                    <option value="Pengiriman Link Melalui Wa">Pengiriman Link Melalui Wa</option>
                    <option value="Pencairan / Revisi">Pencairan / Revisi</option>
                  </select>
                  <select 
                    className="px-3 py-2 border border-gray-300 rounded-lg bg-transparent"
                    onChange={(e) => {
                      if (e.target.value) updateProgress(data.progress, e.target.value);
                    }}
                    defaultValue=""
                  >
                    <option value="">Pilih Status</option>
                    <option value="Proses">Proses</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Ditolak">Ditolak</option>
                  </select>
                </div>
              </div> */}
            </div>
          </section>
        ) : (
          <div className="p-8 text-center text-gray-600">Data tidak ditemukan</div>
        )}
      </div>
    </div>
  );
}


