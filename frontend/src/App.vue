<script setup>
import { ref } from 'vue';
import { RouterView, RouterLink, useRoute } from 'vue-router';
const route = useRoute();

const isSidebarCollapsed = ref(false);

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
};
</script>

<template>
  <div class="app-layout" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="logo" v-show="!isSidebarCollapsed">
          <h2>Retail<span>View</span></h2>
        </div>
        <div class="logo-collapsed" v-show="isSidebarCollapsed">
          <h2>R<span>V</span></h2>
        </div>
      </div>
      <nav class="nav-menu">
        <RouterLink to="/" class="nav-link" :class="{ active: route.path === '/' }" title="Dashboard">
          <svg viewBox="0 0 24 24"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
          <span class="nav-text">Dashboard</span>
        </RouterLink>
        <RouterLink to="/products" class="nav-link" :class="{ active: route.path === '/products' }" title="Produk">
          <svg viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
          <span class="nav-text">Produk</span>
        </RouterLink>
        <RouterLink to="/customers" class="nav-link" :class="{ active: route.path === '/customers' }" title="Pelanggan">
          <svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          <span class="nav-text">Pelanggan</span>
        </RouterLink>
        <RouterLink to="/sales" class="nav-link" :class="{ active: route.path === '/sales' }" title="Penjualan">
          <svg viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          <span class="nav-text">Penjualan</span>
        </RouterLink>
      </nav>
    </aside>

    <main class="main-content">
      <header class="top-header">
        <div class="header-left">
          <button class="toggle-btn" @click="toggleSidebar" title="Toggle Sidebar">
            <svg viewBox="0 0 24 24" v-if="!isSidebarCollapsed"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            <svg viewBox="0 0 24 24" v-else><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="15" y2="18"/></svg>
          </button>
          <h1 class="page-title">{{ route.name }}</h1>
        </div>
        <div class="user-profile">
          <div class="avatar">A</div>
          <span>Admin</span>
        </div>
      </header>
      <div class="content-wrapper">
        <RouterView />
      </div>
    </main>
  </div>
</template>
