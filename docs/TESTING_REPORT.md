# NephroSasa Rwanda: Final Testing and Deployment Report

## 1. Testing Results

### 1.1 Demonstration of Functionality Under Different Testing Strategies

The NephroSasa platform underwent rigorous testing across multiple strategies:

**Unit Testing:** The Random Forest AI model was isolated and tested using pytest 
against known edge cases from the El Kharoua dataset, consistently maintaining its 
84.94% accuracy benchmark.

**Integration Testing:** The data flow from the Next.js frontend to the Django REST 
API was tested end-to-end, confirming that JWT authentication correctly restricted 
access and that the Supabase PostgreSQL database accurately stored longitudinal vital 
logs across multiple submissions per patient.

**System Testing:** Alert triggers were tested end-to-end. The SendGrid API 
successfully dispatches welcome emails upon patient registration and automated 
"Vitals Recorded" risk notifications after every vital submission, with the AI risk 
level (LOW, MEDIUM, or HIGH) included in the email body.

**Compatibility Testing:** The platform was tested across three device types 
(laptop, iPhone, Vivo Android) and multiple browsers (Chrome desktop, Safari iOS, 
Chrome Android) to verify responsive layout and consistent functionality across 
different hardware and software specifications.

**Functional Testing -- Home vs Clinic Mode:** The vitals form toggle was tested in 
both modes. Home Monitoring mode (3 fields) and Clinic Visit mode (10 fields) were 
each submitted and verified to produce correct AI risk scores and email alerts.

---

### 1.2 Demonstration with Different Data Values

Three patient test accounts were used with deliberately different vital profiles 
to verify the AI model's risk classification across the full LOW, MEDIUM, HIGH spectrum.

**Test Account 1 -- profitheist2 (LOW RISK, Home Mode)**
- Systolic BP: 115 mmHg
- Diastolic BP: 75 mmHg
- Fasting Blood Sugar: 4.5 mmol/L
- Result: LOW RISK confirmed, email alert received, confidence score displayed

**Test Account 2 -- profitheist3 (MEDIUM RISK, Clinic Mode)**
- Systolic BP: 160 mmHg, Diastolic BP: 100 mmHg
- Fasting Blood Sugar: 9.0 mmol/L
- HbA1c: 7.2%, Serum Creatinine: 1.4 mg/dL
- BUN: 22.0 mg/dL, eGFR: 58.0 mL/min
- Sodium: 138.0 mEq/L, Potassium: 4.2 mEq/L, Hemoglobin: 11.5 g/dL
- Result: MEDIUM RISK confirmed, email alert received, confidence score displayed

**Test Account 3 -- profitheist4 (HIGH RISK, Clinic Mode)**
- Systolic BP: 200 mmHg, Diastolic BP: 120 mmHg
- Fasting Blood Sugar: 15.0 mmol/L
- HbA1c: 10.5%, Serum Creatinine: 3.2 mg/dL
- BUN: 45.0 mg/dL, eGFR: 22.0 mL/min
- Sodium: 132.0 mEq/L, Potassium: 5.8 mEq/L, Hemoglobin: 8.5 g/dL
- Result: HIGH RISK confirmed, email alert received, confidence score displayed

All screenshots are in the testing/screenshots/ folder.

---

### 1.3 Performance on Different Hardware and Software Specifications

**Laptop (Windows 11, Chrome):** Full functionality tested including vitals 
submission, AI scoring, health history, and email alerts across all three accounts.

**iPhone (iOS, Safari):** Dashboard and health history pages verified responsive 
and functional. Risk scores displayed correctly on mobile viewport.

**Vivo Android (Android, Chrome):** Dashboard and health history pages verified 
responsive and functional. Risk scores displayed correctly on Android viewport.

**Network:** All local testing was conducted with the Django backend running on 
localhost:8000 connected directly to the production Supabase PostgreSQL database 
via DATABASE_URL. The Vercel frontend remained live throughout.

**Infrastructure Note:** The Render free tier backend was suspended on June 24, 
2026 due to monthly usage limits. All system testing was conducted on localhost 
against the live Supabase database. This is documented as a known infrastructure 
limitation. The service auto-resumes July 1, 2026.

---

## 2. Analysis

The results achieved directly align with the core objectives outlined in the 
project proposal.

**Objective Achieved -- Longitudinal Monitoring:** The system successfully connects 
vital readings across time rather than evaluating each entry in isolation. Multiple 
submissions per patient accumulate in the health history, enabling trajectory-based 
analysis as proposed. This directly addresses the monitoring gap identified by 
Nkurunziza et al. (2025).

**Objective Achieved -- AI Risk Scoring:** The Random Forest model (84.94% accuracy) 
successfully classifies kidney risk as LOW, MEDIUM, or HIGH based on submitted vitals. 
The addition of a Home vs Clinic Visit toggle means patients can now submit all 10 
clinical features from lab results, improving real-world model accuracy beyond the 
3-field baseline. When only 3 fields are submitted in Home mode, the model falls back 
to dataset median defaults for the remaining 7 features, which reduces confidence 
scores as expected and documented.

**Objective Partially Achieved -- Alert System:** Automated email alerts via 
SendGrid fire successfully after every vital submission, including the AI risk level 
in the notification. Africa's Talking SMS reminders (7-day and 14-day missed 
follow-up) are deferred to Phase 2.

**Minor Deviation -- Feature Input:** The original proposal described collecting 
10 clinical features in a single form. The implemented solution introduces a two-mode 
toggle separating home monitoring (3 fields) from clinic visits (10 fields), which 
better reflects real-world patient behavior and the actual data available to patients 
at home versus at NCD clinics.

---

## 3. Discussion

The successful implementation of NephroSasa demonstrates that proactive, 
AI-driven longitudinal kidney health tracking is technically feasible in a 
low-resource environment. As documented by Nkurunziza et al. (2025), over 240 
patients arrive at Kigali hospitals annually already at Stage 4 or 5 Chronic Kidney 
Disease because their silent progression was never monitored across visits.

NephroSasa directly addresses this gap by storing readings longitudinally and 
applying machine learning to detect worsening trajectories before symptoms appear. 
The platform costs RWF 18,000 per year to operate, compared to RWF 900,000 monthly 
for dialysis, making early detection economically accessible for Rwandan households.

The home/clinic toggle design emerged from a critical observation during development: 
patients monitoring at home with a BP cuff and glucometer cannot access HbA1c, 
serum creatinine, or GFR without a clinic blood test. Forcing all 10 fields would 
exclude the majority of home users. The toggle solves this by meeting patients where 
they are while still capturing full clinical data when available.

The Render free tier suspension during testing highlighted a real infrastructure 
limitation of zero-cost deployment for healthcare applications. A production 
deployment would require a paid hosting tier with guaranteed uptime SLAs.

---

## 4. Recommendations

### 4.1 Application of the Product

NephroSasa should be piloted within a subset of Rwanda's 30 district 
Non-Communicable Disease clinics. Nurses should be trained to input patient vitals 
into the Clinic Visit mode of NephroSasa alongside existing paper records, running 
a parallel trial of the AI risk scoring engine over a minimum 6-month period to 
validate trajectory detection against clinical outcomes.

### 4.2 Future Work

**Phase 2 (Post-Graduation, 2026):**
- Doctor dashboard with RMDC verification and patient alert system
- QR code health record sharing for cross-clinic access
- MTN Mobile Money and Airtel Money payment integration for remote consultations
- Africa's Talking SMS reminders at 7-day and 14-day intervals
- Supabase RLS security hardening across all tables

**Phase 3 (Masters Research, 2027):**
- Flutter offline mobile application for community health workers
- Bluetooth glucometer and BP cuff synchronization
- API integration with Rwandan hospital Electronic Health Record systems
- USSD interface for non-smartphone rural patients
- Formal ethical clearance from Rwanda National Ethics Committee for live 
  clinical trial measuring platform impact on patient outcomes over 12 months
- Retraining of the Random Forest model on Rwanda-specific patient data 
  following RNEC and RBC ethical clearance