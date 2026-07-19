# NephroSasa Rwanda: Final Testing and Deployment Report

## 1. Testing Results

### 1.1 Demonstration of Functionality Under Different Testing Strategies

The NephroSasa platform underwent rigorous testing across multiple strategies:

**Unit Testing:** The Random Forest AI model was isolated and tested using pytest 
against known edge cases from the El Kharoua dataset, consistently maintaining its 
84.94% accuracy benchmark.

**Integration Testing:** 18 automated integration tests (Django REST Framework's 
APITestCase, isolated test database) cover authentication, vitals logging with 
AI scoring, doctor registration, QR sharing, and consultation flows — see Section 
1.1.1 for full detail. Manual full-stack verification (frontend to backend to 
database) was also conducted, confirming JWT authentication correctly restricted 
access and that Supabase accurately stored longitudinal vital logs across multiple 
submissions per patient — documented as system testing below.

**System Testing:** Alert triggers were tested end-to-end. The SendGrid API 
successfully dispatches welcome emails upon patient registration and automated 
"Vitals Recorded" risk notifications after every vital submission, with the AI risk 
level (LOW, MEDIUM, or HIGH) included in the email body.

**Compatibility Testing:** The platform was tested on laptop (Windows 11, Chrome) 
and via Chrome DevTools device emulation simulating iPhone and Samsung viewports, 
to verify responsive layout and consistent functionality across different screen 
sizes. See Section 1.3 for full detail on this testing method and its limitations.

**Functional Testing -- Home vs Clinic Mode:** The vitals form toggle was tested in 
both modes. Home Monitoring mode (3 fields) and Clinic Visit mode (10 fields) were 
each submitted and verified to produce correct AI risk scores and email alerts.

---

### 1.1.1 Automated Testing (CI/CD)

In addition to the manual testing described above, an automated test suite 
runs via GitHub Actions on every push to the main branch:

- **Unit tests (4):** AI model risk-label boundaries, representative clinical 
  profiles, edge cases on GFR/Serum Creatinine, and reproduction of the 
  84.94% accuracy benchmark.
- **Integration tests (18):** Django REST Framework APITestCase coverage of 
  authentication, vitals logging + AI scoring trigger, health history, QR 
  generation and scanning, doctor registration/verification, consultation 
  booking and confirmation, and doctor profile updates.

All 22 tests execute automatically against an isolated test database on 
every push. Workflow: .github/workflows/tests.yml

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

**Mobile Responsiveness (Chrome DevTools Device Simulation):** Dashboard and 
health history pages were verified using Chrome DevTools' device emulation mode, 
simulating iPhone and Samsung viewport dimensions. Layout, navigation, and risk 
score display were confirmed responsive and functional across both simulated 
device profiles. This method tests viewport-based responsive CSS behavior but 
does not verify device-specific browser engine quirks (e.g. actual Safari iOS 
rendering), which is noted as a limitation for future physical device testing.

**Network:** All local testing was conducted with the Django backend running on 
localhost:8000 connected directly to the production Supabase PostgreSQL database 
via DATABASE_URL. The Vercel frontend remained live throughout.

**Infrastructure Note:** The Render free tier backend was suspended on June 24, 
2026 due to monthly usage limits. All system testing was conducted on localhost 
against the live Supabase database. This is documented as a known infrastructure 
limitation. The service auto-resumes July 1, 2026.

---

### 1.4 Doctor and Consultation Feature Testing

Beyond the core AI risk scoring workflow, the doctor-facing and consultation 
features were tested end-to-end using the isaacmairopedro@gmail.com doctor 
account (RMDC/2024/0988, manually verified via Django admin) alongside the 
three patient test accounts.

**Doctor Registration and Verification:** Doctor registration with RMDC number 
was tested, confirming the account defaults to unverified until manually 
approved in Django admin, at which point the doctor dashboard unlocks full 
functionality.

**QR Code Sharing:** Patient QR code generation and doctor-side scanning were 
tested together, confirming a doctor scanning a patient's QR code correctly 
saves that patient to the doctor's My Patients list and grants access to the 
patient's shared health record.

**Consultation Booking and Scheduling:** A full booking cycle was tested: a 
patient booked both a Virtual Session and an In-Person Visit with the verified 
doctor, the doctor confirmed each request from the Schedule page, and for the 
Virtual Session the doctor added a Google Meet session link. The confirmed 
status and session link were both verified to display correctly on the 
patient's Consultancy page, including a working Join Meeting button.

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
- Africa's Talking SMS reminders (7-day and 14-day missed follow-up intervals)
- MTN Mobile Money and Airtel Money payment integration for remote consultations
- Supabase RLS security hardening across all tables
- Doctor profile editing (name, phone number, specialty)
- Doctor RMDC verification workflow: currently requires manual approval via Django admin panel. A dedicated admin verification interface is deferred to Phase 2.

**Phase 3 (Masters Research, 2027):**
- Flutter offline mobile application for community health workers
- Bluetooth glucometer and BP cuff synchronization
- API integration with Rwandan hospital Electronic Health Record systems
- USSD interface for non-smartphone rural patients
- Formal ethical clearance from Rwanda National Ethics Committee for live 
  clinical trial measuring platform impact on patient outcomes over 12 months
- Retraining of the Random Forest model on Rwanda-specific patient data 
  following RNEC and RBC ethical clearance