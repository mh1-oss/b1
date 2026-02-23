# Task Manager API 🚀

واجهة برمجة تطبيقات (API) لإدارة المهام مبنية باستخدام **Node.js** و **Express** و **PostgreSQL**. توفر هذه الواجهة نظاماً متكاملاً لإدارة المهام مع ميزة المصادقة باستخدام (JWT)، حيث يمكن لكل مستخدم إدارة مهامه الخاصة بسرية تامة.

## 🌟 الميزات (Features)

* **مصادقة المستخدمين:** تسجيل حساب جديد وتسجيل الدخول باستخدام `bcrypt` لتشفير كلمات المرور و `jsonwebtoken` للمصادقة.
* **إدارة المهام (CRUD):** إنشاء، قراءة، تحديث، وحذف المهام.
* **خصوصية البيانات:** كل مستخدم يمكنه الوصول إلى مهامه الخاصة فقط.
* **قاعدة بيانات علائقية:** تخزين البيانات بشكل آمن ومنظم باستخدام PostgreSQL.

## 🛠️ التقنيات المستخدمة (Tech Stack)

* **البيئة الخلفية (Backend):** Node.js, Express.js
* **قاعدة البيانات:** PostgreSQL
* **المصادقة:** JWT (JSON Web Tokens)
* **حماية كلمات المرور:** bcrypt
* **أخرى:** cors, dotenv

## ⚙️ متطلبات التشغيل (Prerequisites)

تأكد من تثبيت البرامج التالية على جهازك:
* [Node.js](https://nodejs.org/)
* [PostgreSQL](https://www.postgresql.org/)

## 🚀 طريقة التشغيل (Installation & Setup)

1. **نسخ المستودع وتثبيت الحزم (Install Dependencies):**
   ```bash
   npm install
   ```

2. **إعداد متغيرات البيئة (Environment Variables):**
   قم بإنشاء ملف `.env` في المجلد الرئيسي واضف الإعدادات التالية (تأكد من تعديلها حسب إعدادات قاعدة البيانات الخاصة بك):
   ```env
   PORT=3000
   DB_USER=your_db_user
   DB_HOST=localhost
   DB_NAME=postgres
   DB_PASSWORD=your_db_password
   DB_PORT=5432
   JWT_SECRET=your_secret_key
   ```

3. **تشغيل الخادم (Start Server):**
   ```bash
   node server.js
   ```
   > **ملاحظة:** سيقوم الخادم تلقائياً بإنشاء جداول قاعدة البيانات (users, tasks) عند التشغيل الأول بناءً على ملف `init.sql`.

## 📡 مسارات الواجهة (API Endpoints)

### المصادقة 🔐 (`/api/auth`)
* `POST /api/auth/register` - تسجيل مستخدم جديد (يتطلب: `username`, `email`, `password`)
* `POST /api/auth/login` - تسجيل الدخول والحصول على التوكن (يتطلب: `email`, `password`)

### المهام 📋 (`/api/tasks`)
*(جميع هذه المسارات تتطلب إرسال JWT Token في الـ Header: `Authorization: Bearer <token>`)*

* `GET /api/tasks` - جلب جميع مهام المستخدم الحالي
* `POST /api/tasks` - إنشاء مهمة جديدة (يتطلب: `title`, يمكن إضافة: `description`)
* `PUT /api/tasks/:id` - تحديث مهمة (مثل تغيير الـ `status`)
* `DELETE /api/tasks/:id` - حذف مهمة

## 🗄️ هيكل قاعدة البيانات (Database Schema)

**جدول المستخدمين (users):**
* `id` (Primary Key)
* `username` (Unique)
* `email` (Unique)
* `password` (Hashed)

**جدول المهام (tasks):**
* `id` (Primary Key)
* `title`
* `description`
* `status` (Boolean)
* `user_id` (Foreign Key -> users.id)
