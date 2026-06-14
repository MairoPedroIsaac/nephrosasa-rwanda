# NephroSasa Rwanda
**Longitudinal AI-Powered Kidney Health Monitoring Platform**

## Project Overview
NephroSasa is an AI-powered early detection platform designed to tackle the late detection of chronic kidney disease among adults with hypertension and diabetes in Rwanda. It tracks vital readings across multiple clinic visits and uses a Random Forest machine learning model to predict silent kidney decline trajectories before symptoms become fatal.

## Links & Demo
- **Live Frontend (Vercel):** `https://nephrosasa-frontend.vercel.app` (Replace with your actual Vercel link)
- **Live API Backend (Render):** `https://nephrosasa-api.onrender.com/api/` (Replace with actual Render link)
- **5-Minute Demo Video:** [Click here to watch the core functionality demo](#) (Insert your video link here)

## Technology Stack
- **Frontend:** Next.js 14, TailwindCSS, TypeScript
- **Backend:** Django, Django REST Framework, scikit-learn (Python)
- **Database:** PostgreSQL (managed by Supabase)
- **Email/Alerts:** Resend API

## Installation and Setup Instructions (Step-by-Step)

### Prerequisites
- Node.js (v18+)
- Python (3.10+)
- PostgreSQL Database (or Supabase account)

### 1. Backend Setup (Django)
1. Navigate to the backend directory:
   `cd backend`
2. Create and activate a virtual environment:
   `python -m venv venv`
   `source venv/bin/activate` (Mac/Linux) or `.\venv\Scripts\activate` (Windows)
3. Install dependencies:
   `pip install -r requirements.txt`
4. Set up environment variables:
   Create a `.env` file in the `backend` folder and add your credentials:
   ```
   DATABASE_URL=postgresql://user:password@host:port/dbname
   SECRET_KEY=your_secret_key
   RESEND_API_KEY=your_resend_api_key
   ```
5. Run migrations:
   `python manage.py migrate`
6. Start the server:
   `python manage.py runserver`

### 2. Frontend Setup (Next.js)
1. Navigate to the frontend directory:
   `cd frontend`
2. Install dependencies:
   `npm install`
3. Set up environment variables:
   Create a `.env.local` file in the `frontend` folder:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   ```
4. Start the development server:
   `npm run dev`

## Related Files
- `docs/Mairo_Pedro_Isaac_NephroSasa_Rwanda_Capstone_Proposal.pdf`: Original project proposal.
- `docs/TESTING_REPORT.md`: Detailed analysis of testing results, discussion, and recommendations.
- `backend/api/ml_models/nephrosasa_model.pkl`: The trained Random Forest risk prediction model.