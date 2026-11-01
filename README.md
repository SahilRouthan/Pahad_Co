# PAHAD.co — Premium Event Management & Destination Weddings

> *“You Dream It, We Make It Extraordinary.”*  
> *“We don’t just plan events, we create moments that last forever.”*

PAHAD.co is an event planning and management business based in Dehradun, Uttarakhand, India. We organize memorable events ranging from intimate celebrations to large-scale corporate functions and destination weddings amidst the Himalayan mountains.

---

## 🏔️ Highlights

- **Bespoke Uttarakhand Mountain Identity**: Warm cream canvas, deep forest green, soft champagne gold accents, and elegant serif typography.
- **Full Backend & Persistent Database**: Powered by Node.js, Express, and high-performance native SQLite (`node:sqlite`).
- **Client Inquiries & CRM**: Client inquiries are stored directly in SQLite with status tracking (`new`, `contacted`, `in_progress`, `completed`, `archived`), admin notes, and instant WhatsApp/Email response triggers.
- **Customer Review System**: Clients can submit 1–5 star reviews with event details. Approved reviews are displayed dynamically on the public website.
- **Client Feedback System**: Structured feedback collection categorized by Service Quality, Coordination, Catering, Decor, and Staffing.
- **Dynamic Gallery Portfolio**: Backed by database storage with category filters, full-screen lightbox preview, and admin image management (URLs and file uploads).
- **Administrative Portal**: Secure dashboard with JWT authentication, bcrypt password hashing, KPI counters, and complete moderation control.
- **Verified Business Details**: Direct click-to-call, email, and floating WhatsApp connect (`+91 87551 05353`).
- **SEO & Schema.org**: Fully configured JSON-LD `EventPlanner` structured data and Open Graph metadata.

---

## 🛠️ Tech Stack

- **Frontend**: [React 18](https://react.dev/) + [Vite 6](https://vitejs.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Backend**: Node.js + [Express 5](https://expressjs.com/)
- **Database**: SQLite (via Node.js built-in `node:sqlite`)
- **Authentication**: JSON Web Tokens (JWT) + [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
- **File Uploads**: [Multer](https://github.com/expressjs/multer)

---

## 🔐 Environment Variables

Create a `.env` file in the root directory (based on `.env.example`):

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=pahad_co_himalayan_jwt_secret_key_2026_super_secure
ADMIN_USERNAME=admin
ADMIN_PASSWORD=PahadAdmin@2026
CLIENT_ORIGIN=http://localhost:5173
DB_PATH=./server/data/pahad.sqlite
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v20+ or v22.5+/v24 with native SQLite)
- npm (v9+)

### Installation & Run

1. Clone repository and install dependencies:
   ```bash
   npm install
   ```

2. Start full development stack (runs both Express server on :5000 and Vite client on :5173 concurrently):
   ```bash
   npm run dev
   ```

3. Open in browser:
   - **Public Website**: [http://localhost:5173](http://localhost:5173)
   - **Full Gallery Archives**: [http://localhost:5173/#gallery-page](http://localhost:5173/#gallery-page)
   - **Admin Management Portal**: [http://localhost:5173/#admin](http://localhost:5173/#admin)
   - **Backend API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

4. Default Admin Credentials:
   - **Username**: `admin`
   - **Password**: `PahadAdmin@2026`

5. Production Build:
   ```bash
   npm run build
   npm run start
   ```

---

## 📡 API Endpoints Summary

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | Server health & database status |
| `POST` | `/api/queries` | Public | Submit new event inquiry |
| `GET` | `/api/queries` | Admin | Retrieve inquiries with status/search filter |
| `PATCH` | `/api/queries/:id` | Admin | Update inquiry status & internal notes |
| `DELETE` | `/api/queries/:id` | Admin | Delete an inquiry record |
| `GET` | `/api/reviews` | Public | Retrieve approved customer reviews |
| `POST` | `/api/reviews` | Public | Submit review for approval |
| `GET` | `/api/reviews/all` | Admin | Retrieve all reviews (pending/approved/rejected) |
| `PATCH` | `/api/reviews/:id/status` | Admin | Approve or reject a review |
| `DELETE` | `/api/reviews/:id` | Admin | Delete a review record |
| `POST` | `/api/feedback` | Public | Submit client/guest feedback |
| `GET` | `/api/feedback` | Admin | Retrieve all feedback submissions |
| `PATCH` | `/api/feedback/:id` | Admin | Update feedback status & notes |
| `DELETE` | `/api/feedback/:id` | Admin | Delete a feedback entry |
| `GET` | `/api/gallery` | Public | Retrieve gallery photos (filter by category) |
| `POST` | `/api/gallery` | Admin | Add photo (URL or file upload) |
| `PUT` | `/api/gallery/:id` | Admin | Update photo title, category, caption, order |
| `DELETE` | `/api/gallery/:id` | Admin | Delete gallery image |
| `POST` | `/api/admin/login` | Public | Authenticate administrator & get JWT token |
| `GET` | `/api/admin/me` | Admin | Verify active session & role |
| `GET` | `/api/admin/stats` | Admin | Aggregate dashboard counters |
| `POST` | `/api/admin/change-password` | Admin | Change admin password |

---

## 📍 Contact & Location

- **Location**: Dehradun, Uttarakhand, India
- **Phone**: [+91 87551 05353](tel:+918755105353)
- **Email**: [pahad.co@gmail.com](mailto:pahad.co@gmail.com)
- **Instagram**: [@pahad.co](https://instagram.com/pahad.co)
- **Website**: [pahad.co](https://pahad.co)
