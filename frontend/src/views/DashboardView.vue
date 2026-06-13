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
import { Bar, Line, Pie } from 'vue-chartjs';
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
const summaryData = ref({ total_pendapatan: 0, total_transaksi: 0 });
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

const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: { 
        color: '#cbd5e1',
        font: { size: 14 }
      },
      position: 'right'
    }
  }
};

const fetchData = async () => {
  try {
    const params = selectedKategori.value ? { kategori: selectedKategori.value } : {};
    
    // Summary isn't explicitly required to be filtered, but we can do it if API supports it
    // Wait, let's fetch summary, per-product, trend, and top customers
    
    const [resSummary, resProduk, resTren, resCustomers] = await Promise.all([
      api.get('/analytics/summary').catch(() => ({data: {data: {}}})),
      api.get('/analytics/per-product', { params }),
      api.get('/analytics/trend-month', { params: { ...params, tahun: new Date().getFullYear() } }),
      api.get('/analytics/top-customers', { params })
    ]);

    if (resSummary.data && resSummary.data.data) {
      summaryData.value = resSummary.data.data;
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

onMounted(() => {
  fetchData();
});

watch(selectedKategori, () => {
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
      <div class="filter-group">
        <label>Filter Kategori (OLAP Slice):</label>
        <select v-model="selectedKategori" class="form-control filter-select">
          <option value="">Semua Kategori</option>
          <option value="Elektronik">Elektronik</option>
          <option value="Aksesoris">Aksesoris</option>
          <option value="Pakaian">Pakaian</option>
        </select>
      </div>
    </div>

    <div class="dashboard-grid">
      <div class="glass-card chart-card">
        <h3>Total Penjualan per Produk</h3>
        <div class="chart-wrapper">
          <Pie v-if="chartDataProduk.labels.length" :data="chartDataProduk" :options="pieOptions" />
          <div v-else class="empty-state">Tidak ada data</div>
        </div>
      </div>

      <div class="glass-card chart-card">
        <h3>Tren Penjualan per Bulan</h3>
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
.filter-bar {
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
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

.chart-card h3, .table-card h3 {
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
