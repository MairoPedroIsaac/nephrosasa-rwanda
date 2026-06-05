# NephroSasa Rwanda 🩺🇷🇼
> Monitor Your Kidneys. Before It's Too Late.

## Description
NephroSasa Rwanda is a longitudinal, AI-powered, pre-dialysis kidney health monitoring platform designed specifically for Rwandan adults diagnosed with hypertension or Type 2 diabetes. The platform serves as an early-warning system that tracks vitals, generates AI-driven kidney risk scores, and connects patients directly with nephrologists before irreversible kidney damage occurs.

**Features:**
- 📊 **Longitudinal Vital Tracking:** Patients log daily blood pressure and blood sugar.
- 🤖 **AI Kidney Risk Scoring:** A Random Forest model generates risk predictions (Low, Medium, High).
- 🏥 **Nephrologist Dashboard:** Doctors can monitor patient trajectories remotely.
- 📱 **Mobile Money & SMS Integration:** Native payments via MTN MoMo and Airtel Money, plus SMS reminders for logging vitals.
- 📑 **QR Health Records:** Easy scanning for interoperability at local clinics.

## GitHub Repository
https://github.com/MairoPedroIsaac/nephrosasa-rwanda

## How to Set Up the Environment and the Project

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Python 3.9+

### Installation Steps

**1. Clone the repository**
```bash
git clone https://github.com/MairoPedroIsaac/nephrosasa-rwanda.git
cd nephrosasa-rwanda
```

**2. Setup the Frontend (Next.js)**
```bash
cd frontend
npm install
npm run dev
```
The frontend will be accessible at `http://localhost:3000`.

**3. Setup the AI Model/Backend (Python)**
```bash
cd ../nephrosasa-ai
# Create a virtual environment
python -m venv venv
# Activate virtual environment (Windows)
venv\Scripts\activate
# Activate virtual environment (Mac/Linux)
# source venv/bin/activate
pip install -r requirements.txt
python predict.py
```

## Designs
Screenshots of the application interface, including the Patient Dashboard and responsive UI layouts, are included in the `docs/designs` folder of this repository.

Figma Design File: [View on Figma](https://www.figma.com/design/iKcVvwWrGPdiyWzr15ZgjT/NephroSasa-Rwanda---UI-Designs?node-id=0-1&t=bQ32MVYbJ755FLuC-1)

## Deployment Plan
- **Frontend:** The Next.js frontend is deployed on **Vercel** with continuous 
deployment from GitHub. Live at: https://nephrosasa-rwanda.vercel.app/en
- **Backend/AI Model:** The Python backend and Random Forest model (`nephrosasa_model.pkl`) will be wrapped in a Django REST Framework, then deployed on **Render** as a backend microservice.
- **Database:** A managed PostgreSQL database on **Supabase** will be used to store patient vitals, doctor records, and authentication data.

## Video Demo
[Insert Link to your 5-10 minute YouTube/Loom Video Demo here]
