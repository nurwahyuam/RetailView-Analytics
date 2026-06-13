<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '../api/axios';
import Swal from 'sweetalert2';

const items = ref([]);
const products = ref([]);
const customers = ref([]);

const isEditing = ref(false);
const form = ref({
  id_penjualan: null,
  id_produk: '',
  id_pelanggan: '',
  tanggal: new Date().toLocaleDateString('en-CA'), // For creating dim_waktu automatically
  jumlah: 1,
  harga_satuan: 0
});

const fetchItems = async () => {
  try {
    const res = await api.get('/sales');
    items.value = res.data.data || [];
  } catch (error) {
    console.error('Error fetching sales', error);
  }
};

const fetchRelations = async () => {
  try {
    const [resProd, resCust] = await Promise.all([
      api.get('/products'),
      api.get('/customers')
    ]);
    products.value = resProd.data.data || [];
    customers.value = resCust.data.data || [];
  } catch (error) {
    console.error('Error fetching relations', error);
  }
};

onMounted(() => {
  fetchItems();
  fetchRelations();
});

// Update harga satuan automatically when product changes
const onProductChange = () => {
  const selectedProd = products.value.find(p => p.id_produk === form.value.id_produk);
  if (selectedProd) {
    form.value.harga_satuan = selectedProd.harga;
  }
};

const totalHarga = computed(() => {
  return form.value.jumlah * form.value.harga_satuan;
});

const resetForm = () => {
  isEditing.value = false;
  form.value = {
    id_penjualan: null,
    id_produk: '',
    id_pelanggan: '',
    tanggal: new Date().toLocaleDateString('en-CA'),
    jumlah: 1,
    harga_satuan: 0
  };
};

const editItem = (item) => {
  isEditing.value = true;
  form.value = {
    id_penjualan: item.id_penjualan,
    id_produk: item.id_produk,
    id_pelanggan: item.id_pelanggan,
    tanggal: item.tanggal
      ? new Date(item.tanggal).toLocaleDateString('en-CA', {
        timeZone: 'UTC'
      })
      : new Date().toLocaleDateString('en-CA'),
    jumlah: item.jumlah,
    harga_satuan: item.harga_satuan
  };
};

const deleteItem = async (id) => {
  const result = await Swal.fire({
    title: 'Hapus Transaksi?',
    text: 'Data yang dihapus tidak dapat dikembalikan.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya, hapus',
    cancelButtonText: 'Batal',
    reverseButtons: true
  });

  if (!result.isConfirmed) return;

  try {
    await api.delete(`/sales/${id}`);

    await Swal.fire({
      icon: 'success',
      title: 'Berhasil',
      text: 'Transaksi berhasil dihapus',
      timer: 2000,
      showConfirmButton: false
    });

    fetchItems();

  } catch (error) {
    console.error('Error deleting sale', error);

    Swal.fire({
      icon: 'error',
      title: 'Gagal',
      text:
        error.response?.data?.message ||
        'Gagal menghapus transaksi',
      confirmButtonText: 'OK'
    });
  }
};

const submitForm = async () => {
  try { 
    const payload = {
      id_produk: form.value.id_produk,
      id_pelanggan: form.value.id_pelanggan,
      tanggal: form.value.tanggal,
      jumlah: form.value.jumlah,
      harga_satuan: form.value.harga_satuan
    };
    
    if (isEditing.value) {
      await api.put(`/sales/${form.value.id_penjualan}`, payload);
    } else {
      await api.post('/sales', payload);
    }
    fetchItems();
    resetForm();
    Swal.fire({
      icon: 'success',
      title: 'Berhasil',
      text: isEditing.value
        ? 'Transaksi berhasil diperbarui'
        : 'Transaksi berhasil ditambahkan',
      timer: 2000,
      showConfirmButton: false
    });
  } catch (error) {
    console.error('Error submitting sale', error);

    const message =
      error.response?.data?.message ||
      error.response?.data?.errors?.join(', ') ||
      'Gagal menyimpan transaksi';

    Swal.fire({
      icon: 'error',
      title: 'Gagal',
      text: message,
      confirmButtonText: 'OK'
    });
  }
};

const formatCurrency = (val) => {
  if (!val) return 'Rp0';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
};

const getProductName = (id) => {
  const p = products.value.find(x => x.id_produk === id);
  return p ? p.nama_produk : id;
};

const getCustomerName = (id) => {
  const c = customers.value.find(x => x.id_pelanggan === id);
  return c ? c.nama_pelanggan : id;
};
</script>

<template>
  <div class="view-container">
    <div class="glass-card">
      <h3 style="margin-bottom: 1.5rem">{{ isEditing ? 'Edit Transaksi Penjualan' : 'Form Tambah Transaksi Penjualan' }}</h3>
      <form @submit.prevent="submitForm">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div class="form-group">
            <label>Pilih Produk</label>
            <select v-model="form.id_produk" class="form-control" required @change="onProductChange">
              <option value="" disabled>-- Pilih Produk --</option>
              <option v-for="p in products" :key="p.id_produk" :value="p.id_produk">
                {{ p.nama_produk }} ({{ formatCurrency(p.harga) }})
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Pilih Pelanggan</label>
            <select v-model="form.id_pelanggan" class="form-control" required>
              <option value="" disabled>-- Pilih Pelanggan --</option>
              <option v-for="c in customers" :key="c.id_pelanggan" :value="c.id_pelanggan">
                {{ c.nama_pelanggan }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Pilih Tanggal</label>
            <input type="date" v-model="form.tanggal" class="form-control" required />
          </div>
          <div class="form-group">
            <label>Jumlah</label>
            <input type="number" v-model="form.jumlah" class="form-control" required min="1" />
          </div>
          <div class="form-group">
            <label>Harga Satuan</label>
            <div style="display: flex; align-items: center; gap: 1rem;">
              <input type="number" v-model="form.harga_satuan" class="form-control" required readonly style="opacity: 0.7;" />
              <span style="color: var(--text-secondary); font-size: 0.8rem;">(otomatis terisi dari produk)</span>
            </div>
          </div>
          <div class="form-group">
            <label>Total Harga</label>
            <div style="display: flex; align-items: center; gap: 1rem;">
              <input type="text" :value="formatCurrency(totalHarga)" class="form-control" readonly style="opacity: 0.7; background: rgba(99, 102, 241, 0.1); color: var(--primary-color); font-weight: bold;" />
              <span style="color: var(--text-secondary); font-size: 0.8rem;">(otomatis: {{ form.jumlah }} x {{ formatCurrency(form.harga_satuan) }})</span>
            </div>
          </div>
        </div>
        <div style="margin-top: 1rem; display: flex; gap: 1rem;">
          <button type="submit" class="btn-primary">{{ isEditing ? 'Update Transaksi' : 'Simpan Transaksi' }}</button>
          <button type="button" class="btn-danger" v-if="isEditing" @click="resetForm">Batal</button>
        </div>
      </form>
    </div>

    <div class="glass-card">
      <h3 style="margin-bottom: 1.5rem">Data Transaksi Penjualan</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Produk</th>
            <th>Pelanggan</th>
            <th>Tanggal</th>
            <th>Jumlah</th>
            <th>Total</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id_penjualan">
            <td>{{ item.id_penjualan }}</td>
            <td>{{ getProductName(item.id_produk) }}</td>
            <td>{{ getCustomerName(item.id_pelanggan) }}</td>
            <td>
              {{
                item.tanggal
                  ? new Date(item.tanggal).toLocaleDateString('id-ID', {
                    timeZone: 'UTC'
              })
              : '-'
              }}
            </td>
            <td>{{ item.jumlah }}</td>
            <td class="amount">{{ formatCurrency(item.total_harga) }}</td>
            <td>
              <div class="action-buttons">
                <button class="btn-primary" style="padding: 0.25rem 0.75rem; font-size: 0.875rem;" @click="editItem(item)">Edit</button>
                <button class="btn-danger" style="padding: 0.25rem 0.75rem; font-size: 0.875rem;" @click="deleteItem(item.id_penjualan)">Hapus</button>
              </div>
            </td>
          </tr>
          <tr v-if="!items.length">
            <td colspan="7" style="text-align: center;">Tidak ada data</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.amount {
  font-weight: 600;
  color: var(--primary-color);
}
</style>
