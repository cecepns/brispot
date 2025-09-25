import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './InputDataPage.css';

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
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
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

function DataRow({ data, onEdit, onDelete, onView, onUpdateProgress }) {
  const [showActions, setShowActions] = useState(false);

  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            {data.foto_path ? (
              <img 
                className="h-10 w-10 rounded-full object-cover" 
                src={`https://api-inventory.isavralabel.com/brispot/${data.foto_path}`} 
                alt={data.nama}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
            ) : null}
            <div 
              className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-medium text-sm"
              style={{ display: data.foto_path ? 'none' : 'flex' }}
            >
              {data.nama?.charAt(0)?.toUpperCase() || '?'}
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{data.nama || '-'}</div>
            <div className="text-sm text-gray-500">{data.nik || '-'}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{data.pekerjaan || '-'}</div>
        <div className="text-sm text-gray-500">{data.npwp || '-'}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">
          {formatCurrencyId(data.nominal_pengajuan)}
        </div>
        {data.revisi_nominal && (
          <div className="text-sm text-orange-600">
            Revisi: {formatCurrencyId(data.revisi_nominal)}
          </div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <StatusBadge status={data.status} />
            <ProgressBadge progress={data.progress} />
          </div>
          <div>
            <select
              className="px-2 py-1 border bg-green-600 text-white border-gray-300 rounded-md text-sm"
              defaultValue=""
              onChange={(e) => {
                if (e.target.value) {
                  onUpdateProgress(e.target.value);
                  // reset to placeholder to allow same selection again later if needed
                  e.target.value = '';
                }
              }}
            >
              <option value="">Ubah Status</option>
              <option value="Pemasukan Berkas">Pemasukan Berkas</option>
              <option value="BI Checking">BI Checking</option>
              <option value="Analisis">Analisis</option>
              <option value="Pengiriman Link Melalui Wa">Pengiriman Link Melalui Wa</option>
              <option value="Pencairan">Pencairan</option>
              <option value="Permintaan Revisi">Permintaan Revisi</option>
              <option value="Revisi Selesai">Revisi Selesai</option>
            </select>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDate(data.created_at)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="bg-blue-600 text-white text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
          {showActions && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
              <div className="space-y-4 p-4">
                <button
                  onClick={() => {
                    setShowActions(false);
                    onView(data);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Lihat Detail
                </button>
                <button
                  onClick={() => {
                    setShowActions(false);
                    onEdit(data);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    setShowActions(false);
                    onDelete(data);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                >
                  Hapus
                </button>
              </div>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}

export default function ListDataPage() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [dataToDelete, setDataToDelete] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        q: searchQuery,
        page: currentPage.toString(),
        pageSize: pageSize.toString(),
      });

      const response = await fetch(`${API_BASE_URL}/pengajuan?${params}`);
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}. Pastikan backend server berjalan di http://localhost:4000`);
      }

      const result = await response.json();
      setData(result.data || []);
      setTotalPages(Math.ceil(result.meta.total / pageSize));
      setTotalItems(result.meta.total);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message || 'Terjadi kesalahan saat memuat data. Pastikan backend server berjalan di http://localhost:4000');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, currentPage, pageSize]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleView = (item) => {
    navigate(`/detail/${item.id}`);
  };

  const handleEdit = (item) => {
    navigate(`/input-data?edit=${item.id}`);
  };

  const handleDelete = (item) => {
    setDataToDelete(item);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!dataToDelete) return;

    try {
      const response = await fetch(`${API_BASE_URL}/pengajuan/${dataToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete data');
      }

      // Refresh data
      await fetchData();
      setShowDeleteConfirm(false);
      setDataToDelete(null);
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.message);
    }
  };

  const updateProgress = async (id, progress, status) => {
    try {
      const response = await fetch(`${API_BASE_URL}/pengajuan/${id}/progress`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ progress, status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update progress');
      }

      // Refresh data
      await fetchData();
    } catch (err) {
      console.error('Update error:', err);
      setError(err.message);
    }
  };

  return (
    <div className="briguna-wrapper">
      <header className="briguna-header">
        <img src="/icon.png" alt="BRIguna" className="header-icon" />
        <h1 className="header-title">BRIguna</h1>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Data Pengajuan</h2>
            <p className="text-gray-300">Kelola data pengajuan dan revisi</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/input-data')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Tambah Data
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-6">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Cari berdasarkan nama, NIK, NPWP, atau pekerjaan..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="text-sm text-gray-300">
              Total: {totalItems} data
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Memuat data...</p>
            </div>
          ) : data.length === 0 ? (
            <div className="p-8 text-center text-gray-600">
              <p>Tidak ada data ditemukan</p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-2 text-blue-600 hover:text-blue-800"
                >
                  Hapus filter pencarian
                </button>
              )}
            </div>
          ) : (
            <>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Identitas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pekerjaan & NPWP
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nominal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status & Progress
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 table-responsive">
                  {data.map((item) => (
                    <DataRow
                      key={item.id}
                      data={item}
                      onView={handleView}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onUpdateProgress={(newProgress) => updateProgress(item.id, newProgress, item.status)}
                    />
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing{' '}
                        <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span>
                        {' '}to{' '}
                        <span className="font-medium">
                          {Math.min(currentPage * pageSize, totalItems)}
                        </span>
                        {' '}of{' '}
                        <span className="font-medium">{totalItems}</span>
                        {' '}results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          Previous
                        </button>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const page = i + 1;
                          return (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                currentPage === page
                                  ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        })}
                        <button
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          Next
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && dataToDelete && (
          <div className="modal-overlay" role="dialog" aria-modal="true">
            <div className="modal-card animate-pop">
              <div className="modal-header">
                <h2 className="text-xl font-bold text-red-600">Konfirmasi Hapus</h2>
                <button 
                  className="close-btn" 
                  onClick={() => setShowDeleteConfirm(false)} 
                  aria-label="Tutup"
                >
                  ✕
                </button>
              </div>
              <div className="modal-body">
                <p className="text-gray-700">
                  Apakah Anda yakin ingin menghapus data pengajuan untuk <strong>{dataToDelete.nama}</strong>?
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Tindakan ini tidak dapat dibatalkan dan akan menghapus semua data terkait termasuk foto.
                </p>
              </div>
              <div className="modal-actions">
                <button 
                  className="ghost" 
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Batal
                </button>
                <button 
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg" 
                  onClick={confirmDelete}
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
