### Persyaratan & Dokumentasi untuk Menjalankan Proyek React Vite (GudangKu)

#### 1. **Prasyarat**
Pastikan sudah terpasang hal-hal berikut di mesin:
- **Node.js** versi 16 atau lebih tinggi
- **npm** versi 8 atau lebih tinggi (atau **Yarn** versi 1 atau lebih tinggi)
- **Git** (untuk mengunduh atau mengelola repositori jika diperlukan)

#### 2. **Langkah-langkah Menjalankan Proyek**

1. **Install Dependensi**
   Jika belum memiliki proyek ini di mesin, pastikan terlebih dahulu untuk mendapatkan atau menyiapkan folder proyek. Setelah itu, jalankan perintah berikut untuk menginstal dependensi yang diperlukan:
   ```bash
   npm install
   ```
   atau jika menggunakan Yarn:
   ```bash
   yarn install
   ```

2. **Menjalankan Server Pengembangan**
   Untuk memulai server pengembangan dan mulai bekerja dengan aplikasi, jalankan perintah berikut:
   ```bash
   npm run dev
   ```
   Ini akan memulai server Vite dan membuka aplikasi di browser default. Aplikasi akan secara otomatis memuat ulang setiap kali ada perubahan.

3. **Membangun Proyek untuk Produksi**
   Ketika siap untuk membangun proyek untuk produksi, gunakan perintah berikut:
   ```bash
   npm run build
   ```
   Ini akan menghasilkan build yang siap produksi di direktori `dist/`.

4. **Pratinjau Build Produksi**
   Untuk mempratinjau build produksi secara lokal, gunakan perintah berikut:
   ```bash
   npm run preview
   ```

#### 3. **Scripts di `package.json`**
- `npm run build`: Untuk membangun aplikasi untuk produksi.
- `npm run dev`: Untuk menjalankan server pengembangan dan melihat aplikasi secara real-time.
- `npm run format`: Untuk memformat kode menggunakan Prettier.
- `npm run lint`: Untuk memeriksa masalah linting pada kode.
- `npm run preview`: Untuk melihat build produksi secara lokal.
- `npm run typecheck`: Untuk memeriksa tipe TypeScript dalam proyek.

#### 4. **Pengaturan Mesin (Engines)**
Proyek ini membutuhkan versi Node.js minimal 16, npm minimal 8, atau Yarn minimal 1. Pastikan menggunakan versi yang sesuai agar proyek dapat berjalan dengan baik.

#### 5. **Dependensi Utama**
Proyek ini menggunakan beberapa dependensi utama seperti:
- **React** dan **React DOM** untuk membangun antarmuka pengguna.
- **Vite** sebagai bundler dan pengembang server.
- **Flowbite** dan **Flowbite React** untuk komponen antarmuka pengguna.
- **ApexCharts** untuk visualisasi data berbasis grafik.
- **Axios** untuk menangani permintaan HTTP.

#### 6. **Pengaturan Linting dan Format Kode**
Proyek ini telah disetel untuk menggunakan linting dan format kode otomatis menggunakan:
- **ESLint** dengan berbagai plugin seperti `@typescript-eslint`, `jsx-a11y`, `react`, `react-hooks`, dan `tailwindcss`.
- **Prettier** untuk pemformatan kode otomatis sesuai dengan gaya yang telah ditentukan.

#### 7. **Catatan Lain**
Pastikan alat-alat ini (Node.js, npm, atau Yarn) selalu diperbarui agar proses pengembangan dan pembaruan proyek berjalan dengan lancar.