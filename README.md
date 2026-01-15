# 🎨 Canvas – Nền tảng thiết kế đồ họa trực tuyến (Microservice Architecture)

## 📌 Tổng quan dự án

**Canvas** là một dự án **fullstack web application** mô phỏng nền tảng thiết kế đồ họa trực tuyến (tương tự Canva), cho phép người dùng tạo, quản lý và lưu trữ các bản thiết kế (design) trực tiếp trên trình duyệt.

Dự án được xây dựng theo **kiến trúc Microservice hiện đại**, tách biệt rõ ràng giữa frontend và các backend service nhằm đảm bảo:

* Khả năng mở rộng (Scalability)
* Dễ bảo trì (Maintainability)
* Dễ phát triển độc lập từng service

---

## 🎯 Mục tiêu dự án

* Xây dựng một hệ thống **Canvas online** hoàn chỉnh từ UI đến backend
* Áp dụng **Next.js 15** cho frontend hiện đại
* Triển khai **State Management với Zustand**
* Áp dụng **Microservice Architecture** với Node.js
* Tích hợp **Thanh toán Paypal** và **AI Image Generation**
* Phù hợp làm **portfolio chuyên sâu Backend / Fullstack**

---

## 🧩 Kiến trúc tổng thể hệ thống

```
┌──────────────┐
│   Frontend   │  Next.js 15 + Zustand
│  (canvas-fe) │
└───────▲──────┘
        │ HTTP / REST
        ▼
┌───────────────────────┐
│   API Gateway Service │
│  (gateway-service)   │
└───────▲───────▲───────┘
        │       │
 ┌──────┘       └───────────┐
 ▼                          ▼
Design Service     Subscription Service
(CRUD Design)      (Paypal, Premium)

        ▲
        │
   Upload Service
 (Upload / AI Image)
```

---

## 🚀 Công nghệ sử dụng

### 🌐 Frontend – canvas-fe

* **Next.js 15** – App Router, Server Components
* **TypeScript**
* **Zustand** – Global state management
* **TailwindCSS** – Utility-first CSS
* **Radix UI** – Headless UI components
* **NextAuth / Google Auth** – Đăng nhập Google
* **Axios / Fetch API**

🔗 Repository: [https://github.com/nam-Space/canvas-fe](https://github.com/nam-Space/canvas-fe)

---

### 🖥️ Backend – Microservices (Node.js)

Toàn bộ backend được xây dựng bằng **Node.js**, mỗi service đảm nhiệm một vai trò riêng biệt.

---

## 🔀 API Gateway Service

🔗 Repository: [https://github.com/nam-Space/api-gateway-canvas-be](https://github.com/nam-Space/api-gateway-canvas-be)

### Vai trò

* Là **cổng giao tiếp duy nhất** giữa Frontend và các service backend
* Hợp nhất URL (Unified API)
* Routing request đến đúng service
* Kiểm soát authentication / authorization

### Chức năng chính

* Forward request tới:

  * Design Service
  * Upload Service
  * Subscription Service
* Validate request
* Xử lý lỗi tập trung

---

## 🎨 Design Service

🔗 Repository: [https://github.com/nam-Space/design-service-canvas-be](https://github.com/nam-Space/design-service-canvas-be)

### Vai trò

* Quản lý **bản thiết kế (Design)** của người dùng

### Chức năng

* CRUD Design:

  * Tạo design mới
  * Cập nhật nội dung canvas
  * Lưu trạng thái thiết kế
  * Xoá design
* Phân quyền theo user
* Lưu metadata design vào database

---

## ☁️ Upload Service

🔗 Repository: [https://github.com/nam-Space/upload-service-canvas-be](https://github.com/nam-Space/upload-service-canvas-be)

### Vai trò

* Quản lý **upload tài nguyên hình ảnh**
* Tạo ảnh bằng **AI Image Generation**

### Chức năng

* Upload ảnh từ người dùng
* Lưu trữ ảnh (Cloud / Storage)
* Tạo bộ sưu tập hình ảnh cho design
* Sinh ảnh bằng AI theo prompt

---

## 💳 Subscription Service

🔗 Repository: [https://github.com/nam-Space/subscription-service-canvas-be](https://github.com/nam-Space/subscription-service-canvas-be)

### Vai trò

* Quản lý **gói Premium**
* Xử lý **Thanh toán Paypal**

### Chức năng

* Đăng ký gói Premium
* Tạo Order Paypal
* Capture Payment
* Lưu lịch sử giao dịch
* Quản lý trạng thái user (Free / Premium)

---

## 🔐 Authentication & Authorization

### Frontend

* Đăng nhập bằng **Google OAuth**
* Lưu session và token

### Backend

* Gateway kiểm tra token
* Forward thông tin user sang service tương ứng
* Bảo vệ API theo role

---

## 📂 Cấu trúc tổng quan

```bash
canvas-system/
├── canvas-fe/
├── api-gateway-canvas-be/
├── design-service-canvas-be/
├── upload-service-canvas-be/
├── subscription-service-canvas-be/
└── README.md
```

---

## ⚙️ Cài đặt & Chạy hệ thống

### 1️⃣ Clone các repository

```bash
git clone https://github.com/nam-Space/canvas-fe.git
git clone https://github.com/nam-Space/api-gateway-canvas-be.git
git clone https://github.com/nam-Space/design-service-canvas-be.git
git clone https://github.com/nam-Space/upload-service-canvas-be.git
git clone https://github.com/nam-Space/subscription-service-canvas-be.git
```

---

### 2️⃣ Cài đặt dependencies

```bash
npm install
```

(Thực hiện cho từng service)

---

### 3️⃣ Cấu hình môi trường (.env)

#### Frontend

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

#### Backend (ví dụ)

```env
PORT=4000
DATABASE_URL=mongodb://localhost:27017/canvas
PAYPAL_CLIENT_ID=xxx
PAYPAL_SECRET=xxx
```

---

### 4️⃣ Chạy development

```bash
npm run dev
```

* Frontend: [http://localhost:3000](http://localhost:3000)
* Gateway: [http://localhost:4000](http://localhost:4000)

---

## Một số giao diện chính

### 1️⃣ Giao diện trang chủ
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/f6483b63-29e8-4e87-aa56-f26c5003fbec" />
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/05ab2a37-4b4c-4212-bf35-bac4a2b49dc4" />
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/c9371678-d7ac-4d53-8946-5d7a67835a08" />

---

### 2️⃣ Giao diện vẽ
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/19c167b5-b9ec-446c-bade-bdc9c6a0fb0c" />

---


## 🧪 Use Case chính

* User đăng nhập Google
* Tạo design mới
* Upload hoặc tạo ảnh bằng AI
* Lưu design
* Nâng cấp Premium để mở khóa tính năng

---

## 🔒 Bảo mật & Best Practices

* Tách biệt service
* Validate dữ liệu đầu vào
* Không expose secret
* Phân quyền theo user

---

## 🚀 Hướng phát triển tương lai

* Realtime collaboration
* Version history cho design
* Export PDF / PNG
* Team workspace
* Scale bằng Docker & Kubernetes

---

## 👨‍💻 Tác giả

* **Nam Nguyen**
* GitHub: [https://github.com/nam-Space](https://github.com/nam-Space)

---

## 📄 License

Dự án được xây dựng cho mục đích **học tập, nghiên cứu kiến trúc microservice và phát triển nền tảng Canvas online**.
