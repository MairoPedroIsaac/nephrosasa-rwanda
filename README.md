# NephroSasa Rwanda

**Longitudinal AI-Powered Pre-Dialysis Kidney Health Monitoring Platform**

> *"Monitor Your Kidneys. Before It's Too Late."*

NephroSasa Rwanda is an AI-powered longitudinal kidney health monitoring platform for Rwandan adults already diagnosed with hypertension or Type 2 diabetes. It tracks blood pressure and blood sugar readings across multiple visits, uses a Random Forest machine learning model (84.94% accuracy) to generate a **LOW**, **MEDIUM**, or **HIGH** kidney risk score, and sends automated email alerts after every vital submission. The platform connects patients with verified nephrologists through QR-based health record sharing and consultation booking, closing the loop between AI-detected risk and actual clinical follow-up.

---

## Core Features

**Patient**
- Registration, login, and JWT-secured session management
- Vitals logging in Home mode (3 fields) or Clinic mode (10 fields), with an AI-generated LOW/MEDIUM/HIGH kidney risk score after each submission
- Automated email alerts via SendGrid on registration and after every vitals submission
- Health history with mode indicators, expandable clinic lab details, and CSV export
- QR code generation for secure, shareable health records
- Consultation booking with verified nephrologists (Virtual or In-Person)

**Doctor**
- Registration with RMDC medical licence number, verified manually via Django admin
- Doctor dashboard with live patient count and upcoming consultations
- QR code scanning to access a patient's shared health record
- My Patients list of all patients who have shared records via QR
- Schedule management: confirm or cancel consultation requests, add session links for virtual consultations
- Profile editing (name, phone, photo, password)

---

## Deployed Version

* **Live Frontend (Vercel):** https://nephrosasa-rwanda.vercel.app
* **Live Backend (Render):** https://nephrosasa-rwanda.onrender.com

> **Infrastructure Note:** The Render free tier backend was suspended on June 24, 2026 due to monthly usage limits being reached. The service auto-resumes July 1, 2026. All functionality was fully tested and verified prior to suspension using localhost with the production Supabase PostgreSQL database. Screenshots and demo video reflect full working functionality captured before and during local testing.

---

## Demo Video

[Click here to watch the 5-minute core functionality demo](https://youtu.be/wWy2c76qtjU)

> Video covers: patient registration, vitals logging (Home and Clinic modes), AI risk scoring (LOW/MEDIUM/HIGH), email alerts, health history, and multi-device responsiveness. Sign-up and sign-in flows are not the focus.

---

## Testing Evidence

All testing screenshots are located in the `testing/screenshots/` folder.

| #  | File                                      | Description                             |
| -- | ----------------------------------------- | --------------------------------------- |
| 01 | `01_laptop_low_home_vitals_form.png`      | Home mode vitals form — LOW risk values |
| 02 | `02_laptop_low_dashboard_risk.png`        | Dashboard showing LOW RISK score        |
| 03 | `03_laptop_low_health_history.png`        | Health history entry — LOW              |
| 04 | `04_laptop_low_email.png`                 | Email alert — LOW RISK                  |
| 05 | `05_laptop_low_dashboard_overview.png`    | Full dashboard overview                 |
| 06 | `06_laptop_medium_clinic_vitals_form.png` | Clinic mode — MEDIUM risk values        |
| 07 | `07_laptop_medium_dashboard_risk.png`     | Dashboard showing MEDIUM RISK score     |
| 08 | `08_laptop_medium_health_history.png`     | Health history entry — MEDIUM           |
| 09 | `09_laptop_medium_email.png`              | Email alert — MEDIUM RISK               |
| 10 | `10_laptop_medium_dashboard_overview.png` | Full dashboard overview                 |
| 11 | `11_laptop_high_clinic_vitals_form.png`   | Clinic mode — HIGH risk values          |
| 12 | `12_laptop_high_dashboard_risk.png`       | Dashboard showing HIGH RISK score       |
| 13 | `13_laptop_high_health_history.png`       | Health history entry — HIGH             |
| 14 | `14_laptop_high_email.png`                | Email alert — HIGH RISK                 |
| 15 | `15_laptop_high_dashboard_overview.png`   | Full dashboard overview                 |
| 16 | `16_iphone_low_dashboard.png`             | iPhone simulation (DevTools) — LOW RISK dashboard    |
| 17 | `17_iphone_low_history.png`               | iPhone simulation (DevTools) — health history        |
| 18 | `18_iphone_medium_dashboard.png`          | iPhone simulation (DevTools) — MEDIUM RISK dashboard |
| 19 | `19_iphone_medium_history.png`            | iPhone simulation (DevTools) — health history        |               |
| 20 | `20_samsung_medium_dashboard.png`         | Samsung simulation (DevTools) — MEDIUM RISK dashboard |
| 21 | `21_samsung_medium_history.png`           | Samsung simulation (DevTools) — health history        |
| 22 | `22_samsung_high_dashboard.png`           | Samsung simulation (DevTools) — HIGH RISK dashboard   |
| 23 | `23_samsung_high_history.png`             | Samsung simulation (DevTools) — health history
| 24 | `24_doctor_dashboard_overview.png`  | Doctor dashboard — overview                                   |
| 25 | `25_doctor_dashboard_verified.png`  | Doctor dashboard — verified badge, Practice Overview stats    |
| 26 | `26_doctor_my_patients.png`         | My Patients list                                               |
| 27 | `27_doctor_scan_qr.png`             | QR code scanner for patient health records                    |
| 28 | `28_doctor_schedule_confirmed.png`  | Schedule — confirmed consultation                              |
| 29 | `29_doctor_profile.png`             | Doctor profile page                                            |


> Note: Screenshots 01-23 document the core vitals logging, AI risk scoring, and multi-device testing described in the original capstone proposal. Screenshots 24-29 document doctor-side features (dashboard, My Patients, QR scanning, consultation scheduling, profile) built afterward as an expanded scope. All features are also demonstrated live in the demo video.

---

## Technology Stack

| Layer      | Technology                          | Purpose                     |
| ---------- | ----------------------------------- | --------------------------- |
| Frontend   | Next.js 14, TypeScript, TailwindCSS | Web application             |
| Backend    | Django 4.2, Django REST Framework   | API server                  |
| Database   | PostgreSQL via Supabase             | Longitudinal health records |
| AI Model   | scikit-learn Random Forest          | Kidney risk scoring         |
| Email      | SendGrid (HTTP API)                 | Automated patient alerts    |
| Deployment | Vercel (frontend), Render (backend) | Cloud hosting               |
| Auth       | JWT with token blacklisting         | Secure authentication       |

---

## Installation and Setup (Step by Step)

### Prerequisites

* Python 3.12+
* Node.js 18+
* Git

---

### 1. Clone the Repository

```bash
git clone https://github.com/MairoPedroIsaac/nephrosasa-rwanda.git
cd nephrosasa-rwanda
```

---

### 2. Backend Setup (Django)

```bash
cd backend

python -m venv venv312

# Windows
source venv312/Scripts/activate

# Mac/Linux
# source venv312/bin/activate

pip install -r requirements.txt
```

Create a `.env` file inside the `backend/` folder:

```env
SECRET_KEY=your-secret-key

DEBUG=True

ALLOWED_HOSTS=localhost,127.0.0.1

DATABASE_URL=postgresql://user:password@host:port/dbname

SUPABASE_URL=https://your-project.supabase.co

FRONTEND_URL=http://localhost:3000

SENDGRID_API_KEY=your-sendgrid-api-key

JWT_ACCESS_TOKEN_LIFETIME=60

JWT_REFRESH_TOKEN_LIFETIME=1440
```

Run migrations and start the server:

```bash
python manage.py migrate
python manage.py runserver
```

---

### 3. Frontend Setup (Next.js)

```bash
cd frontend
npm install
```

Create a `.env.local` file inside the `frontend/` folder:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

Start the frontend:

```bash
npm run dev
```

---

### 4. Access the App

* Frontend: `http://localhost:3000`
* Backend Admin: `http://localhost:8000/admin`

---

## Related Files

| File                                                             | Description                                                |
| ---------------------------------------------------------------- | ---------------------------------------------------------- |
| `docs/Mairo_Pedro_Isaac_NephroSasa_Rwanda_Capstone_Proposal.pdf` | Full capstone proposal                                     |
| `docs/TESTING_REPORT.md`                                         | Testing analysis, results, discussion, and recommendations |
| `backend/api/ml_models/nephrosasa_model.pkl`                     | Trained Random Forest model                                |
| `backend/nephrosasa-ai/`                                         | Model training notebook and dataset                        |
| `testing/screenshots/`                                           | All 29 testing screenshots                                 |                                       |

---

## Known Limitations

1. The vitals form UI collects 3 fields in Home mode and 10 fields in Clinic mode. When only 3 fields are submitted, the AI model uses dataset median defaults for the remaining 7 features, which reduces real-world accuracy below the reported 84.94%.

2. Email delivery uses SendGrid single-sender verification without a custom domain. Emails may land in spam.

3. Africa's Talking SMS reminders (7-day and 14-day missed follow-up) and MTN Mobile Money / Airtel Money payment integration for remote consultations are deferred to Phase 2 post-graduation development. Doctor RMDC verification currently requires manual approval via Django admin. A dedicated verification interface is a Phase 2 feature.

4. Render free tier suspension occurs monthly when usage limits are reached. UptimeRobot pings the backend every 5 minutes to minimize cold starts during active periods.

5. RLS (Row Level Security) is not yet enabled on Supabase tables and is scheduled for Phase 2 security hardening.

---

## AI Model Details

* **Algorithm:** Random Forest Classifier
* **Dataset:** El Kharoua Chronic Kidney Disease Dataset (1,659 records, Kaggle 2024)
* **Training Accuracy:** 84.94%
* **Baseline (Logistic Regression):** 74.70%
* **Cross-Validation Mean:** 79.12% (5-fold, std 1.36%)
* **Class Balancing:** SMOTE oversampling applied to training split
* **Output:** LOW, MEDIUM, or HIGH kidney risk with confidence percentage
