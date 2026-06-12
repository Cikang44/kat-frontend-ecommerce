# **Documentation Website GaneshaGoods**

[**1\. Pendahuluan 3**](#1.-pendahuluan)

[1.1. Purpose 3](#1.1.-purpose)

[1.2. Project Scope 3](#heading=h.fvyrdo16vlc8)

[**2\. Deskripsi Umum 3**](#heading=h.86za047ovy19)

[2.1. Overview Product 3](#2.1.-overview-product)

[2.2. Penjelasan Fitur 3](#heading=h.hiwso0sc4pk0)

[2.3. Pengguna 3](#heading=h.b7879belxrm8)

[2.4. Asumsi & Batasan 3](#heading=h.jclfw0sboam)

[**3\. Kebutuhan Sistem 3**](#3.-kebutuhan-sistem)

[3.1. Functional Requirement 3](#3.1.-functional-requirement)

[3.2. Non-Functional Requirement 3](#3.2.-non-functional-requirement)

[**4\. Model Sistem 3**](#4.-model-sistem)

[4.1. Use Case 3](#4.1.-use-case-diagram)

[4.2. Database Diagram 3](#heading=h.v4wxj4o6xgez)

[**5\. Kriteria Penerimaan 3**](#5.-kriteria-penerimaan)

[5.1. 3](<#5.1.-(soon)>)

[**6\. Arsitektur 3**](#6.-arsitektur)

[6.1. Tech Stack 3](#6.1.-tech-stack)

[6.2. Folder Architecture 3](#6.2.-folder-architecture)

[**7\. Implementasi 3**](#7.-implementasi)

[7.1. Front-End 3](#7.1.-front-end)

[7.2. Back-End 3](#7.2.-back-end)

[**8\. Hasil Implementasi 3**](#8.-hasil-implementasi)

[8.1. 3](#8.1.)

[**9\. Evaluasi 3**](#9.-evaluasi)

[9.1. 3](#9.1.)

# 1\. Pendahuluan {#1.-pendahuluan}

## 1.1. Purpose {#1.1.-purpose}

Dokumen ini merupakan Software Requirements Specification (SRS) untuk sistem **GaneshaGoods**, sebuah platform e-commerce berbasis web yang dirancang khusus untuk mendukung penjualan merchandise resmi event OSKM ITB 2026\. Dokumen ini disusun sebagai acuan formal bagi seluruh pemangku kepentingan — mulai dari tim pengembang (frontend dan backend), product manager, desainer UI/UX, hingga panitia OSKM — untuk memastikan keselarasan visi, ruang lingkup, dan spesifikasi teknis selama siklus pengembangan berlangsung.

Tujuan spesifik dokumen ini adalah:

1. Mendefinisikan secara lengkap dan tidak ambigu semua kebutuhan fungsional dan non-fungsional sistem.
2. Memberikan landasan formal untuk estimasi waktu pengerjaan, pembagian tugas, dan pengelolaan risiko.
3. Menjadi referensi utama dalam proses pengujian dan validasi (QA) sebelum sistem diluncurkan.
4. Menjadi kontrak teknis antara tim pengembang dan panitia OSKM selaku klien/pemangku kepentingan.

## 1.2. Project Scope

### 1.2.1. Di Dalam Ruang Lingkup

GaneshaGoods adalah platform web e-commerce yang mencakup:

1. **Sistem autentikasi dan manajemen pengguna** dengan tiga level peran (umum, panitia, admin), mekanisme OTP, onboarding, dan pembatasan laju (rate limiting) pada proses login dan signup.
2. **Katalog produk** yang dapat difilter dan dicari berdasarkan kategori, tipe, dan atribut produk. Produk ditampilkan berbeda berdasarkan peran pengguna (umum melihat merchandise & collaboration, panitia juga melihat kit panitia).
3. **Halaman detail produk** yang menampilkan galeri gambar, variasi (ukuran, warna, tipe lengan), dan penambahan ke keranjang.
4. **Keranjang belanja (cart)** yang mendukung pemilihan sebagian item untuk checkout (partial checkout), manajemen kuantitas, dan penghapusan item.
5. **Alur checkout** mencakup pengisian data pengiriman (pickup atau dikirim), pemilihan metode pembayaran, dan ringkasan transaksi.
6. **Halaman pembayaran** dengan tampilan QR QRIS, countdown batas waktu pembayaran 24 jam, dan konfirmasi status pembayaran.
7. **Profil pengguna** dengan manajemen informasi pribadi, penggantian password, dan riwayat transaksi.
8. **Riwayat transaksi pengguna** dengan QR code pengambilan barang yang memiliki batas waktu 1 hari.
9. **Dashboard admin** yang mencakup laporan item terjual, manajemen transaksi, dan proses hand over menggunakan scan QR code.
10. **Antarmuka responsif** yang dapat diakses baik dari perangkat mobile maupun desktop.

### 1.2.2. Di Luar Ruang Lingkup

- Integrasi dengan sistem manajemen inventori eksternal (WMS).
- Fitur ulasan atau rating produk oleh pengguna.
- Program loyalitas atau poin reward.
- Pengelolaan konten dinamis (CMS) untuk panitia atau admin non-teknis.
- Aplikasi mobile native (iOS/Android).
- Integrasi dengan sistem keuangan atau akuntansi eksternal.
- Fitur live chat atau customer support real-time.
- Pengiriman otomatis melalui integrasi kurir (Gojek, JNE, dll.).

- #

- # 2\. Deskripsi Umum

## 2.1. Overview Product {#2.1.-overview-product}

GaneshaGoods adalah platform web e-commerce yang dikembangkan untuk memfasilitasi penjualan merchandise resmi OSKM ITB 2026\. Platform ini menggantikan mekanisme pemesanan manual (formulir, transfer, konfirmasi via chat) dengan sistem digital yang terintegrasi, aman, dan efisien.

Platform ini dibangun di atas konsep **event-based commerce**, di mana siklus hidup produk, pengguna, dan transaksi terikat dengan konteks penyelenggaraan OSKM ITB 2026\. Sistem membedakan tiga jenis pengguna dengan hak akses berbeda: massa umum yang dapat membeli merchandise dan produk kolaborasi; panitia yang juga dapat membeli kit panitia; serta admin yang memiliki akses penuh termasuk dashboard pelaporan dan proses hand over.

Arsitektur sistem menggunakan pendekatan **full-stack terpisah** (decoupled), di mana backend menyajikan RESTful API yang terdokumentasi dengan OpenAPI, dan frontend Next.js mengonsumsi API tersebut. Pemisahan ini memungkinkan skalabilitas dan maintainabilitas jangka panjang.

## 2.2. Penjelasan Fitur

### 2.2.1. Autentikasi dan Manajemen Peran

Sistem menyediakan mekanisme registrasi dengan verifikasi email via OTP, proses onboarding untuk pengumpulan data kontak dan penentuan peran, serta login dengan rate limiting untuk mencegah brute force. Pengguna panitia harus memverifikasi NIM dan kode bidang yang valid.

### 2.2.2. Katalog Produk (Product List)

Halaman katalog menampilkan produk dalam bentuk card grid yang responsif. Setiap card menampilkan gambar, nama, dan harga satuan, serta shortcut kuantitas di pojok kanan atas. Navigasi menggunakan sistem tab (Merchandise, Collaboration, Kit Panitia) dan panel Search & Filter yang dapat diperluas secara horizontal. Filter mendukung multi-select berdasarkan tipe, kategori, dan fakultas.

### 2.2.3. Detail Produk

Halaman ini menyajikan informasi lengkap sebuah produk: galeri gambar multi-foto, deskripsi, kontrol kuantitas, pemilihan variasi (tipe lengan, warna, ukuran), dan dua opsi aksi (beli langsung atau tambah ke keranjang).

### 2.2.4. Keranjang Belanja

Cart mendukung manajemen item yang fleksibel: perubahan kuantitas per item, penghapusan item, checkbox seleksi partial untuk checkout, ringkasan total yang diperbarui secara real-time, dan pagination untuk daftar item yang panjang.

### 2.2.5. Checkout

Alur checkout terdiri dari: review item yang dipilih, pemilihan metode pengiriman (pickup point atau dikirim ke alamat), pengisian data penerima (dengan pre-fill dari data onboarding), pemilihan metode pembayaran, serta ringkasan transaksi akhir (total harga, potongan payment gateway, total tagihan).

### 2.2.6. Pembayaran

Halaman pembayaran menampilkan QR code QRIS (atau instruksi transfer bank), countdown 24 jam, dan konfirmasi otomatis setelah pembayaran berhasil dideteksi oleh payment gateway.

### 2.2.7. Profil Pengguna

Halaman profil menampilkan informasi sesuai peran (umum: nama, NIM opsional, kelompok opsional, email; panitia: nama, NIM, bidang, email; admin: nama, email). Tersedia tombol untuk ganti password (modal), lihat riwayat transaksi, dan logout.

### 2.2.8. Riwayat Transaksi

Daftar paginated semua transaksi pengguna, lengkap dengan detail item, total harga, status (belum bayar / lunas / diterima), dan tombol untuk menghasilkan QR code pengambilan barang (berlaku 1 hari).

### 2.2.9. Dashboard Admin — Item

Laporan paginated item terjual berdasarkan sub-kategori, dengan cell merging untuk grouping item, menampilkan jumlah terjual per varian, dan pendapatan (eksklusif biaya payment gateway). Dilengkapi search & filter.

### 2.2.10. Dashboard Admin — Transaksi

Daftar paginated seluruh transaksi di platform, dengan data lengkap pembeli, detail item, status, dan timestamp pelunasan hingga detik. Dilengkapi search & filter.

### 2.2.11. Hand Over (Admin)

Fitur scan QR code pengambilan barang yang dipegang pengguna. Setelah scan berhasil, sistem menampilkan detail lengkap transaksi dan mengizinkan admin menandai status sebagai "diterima".

## 2.3. Pengguna

### 2.3.1. Pengguna Umum (Massa Umum)

**Profil:** Peserta OSKM ITB 2026 atau masyarakat umum yang ingin membeli merchandise resmi event.

**Karakteristik:**

- Familiar dengan penggunaan e-commerce dasar.
- Mengakses platform via smartphone (mayoritas) atau laptop.
- Tidak memiliki akun sebelum event; melakukan signup sendiri.

**Hak Akses:**

- Melihat dan membeli produk Merchandise dan Collaboration.
- Mengelola cart dan melakukan checkout.
- Melihat riwayat transaksi dan mengambil barang via QR code.
- Mengelola profil pribadi.

### 2.3.2. Pengguna Panitia

**Profil:** Anggota panitia OSKM ITB 2026 yang terverifikasi melalui NIM dan kode bidang.

**Karakteristik:**

- Memiliki NIM ITB yang valid.
- Memiliki kode bidang panitia yang valid.
- Membutuhkan akses ke produk eksklusif panitia (kit panitia).

**Hak Akses:**

- Semua hak akses pengguna umum.
- Melihat dan membeli produk Kit Panitia.
- Tab "Kit Panitia" terlihat di halaman produk.

### 2.3.3. Admin

**Profil:** Pengelola teknis dan operasional platform dari tim panitia inti atau tim IT OSKM.

**Karakteristik:**

- Akun dibuat hanya melalui database seeding atau level DB.
- Tidak dapat mendaftar melalui antarmuka publik.
- Memiliki akses penuh ke semua fitur.

**Hak Akses:**

- Semua hak akses pengguna umum dan panitia.
- Akses Dashboard Item.
- Akses Dashboard Transaksi.
- Akses Hand Over (scan QR).
- Tab tambahan di navbar: Dashboard Item, Dashboard Transaksi, Hand Over.

##

## 2.4. Asumsi & Batasan

### 2.4.1. Asumsi

1. Seluruh pengguna memiliki akses ke alamat email aktif untuk menerima OTP.
2. Pengguna panitia mengetahui NIM dan kode bidang mereka sebelum signup.
3. Data kode bidang panitia yang valid telah di-seed ke database sebelum platform dibuka.
4. Payment gateway (QRIS/bank transfer) telah dikonfigurasi dan dapat mendeteksi pembayaran secara real-time atau near-real-time.
5. Informasi ongkos kirim dikomunikasikan secara manual melalui kontak yang diberikan pengguna, bukan dihitung otomatis oleh sistem.
6. QR code pengambilan barang hanya dapat di-scan oleh admin melalui halaman Hand Over.
7. Satu pengguna dapat memiliki lebih dari satu transaksi (multi-order).
8. Produk memiliki varian yang telah didefinisikan (ukuran, warna, tipe lengan) dan tidak berubah selama event berlangsung.
9. Admin tidak dapat didaftarkan melalui UI; hanya melalui seed database atau perubahan langsung di level DB.
10. Platform beroperasi dalam timezone WIB (UTC+7).

### 2.4.2. Batasan

1. **Bahasa:** Antarmuka menggunakan Bahasa Indonesia.
2. **Mata Uang:** Transaksi dalam Rupiah (IDR).
3. **Platform:** Web-only (tidak ada aplikasi mobile native).
4. **Pengiriman:** Ongkos kirim tidak dihitung otomatis; diinformasikan manual via kontak.
5. **Pembayaran:** Hanya mendukung metode pembayaran yang tersedia di payment gateway yang dipilih (QRIS, transfer bank, dll.).
6. **Kapasitas Produk:** Tidak ada manajemen stok real-time; ketersediaan produk diasumsikan dikelola secara manual oleh admin.
7. **QR Code Pengambilan:** Masa berlaku QR code adalah 1 × 24 jam sejak digenerate; setelah kadaluarsa pengguna perlu generate ulang.
8. **Batas Waktu Pembayaran:** Countdown pembayaran adalah 24 jam sejak order dibuat; setelah batas waktu terlampaui, order berstatus expired/gagal.
9. **Verifikasi Panitia:** Validasi NIM dan kode bidang dilakukan berdasarkan data yang ada di database; tidak terintegrasi dengan sistem akademik ITB secara real-time.
10. **Rate Limiting:** Login dibatasi N percobaan per periode waktu (konfigurasi di backend), signup dibatasi per IP/email.

# 3\. Kebutuhan Sistem {#3.-kebutuhan-sistem}

## 3.1. Functional Requirement {#3.1.-functional-requirement}

| Code                            | Fitur               | Functional Requirement                              | Deskripsi Lengkap                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | User                 |
| ------------------------------- | ------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------- |
| **AUTH**                        |                     |                                                     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |                      |
| FR-AUTH-01                      | Autentikasi         | Signup pengguna baru                                | Sistem menyediakan formulir registrasi yang meminta nama lengkap, alamat email, dan password. Password harus divalidasi kekuatannya (minimal 8 karakter, mengandung huruf besar, huruf kecil, dan angka). Email harus dalam format valid dan belum terdaftar di sistem. Setelah klik tombol "Daftar", sistem secara asinkron mengirimkan kode OTP 6 digit ke alamat email yang didaftarkan. Proses ini harus memberikan feedback visual (loading state) kepada pengguna.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Umum, Panitia        |
| FR-AUTH-02                      | Autentikasi         | Verifikasi OTP email                                | Setelah proses signup, sistem menampilkan section/halaman verifikasi OTP. Pengguna memasukkan kode 6 digit yang diterima via email. OTP memiliki batas waktu kedaluwarsa (misalnya 10 menit). Jika OTP benar dan belum kedaluwarsa, akun pengguna aktif dan pengguna diarahkan ke alur onboarding. Jika OTP salah, sistem menampilkan pesan error yang informatif. Jika OTP kedaluwarsa, sistem menyediakan opsi untuk request OTP baru (resend OTP) dengan rate limiting. Pengguna tidak dapat mengakses fitur platform sebelum OTP terverifikasi.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | Umum, Panitia        |
| FR-AUTH-03                      | Autentikasi         | Onboarding pengguna baru                            | Setelah verifikasi OTP berhasil, pengguna diwajibkan melewati alur onboarding sebelum dapat mengakses platform. Onboarding terdiri dari: (1) Pengisian ID LINE dan nomor telepon — keduanya wajib diisi dan disimpan sebagai data kontak utama pengguna yang akan digunakan sebagai pre-fill pada form checkout; (2) Pemilihan tipe pengguna: "Massa Umum" atau "Panitia". Jika memilih Massa Umum, pengguna langsung diarahkan ke halaman Product List. Jika memilih Panitia, pengguna wajib mengisi NIM dan kode bidang panitia yang valid. Validasi dilakukan terhadap database kode bidang; jika valid, peran pengguna diset sebagai 'panitia' dan pengguna diarahkan ke Product List; jika tidak valid, sistem menampilkan pesan error dan meminta pengguna memperbaiki input.                                                                                                                                                                                                                                                                                                                                                                                                                                                              | Umum, Panitia        |
| FR-AUTH-04                      | Autentikasi         | Login pengguna                                      | Sistem menyediakan formulir login dengan field email dan password. Setelah submit, backend memvalidasi kredensial. Jika valid, sistem membuat sesi autentikasi (JWT token atau session cookie) dan mengarahkan pengguna ke halaman Product List. Jika tidak valid, sistem menampilkan pesan error generik ("Email atau password salah") tanpa mengungkapkan detail mana yang salah, untuk mencegah user enumeration. Backend membedakan peran pengguna (umum, panitia, admin) berdasarkan data di database dan mengirimkan informasi peran dalam respons autentikasi.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Umum, Panitia, Admin |
| FR-AUTH-05                      | Autentikasi         | Rate limiting login & signup                        | Sistem membatasi jumlah percobaan login yang gagal dari IP atau akun yang sama. Setelah N kali gagal (misalnya 5 kali), sistem memblokir percobaan selanjutnya selama periode tertentu (misalnya 15 menit) dan menampilkan pesan yang sesuai. Untuk signup, sistem membatasi jumlah permintaan OTP dari IP yang sama dalam periode waktu tertentu untuk mencegah penyalahgunaan. Implementasi menggunakan mekanisme sliding window atau token bucket di sisi backend.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Umum, Panitia, Admin |
| FR-AUTH-06                      | Autentikasi         | Ganti password                                      | Dari halaman profil, pengguna dapat mengklik tombol "Ganti Password" yang memicu munculnya modal/popup. Modal memiliki tiga field: password lama (untuk verifikasi identitas), password baru, dan konfirmasi password baru. Sistem memvalidasi bahwa password lama benar, password baru memenuhi kriteria kekuatan, dan password baru sama dengan konfirmasi. Setelah berhasil, sistem memperbarui password dan dapat membatalkan semua sesi aktif lain sebagai langkah keamanan.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Umum, Panitia, Admin |
| FR-AUTH-07                      | Autentikasi         | Logout                                              | Pengguna dapat mengklik tombol logout dari halaman profil. Sistem menghapus sesi/token aktif di server dan mengarahkan pengguna ke halaman login. Semua data sesi di client-side juga dibersihkan.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | Umum, Panitia, Admin |
| **NAVBAR**                      |                     |                                                     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |                      |
| FR-NAV-01                       | Navigasi            | Navbar global                                       | Navbar ditampilkan pada semua halaman yang membutuhkan autentikasi. Navbar berisi: (1) Logo/nama GaneshaGoods yang dapat diklik untuk kembali ke Product List; (2) Tab navigasi "Product List"; (3) Ikon/tombol Cart yang menampilkan badge jumlah item di cart; (4) Tampilan informasi pengguna yang menampilkan nama pengguna dan status/peran (Umum, Panitia, atau Admin) — dapat diklik untuk menuju halaman profil. Navbar bersifat responsif dan kolaps menjadi hamburger menu di layar mobile.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Umum, Panitia, Admin |
| FR-NAV-02                       | Navigasi            | Navbar tambahan admin                               | Untuk pengguna dengan peran Admin, navbar memiliki item tambahan: (1) "Dashboard Item"; (2) "Dashboard Transaksi"; (3) "Hand Over". Item-item ini hanya terlihat dan dapat diakses oleh admin; pengguna lain tidak dapat mengakses URL halaman-halaman ini (dilindungi di backend maupun frontend).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | Admin                |
| FR-NAV-03                       | Navigasi            | Footer global                                       | Footer ditampilkan di semua halaman. Footer berisi: (1) Nama kegiatan "OSKM ITB 2026"; (2) Informasi kontak yang dapat dihubungi: ID LINE panitia dan username Instagram resmi event.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Umum, Panitia, Admin |
| **PRODUCT**                     |                     |                                                     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |                      |
| FR-PROD-01                      | Product List        | Tampilan daftar produk berdasarkan peran            | Halaman Product List menampilkan semua produk yang tersedia dalam bentuk grid card responsif. Produk yang ditampilkan disesuaikan berdasarkan peran pengguna: pengguna Umum hanya melihat produk bertipe "Merchandise" dan "Collaboration"; pengguna Panitia juga melihat produk bertipe "Kit Panitia". Setiap card produk menampilkan: (1) Gambar utama produk; (2) Nama produk; (3) Harga per satuan (format Rupiah). Di pojok kanan atas setiap card terdapat kontrol kuantitas berupa tombol "+" dan "-" beserta tampilan angka kuantitas saat ini. Interaksi dengan kontrol kuantitas ini secara langsung memperbarui data item terkait di cart pengguna (atau membuat entry baru di cart jika item belum ada). Data kuantitas di card selalu sinkron dengan data di cart.                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Umum, Panitia        |
| FR-PROD-02                      | Product List        | Sistem tab navigasi produk                          | Di bagian atas halaman Product List terdapat sistem tab yang memungkinkan pengguna menyaring produk berdasarkan tipe. Tab yang tersedia: (1) "Merchandise" — menampilkan hanya produk bertipe merchandise; (2) "Collaboration" — menampilkan hanya produk kolaborasi; (3) "Kit Panitia" — hanya terlihat dan dapat diklik oleh pengguna Panitia, menampilkan produk kit panitia; (4) "Search & Filter" — ketika diklik, tab-tab lain tersembunyi dan diganti oleh panel search & filter yang memanjang secara horizontal. Saat pengguna aktif di tab Search & Filter, terdapat tombol "\>" di paling kiri panel yang jika diklik akan menyembunyikan panel search & filter dan menampilkan kembali tab-tab navigasi standar. Satu tab aktif pada satu waktu; tab aktif diberikan visual indicator (underline, warna berbeda, dll.).                                                                                                                                                                                                                                                                                                                                                                                                              | Umum, Panitia        |
| FR-PROD-03                      | Product List        | Pencarian produk                                    | Dalam mode Search & Filter, terdapat field input search bar. Pencarian dilakukan dengan algoritma full-text matching yang mencocokkan query pengguna dengan semua field teks produk yang relevan (nama produk, deskripsi, kategori, dll.). Hasil pencarian diperbarui secara real-time atau setelah pengguna menekan Enter/tombol cari. Jika tidak ada hasil, ditampilkan pesan informatif "Produk tidak ditemukan". Pencarian tidak case-sensitive.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Umum, Panitia        |
| FR-PROD-04                      | Product List        | Filter multi-select produk                          | Dalam mode Search & Filter, tersedia opsi filter yang dapat digunakan bersamaan dengan pencarian. Filter yang tersedia: (1) Filter Tipe: pilihan antara "Merchandise", "Collaboration", dan "Kit Panitia" (Kit Panitia hanya muncul untuk pengguna Panitia); (2) Filter Kategori: pilihan antara "Perhiasan", "Baju", "Peralatan Tulis", "Aksesoris" (multi-select); (3) Filter Fakultas: daftar fakultas yang tersedia (multi-select). Semua filter bersifat multi-select sehingga pengguna dapat memilih lebih dari satu nilai per filter. Kombinasi filter diterapkan secara kumulatif (AND logic antar tipe filter, OR logic dalam satu tipe filter). Terdapat tombol "Reset" atau "Hapus Filter" untuk membersihkan semua filter aktif.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | Umum, Panitia        |
| FR-PROD-05                      | Detail Produk       | Halaman detail produk                               | Ketika pengguna mengklik sebuah card produk di halaman Product List, pengguna diarahkan ke halaman Detail Produk. Halaman ini menampilkan: (1) Galeri gambar produk yang mendukung beberapa foto (slider/carousel atau thumbnail grid), dengan kemampuan zoom atau full-screen view; (2) Nama produk; (3) Harga per satuan dalam format Rupiah; (4) Deskripsi produk lengkap; (5) Kontrol kuantitas dengan tombol "+" dan "-" serta input angka langsung, dengan validasi minimum 1 dan maksimum sesuai stok/batas yang ditentukan; (6) Pemilihan variasi tipe lengan (contoh: "Lengan Panjang", "Lengan Pendek", atau variasi lain sesuai produk — hanya muncul jika produk memiliki varian ini); (7) Pemilihan warna dari daftar warna yang tersedia untuk produk tersebut (visual swatch warna); (8) Pemilihan ukuran dari daftar ukuran yang tersedia (S, M, L, XL, XXL, atau sesuai produk); (9) Tombol aksi: "Beli Langsung" (langsung menuju checkout dengan item ini) dan "Tambah ke Keranjang" (menambahkan item dengan semua variasi yang dipilih ke cart). Semua variasi wajib dipilih sebelum dapat menambahkan ke cart atau melakukan beli langsung. Jika variasi belum dipilih, sistem menampilkan pesan validasi yang informatif. | Umum, Panitia        |
| **CART**                        |                     |                                                     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |                      |
| FR-CART-01                      | Cart                | Tampilan isi keranjang belanja                      | Halaman Cart dapat diakses dengan mengklik ikon Cart di navbar. Halaman ini menampilkan daftar semua item yang telah ditambahkan ke keranjang dalam bentuk list. Setiap item dalam list menampilkan: (1) Gambar produk (thumbnail); (2) Nama produk; (3) Detail varian yang dipilih (warna, ukuran, tipe lengan); (4) Harga satuan; (5) Kuantitas dengan kontrol "+" dan "-" untuk mengubah jumlah (perubahan langsung memperbarui total); (6) Total harga item tersebut (harga satuan × kuantitas); (7) Tombol/ikon "Hapus" untuk menghapus item dari cart. Daftar item menggunakan pagination untuk menangani cart dengan banyak item. Jika cart kosong, ditampilkan pesan "Keranjang belanja Anda kosong" beserta tombol untuk menuju Product List.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Umum, Panitia        |
| FR-CART-02                      | Cart                | Seleksi partial checkout                            | Setiap item dalam cart memiliki checkbox di sisi kiri. Pengguna dapat mencentang hanya item-item tertentu yang ingin di-checkout (partial checkout). Di bagian bawah halaman (sticky/fixed footer card) terdapat: (1) Checkbox "Pilih Semua" di paling kiri yang jika dicentang akan mencentang semua item, dan jika salah satu item di-uncheck maka checkbox ini otomatis menjadi unchecked/indeterminate; (2) Ringkasan "Total Produk: N item" yang menampilkan jumlah item yang saat ini tercentang; (3) Ringkasan "Total Harga: Rp X" yang menampilkan total harga dari item-item yang tercentang; (4) Tombol "Checkout" di paling kanan. Tombol Checkout hanya aktif jika minimal satu item tercentang. Card ini selalu terlihat (sticky) saat pengguna scroll list cart.                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Umum, Panitia        |
| FR-CART-03                      | Cart                | Sinkronisasi cart dengan product list               | Perubahan kuantitas yang dilakukan di halaman Product List (melalui shortcut kuantitas di card) langsung tersinkronisasi dengan data cart. Demikian pula, perubahan di halaman Cart tersinkronisasi dengan tampilan kuantitas di Product List jika pengguna kembali ke halaman tersebut. Badge jumlah item di ikon Cart di navbar selalu mencerminkan total item di cart secara real-time.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Umum, Panitia        |
| **CHECKOUT**                    |                     |                                                     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |                      |
| FR-CO-01                        | Checkout            | Halaman checkout — overview cart                    | Setelah pengguna mengklik tombol "Checkout" dari halaman Cart, pengguna diarahkan ke halaman Checkout. Halaman ini menampilkan overview item yang akan di-checkout dalam bentuk list read-only (hanya tampilan, tidak dapat diubah kuantitasnya di sini): gambar produk, nama produk, detail varian, kuantitas, dan total harga per item. Di akhir list ditampilkan: total jumlah produk dan total harga keseluruhan. Jika pengguna perlu mengubah order, terdapat tombol "Kembali ke Keranjang".                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Umum, Panitia        |
| FR-CO-02                        | Checkout            | Pemilihan metode pengiriman                         | Di halaman Checkout terdapat card/section "Pengiriman" dengan dua opsi yang dapat dipilih pengguna melalui radio button: (1) "Ambil di Pickup Point" — pengguna akan mengambil sendiri barang di lokasi pickup yang telah ditentukan (informasi lokasi ditampilkan); (2) "Dikirimkan" — barang akan dikirimkan ke alamat pengguna. Jika memilih "Dikirimkan", muncul form data penerima yang berisi: nama kontak, nomor telepon, ID LINE, dan alamat lengkap. Form ini secara otomatis ter-prefill dengan data yang pengguna masukkan saat onboarding. Pengguna dapat mengubah data prefill ini jika diperlukan (misalnya, mengirim ke alamat orang lain). Juga ditampilkan catatan bahwa biaya ongkos kirim akan diinformasikan melalui kontak yang diberikan.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Umum, Panitia        |
| FR-CO-03                        | Checkout            | Pemilihan metode pembayaran dan ringkasan transaksi | Di halaman Checkout terdapat section "Metode Pembayaran" yang menampilkan pilihan metode pembayaran yang tersedia (QRIS, Transfer Bank, dll.). Pengguna memilih satu metode. Setelah memilih, pada card yang sama muncul ringkasan transaksi: (1) Total harga produk; (2) Potongan/biaya dari payment gateway (jika ada); (3) Total tagihan akhir. Semua nilai ditampilkan dalam format mata uang Rupiah yang jelas. Tombol "Bayar" hanya aktif setelah semua data yang diperlukan (metode pengiriman, data penerima jika dikirim, metode pembayaran) telah diisi dengan valid.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Umum, Panitia        |
| **PAYMENT**                     |                     |                                                     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |                      |
| FR-PAY-01                       | Pembayaran          | Halaman pembayaran — informasi order                | Setelah pengguna mengklik "Bayar" di halaman Checkout dan semua data valid, pengguna diarahkan ke halaman Payment. Halaman ini menampilkan: (1) Ringkasan metode pengiriman yang dipilih; jika "Dikirimkan", ditampilkan detail alamat dan data penerima; (2) Overview cart yang sama seperti di halaman Checkout (read-only); (3) Total tagihan akhir.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Umum, Panitia        |
| FR-PAY-02                       | Pembayaran          | Halaman pembayaran — instruksi dan countdown        | Pada halaman Payment terdapat section "Pembayaran" yang menampilkan: (1) Metode pembayaran yang dipilih; (2) Jika QRIS: QR code QRIS yang dapat di-scan oleh aplikasi dompet digital pengguna; (3) Countdown timer yang menampilkan sisa waktu pembayaran (24 jam dari order dibuat), ditampilkan dalam format HH:MM:SS. Timer berjalan real-time. (4) Instruksi singkat cara melakukan pembayaran sesuai metode yang dipilih. Pengguna tidak dapat kembali ke halaman Checkout setelah berada di halaman ini untuk menghindari duplikasi order.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Umum, Panitia        |
| FR-PAY-03                       | Pembayaran          | Konfirmasi pembayaran berhasil                      | Sistem melakukan polling atau menerima webhook dari payment gateway untuk mendeteksi status pembayaran. Ketika pembayaran terdeteksi berhasil sebelum countdown habis, countdown timer berhenti, halaman menampilkan notifikasi sukses (misalnya ikon centang hijau dengan teks "Pembayaran Berhasil\!"), dan status transaksi di database diperbarui menjadi "lunas". Sistem dapat menampilkan estimasi waktu pengambilan atau informasi lanjutan. Pengguna diarahkan atau diberikan link ke halaman Riwayat Transaksi.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Umum, Panitia        |
| FR-PAY-04                       | Pembayaran          | Penanganan batas waktu pembayaran habis             | Jika countdown mencapai 00:00:00 sebelum pembayaran terdeteksi, sistem menampilkan notifikasi bahwa batas waktu pembayaran telah habis, order berstatus "expired/gagal", dan countdown berhenti. Pengguna diarahkan atau diberikan opsi untuk membuat order baru.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Umum, Panitia        |
| **PROFILE**                     |                     |                                                     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |                      |
| FR-PROF-01                      | Profil              | Halaman profil pengguna umum                        | Halaman profil dapat diakses dengan mengklik tampilan nama/info pengguna di navbar. Untuk pengguna Umum, halaman ini menampilkan: (1) Nama lengkap; (2) NIM (opsional, jika diisi saat onboarding atau dapat diisi di profil); (3) Kelompok (opsional); (4) Email. Informasi ini ditampilkan secara read-only. Tersedia tombol: "Ganti Password" (memicu modal), "Lihat Riwayat Transaksi" (menuju halaman History Transaction), dan "Logout".                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Umum                 |
| FR-PROF-02                      | Profil              | Halaman profil pengguna panitia                     | Untuk pengguna Panitia, halaman profil menampilkan: (1) Nama lengkap; (2) NIM (wajib, telah diverifikasi saat onboarding); (3) Bidang panitia (sesuai kode bidang yang diverifikasi); (4) Email. Tombol yang tersedia sama dengan profil pengguna umum: "Ganti Password", "Lihat Riwayat Transaksi", dan "Logout".                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | Panitia              |
| FR-PROF-03                      | Profil              | Halaman profil admin                                | Untuk pengguna Admin, halaman profil menampilkan: (1) Nama; (2) Email. Tombol yang tersedia: "Ganti Password" (memicu modal), "Lihat Riwayat Transaksi", dan "Logout". Profil admin lebih sederhana karena admin tidak memiliki data NIM atau bidang panitia.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Admin                |
| **HISTORY**                     |                     |                                                     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |                      |
| FR-HIST-01                      | Riwayat Transaksi   | Daftar riwayat transaksi                            | Halaman History Transaction menampilkan daftar paginated semua transaksi yang pernah dilakukan pengguna, baik yang sudah selesai maupun yang masih dalam proses. Setiap item transaksi dalam list menampilkan: (1) Detail lengkap item-item yang dibeli, termasuk variannya (contoh: "2x Kaos Lengan Panjang XL Merah", "1x Tas Kecil Merah"); (2) Total harga keseluruhan pesanan; (3) Status transaksi dengan visual indicator (badge warna): "Belum Bayar" (merah/oranye), "Lunas" (hijau), "Diterima" (biru/abu); (4) Tombol "Ambil Barang" yang aktif untuk transaksi berstatus "Lunas" (sudah dibayar tetapi belum diambil). Daftar diurutkan berdasarkan tanggal terbaru di atas.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Umum, Panitia, Admin |
| FR-HIST-02                      | Riwayat Transaksi   | QR code pengambilan barang                          | Ketika pengguna mengklik tombol "Ambil Barang" pada sebuah transaksi berstatus "Lunas", sistem men-generate QR code unik untuk transaksi tersebut dan menampilkannya pada modal atau halaman baru. QR code memiliki countdown kadaluarsa selama 1 × 24 jam. Countdown ditampilkan secara real-time di bawah QR code. Setelah QR code kadaluarsa, pengguna dapat men-generate ulang dengan mengklik tombol "Ambil Barang" lagi (QR code baru akan di-generate dengan countdown baru 24 jam). QR code ini kemudian dapat di-scan oleh admin melalui halaman Hand Over untuk menyelesaikan proses pengambilan.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Umum, Panitia        |
| **ADMIN — DASHBOARD ITEM**      |                     |                                                     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |                      |
| FR-ADMI-01                      | Dashboard Item      | Laporan item terjual per sub-kategori               | Halaman Dashboard Item (hanya untuk Admin) menampilkan laporan dalam format tabel paginated. Laporan ini menunjukkan data item yang telah berhasil terjual (status "lunas" atau "diterima"). Setiap baris dalam tabel menampilkan: (1) Gambar produk (thumbnail); (2) Nama produk; (3) Jumlah item terjual untuk varian tertentu; (4) Detail varian (contoh: "Baju Lengan Panjang XL Hijau"); (5) Jumlah pendapatan dari varian tersebut, eksklusif biaya payment gateway. Kolom gambar dan nama produk menggunakan cell merging: semua baris varian dari satu produk yang sama digabungkan secara visual dalam satu cell sehingga memberi tampilan grouping yang jelas dan memudahkan pembacaan data. Tabel mendukung sorting berdasarkan kolom tertentu (nama produk, jumlah terjual, pendapatan).                                                                                                                                                                                                                                                                                                                                                                                                                                             | Admin                |
| FR-ADMI-02                      | Dashboard Item      | Search & filter pada dashboard item                 | Pada halaman Dashboard Item terdapat fitur search & filter yang cara kerjanya serupa dengan di halaman Product List. Pencarian dapat dilakukan berdasarkan nama produk atau varian. Filter dapat dilakukan berdasarkan tipe produk, kategori, dan fakultas (sesuai filter di Product List). Filter bersifat multi-select. Hasil pada tabel diperbarui sesuai kriteria search & filter yang diterapkan.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Admin                |
| **ADMIN — DASHBOARD TRANSAKSI** |                     |                                                     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |                      |
| FR-ADMT-01                      | Dashboard Transaksi | Daftar transaksi seluruh pengguna                   | Halaman Dashboard Transaksi (hanya untuk Admin) menampilkan daftar paginated semua transaksi yang terjadi di platform dari semua pengguna. Setiap item transaksi menampilkan: (1) Nama pembeli; (2) Email pembeli; (3) Nomor telepon pembeli; (4) ID LINE pembeli; (5) Detail lengkap item yang dibeli beserta variannya (contoh: "2x Kaos Lengan Panjang XL Merah, 1x Tas Kecil Merah"); (6) Total harga pesanan; (7) Status transaksi ("Belum Bayar", "Lunas", "Diterima"); (8) Informasi waktu dan tanggal pelunasan (timestamp lengkap hingga detik, format: DD/MM/YYYY HH:MM:SS). Daftar dapat diurutkan dan di-paginate.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Admin                |
| FR-ADMT-02                      | Dashboard Transaksi | Search & filter pada dashboard transaksi            | Pada halaman Dashboard Transaksi terdapat section search & filter. Pencarian dapat dilakukan berdasarkan semua field data transaksi: nama pembeli, email, nomor telepon, ID LINE, nama item, status, dll. Filter dapat dilakukan berdasarkan status transaksi dan rentang tanggal (date range picker). Hasil pada list/tabel diperbarui sesuai kriteria yang diterapkan.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Admin                |
| **ADMIN — HAND OVER**           |                     |                                                     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |                      |
| FR-ADHO-01                      | Hand Over           | Scan QR code pengambilan                            | Halaman Hand Over (hanya untuk Admin) menyediakan antarmuka untuk melakukan scan QR code pengambilan barang yang dimiliki oleh pengguna. Admin dapat menggunakan kamera perangkat (via browser API) untuk melakukan scan. Setelah QR code berhasil ter-scan dan QR code masih valid (belum kadaluarsa), sistem menampilkan informasi lengkap transaksi terkait: (1) Nama pembeli; (2) Email pembeli; (3) Nomor telepon pembeli; (4) ID LINE pembeli; (5) Detail item yang dibeli beserta varian lengkap; (6) Total harga pesanan; (7) Status saat ini ("Lunas" saat baru di-scan); (8) Waktu dan tanggal pelunasan. Admin dapat mengkonfirmasi penyerahan barang, yang akan mengubah status transaksi dari "Lunas" menjadi "Diterima". Jika QR code kadaluarsa atau tidak valid, sistem menampilkan pesan error yang informatif.                                                                                                                                                                                                                                                                                                                                                                                                                 | Admin                |
| **PAGES**                       |                     |                                                     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |                      |
| FR-PAGE-01                      | Halaman Kondisional | Halaman 404 Not Found                               | Sistem menampilkan halaman 404 yang informatif dan sesuai dengan desain GaneshaGoods ketika pengguna mengakses URL yang tidak ada atau tidak valid. Halaman 404 memiliki pesan yang jelas dan tombol/link untuk kembali ke halaman utama (Product List).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Umum, Panitia, Admin |
| FR-PAGE-02                      | Halaman Kondisional | Proteksi rute                                       | Halaman-halaman yang memerlukan autentikasi (Cart, Checkout, Payment, Profile, History, dan semua halaman Admin) harus dilindungi. Jika pengguna yang belum login mencoba mengakses URL halaman tersebut, pengguna diarahkan ke halaman login. Jika pengguna yang sudah login mencoba mengakses halaman yang tidak sesuai perannya (misalnya pengguna Umum mengakses Dashboard Admin), pengguna diarahkan ke halaman 403 Forbidden atau Product List dengan pesan error.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Umum, Panitia, Admin |

## 3.2. Non-Functional Requirement {#3.2.-non-functional-requirement}

| Code          | Non-Functional Requirement | Deskripsi Lengkap                                                                                                                                                                                                                                                                                                                                                               |
| ------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| NFR-PERF-01   | Waktu Respons API          | Semua endpoint API backend harus merespons dalam waktu kurang dari 500ms untuk operasi baca (GET) dan kurang dari 1000ms untuk operasi tulis (POST/PUT/DELETE/PATCH) dalam kondisi beban normal (jumlah concurrent user sesuai estimasi event). Endpoint yang melibatkan payment gateway atau external service dikecualikan dari SLA ini.                                       |
| NFR-PERF-02   | Waktu Muat Halaman         | Halaman-halaman frontend harus mencapai First Contentful Paint (FCP) dalam waktu kurang dari 2 detik pada koneksi 4G standar. Largest Contentful Paint (LCP) harus di bawah 3 detik. Penggunaan Next.js Server-Side Rendering (SSR) dan Static Site Generation (SSG) dioptimalkan untuk mencapai target ini.                                                                    |
| NFR-PERF-03   | Concurrency                | Sistem harus mampu menangani minimal 200 concurrent user aktif tanpa degradasi performa yang signifikan (respons API tidak melebihi 2× target waktu normal).                                                                                                                                                                                                                    |
| NFR-SEC-01    | Keamanan Autentikasi       | Semua password disimpan menggunakan algoritma hashing yang aman (bcrypt atau Argon2 dengan salt yang memadai). Token autentikasi menggunakan JWT dengan expiry yang wajar (akses token: 15 menit, refresh token: 7 hari). HTTPS wajib digunakan di semua lingkungan produksi.                                                                                                   |
| NFR-SEC-02    | Proteksi API               | Semua endpoint API yang memerlukan autentikasi dilindungi dengan validasi token. Endpoint admin dilindungi dengan pengecekan peran tambahan. Implementasi CORS yang ketat untuk membatasi origin yang diizinkan. Input dari pengguna selalu divalidasi dan di-sanitize di sisi server untuk mencegah SQL Injection, XSS, dan serangan injeksi lainnya.                          |
| NFR-SEC-03    | Rate Limiting              | Rate limiting diterapkan pada endpoint-endpoint sensitif: login (5 percobaan per 15 menit per IP/akun), signup (3 request OTP per jam per IP), dan endpoint payment (1 request per order). Implementasi menggunakan Redis atau in-memory store di backend Hono.                                                                                                                 |
| NFR-SEC-04    | Keamanan Data Transaksi    | Data transaksi harus tidak dapat dimodifikasi secara retroaktif oleh pengguna biasa. Hanya admin yang dapat mengubah status transaksi. Semua perubahan status transaksi dicatat dengan timestamp dan actor.                                                                                                                                                                     |
| NFR-USAB-01   | Responsivitas              | Antarmuka harus sepenuhnya responsif dan dapat digunakan dengan nyaman pada: mobile (320px – 768px), tablet (768px – 1024px), dan desktop (1024px+). Layout, font size, dan komponen UI menyesuaikan diri secara otomatis.                                                                                                                                                      |
| NFR-USAB-02   | Aksesibilitas              | Antarmuka mengikuti panduan WCAG 2.1 Level AA minimal: kontras warna yang memadai (4.5:1 untuk teks normal), semua elemen interaktif dapat diakses via keyboard, label yang sesuai untuk form elements, dan alt text untuk semua gambar produk.                                                                                                                                 |
| NFR-USAB-03   | Umpan Balik Pengguna       | Setiap aksi pengguna yang memerlukan proses (submit form, loading data, dll.) harus memberikan feedback visual yang jelas: loading spinner, skeleton screen, atau progress indicator. Pesan error dan sukses harus informatif, spesifik, dan ditampilkan di lokasi yang relevan.                                                                                                |
| NFR-MAIN-01   | Clean Code & Standar Kode  | Semua kode mengikuti konvensi dan standar yang konsisten: penamaan variabel/fungsi yang deskriptif (camelCase untuk JS/TS, snake_case untuk Python/SQL), penggunaan TypeScript dengan strict mode untuk type safety, tidak ada `any` type yang tidak terdokumentasi, fungsi single-responsibility, dan tidak ada dead code. Setiap domain/modul memiliki README teknis singkat. |
| NFR-MAIN-02   | Dokumentasi API            | Semua endpoint API harus terdokumentasi menggunakan OpenAPI 3.x (via Hono's OpenAPI integration). Dokumentasi mencakup: deskripsi endpoint, parameter request, schema request body, schema response (semua kemungkinan kode status), dan contoh request/response. Dokumentasi dapat diakses via URL `/docs` atau `/api-docs` di lingkungan development.                         |
| NFR-MAIN-03   | Arsitektur Domain-Based    | Kode diorganisir berdasarkan domain bisnis (auth, product, cart, order/transaction, user, admin) bukan berdasarkan layer teknis. Setiap domain memiliki folder sendiri yang berisi controller/handler, service/use-case, repository/model, dan schema/DTO. Hal ini memudahkan navigasi kode dan pemisahan concern.                                                              |
| NFR-MAIN-04   | Error Handling             | Backend selalu mengembalikan respons error dalam format JSON yang konsisten dengan struktur: `{ success: false, error: { code: string, message: string } }`. Frontend menangani semua kemungkinan error state dan tidak pernah menampilkan stack trace atau pesan error teknis kepada pengguna akhir.                                                                           |
| NFR-SCAL-01   | Skalabilitas Database      | Skema database dirancang dengan indexing yang tepat pada kolom yang sering digunakan untuk query (foreign key, email, status transaksi, timestamp). Query yang kompleks dioptimalkan dengan Drizzle ORM query builder dan dapat di-monitor via query logging di development.                                                                                                    |
| NFR-AVAIL-01  | Ketersediaan               | Platform harus tersedia (uptime) minimal 99% selama periode aktif event OSKM ITB 2026\. Deployment menggunakan layanan cloud yang andal.                                                                                                                                                                                                                                        |
| NFR-COMPAT-01 | Kompatibilitas Browser     | Antarmuka mendukung versi terbaru (N dan N-1) dari browser utama: Chrome, Firefox, Safari, dan Edge. Fitur kamera (untuk QR scan oleh admin) memerlukan browser yang mendukung WebRTC/MediaDevices API.                                                                                                                                                                         |

# 4\. Model Sistem {#4.-model-sistem}

## 4.1. Use Case Diagram {#4.1.-use-case-diagram}

## 4.2. Spesifikasi Use Case

### 4.2.1. UC-01: Signup Pengguna Baru

- **Aktor:** Pengguna (belum terdaftar)
- **Precondition:** Pengguna belum memiliki akun dan mengakses halaman signup.
- **Alur Normal:** Pengguna mengisi nama, email, password → klik Daftar → sistem validasi input → sistem kirim OTP ke email → sistem tampilkan halaman verifikasi OTP.
- **Alur Alternatif:** Email sudah terdaftar → sistem tampilkan pesan error, pengguna diminta login.
- **Postcondition:** Email OTP terkirim; pengguna menunggu di halaman verifikasi OTP.

### 4.2.2. UC-02: Verifikasi OTP

- **Aktor:** Pengguna (sudah signup, belum verifikasi)
- **Precondition:** OTP telah dikirim ke email pengguna.
- **Alur Normal:** Pengguna memasukkan kode OTP → sistem validasi kode dan waktu → OTP valid → pengguna diarahkan ke onboarding.
- **Alur Alternatif:** OTP salah → sistem tampilkan error; OTP kedaluwarsa → pengguna diminta resend OTP.
- **Postcondition:** Akun pengguna aktif; pengguna memulai onboarding.

### 4.2.3. UC-03: Onboarding

- **Aktor:** Pengguna (OTP terverifikasi)
- **Precondition:** OTP sudah terverifikasi.
- **Alur Normal:** Pengguna isi ID LINE & no. telp → pilih tipe (Umum/Panitia) → jika Umum: langsung ke Product List → jika Panitia: isi NIM & kode bidang → validasi → sukses → Product List.
- **Alur Alternatif:** NIM atau kode bidang tidak valid → tampilkan error; pengguna coba lagi.
- **Postcondition:** Profil pengguna lengkap; peran ditetapkan; dapat mengakses platform.

### 4.2.4. UC-04: Login

- **Aktor:** Pengguna (terdaftar)
- **Precondition:** Pengguna memiliki akun aktif.
- **Alur Normal:** Pengguna isi email & password → klik Login → sistem validasi → sukses → diarahkan ke Product List dengan token autentikasi.
- **Alur Alternatif:** Kredensial salah → tampilkan error generik; rate limit tercapai → tampilkan pesan blokir sementara.
- **Postcondition:** Pengguna terautentikasi; dapat mengakses halaman sesuai peran.

### 4.2.5. UC-05: Lihat Product List

- **Aktor:** Pengguna Umum, Panitia, Admin
- **Precondition:** Pengguna sudah login.
- **Alur Normal:** Pengguna membuka Product List → sistem fetch produk sesuai peran → produk ditampilkan dalam card grid → pengguna dapat klik tab untuk filter tipe.
- **Alur Alternatif:** Tidak ada produk → tampilkan pesan kosong.
- **Postcondition:** Produk sesuai peran dan tab aktif ditampilkan.

### 4.2.6. UC-06: Search & Filter Produk

- **Aktor:** Pengguna Umum, Panitia, Admin
- **Precondition:** Pengguna di halaman Product List.
- **Alur Normal:** Pengguna klik tab "Search & Filter" → panel muncul → pengguna ketik keyword dan/atau pilih filter → sistem memperbarui daftar produk.
- **Alur Alternatif:** Tidak ada hasil → tampilkan "Produk tidak ditemukan".
- **Postcondition:** Produk yang ditampilkan sesuai kriteria pencarian & filter.

### 4.2.7. UC-07: Lihat Detail Produk

- **Aktor:** Pengguna Umum, Panitia, Admin
- **Precondition:** Pengguna di Product List.
- **Alur Normal:** Pengguna klik card produk → diarahkan ke halaman Detail Produk → informasi lengkap ditampilkan termasuk galeri, varian, dan harga.
- **Postcondition:** Detail produk ditampilkan.

### 4.2.8. UC-08: Tambah ke Keranjang / Beli Langsung

- **Aktor:** Pengguna Umum, Panitia, Admin
- **Precondition:** Pengguna di halaman Detail Produk; semua varian telah dipilih.
- **Alur Normal:** Pengguna pilih varian, atur kuantitas → klik "Tambah ke Keranjang" atau "Beli Langsung" → sistem simpan ke cart → badge cart diperbarui; jika "Beli Langsung" → langsung ke checkout.
- **Alur Alternatif:** Varian belum dipilih → tampilkan validasi error.
- **Postcondition:** Item ada di cart (atau pengguna di halaman checkout).

### 4.2.9. UC-09: Kelola Cart

- **Aktor:** Pengguna Umum, Panitia, Admin
- **Precondition:** Cart memiliki minimal 1 item.
- **Alur Normal:** Pengguna buka Cart → lihat daftar item → ubah kuantitas, hapus item, atau centang item untuk checkout.
- **Postcondition:** Cart diperbarui sesuai aksi pengguna.

### 4.2.10. UC-10: Checkout

- **Aktor:** Pengguna Umum, Panitia, Admin
- **Precondition:** Cart memiliki minimal 1 item yang dicentang.
- **Alur Normal:** Pengguna klik Checkout → review order → pilih metode pengiriman (dan isi data jika dikirim) → pilih metode pembayaran → klik Bayar.
- **Alur Alternatif:** Data penerima tidak lengkap → tampilkan validasi.
- **Postcondition:** Order dibuat di database; pengguna diarahkan ke halaman Payment.

### 4.2.11. UC-11: Pembayaran

- **Aktor:** Pengguna Umum, Panitia, Admin
- **Precondition:** Order telah dibuat (status: belum bayar).
- **Alur Normal:** Pengguna di halaman Payment → scan QRIS / transfer → sistem deteksi pembayaran (webhook/polling) → status berubah "lunas" → halaman tampilkan sukses.
- **Alur Alternatif:** Waktu habis → order expired; pengguna diminta buat order baru.
- **Postcondition:** Transaksi berstatus "lunas" atau "expired".

### 4.2.12. UC-12–15: Profil, Ganti Password, Riwayat, QR Ambil Barang

_(Mengikuti deskripsi di Functional Requirements FR-PROF dan FR-HIST)_

### 4.2.13. UC-16: Lihat & Beli Kit Panitia

- **Aktor:** Panitia, Admin
- **Precondition:** Pengguna login dengan peran Panitia atau Admin.
- **Alur Normal:** Pengguna klik tab "Kit Panitia" → produk kit panitia ditampilkan → alur belanja sama seperti produk umum.
- **Postcondition:** Produk kit panitia ditambahkan ke cart.

### 4.2.14. UC-17–18: Dashboard Item Admin

_(Mengikuti FR-ADMI-01 dan FR-ADMI-02)_

### 4.2.15. UC-19–20: Dashboard Transaksi Admin

_(Mengikuti FR-ADMT-01 dan FR-ADMT-02)_

### 4.2.16. UC-21: Scan QR & Hand Over

- **Aktor:** Admin
- **Precondition:** Admin di halaman Hand Over; pengguna memiliki QR code yang valid (belum kedaluwarsa).
- **Alur Normal:** Admin klik "Mulai Scan" → kamera aktif → arahkan ke QR code pengguna → sistem validasi QR → tampilkan detail transaksi → admin klik "Konfirmasi Serah Terima" → status berubah "Diterima".
- **Alur Alternatif:** QR kedaluwarsa → tampilkan error "QR code tidak valid atau sudah kadaluarsa".
- **Postcondition:** Transaksi berstatus "Diterima".

## 4.3. Database Diagram

# 5\. Kriteria Penerimaan {#5.-kriteria-penerimaan}

## 5.1. (Soon) {#5.1.-(soon)}

# 6\. Arsitektur {#6.-arsitektur}

## 6.1. Tech Stack {#6.1.-tech-stack}

| Layer                   | Teknologi                                 | Keterangan                                                                         |
| ----------------------- | ----------------------------------------- | ---------------------------------------------------------------------------------- |
| **Frontend Runtime**    | Bun                                       | Runtime JavaScript/TypeScript untuk menjalankan Next.js dev server dan build tools |
| **Frontend Framework**  | Next.js 14+ (App Router)                  | Framework React dengan dukungan SSR, SSG, ISR, dan API routes                      |
| **Frontend Language**   | TypeScript (strict mode)                  | Type safety di seluruh codebase frontend                                           |
| **Frontend Styling**    | Tailwind CSS                              | Utility-first CSS framework; responsif by default                                  |
| **Frontend State**      | Zustand atau React Query (TanStack Query) | State management global (cart) dan server state (data fetching, caching)           |
| **Frontend Forms**      | React Hook Form \+ Zod                    | Manajemen form dan validasi schema yang typesafe                                   |
| **QR Code (FE)**        | `qrcode.react` atau `html5-qrcode`        | Generate dan scan QR code di browser                                               |
| **Backend Runtime**     | Bun                                       | Runtime untuk Hono backend                                                         |
| **Backend Framework**   | Hono                                      | Ultra-lightweight web framework untuk Bun/Edge                                     |
| **Backend Language**    | TypeScript (strict mode)                  | Type safety di seluruh codebase backend                                            |
| **API Documentation**   | Hono OpenAPI (`@hono/zod-openapi`)        | Integrasi Zod schema dengan OpenAPI 3.x spec generation otomatis                   |
| **Database**            | PostgreSQL 15+                            | Relational database utama                                                          |
| **ORM**                 | Drizzle ORM                               | Type-safe ORM untuk PostgreSQL dengan migration support                            |
| **Auth**                | Custom JWT (via `hono/jwt`)               | JWT untuk access token; refresh token via HTTP-only cookie                         |
| **Email**               | Nodemailer / Resend / Sendgrid            | Pengiriman OTP via email                                                           |
| **Payment Gateway**     | QRIS Provider (Midtrans / Xendit / dll.)  | Sesuai pilihan panitia; sistem didesain agnostik terhadap provider                 |
| **Rate Limiting**       | In-memory (Hono middleware) atau Redis    | Rate limiting per IP/akun                                                          |
| **File Storage**        | Cloudinary / Supabase Storage / S3        | Penyimpanan gambar produk                                                          |
| **Deployment Frontend** | Vercel / Self-hosted                      | Mendukung Next.js App Router secara native                                         |
| **Deployment Backend**  | Railway / Fly.io / VPS                    | Deployment Hono \+ Bun                                                             |
| **Deployment DB**       | Railway PostgreSQL / Supabase / Neon      | Managed PostgreSQL                                                                 |

**Catatan Clean Code:**

- Gunakan TypeScript strict mode di semua file; hindari `any` type tanpa alasan dokumentasi.
- Semua environment variable harus didefinisikan di `.env.example` dan divalidasi saat startup (gunakan Zod untuk env validation).
- Pisahkan konfigurasi dari logika bisnis.

## 6.2. Folder Architecture {#6.2.-folder-architecture}

### 6.2.1. Back-End

| `backend/ ├── src/ │   ├── index.ts                    # Entry point: inisialisasi Hono app, mount routes │   ├── config/ │   │   ├── env.ts                  # Zod env validation & typed config export │   │   ├── database.ts             # Drizzle client setup & connection pool │   │   └── email.ts                # Email provider config │   │ │   ├── lib/ │   │   ├── jwt.ts                  # JWT sign, verify helpers │   │   ├── hash.ts                 # Password hashing (bcrypt/argon2) │   │   ├── email.ts                # Email sending helper │   │   ├── qr.ts                   # QR token generation helper │   │   └── errors.ts               # Custom error classes & HTTP error factory │   │ │   ├── middleware/ │   │   ├── auth.middleware.ts       # JWT verification, attach user to context │   │   ├── role.middleware.ts       # Role-based access control (umum/panitia/admin) │   │   ├── rate-limit.middleware.ts # Rate limiting middleware │   │   └── error.middleware.ts      # Global error handler │   │ │   ├── database/ │   │   ├── schema/ │   │   │   ├── users.schema.ts │   │   │   ├── products.schema.ts │   │   │   ├── product-variants.schema.ts │   │   │   ├── product-images.schema.ts │   │   │   ├── cart-items.schema.ts │   │   │   ├── orders.schema.ts │   │   │   ├── order-items.schema.ts │   │   │   ├── pickup-qr-codes.schema.ts │   │   │   ├── otp-verifications.schema.ts │   │   │   ├── panitia-divisions.schema.ts │   │   │   └── index.ts            # Re-export semua schema │   │   └── migrations/             # Drizzle-generated migration files │   │ │   ├── domains/ │   │   ├── auth/ │   │   │   ├── auth.routes.ts      # Hono OpenAPI route definitions │   │   │   ├── auth.handler.ts     # Request handlers │   │   │   ├── auth.service.ts     # Logika bisnis auth │   │   │   ├── auth.repository.ts  # Database queries │   │   │   └── auth.schema.ts      # Zod schemas (request/response DTOs) │   │   │ │   │   ├── user/ │   │   │   ├── user.routes.ts │   │   │   ├── user.handler.ts │   │   │   ├── user.service.ts │   │   │   ├── user.repository.ts │   │   │   └── user.schema.ts │   │   │ │   │   ├── product/ │   │   │   ├── product.routes.ts │   │   │   ├── product.handler.ts │   │   │   ├── product.service.ts │   │   │   ├── product.repository.ts │   │   │   └── product.schema.ts │   │   │ │   │   ├── cart/ │   │   │   ├── cart.routes.ts │   │   │   ├── cart.handler.ts │   │   │   ├── cart.service.ts │   │   │   ├── cart.repository.ts │   │   │   └── cart.schema.ts │   │   │ │   │   ├── order/ │   │   │   ├── order.routes.ts │   │   │   ├── order.handler.ts │   │   │   ├── order.service.ts │   │   │   ├── order.repository.ts │   │   │   └── order.schema.ts │   │   │ │   │   ├── payment/ │   │   │   ├── payment.routes.ts │   │   │   ├── payment.handler.ts │   │   │   ├── payment.service.ts │   │   │   ├── payment.repository.ts │   │   │   └── payment.schema.ts │   │   │ │   │   └── admin/ │   │       ├── admin.routes.ts │   │       ├── admin.handler.ts │   │       ├── admin.service.ts │   │       ├── admin.repository.ts │   │       └── admin.schema.ts │   │ │   └── openapi/ │       └── spec.ts                 # OpenAPI spec assembly & Swagger UI setup │ ├── drizzle.config.ts ├── package.json ├── tsconfig.json ├── .env ├── .env.example └── README.md` |
| :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

### 6.2.2. Front-End

| `frontend/ ├── src/ │   ├── app/                        # Next.js App Router │   │   ├── layout.tsx              # Root layout (Navbar, Footer, Providers) │   │   ├── page.tsx                # Redirect ke /products │   │   ├── (auth)/                 # Route group: halaman tanpa Navbar │   │   │   ├── login/ │   │   │   │   └── page.tsx │   │   │   ├── signup/ │   │   │   │   └── page.tsx │   │   │   ├── verify-otp/ │   │   │   │   └── page.tsx │   │   │   └── onboarding/ │   │   │       └── page.tsx │   │   │ │   │   ├── (main)/                 # Route group: halaman dengan Navbar │   │   │   ├── products/ │   │   │   │   ├── page.tsx        # Product List │   │   │   │   └── [id]/ │   │   │   │       └── page.tsx    # Detail Produk │   │   │   ├── cart/ │   │   │   │   └── page.tsx │   │   │   ├── checkout/ │   │   │   │   └── page.tsx │   │   │   ├── payment/ │   │   │   │   └── [orderId]/ │   │   │   │       └── page.tsx │   │   │   ├── profile/ │   │   │   │   └── page.tsx │   │   │   ├── history/ │   │   │   │   └── page.tsx │   │   │   └── admin/              # Admin-only routes │   │   │       ├── dashboard-item/ │   │   │       │   └── page.tsx │   │   │       ├── dashboard-transaction/ │   │   │       │   └── page.tsx │   │   │       └── hand-over/ │   │   │           └── page.tsx │   │   │ │   │   ├── not-found.tsx           # Halaman 404 │   │   └── error.tsx               # Error boundary global │   │ │   ├── components/ │   │   ├── ui/                     # Komponen UI primitif (Button, Input, Modal, Badge, dll.) │   │   │   ├── button.tsx │   │   │   ├── input.tsx │   │   │   ├── modal.tsx │   │   │   ├── badge.tsx │   │   │   ├── card.tsx │   │   │   ├── spinner.tsx │   │   │   ├── skeleton.tsx │   │   │   ├── pagination.tsx │   │   │   └── checkbox.tsx │   │   │ │   │   ├── layout/                 # Komponen layout │   │   │   ├── navbar.tsx │   │   │   ├── footer.tsx │   │   │   └── auth-guard.tsx      # HOC untuk proteksi rute │   │   │ │   │   ├── auth/                   # Komponen domain auth │   │   │   ├── signup-form.tsx │   │   │   ├── login-form.tsx │   │   │   ├── otp-input.tsx │   │   │   └── onboarding-form.tsx │   │   │ │   │   ├── product/                # Komponen domain produk │   │   │   ├── product-card.tsx │   │   │   ├── product-grid.tsx │   │   │   ├── product-tabs.tsx │   │   │   ├── search-filter-panel.tsx │   │   │   ├── product-image-gallery.tsx │   │   │   ├── variant-selector.tsx │   │   │   └── quantity-control.tsx │   │   │ │   │   ├── cart/ │   │   │   ├── cart-item-row.tsx │   │   │   ├── cart-summary-card.tsx │   │   │   └── cart-empty-state.tsx │   │   │ │   │   ├── checkout/ │   │   │   ├── order-overview.tsx │   │   │   ├── delivery-form.tsx │   │   │   └── payment-method-selector.tsx │   │   │ │   │   ├── payment/ │   │   │   ├── qris-display.tsx │   │   │   └── countdown-timer.tsx │   │   │ │   │   └── admin/ │   │       ├── dashboard-item-table.tsx │   │       ├── dashboard-transaction-table.tsx │   │       └── qr-scanner.tsx │   │ │   ├── domains/                    # Domain-based logic di FE │   │   ├── auth/ │   │   │   ├── auth.api.ts         # API calls untuk auth │   │   │   ├── auth.hooks.ts       # Custom hooks (useAuth, useLogin, etc.) │   │   │   └── auth.types.ts       # TypeScript types │   │   ├── product/ │   │   │   ├── product.api.ts │   │   │   ├── product.hooks.ts │   │   │   └── product.types.ts │   │   ├── cart/ │   │   │   ├── cart.api.ts │   │   │   ├── cart.hooks.ts │   │   │   ├── cart.store.ts       # Zustand store untuk cart state │   │   │   └── cart.types.ts │   │   ├── order/ │   │   │   ├── order.api.ts │   │   │   ├── order.hooks.ts │   │   │   └── order.types.ts │   │   └── admin/ │   │       ├── admin.api.ts │   │       ├── admin.hooks.ts │   │       └── admin.types.ts │   │ │   ├── lib/ │   │   ├── api-client.ts           # Axios/fetch wrapper dengan interceptor token │   │   ├── auth-token.ts           # Helper read/write token di cookie/localStorage │   │   └── utils.ts                # Format Rupiah, tanggal, dll. │   │ │   ├── hooks/ │   │   └── use-debounce.ts         # Generic debounce hook (untuk search) │   │ │   └── types/ │       └── global.d.ts             # Global TypeScript declarations │ ├── public/                         # Static assets │   └── images/ │ ├── next.config.js ├── tailwind.config.js ├── tsconfig.json ├── package.json ├── .env.local ├── .env.example └── README.md` |
| :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

# 7\. Implementasi {#7.-implementasi}

## 7.1. Front-End {#7.1.-front-end}

### 7.1.1 Halaman Login (`/login`)

**Informasi:**

- Field: Email (text input, type="email"), Password (text input, type="password", dengan toggle show/hide)
- Tombol: "Masuk" (submit), Link: "Belum punya akun? Daftar"
- Error state: Pesan error inline di bawah form (bukan alert popup)
- Loading state: Tombol "Masuk" berubah menjadi disabled \+ spinner saat proses
- Rate limit state: Pesan "Terlalu banyak percobaan, coba lagi dalam X menit"

**Interaksi:**

- Submit → POST `/api/auth/login` → jika sukses, simpan token, redirect ke `/products`
- Jika gagal 5×, tampilkan countdown blokir
- Link "Daftar" → navigate ke `/signup`
- Form validasi client-side: email format, password non-empty

---

### 7.1.2 Halaman Signup (`/signup`)

**Informasi:**

- Field: Nama Lengkap, Email, Password, Konfirmasi Password
- Indikator kekuatan password
- Tombol: "Daftar", Link: "Sudah punya akun? Masuk"
- Error state per field (inline)

**Interaksi:**

- Submit → POST `/api/auth/signup` → jika sukses, navigate ke `/verify-otp?email=...`
- Validasi client: semua field wajib, email format, password match, password strength
- Email sudah terdaftar → error inline "Email sudah digunakan"

---

### 7.1.3 Halaman Verifikasi OTP (`/verify-otp`)

**Informasi:**

- Heading: "Verifikasi Email"
- Subheading: "Kode OTP telah dikirim ke {email}"
- Input OTP: 6 kotak input digit terpisah (auto-focus ke kotak berikutnya)
- Countdown timer resend OTP (misal 60 detik)
- Tombol: "Verifikasi", "Kirim Ulang Kode" (aktif setelah countdown habis)

**Interaksi:**

- Input digit → auto-focus ke kotak berikutnya
- Paste → isi semua kotak sekaligus
- Submit → POST `/api/auth/verify-otp` → sukses → navigate ke `/onboarding`
- OTP salah → shake animation \+ error message
- "Kirim Ulang" → POST `/api/auth/resend-otp` → reset countdown

---

### 7.1.4 Halaman Onboarding (`/onboarding`)

**Informasi:**

- Step 1: Kontak
  - Field: ID LINE (text), Nomor Telepon (tel)
- Step 2: Tipe Pengguna
  - Radio: "Massa Umum" / "Panitia"
  - Jika "Panitia": muncul field NIM (text) dan Kode Bidang (text)
- Progress indicator (Step 1/2 atau Step 1/3 untuk panitia)

**Interaksi:**

- "Lanjut" di Step 1 → validasi → lanjut ke Step 2
- Pilih "Massa Umum" → POST `/api/auth/onboarding` (role: umum) → navigate ke `/products`
- Pilih "Panitia" → muncul field NIM & kode bidang → POST `/api/auth/onboarding` (role: panitia, nim, divisionCode) → jika valid → navigate ke `/products`; jika tidak valid → error "NIM atau kode bidang tidak valid"
- Tombol "Kembali" di Step 2 → kembali ke Step 1 (data tidak hilang)

---

### 7.1.5 Halaman Product List (`/products`)

**Informasi:**

- Navbar (global)
- Tab bar: \[Merchandise\] \[Collaboration\] \[Kit Panitia\*\] \[🔍 Search & Filter\]
  - \*hanya tampil untuk role panitia & admin
- Grid card produk (2 kolom mobile, 3–4 kolom desktop)
- Setiap card: gambar, nama, harga/satuan, kontrol kuantitas (pojok kanan atas)
- Skeleton loading saat fetch
- Empty state jika tidak ada produk

**Panel Search & Filter (muncul saat tab "Search & Filter" aktif):**

- Tombol "\<" di paling kiri untuk menutup panel & kembali ke tab view
- Search bar (debounced 300ms)
- Filter Tipe: checkbox multi-select (Merchandise, Collaboration, Kit Panitia\*)
- Filter Kategori: checkbox multi-select (Perhiasan, Baju, Peralatan Tulis, Aksesoris)
- Filter Fakultas: checkbox multi-select (daftar fakultas)
- Tombol "Reset Filter"
- Hasil diupdate real-time

**Interaksi:**

- Klik tab → filter produk sesuai tab
- Klik card → navigate ke `/products/{id}`
- Kontrol "+" di card → tambah quantity di cart (debounce optimistic update)
- Kontrol "-" di card → kurangi quantity (minimum 0 \= hapus dari cart)
- Kuantitas di card selalu sinkron dengan cart store (Zustand)

---

### 7.1.6 Halaman Detail Produk (`/products/[id]`)

**Informasi:**

- Gambar: carousel/slider dengan thumbnail di bawah; klik thumbnail untuk ganti gambar utama; tombol full-screen
- Nama produk (heading)
- Harga/satuan (bold, format Rupiah)
- Deskripsi (bisa multi-paragraf, collapsible jika panjang)
- Variasi (hanya muncul jika produk memiliki varian tersebut):
  - Tipe Lengan: button group (Lengan Panjang / Lengan Pendek / lainnya)
  - Warna: swatch color selector (lingkaran warna, border jika selected)
  - Ukuran: button group (S / M / L / XL / XXL / custom)
- Kontrol kuantitas: tombol "-", input angka, tombol "+"
- Tombol aksi: "Beli Langsung" (primary) dan "Tambah ke Keranjang" (secondary)
- Breadcrumb: Product List \> {Nama Produk}

**Interaksi:**

- Pilih tipe lengan → highlight button yang dipilih
- Pilih warna → border/ring pada swatch terpilih
- Pilih ukuran → highlight button
- Klik "Tambah ke Keranjang" tanpa pilih semua varian yang tersedia → validasi toast/tooltip "Silakan pilih {variasi yang belum dipilih}"
- Klik "Tambah ke Keranjang" → POST `/api/cart` → sukses → badge cart diperbarui → toast "Produk ditambahkan ke keranjang"
- Klik "Beli Langsung" → POST `/api/cart` \+ navigate ke `/checkout` dengan item tersebut
- Tombol back / breadcrumb → kembali ke Product List

---

### 7.1.7 Halaman Cart (`/cart`)

**Informasi:**

- List item cart (paginated, 10 item per halaman):
  - Checkbox (kiri)
  - Gambar thumbnail
  - Nama produk
  - Detail varian (tipe lengan, warna, ukuran)
  - Harga satuan
  - Kontrol kuantitas (- | angka | \+)
  - Total harga item
  - Tombol hapus (ikon trash)
- Komponen pagination
- Sticky bottom card:
  - Checkbox "Pilih Semua" (kiri)
  - Total Produk: N item (tengah kiri)
  - Total Harga: Rp X (tengah)
  - Tombol "Checkout" (kanan, disabled jika 0 item tercentang)
- Empty state jika cart kosong

**Interaksi:**

- Checkbox item → update total di sticky card
- Checkbox "Pilih Semua" → toggle semua item; jika semua item sudah tercentang → uncheck semua
- Tombol "+" / "-" pada kuantitas → PATCH `/api/cart/{itemId}` → optimistic update
- Tombol hapus → DELETE `/api/cart/{itemId}` → item hilang dari list; toast konfirmasi
- Tombol "Checkout" → POST `/api/order/initiate` dengan item-item yang tercentang → navigate ke `/checkout`

---

### 7.1.8 Halaman Checkout (`/checkout`)

**Informasi:**

- Section "Ringkasan Pesanan" (read-only list):
  - Per item: gambar, nama, varian, kuantitas, total harga
  - Total produk dan total harga di akhir
  - Tombol "Ubah Pesanan" → kembali ke cart
- Section "Pengiriman":
  - Radio: "Ambil di Pickup Point" / "Dikirimkan"
  - Jika "Dikirimkan": form (nama kontak, no. telp, ID LINE, alamat) — prefill dari data user
  - Catatan ongkir jika memilih "Dikirimkan"
- Section "Metode Pembayaran":
  - Radio/card selector: QRIS, Transfer Bank, dll.
  - Setelah pilih: muncul ringkasan transaksi (total produk, potongan gateway, total tagihan)
- Tombol "Bayar" (disabled sampai semua field valid)

**Interaksi:**

- Pilih "Dikirimkan" → form penerima muncul dengan animasi
- Ubah data penerima → validasi real-time
- Pilih metode pembayaran → ringkasan transaksi diperbarui (GET `/api/payment/fee?method=qris`)
- Klik "Bayar" → POST `/api/order/confirm` → navigate ke `/payment/{orderId}`

---

### 7.1.9 Halaman Payment (`/payment/[orderId]`)

**Informasi:**

- Section "Detail Pengiriman": metode, jika dikirim tampilkan alamat & kontak penerima
- Section "Ringkasan Pesanan": list item (sama seperti checkout, read-only)
- Section "Pembayaran":
  - Metode pembayaran yang dipilih
  - Jika QRIS: QR code image (generate dari backend)
  - Jika Transfer Bank: nomor rekening, nama bank, atas nama
  - Countdown timer (HH:MM:SS, real-time, berdasarkan `payment_expired_at` dari server)
  - Instruksi singkat
- Setelah pembayaran terkonfirmasi:
  - Countdown berhenti
  - Overlay/section sukses: ikon centang, "Pembayaran Berhasil\!", tombol "Lihat Riwayat"

**Interaksi:**

- Polling setiap 5 detik ke GET `/api/payment/{orderId}/status` untuk cek status
- Jika status berubah "lunas" → tampilkan sukses state
- Jika countdown habis → polling berhenti, tampilkan "Pembayaran Kadaluarsa"
- Tombol "Lihat Riwayat" → navigate ke `/history`

---

### 7.1.10 Halaman Profil (`/profile`)

**Informasi — Pengguna Umum:**

- Avatar/inisial nama
- Nama lengkap
- NIM (jika diisi, optional)
- Kelompok (jika diisi, optional)
- Email (read-only, tidak bisa diubah)
- Tombol: "Ganti Password", "Lihat Riwayat Transaksi", "Logout"

**Informasi — Pengguna Panitia:**

- Nama lengkap, NIM, Bidang Panitia, Email
- Tombol yang sama

**Informasi — Admin:**

- Nama, Email
- Tombol: "Ganti Password", "Lihat Riwayat Transaksi", "Logout"

**Modal Ganti Password:**

- Field: Password Lama, Password Baru, Konfirmasi Password Baru
- Tombol: "Simpan", "Batal"
- Validasi: password lama benar, password baru strength check, konfirmasi match
- Sukses → toast "Password berhasil diubah", modal tertutup

**Interaksi:**

- "Ganti Password" → buka modal
- Modal "Simpan" → PUT `/api/user/password` → sukses → tutup modal \+ toast
- "Lihat Riwayat Transaksi" → navigate ke `/history`
- "Logout" → DELETE `/api/auth/logout` → clear token → navigate ke `/login`

---

### 7.1.11 Halaman Riwayat Transaksi (`/history`)

**Informasi:**

- List transaksi paginated (terbaru di atas)
- Per item transaksi:
  - ID transaksi / nomor order (singkat)
  - Detail item: nama \+ varian \+ kuantitas (misal "2x Kaos Lengan Panjang XL Merah")
  - Total harga (format Rupiah)
  - Badge status: "Belum Bayar" (merah), "Lunas" (hijau), "Diterima" (biru)
  - Tombol "Ambil Barang" (aktif hanya jika status \= "Lunas")
  - Tanggal transaksi
- Pagination

**Modal QR Ambil Barang:**

- QR Code image (generate dari server, berisi token unik)
- Countdown kadaluarsa: "Berlaku hingga: HH:MM:SS"
- Informasi: "Tunjukkan QR ini kepada panitia untuk pengambilan barang"
- Tombol "Tutup"

**Interaksi:**

- Klik "Ambil Barang" → POST `/api/order/{orderId}/generate-qr` → response: QR token → tampilkan modal \+ generate QR code dari token
- Countdown berjalan real-time berdasarkan `expires_at` dari server
- Setelah kadaluarsa → QR code ditampilkan dengan overlay "Kadaluarsa" \+ tombol "Perbarui QR" → generate ulang
- Pagination → GET `/api/order/history?page=N`

---

### 7.1.12 Halaman Dashboard Item Admin (`/admin/dashboard-item`)

**Informasi:**

- Tabel paginated dengan kolom:
  - Gambar \+ Nama Produk (merged cell untuk semua varian satu produk)
  - Jumlah Item Terjual (per varian)
  - Detail Varian (contoh: "Lengan Panjang XL Hijau")
  - Pendapatan (format Rupiah, eksklusif biaya gateway)
- Section search & filter (di atas tabel, collapsible):
  - Search bar
  - Filter tipe, kategori, fakultas (multi-select)

**Interaksi:**

- Search/filter → GET `/api/admin/dashboard/items?search=...&type=...&page=N` → update tabel
- Klik header kolom → sort ascending/descending
- Pagination
- Export data (opsional: button "Export CSV")

---

### 7.1.13 Halaman Dashboard Transaksi Admin (`/admin/dashboard-transaction`)

**Informasi:**

- List/tabel transaksi paginated dengan data:
  - Nama pembeli
  - Email pembeli
  - Nomor telepon
  - ID LINE
  - Detail item (multiline jika banyak item)
  - Total harga
  - Badge status
  - Timestamp pelunasan (DD/MM/YYYY HH:MM:SS) — jika belum bayar: "-"
- Section search & filter:
  - Search bar (cari berdasarkan semua field)
  - Filter status (multi-select)
  - Filter rentang tanggal

**Interaksi:**

- Search/filter/date range → GET `/api/admin/dashboard/transactions?...` → update list
- Pagination
- Klik baris → expand untuk detail lengkap (opsional)

---

### 7.1.14 Halaman Hand Over Admin (`/admin/hand-over`)

**Informasi:**

- Heading: "Serah Terima Barang"
- Area kamera (viewfinder) untuk QR scan — menggunakan browser camera API
- Tombol: "Mulai Scan" / "Hentikan Scan"
- Area hasil scan:
  - Sebelum scan: placeholder "Scan QR code pengguna untuk melihat detail transaksi"
  - Setelah scan berhasil: card informasi transaksi:
    - Nama pembeli
    - Email, No. Telp, ID LINE
    - Detail item yang dibeli (list)
    - Total harga
    - Status saat ini
    - Timestamp pelunasan
  - Tombol: "Konfirmasi Serah Terima" (primary, mengubah status → "Diterima")
  - Tombol: "Scan Lagi" (scan QR berikutnya)

**Interaksi:**

- "Mulai Scan" → akses kamera browser (minta izin jika belum) → scan QR secara kontinu
- QR berhasil ter-decode → POST `/api/admin/hand-over/scan` dengan `{ qrToken: string }` → response: detail transaksi → tampilkan card info
- QR tidak valid / kadaluarsa → tampilkan toast error, scanner tetap aktif
- "Konfirmasi Serah Terima" → PATCH `/api/admin/hand-over/confirm/{transactionId}` → status berubah "Diterima" → toast sukses → siap scan berikutnya
- "Scan Lagi" → reset tampilan hasil, scanner aktif kembali

## 7.2. Back-End {#7.2.-back-end}

### 7.2.0. Konvensi Umum

- **Base URL:** `https://api.ganeshagoods.com/api/v1`
- **Format Request/Response:** `application/json`
- **Autentikasi:** Bearer token di header `Authorization: Bearer <token>`
- **Format Respons Sukses:**

json  
 {  
 "success": true,  
 "data": { ... },  
 "meta": { "page": 1, "limit": 10, "total": 100 } // untuk paginated  
 }

- **Format Respons Error:**

json  
 {  
 "success": false,  
 "error": {  
 "code": "INVALID_CREDENTIALS",  
 "message": "Email atau password tidak valid"  
 }  
 }

- **HTTP Status Codes:** 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 422 Unprocessable Entity, 429 Too Many Requests, 500 Internal Server Error

---

### 7.2.1 Domain Auth (`/api/v1/auth`)

**POST `/auth/signup`**

- **Deskripsi:** Registrasi pengguna baru
- **Auth:** Tidak perlu
- **Request Body:**

json  
 {  
 "name": "string (required, 2-100 char)",  
 "email": "string (required, valid email)",  
 "password": "string (required, min 8 char, 1 upper, 1 lower, 1 digit)"  
 }

- **Response 201:**

json  
 {  
 "success": true,  
 "data": { "message": "OTP telah dikirim ke email Anda" }  
 }

- **Response 409:** Email sudah terdaftar
- **Response 429:** Rate limit terlampaui

---

**POST `/auth/verify-otp`**

- **Deskripsi:** Verifikasi kode OTP email
- **Auth:** Tidak perlu
- **Request Body:**

json  
 {  
 "email": "string",  
 "otp": "string (6 digit)"  
 }

- **Response 200:**

json  
 {  
 "success": true,  
 "data": {  
 "message": "Email berhasil diverifikasi",  
 "onboarding_token": "string (temporary token untuk onboarding)"  
 }  
 }

- **Response 400:** OTP salah atau kadaluarsa

---

**POST `/auth/resend-otp`**

- **Deskripsi:** Kirim ulang OTP ke email
- **Auth:** Tidak perlu
- **Request Body:** `{ "email": "string" }`
- **Response 200:** `{ "success": true, "data": { "message": "OTP baru telah dikirim" } }`
- **Response 429:** Rate limit

---

**POST `/auth/onboarding`**

- **Deskripsi:** Menyelesaikan onboarding pengguna setelah OTP terverifikasi
- **Auth:** Onboarding token (temporary)
- **Request Body:**

json  
 {  
 "line_id": "string (required)",  
 "phone": "string (required)",  
 "role": "umum | panitia",  
 "nim": "string (required jika role=panitia)",  
 "division_code": "string (required jika role=panitia)"  
 }

- **Response 200:**

json  
 {  
 "success": true,  
 "data": {  
 "access_token": "string (JWT)",  
 "user": { "id": "uuid", "name": "string", "email": "string", "role": "umum|panitia|admin" }  
 }  
 }

- **Response 422:** NIM atau kode bidang tidak valid (untuk role panitia)

---

**POST `/auth/login`**

- **Deskripsi:** Login pengguna
- **Auth:** Tidak perlu
- **Request Body:** `{ "email": "string", "password": "string" }`
- **Response 200:**

json  
 {  
 "success": true,  
 "data": {  
 "access_token": "string",  
 "user": { "id": "uuid", "name": "string", "email": "string", "role": "umum|panitia|admin" }  
 }  
 }

- **Response 401:** Kredensial tidak valid
- **Response 429:** Rate limit / blokir sementara

---

**DELETE `/auth/logout`**

- **Deskripsi:** Logout — invalidasi token
- **Auth:** Required
- **Response 200:** `{ "success": true, "data": { "message": "Berhasil logout" } }`

---

**PUT `/auth/change-password`**

- **Deskripsi:** Ganti password pengguna
- **Auth:** Required
- **Request Body:**

json  
 {  
 "old_password": "string",  
 "new_password": "string (min 8 char, 1 upper, 1 lower, 1 digit)",  
 "confirm_new_password": "string"  
 }

- **Response 200:** `{ "success": true, "data": { "message": "Password berhasil diubah" } }`
- **Response 401:** Password lama salah
- **Response 422:** Password baru tidak memenuhi syarat / konfirmasi tidak cocok

---

### 7.2.2 Domain User (`/api/v1/user`)

**GET `/user/me`**

- **Deskripsi:** Mendapatkan data profil pengguna yang sedang login
- **Auth:** Required
- **Response 200:**

json  
 {  
 "success": true,  
 "data": {  
 "id": "uuid",  
 "name": "string",  
 "email": "string",  
 "role": "umum|panitia|admin",  
 "line_id": "string",  
 "phone": "string",  
 "nim": "string|null",  
 "division": { "id": "uuid", "name": "string", "code": "string" } | null,  
 "kelompok": "string|null"  
 }  
 }

---

### 7.2.3 Domain Product (`/api/v1/product`)

**GET `/product`**

- **Deskripsi:** Mendapatkan daftar produk (dengan filtering, pagination)
- **Auth:** Required
- **Query Params:**
  - `type`: `merchandise | collaboration | kit_panitia` (bisa multi, dipisah koma)
  - `category`: `perhiasan | baju | peralatan_tulis | aksesoris` (bisa multi)
  - `faculty`: string (bisa multi, dipisah koma)
  - `search`: string (keyword pencarian)
  - `page`: integer (default: 1\)
  - `limit`: integer (default: 20\)
- **Logika Backend:** Produk `kit_panitia` hanya dikembalikan jika role user adalah `panitia` atau `admin`
- **Response 200:**

json  
 {  
 "success": true,  
 "data": \[  
 {  
 "id": "uuid",  
 "name": "string",  
 "base_price": 50000,  
 "type": "merchandise",  
 "category": "baju",  
 "faculty": "string|null",  
 "primary_image_url": "string"  
 }  
 \],  
 "meta": { "page": 1, "limit": 20, "total": 50, "total_pages": 3 }  
 }

---

**GET `/product/:id`**

- **Deskripsi:** Mendapatkan detail satu produk beserta varian dan gambarnya
- **Auth:** Required
- **Response 200:**

json  
 {  
 "success": true,  
 "data": {  
 "id": "uuid",  
 "name": "string",  
 "description": "string",  
 "base_price": 50000,  
 "type": "merchandise",  
 "category": "baju",  
 "faculty": "string|null",  
 "images": \[  
 { "id": "uuid", "url": "string", "is_primary": true, "sort_order": 0 }  
 \],  
 "variants": \[  
 {  
 "id": "uuid",  
 "sleeve_type": "lengan_panjang|lengan_pendek|none|null",  
 "color": "Merah|null",  
 "size": "M|null",  
 "price_modifier": 0,  
 "sku": "string"  
 }  
 \]  
 }  
 }

- **Response 404:** Produk tidak ditemukan

---

### 7.2.4 Domain Cart (`/api/v1/cart`)

**GET `/cart`**

- **Deskripsi:** Mendapatkan isi cart pengguna yang sedang login
- **Auth:** Required
- **Query Params:** `page`, `limit`
- **Response 200:**

json  
 {  
 "success": true,  
 "data": \[  
 {  
 "cart_item_id": "uuid",  
 "variant_id": "uuid",  
 "product_id": "uuid",  
 "product_name": "string",  
 "primary_image_url": "string",  
 "sleeve_type": "string|null",  
 "color": "string|null",  
 "size": "string|null",  
 "unit_price": 55000,  
 "quantity": 2,  
 "subtotal": 110000  
 }  
 \],  
 "meta": { "page": 1, "limit": 10, "total": 5 }  
 }

---

**POST `/cart`**

- **Deskripsi:** Menambahkan item ke cart atau menambah kuantitas jika item sudah ada
- **Auth:** Required
- **Request Body:**

json  
 {  
 "variant_id": "uuid",  
 "quantity": 1  
 }

- **Response 201:**

json  
 {  
 "success": true,  
 "data": { "cart_item_id": "uuid", "quantity": 2 }  
 }

- **Response 404:** Variant tidak ditemukan

---

**PATCH `/cart/:cartItemId`**

- **Deskripsi:** Update kuantitas item di cart
- **Auth:** Required
- **Request Body:** `{ "quantity": 3 }`
- **Response 200:** `{ "success": true, "data": { "cart_item_id": "uuid", "quantity": 3, "subtotal": 165000 } }`
- **Response 400:** Quantity \< 1 (gunakan DELETE untuk hapus)
- **Response 403:** Cart item bukan milik user ini

---

**DELETE `/cart/:cartItemId`**

- **Deskripsi:** Hapus item dari cart
- **Auth:** Required
- **Response 200:** `{ "success": true, "data": { "message": "Item berhasil dihapus dari keranjang" } }`

---

**GET `/cart/count`**

- **Deskripsi:** Mendapatkan jumlah total item di cart (untuk badge navbar)
- **Auth:** Required
- **Response 200:** `{ "success": true, "data": { "count": 5 } }`

---

### 7.2.5 Domain Order (`/api/v1/order`)

**POST `/order`**

- **Deskripsi:** Membuat order baru (checkout) dari item-item yang dipilih di cart
- **Auth:** Required
- **Request Body:**

json  
 {  
 "cart_item_ids": \["uuid", "uuid"\],  
 "delivery_method": "pickup | delivery",  
 "contact_name": "string (required jika delivery)",  
 "contact_phone": "string (required jika delivery)",  
 "contact_line_id": "string (required jika delivery)",  
 "delivery_address": "string (required jika delivery)",  
 "payment_method": "qris | bank_transfer"  
 }

- **Response 201:**

json  
 {  
 "success": true,  
 "data": {  
 "order_id": "uuid",  
 "total_amount": 200000,  
 "gateway_fee": 4000,  
 "total_billed": 204000,  
 "payment_expired_at": "2025-01-01T12:00:00Z",  
 "payment_method": "qris",  
 "qris_code": "string (base64 image atau URL)"  
 }  
 }

- **Response 400:** Cart item ids tidak valid atau tidak ada

---

**GET `/order/:orderId`**

- **Deskripsi:** Mendapatkan detail satu order
- **Auth:** Required (hanya order milik user, atau admin)
- **Response 200:**

json  
 {  
 "success": true,  
 "data": {  
 "id": "uuid",  
 "status": "belum_bayar|lunas|diterima|expired",  
 "delivery_method": "pickup|delivery",  
 "contact_name": "string|null",  
 "contact_phone": "string|null",  
 "contact_line_id": "string|null",  
 "delivery_address": "string|null",  
 "payment_method": "string",  
 "total_amount": 200000,  
 "gateway_fee": 4000,  
 "total_billed": 204000,  
 "payment_expired_at": "datetime",  
 "paid_at": "datetime|null",  
 "qris_code": "string|null",  
 "items": \[  
 {  
 "product_name": "string",  
 "variant_snapshot": { "sleeve_type": "lengan_panjang", "color": "Merah", "size": "XL" },  
 "unit_price": 55000,  
 "quantity": 2,  
 "subtotal": 110000  
 }  
 \]  
 }  
 }

---

**GET `/order/:orderId/status`**

- **Deskripsi:** Polling status pembayaran (untuk halaman Payment)
- **Auth:** Required
- **Response 200:**

json  
 {  
 "success": true,  
 "data": {  
 "status": "belum_bayar|lunas|expired",  
 "paid_at": "datetime|null"  
 }  
 }

---

**GET `/order/history`**

- **Deskripsi:** Mendapatkan riwayat transaksi pengguna yang login
- **Auth:** Required
- **Query Params:** `page` (default: 1), `limit` (default: 10\)
- **Response 200:**

json  
 {  
 "success": true,  
 "data": \[  
 {  
 "id": "uuid",  
 "status": "string",  
 "total_billed": 204000,  
 "paid_at": "datetime|null",  
 "created_at": "datetime",  
 "items": \[  
 { "product_name": "Kaos", "variant_snapshot": { "sleeve_type": "lengan_panjang", "color": "Merah", "size": "XL" }, "quantity": 2 }  
 \]  
 }  
 \],  
 "meta": { "page": 1, "total": 15, "total_pages": 2 }  
 }

---

**POST `/order/:orderId/generate-qr`**

- **Deskripsi:** Generate QR code pengambilan barang (berlaku 24 jam)
- **Auth:** Required (hanya order milik user)
- **Precondition:** Status order \= "lunas"
- **Response 201:**

json  
 {  
 "success": true,  
 "data": {  
 "qr_token": "string (opaque token)",  
 "expires_at": "datetime"  
 }  
 }

- **Response 400:** Order belum lunas
- **Response 403:** Order bukan milik user ini

---

### 7.2.6 Domain Payment (`/api/v1/payment`)

**POST `/payment/webhook`**

- **Deskripsi:** Endpoint untuk menerima notifikasi dari payment gateway (webhook)
- **Auth:** Signature verification dari payment gateway (bukan JWT user)
- **Request Body:** Sesuai format payment gateway (Midtrans/Xendit/dll.)
- **Logic Backend:** Verifikasi signature → parse data pembayaran → update status order → catat paid_at
- **Response 200:** `{ "success": true }`

---

**GET `/payment/methods`**

- **Deskripsi:** Mendapatkan daftar metode pembayaran yang tersedia beserta biaya gateway
- **Auth:** Required
- **Response 200:**

json  
 {  
 "success": true,  
 "data": \[  
 { "id": "qris", "name": "QRIS", "fee_percentage": 0.7, "fee_flat": 0 },  
 { "id": "bank_transfer", "name": "Transfer Bank", "fee_percentage": 0, "fee_flat": 4500 }  
 \]  
 }

---

### 7.2.7 Domain Admin (`/api/v1/admin`)

Semua endpoint di domain ini memerlukan Auth \+ Role Admin

**GET `/admin/dashboard/items`**

- **Deskripsi:** Data item terjual per varian untuk Dashboard Item
- **Auth:** Required \+ Admin
- **Query Params:** `search`, `type`, `category`, `faculty`, `page`, `limit`, `sort_by` (name|quantity|revenue), `sort_order` (asc|desc)
- **Response 200:**

json  
 {  
 "success": true,  
 "data": \[  
 {  
 "product_id": "uuid",  
 "product_name": "Kaos OSKM",  
 "primary_image_url": "string",  
 "variants": \[  
 {  
 "variant_id": "uuid",  
 "sleeve_type": "lengan_panjang",  
 "color": "Merah",  
 "size": "XL",  
 "quantity_sold": 15,  
 "revenue": 825000  
 }  
 \]  
 }  
 \],  
 "meta": { "page": 1, "total": 20, "total_pages": 2 }  
 }

---

**GET `/admin/dashboard/transactions`**

- **Deskripsi:** Data semua transaksi untuk Dashboard Transaksi
- **Auth:** Required \+ Admin
- **Query Params:** `search` (nama/email/telp/line_id/nama_produk), `status` (multi, dipisah koma), `date_from` (ISO date), `date_to` (ISO date), `page`, `limit`
- **Response 200:**

json  
 {  
 "success": true,  
 "data": \[  
 {  
 "order_id": "uuid",  
 "buyer_name": "string",  
 "buyer_email": "string",  
 "buyer_phone": "string",  
 "buyer_line_id": "string",  
 "items": \[  
 { "product_name": "Kaos Lengan Panjang XL Merah", "quantity": 2 }  
 \],  
 "total_billed": 204000,  
 "status": "lunas",  
 "paid_at": "2025-01-01T10:30:45Z"  
 }  
 \],  
 "meta": { "page": 1, "total": 100, "total_pages": 10 }  
 }

---

**POST `/admin/hand-over/scan`**

- **Deskripsi:** Validasi QR token pengambilan barang
- **Auth:** Required \+ Admin
- **Request Body:** `{ "qr_token": "string" }`
- **Response 200:**

json  
 {  
 "success": true,  
 "data": {  
 "transaction_id": "uuid",  
 "buyer_name": "string",  
 "buyer_email": "string",  
 "buyer_phone": "string",  
 "buyer_line_id": "string",  
 "items": \[  
 { "product_name": "Kaos", "variant_snapshot": { ... }, "quantity": 2 }  
 \],  
 "total_billed": 204000,  
 "status": "lunas",  
 "paid_at": "datetime"  
 }  
 }

- **Response 400:** QR token tidak valid atau kadaluarsa
- **Response 404:** QR token tidak ditemukan

---

**PATCH `/admin/hand-over/confirm/:transactionId`**

- **Deskripsi:** Mengkonfirmasi serah terima barang, mengubah status order menjadi "diterima"
- **Auth:** Required \+ Admin
- **Response 200:**

json  
 {  
 "success": true,  
 "data": { "order_id": "uuid", "status": "diterima", "updated_at": "datetime" }  
 }

- **Response 400:** Order belum berstatus "lunas" (tidak bisa konfirmasi)
- **Response 404:** Order tidak ditemukan

---

**Catatan Implementasi Best Practices:**

1. **Drizzle ORM:** Gunakan `db.transaction()` untuk operasi yang melibatkan beberapa tabel (misalnya membuat order \+ order_items \+ hapus cart items) untuk memastikan atomisitas.
2. **OpenAPI:** Setiap route di Hono menggunakan `createRoute()` dari `@hono/zod-openapi` sehingga Zod schema otomatis menjadi OpenAPI spec. Ini memastikan validasi request dan dokumentasi selalu sinkron.
3. **Error Handling:** Semua handler dibungkus dengan try-catch; unhandled errors di-handle oleh global error middleware yang mengembalikan format error konsisten.
4. **Separation of Concerns:** Handler hanya mengekstrak data dari request dan memanggil service. Service berisi logika bisnis dan memanggil repository. Repository hanya berinteraksi dengan database via Drizzle.
5. **Input Validation:** Semua input divalidasi dengan Zod schema di level route/handler sebelum masuk ke service layer.
6. **Snapshot pada Order Items:** Saat order dibuat, nama produk, detail varian, dan harga di-snapshot ke `order_items` untuk memastikan riwayat transaksi akurat meski produk diedit di kemudian hari.
7. **Cart Sinkronisasi (FE):** Gunakan TanStack Query dengan `invalidateQueries` untuk memastikan data cart selalu segar setelah mutasi; Zustand untuk sinkronisasi badge navbar yang real-time.
8. **QR Code Security:** `qr_token` adalah UUID v4 atau random string 64 karakter yang di-hash sebelum disimpan ke DB untuk menghindari brute force; backend selalu memvalidasi waktu kadaluarsa dan status `is_used`.

# 8\. Hasil Implementasi {#8.-hasil-implementasi}

## 8.1. {#8.1.}

# 9\. Evaluasi {#9.-evaluasi}

## 9.1. {#9.1.}
