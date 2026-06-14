<script setup>
import { ref, onMounted } from 'vue';
import api from '../api/axios';
import { useAlert } from '../components/utils/alert';

const items = ref([]);
const isEditing = ref(false);
const form = ref({
  id_pelanggan: null,
  kode_pelanggan: '',
  nama_pelanggan: '',
  jenis_kelamin: 'L',
  kota: ''
});

const fetchItems = async () => {
  try {
    const res = await api.get('/customers');
    items.value = res.data.data || [];
  } catch (error) {
    console.error('Error fetching customers', error);
  }
};

onMounted(() => {
  fetchItems();
});

const resetForm = () => {
  isEditing.value = false;
  form.value = {
    id_pelanggan: null,
    kode_pelanggan: '',
    nama_pelanggan: '',
    jenis_kelamin: 'L',
    kota: ''
  };
};

const editItem = (item) => {
  isEditing.value = true;
  form.value = { ...item };
};

const deleteItem = async (id) => {
  const yakin = await useAlert.confirm('Data pelanggan yang dihapus tidak dapat dikembalikan.', 'Hapus Pelanggan?');

  if (!yakin) return;

  try {
    await api.delete(`/customers/${id}`);
    useAlert.success('Pelanggan berhasil dihapus');
    fetchItems();
  } catch (error) {
    console.error('Error deleting customer', error);
    const pesanError = error.response?.data?.message || 'Gagal menghapus pelanggan';
    useAlert.error(pesanError);
  }
};

const submitForm = async () => {
  try {
    if (isEditing.value) {
      await api.put(`/customers/${form.value.id_pelanggan}`, form.value);
    } else {
      await api.post('/customers', form.value);
    }

    const pesanSukses = isEditing.value
      ? 'Data pelanggan berhasil diperbarui'
      : 'Pelanggan baru berhasil ditambahkan';

    await fetchItems();
    resetForm();

    useAlert.success(pesanSukses);
  } catch (error) {
    console.error('Error submitting customer', error);
    const pesanGagal =
      error.response?.data?.message ||
      error.response?.data?.errors?.join(', ') ||
      'Gagal menyimpan data pelanggan';
    useAlert.error(pesanGagal);
  }
};
</script>

<template>
  <div class="view-container">
    <div class="glass-card">
      <h3 style="margin-bottom: 1.5rem">{{ isEditing ? 'Edit Pelanggan' : 'Tambah Pelanggan Baru' }}</h3>
      <form @submit.prevent="submitForm">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div class="form-group">
            <label>Kode Pelanggan</label>
            <input type="text" v-model="form.kode_pelanggan" class="form-control" required />
          </div>
          <div class="form-group">
            <label>Nama Pelanggan</label>
            <input type="text" v-model="form.nama_pelanggan" class="form-control" required />
          </div>
          <div class="form-group">
            <label>Jenis Kelamin</label>
            <select v-model="form.jenis_kelamin" class="form-control" required>
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
          </div>
          <div class="form-group">
            <label>Kota Domisili</label>
            <input type="text" v-model="form.kota" class="form-control" required />
          </div>
        </div>
        <div style="margin-top: 1rem; display: flex; gap: 1rem;">
          <button type="submit" class="btn-primary">{{ isEditing ? 'Update' : 'Simpan' }}</button>
          <button type="button" class="btn-danger" v-if="isEditing" @click="resetForm">Batal</button>
        </div>
      </form>
    </div>

    <div class="glass-card">
      <h3 style="margin-bottom: 1.5rem">Data Pelanggan</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Kode</th>
            <th>Nama</th>
            <th>Gender</th>
            <th>Kota</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id_pelanggan">
            <td>{{ item.id_pelanggan }}</td>
            <td>{{ item.kode_pelanggan }}</td>
            <td>{{ item.nama_pelanggan }}</td>
            <td>{{ item.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan' }}</td>
            <td>{{ item.kota }}</td>
            <td>
              <div class="action-buttons">
                <button class="btn-primary" style="padding: 0.25rem 0.75rem; font-size: 0.875rem;" @click="editItem(item)">Edit</button>
                <button class="btn-danger" style="padding: 0.25rem 0.75rem; font-size: 0.875rem;" @click="deleteItem(item.id_pelanggan)">Hapus</button>
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
