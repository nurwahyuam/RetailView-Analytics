<script setup>
import { ref, onMounted } from 'vue';
import api from '../api/axios';
import { useAlert } from '../components/utils/alert';

const items = ref([]);
const categories = ref([]);
const isEditing = ref(false);
const form = ref({
  id_produk: null,
  kode_produk: '',
  nama_produk: '',
  kategori: '',
  harga: 0
});

const fetchItems = async () => {
  try {
    const res = await api.get('/products');
    items.value = res.data.data || [];
  } catch (error) {
    console.error('Error fetching products', error);
  }
};

onMounted(() => {
  fetchItems();
});

const fetchCategories = async () => {
  try {
    const response = await api.get('/analytics/categories');

    categories.value = response.data.data;
  } catch (error) {
    console.error('Gagal mengambil kategori:', error);
  }
};

onMounted(() => {
  fetchCategories();
});

const resetForm = () => {
  isEditing.value = false;
  form.value = {
    id_produk: null,
    kode_produk: '',
    nama_produk: '',
    kategori: '',
    harga: 0
  };
};

const editItem = (item) => {
  isEditing.value = true;

  const kategori = categories.value.find(
    cat => cat.nama_kategori === item.kategori
  );

  form.value = {
    id_produk: item.id_produk,
    kode_produk: item.kode_produk,
    nama_produk: item.nama_produk,
    kategori: kategori?.nama_kategori || '',
    harga: item.harga
  };
};

const deleteItem = async (id) => {
  const yakin = await useAlert.confirm('Data produk yang dihapus tidak dapat dikembalikan.', 'Hapus Produk?');

  if (!yakin) return;

  try {
    await api.delete(`/products/${id}`);
    useAlert.success('Produk berhasil dihapus');
    fetchItems();
  } catch (error) {
    console.error('Error deleting product', error);
    const pesanError = error.response?.data?.message || 'Gagal menghapus produk';
    useAlert.error(pesanError);
  }
};

const submitForm = async () => {
  try {
    if (isEditing.value) {
      await api.put(`/products/${form.value.id_produk}`, form.value);
    } else {
      await api.post('/products', form.value);
    }

    const pesanSukses = isEditing.value
      ? 'Produk berhasil diperbarui'
      : 'Produk berhasil ditambahkan';

    await fetchItems();
    resetForm();

    useAlert.success(pesanSukses);
  } catch (error) {
    console.error('Error submitting product', error);
    const pesanGagal =
      error.response?.data?.message ||
      error.response?.data?.errors?.join(', ') ||
      'Gagal menyimpan data produk';
    useAlert.error(pesanGagal);
  }
};

const formatCurrency = (val) => {
  if (!val) return 'Rp0';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
};
</script>

<template>
  <div class="view-container">
    <div class="glass-card">
      <h3 style="margin-bottom: 1.5rem">{{ isEditing ? 'Edit Produk' : 'Tambah Produk Baru' }}</h3>
      <form @submit.prevent="submitForm">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div class="form-group">
            <label>Kode Produk</label>
            <input type="text" v-model="form.kode_produk" class="form-control" required />
          </div>
          <div class="form-group">
            <label>Nama Produk</label>
            <input type="text" v-model="form.nama_produk" class="form-control" required />
          </div>
          <div class="form-group">
            <label>Kategori</label>
            <select v-model="form.kategori" class="form-control" required>
              <option value="" disabled>Pilih Kategori</option>

              <option v-for="kategori in categories" :key="kategori" :value="kategori">
                {{ kategori }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Harga (Rp)</label>
            <input type="number" v-model="form.harga" class="form-control" required min="0" />
          </div>
        </div>
        <div style="margin-top: 1rem; display: flex; gap: 1rem;">
          <button type="submit" class="btn-primary">{{ isEditing ? 'Update' : 'Simpan' }}</button>
          <button type="button" class="btn-danger" v-if="isEditing" @click="resetForm">Batal</button>
        </div>
      </form>
    </div>

    <div class="glass-card">
      <h3 style="margin-bottom: 1.5rem">Data Produk</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Kode</th>
            <th>Nama</th>
            <th>Kategori</th>
            <th>Harga</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id_produk">
            <td>{{ item.id_produk }}</td>
            <td>{{ item.kode_produk }}</td>
            <td>{{ item.nama_produk }}</td>
            <td><span class="badge">{{ item.kategori }}</span></td>
            <td>{{ formatCurrency(item.harga) }}</td>
            <td>
              <div class="action-buttons">
                <button class="btn-primary" style="padding: 0.25rem 0.75rem; font-size: 0.875rem;" @click="editItem(item)">Edit</button>
                <button class="btn-danger" style="padding: 0.25rem 0.75rem; font-size: 0.875rem;" @click="deleteItem(item.id_produk)">Hapus</button>
              </div>
            </td>
          </tr>
          <tr v-if="!items.length">
            <td colspan="6" style="text-align: center;">Tidak ada data</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.badge {
  background: rgba(99, 102, 241, 0.2);
  color: #a5b4fc;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
}
</style>
