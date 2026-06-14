<script setup>
import { ref, onMounted, watch } from 'vue';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement
} from 'chart.js';
import { Bar, Line, Doughnut} from 'vue-chartjs';
import api from '../api/axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
);

const selectedKategori = ref('');
const selectedTahun = ref(new Date().getFullYear().toString());
const categories = ref([]);
const currentYear = new Date().getFullYear();
const listTahun = ref([
  currentYear.toString(),
  (currentYear - 1).toString(),
  (currentYear - 2).toString()
]);
// Menambahkan nilai default properti baru untuk card statis
const summaryData = ref({
  total_pendapatan: 0,
  total_transaksi: 0,
  total_pelanggan: 0,
  total_produk: 0
});
const topCustomers = ref([]);

const chartDataProduk = ref({ labels: [], datasets: [] });
const chartDataTren = ref({ labels: [], datasets: [] });

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: '#cbd5e1',
        font: { size: 14 }
      }
    }
  },
  scales: {
    x: {
      ticks: { color: '#cbd5e1' },
      grid: { color: 'rgba(255,255,255,0.1)' }
    },
    y: {
      ticks: { color: '#cbd5e1' },
      grid: { color: 'rgba(255,255,255,0.1)' }
    }
  }
};

const DoughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '70%',
  plugins: {
    legend: {
      position: 'right',
      align: 'center',
      labels: {
        boxWidth: 12,
        padding: 15,
        font: {
          family: "'Outfit', sans-serif",
          size: 13
        },
        generateLabels: (chart) => {
          const data = chart.data;
          if (data.labels.length && data.datasets.length) {
            const dataset = data.datasets[0];
            const total = dataset.data.reduce((sum, value) => sum + value, 0);

            return data.labels.map((label, i) => {
              const value = dataset.data[i];
              const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;

              return {
                text: `${label} (${percentage}%)`,
                fillStyle: dataset.backgroundColor[i],
                strokeStyle: dataset.borderColor ? dataset.borderColor[i] : dataset.backgroundColor[i],
                lineWidth: dataset.borderWidth || 0,
                hidden: isNaN(dataset.data[i]) || chart.getDatasetMeta(0).data[i].hidden,
                index: i
              };
            });
          }
          return [];
        }
      }
    }
  }
};

const centerTextPlugin = {
  id: 'centerText',
  afterDraw: (chart) => {
    const { ctx, chartArea } = chart;
    if (!chartArea) return;

    ctx.save();

    const centerX = (chartArea.left + chartArea.right) / 2;
    const centerY = (chartArea.top + chartArea.bottom) / 2;

    const pendapatanRaw = summaryData.value.total_pendapatan || 0;

    const formatRingkas = (num) => {
      if (num >= 1e9) {
        return (num / 1e9).toFixed(1).replace('.0', '') + ' M'; 
      }
      if (num >= 1e6) {
        return (num / 1e6).toFixed(1).replace('.0', '') + ' Jt';
      }
      return num.toLocaleString('id-ID'); 
    };

    const totalTransaksi = formatRingkas(pendapatanRaw);

    ctx.font = "bold 30px 'Outfit', sans-serif";
    ctx.fillStyle = "#0f172a";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(totalTransaksi, centerX, centerY - 8);

    ctx.font = "600 11px 'Outfit', sans-serif";
    ctx.fillStyle = "#64748b";
    ctx.fillText("TOTAL", centerX, centerY + 16);

    ctx.restore();
  }
};

const fetchCategories = async () => {
  try {
    const response = await api.get('/analytics/categories');

    if (response.data && response.data.data) {
      categories.value = response.data.data;
    }
  } catch (error) {
    console.error('Error fetching categories', error);
    categories.value = [];
  }
};

const fetchData = async () => {
  try {
    const params = selectedKategori.value ? { kategori: selectedKategori.value } : {};

    const trenParams = { ...params, tahun: selectedTahun.value };

    const [resSummary, resProduk, resTren, resCustomers] = await Promise.all([
      api.get('/analytics/summary', { params }).catch(() => ({ data: { data: {} } })),
      api.get('/analytics/per-product', { params }),
      api.get('/analytics/trend-month', { params: trenParams }),
      api.get('/analytics/top-customers', { params })
    ]);

    if (resSummary.data && resSummary.data.data) {
      const data = resSummary.data.data;
      summaryData.value = {
        total_pendapatan: parseFloat(data.total_pendapatan), 
        total_transaksi: data.total_transaksi,
        total_produk_terjual: data.total_item_terjual,
        total_pelanggan: data.total_pelanggan_aktif,       
      };
    }

    if (resProduk.data && resProduk.data.data) {
      const data = resProduk.data.data;
      chartDataProduk.value = {
        labels: data.map(d => d.nama_produk),
        datasets: [{
          label: 'Total Pendapatan (Rp)',
          backgroundColor: ['#86b5b0', '#4d6d70', '#d2dada', '#0b2532', '#37575a'],
          data: data.map(d => parseFloat(d.total_pendapatan))
        }]
      };
    }

    if (resTren.data && resTren.data.data) {
      const data = resTren.data.data;
      chartDataTren.value = {
        labels: data.map(d => d.bulan_nama),
        datasets: [{
          label: 'Tren Pendapatan Bulanan',
          borderColor: '#86b5b0',
          backgroundColor: 'rgba(134, 181, 176, 0.25)',
          data: data.map(d => parseFloat(d.total_pendapatan)),
          fill: true,
          tension: 0.4
        }]
      };
    }

    if (resCustomers.data && resCustomers.data.data) {
      topCustomers.value = resCustomers.data.data;
    }
  } catch (error) {
    console.error("Error fetching analytics data", error);
  }
};

onMounted(async () => {
  await fetchCategories();
  await fetchData();
});

watch([selectedKategori, selectedTahun], () => {
  fetchData();
});

const formatCurrency = (val) => {
  if (!val) return 'Rp0';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
};
</script>

<template>
  <div class="view-container">
    <div class="filter-bar glass-card">
      <div style="display: flex; gap: 2rem; align-items: center;">

        <div class="filter-group" style="display: flex; align-items: center; gap: 0.75rem;">
          <label style="font-weight: 600; color: var(--text-primary);">Kategori:</label>
          <select v-model="selectedKategori" class="form-control filter-select" style="width: 180px;">
            <option value="">Semua Kategori</option>
            <option v-for="kategori in categories" :key="kategori" :value="kategori">{{ kategori }}</option>
          </select>
        </div>

      </div>
    </div>

    <div class="dashboard-stats">
      <div class="stat-card glass-card sales">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24">
            <line x1="12" y1="1" x2="12" y2="23"></line>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
        </div>
        <div class="stat-info">
          <h3>Total Penjualan</h3>
          <p class="stat-value">{{ formatCurrency(summaryData.total_pendapatan) }}</p>
        </div>
      </div>

      <div class="stat-card glass-card transactions">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
        </div>
        <div class="stat-info">
          <h3>Total Transaksi</h3>
          <p class="stat-value">{{ summaryData.total_transaksi || 0 }}</p>
        </div>
      </div>

      <div class="stat-card glass-card products">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24">
            <path
              d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z">
            </path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
          </svg>
        </div>
        <div class="stat-info">
          <h3>Total Produk Terjual</h3>
          <p class="stat-value">{{ summaryData.total_produk_terjual || 0 }}</p>
        </div>
      </div>

      <div class="stat-card glass-card customers">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </div>
        <div class="stat-info">
          <h3>Total Pelanggan</h3>
          <p class="stat-value">{{ summaryData.total_pelanggan || 0 }}</p>
        </div>
      </div>
    </div>

    <div class="dashboard-grid">
      <div class="glass-card chart-card">
        <h3>Total Penjualan per Produk</h3>
        <div class="chart-wrapper">
          <Doughnut v-if="chartDataProduk.labels.length" 
          :data="chartDataProduk" 
          :options="DoughnutOptions" 
          :plugins="[centerTextPlugin]" />
          <div v-else class="empty-state">Tidak ada data</div>
        </div>
      </div>

      <div class="glass-card chart-card">

        <div class="chart-header"
          style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
          <h3 style="margin-bottom: 0;">Tren Penjualan per Bulan</h3>

          <select v-model="selectedTahun" class="form-control filter-select"
            style="width: 130px; padding: 0.35rem 0.5rem; height: auto;">
            <option v-for="tahun in listTahun" :key="tahun" :value="tahun">Tahun {{ tahun }}</option>
          </select>
        </div>
        <div class="chart-wrapper">
          <Line v-if="chartDataTren.labels.length" :data="chartDataTren" :options="chartOptions" />
          <div v-else class="empty-state">Tidak ada data</div>
        </div>
      </div>

      <div class="glass-card table-card">
        <h3>Pelanggan dengan Belanja Tertinggi</h3>
        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Nama Pelanggan</th>
                <th>Jumlah Transaksi</th>
                <th>Total Belanja</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(customer, idx) in topCustomers" :key="idx">
                <td>{{ customer.nama_pelanggan }}</td>
                <td>{{ customer.jumlah_transaksi }}</td>
                <td class="amount">{{ formatCurrency(customer.total_belanja) }}</td>
              </tr>
              <tr v-if="!topCustomers.length">
                <td colspan="3" class="text-center">Tidak ada data</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* CSS BARU: Grid layout untuk baris card */
.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

/* CSS BARU: Modifikasi glass card khusus stat-card */
.stat-card.glass-card {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.5rem;
  border-left: none;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon svg {
  width: 24px;
  height: 24px;
  stroke: currentColor;
  stroke-width: 2;
  fill: none;
}

/* CSS BARU: Warna border samping dan icon mengikuti skema warna kamu */
.sales {
  border-left: 4px solid var(--primary-color);
}

.sales .stat-icon {
  background: rgba(2, 132, 199, 0.1);
  color: var(--primary-color);
}

.transactions {
  border-left: 4px solid #8b5cf6;
}

.transactions .stat-icon {
  background: rgba(139, 92, 246, 0.1);
  color: #8b5cf6;
}

.customers {
  border-left: 4px solid var(--success-color);
}

.customers .stat-icon {
  background: rgba(16, 185, 129, 0.1);
  color: var(--success-color);
}

.products {
  border-left: 4px solid #f59e0b;
}

.products .stat-icon {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.stat-info h3 {
  font-size: 0.85rem;
  color: var(--text-secondary);
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--text-primary);
}

/* CSS Lama kamu tetap dipertahankan di bawah */
.filter-bar {
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  margin-bottom: 1.5rem;
  /* Tambah jarak bawah sedikit */
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.filter-group label {
  color: var(--text-primary);
  font-weight: 500;
  margin-bottom: 0;
}

.filter-select {
  width: 200px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.table-card {
  grid-column: 1 / -1;
}

.chart-card {
  height: 400px;
  display: flex;
  flex-direction: column;
}

.chart-card h3,
.table-card h3 {
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
  color: var(--text-primary);
}

.chart-wrapper {
  flex: 1;
  position: relative;
}

.empty-state {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
}

.amount {
  font-weight: 600;
  color: var(--primary-color);
}

.text-center {
  text-align: center;
}
</style>