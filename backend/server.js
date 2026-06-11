require("dotenv").config();
const app = require("./src/app");
const { testConnection } = require("./src/config/db");

const PORT = process.env.PORT || 3000;

async function startServer() {
  await testConnection();
  app.listen(PORT, () => {
    console.log('');
    console.log('╔══════════════════════════════════════════╗');
    console.log('║   UAS Data Warehouse - Toko Retail API   ║');
    console.log('╠══════════════════════════════════════════╣');
    console.log(`║  Port  : ${PORT}                              ║`);
    console.log(`║  Base  : http://localhost:${PORT}/api/v1      ║`);
    console.log('╚══════════════════════════════════════════╝');
    console.log('');
  });
}


startServer().catch((err) => {
  console.error('❌  Gagal menjalankan server:', err.message);
  process.exit(1);
});
