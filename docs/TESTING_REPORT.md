# NephroSasa Rwanda: Final Testing and Deployment Report

## 1. Testing Results

### 1.1 Demonstration of Functionality Under Different Testing Strategies
The NephroSasa platform underwent rigorous testing across multiple strategies to ensure reliability and accuracy:
- **Unit Testing:** The Random Forest AI model was isolated and tested using `pytest` against known edge cases from the El Kharoua dataset, consistently maintaining its 84.94% accuracy benchmark.
- **Integration Testing:** We tested the data flow from the Next.js frontend to the Django REST API, confirming that JWT authentication correctly restricted access, and that the Supabase PostgreSQL database accurately stored longitudinal vital logs.
- **System Testing:** The alert triggers were tested end-to-end. We verified that the Resend API successfully dispatches welcome emails upon patient registration and automated risk notifications when a high-risk trajectory is detected by the model.

### 1.2 Demonstration with Different Data Values
The system was evaluated using diverse patient profiles:
- **Baseline Data (Low Risk):** A test profile with `SystolicBP: 120`, `FastingBloodSugar: 90`, and `GFR: 100`. The model correctly returned a "LOW" risk score with high confidence.
- **Elevated Data (Medium Risk):** A profile representing early hypertension (`SystolicBP: 140`, `HbA1c: 6.2`). The system correctly logged the trajectory shift and returned a "MEDIUM" risk.
- **Critical Data (High Risk):** A profile representing uncontrolled Type 2 Diabetes (`FastingBloodSugar: 180`, `GFR: 55`). The system flagged the entry as "HIGH" risk and successfully triggered the simulated Nephrologist alert workflow.

### 1.3 Performance on Different Specifications
- **Hardware Agnostic:** Because the intensive ML processing is handled server-side via the Render backend, the platform runs seamlessly on low-specification hardware, including older smartphones and rural clinic desktops.
- **Software/Network:** The Next.js frontend is optimized for slow 3G networks typical in rural Rwanda, utilizing aggressive caching and minimal payload sizes. 

---

## 2. Analysis

The results achieved directly align with the core objectives outlined in the project proposal. 
- **Objective Achieved (Longitudinal Monitoring):** We successfully shifted away from isolated vital checks. The system successfully connects readings across time, proving the viability of our Stage 1 to Stage 3a pre-dialysis intervention window.
- **Objective Achieved (AI Risk Scoring):** The Random Forest model successfully replaced generic clinical heuristics, providing an active, predictive mechanism that alerts patients to silent kidney decline.
- **Minor Deviation:** While the primary focus was on SMS alerts via Africa's Talking API, we pivoted to utilizing Resend for reliable email infrastructure during the capstone phase to ensure stable cross-platform communication during the demonstration.

---

## 3. Discussion

The successful deployment of NephroSasa marks a critical milestone in addressing Rwanda's kidney care gap. As documented by Nkurunziza et al. (2025), over 240 patients arrive at Kigali hospitals annually already at Stage 4 or 5 Chronic Kidney Disease because their silent progression was never monitored.

By successfully deploying this platform, we have demonstrated that proactive, AI-driven longitudinal tracking is not just clinically sound, but technically feasible in a low-resource environment. The ability to run this system across district NCD clinics could fundamentally shift Rwanda's nephrology approach from expensive, late-stage dialysis (costing RWF 900,000 monthly) to affordable, early-stage prevention.

---

## 4. Recommendations

### 4.1 Application of the Product
We recommend that the NephroSasa platform be piloted within a subset of Rwanda's 30 district Non-Communicable Disease (NCD) clinics. Nurses should be trained to input patient vitals into NephroSasa alongside their existing paper records to run a parallel trial of the AI risk scoring engine.

### 4.2 Future Work
- **Integration with Hospital EHRs:** The next development phase must focus on building API bridges between NephroSasa and existing Rwandan hospital Electronic Health Record systems to eliminate double data entry for nurses.
- **USSD / Offline Functionality:** To truly reach the most vulnerable rural populations, the platform must be expanded beyond a web interface to include a USSD interface that works on non-smartphones without internet access.
- **Clinical Trials:** Formal ethical clearance from the Rwanda National Ethics Committee (RNEC) must be secured to conduct a live clinical trial measuring the platform's impact on actual patient outcomes over a 12-month period.
