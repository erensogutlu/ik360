/* ik360 – İnsan Kaynakları Yönetim Sistemi */

ik360, departmanları, işe alım süreçlerini, maaş & bordroları, performans ve personel izin kayıtlarını tek bir merkezden profesyonelce, uçtan uca yönetmenizi sağlayan yeni nesil bir Kurumsal Kaynak Planlama platformudur.

* Özellikler : 

 -> Çalışanlar, Departmanlar, İşe Alım, Bordro, Performans vb. modüllerle tam kapsamlı CRUD
 -> Recharts entegrasyonuyla canlı olarak güncellenen şirket analitikleri ve grafikleri
 -> Express.js Rate Limit ve Veritabanı Kota Koruması ile Public-Demo seviyesinde üst düzey güvenlik
 -> Mobil, tablet ve masaüstü ile tam uyumlu modern, glassmorphism destekli karanlık tema

* Kullanılan Teknolojiler :

    Frontend : 

   -> React.js
   -> Vite
   -> Vanilla CSS (Dark & Glassmorphism)
   -> Recharts & Lucide React

    Backend :

   -> Node.js
   -> Express.js
   -> PostgreSQL (NeonDB)

* Geliştirici : Eren Söğütlü

* Panel Giriş Bilgileri : 

 -> E-Posta: admin@ik360.com
 -> Şifre: admin123

 ⚠️ Bu hesap yalnızca tanıtım amaçlıdır ve sistem üzerinde güvenlik amacıyla bazı veritabanı kotaları uygulanmaktadır.

-----------------------------------------------------------------------------------------------------------------

/* ik360 – Human Resources Management System */

ik360 is a next-generation Enterprise Resource Planning platform that allows you to professionally manage departments, recruitment processes, payrolls, performance, and employee leave records from a single center, end-to-end.

* Features : 

 -> Full comprehensive CRUD with modules like Employees, Departments, Recruitment, Payroll, Performance, etc.
 -> Live updating company analytics and charts with Recharts integration
 -> High-level Public-Demo security with Express.js Rate Limiting and Database Quota Protections
 -> Modern, glassmorphism-supported dark theme fully responsive with mobile, tablet, and desktop

* Technologies Used : 

    Frontend : 

   -> React.js 
   -> Vite 
   -> Vanilla CSS (Dark & Glassmorphism)
   -> Recharts & Lucide React

    Backend : 

   -> Node.js 
   -> Express.js 
   -> PostgreSQL (NeonDB)

* Developer : Eren Söğütlü

* Panel Login Information :

 -> Email: admin@ik360.com
 -> Password: admin123

 ⚠️ This account is for demonstration purposes only, and certain database quotas are enforced on the system for security purposes.

-----------------------------------------------------------------------------------------------------------------

## Kurulum ve Çalıştırma

### 1. Gerekli Paketlerin Yüklenmesi

Frontend için:

```bash
cd frontend
npm install
```

Backend için:

```bash
cd backend
npm install
```

---

### 2. Çevre Değişkenleri Ayarları (.env)

Backend için `backend` dizininde `.env` dosyasını oluşturup bilgileri girin:

```env
DATABASE_URL=your_postgresql_database_url
PORT=5000
```

---

### 3. Projeyi Çalıştırma

Kurulum tamamlandıktan sonra iki ayrı terminal kullanın:

#### Backend (Arka Yüz)

```bash
cd backend
node server.js
```

> Sunucu: http://localhost:5000

---

#### Frontend (Ön Yüz)

```bash
cd frontend
npm run dev
```

> Uygulama: http://localhost:5173

-----------------------------------------------------------------------------------------------------------------

## Installation and Operation

### 1. Installing Required Packages

For frontend:

```bash
cd frontend
npm install
```

For backend:

```bash
cd backend
npm install
```

---

### 2. Environment Variables Settings (.env)

Create an `.env` file in the `backend` directory and fill in the contents:

```env
DATABASE_URL=your_postgresql_database_url
PORT=5000
```

---

### 3. Running the Project

Once the installation is complete, use two separate terminals:

#### Backend

```bash
cd backend
node server.js
```

> Server: http://localhost:5000

---

#### Frontend

```bash
cd frontend
npm run dev
```

> Application: http://localhost:5173