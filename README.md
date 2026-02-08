# Clinexa - Advanced Hospital Management System

Clinexa is a comprehensive, modern, and production-ready Hospital Management System (HMS) designed to streamline clinical workflows, automate laboratory operations, and manage hospital administration with high efficiency.

## 🚀 Core Features & Modules

### 🏥 Clinical & Outpatient (OPD)

- **Patient Management**: Secure registration, medical history, and portal access.
- **Appointment Booking**: Multi-step booking flow with department and doctor availability.
- **Consultation**: Digital prescriptions, vital signs tracking, and clinical notes.

### 🛌 Inpatient (IPD) & Nursing

- **Ward Management**: Real-time bed occupancy tracking with graphical ward views.
- **Nursing Station**: Vitals monitoring, nursing notes, and task management.
- **Admission & Discharge**: Automated stay-duration billing and clearance validation.

### 🔬 Diagnostics (LIS & RIS)

- **Lab Automation**: Machine integration via ASTM/HL7 protocols for automated result logging.
- **Sample Tracking**: Barcode-based sample collection and status monitoring.
- **Radiology**: Worklist management and digital reporting for imaging studies.

### 💊 Pharmacy & Inventory

- **POS System**: Point of Sale for medicine dispensing with batch-wise stock tracking.
- **Stock Management**: Supplier management, purchase orders, and multi-store inventory.
- **IPD Issues**: Direct stock deduction for inpatient prescriptions.

### 💰 Finance & HR

- **Billing System**: Centralized billing for OPD, IPD, and Pharmacy with discount management.
- **Accounts**: Multi-ledger accounting with cost-center tagging and financial reporting.
- **HR Management**: Employee shifts, leave workflows, and payroll integration.

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui.
- **Backend**: Laravel (PHP), MySQL, Eloquent ORM.
- **State Management**: React Query (TanStack Query) & Context API.
- **UI Architecture**: Atomic components with `lucide-react` icons.

## ⚙️ Installation & Setup

### Prerequisites

- Node.js (v18+)
- PHP (v8.1+) & Composer
- MySQL

### Frontend Setup

```sh
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### Backend Setup (Located in /backend)

```sh
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

## 📈 Recent Improvements

- **Type Safety**: Full TypeScript refactoring for robust frontend-backend alignment.
- **UX**: Automatic scroll-to-top on navigation and persistent dashboard layouts.
- **Security**: OTP-based patient login and time-limited secure report download links.

---
Built with pride for modern healthcare.
