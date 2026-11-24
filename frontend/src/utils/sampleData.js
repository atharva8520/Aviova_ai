export const FALLBACK_SAMPLE_INVESTIGATION = {
  incident_details: {
    incident_id: "DEV-2026-0881",
    title: "OOS Impurity D (0.28%) during Atorvastatin Calcium Crystallization",
    description: "During final crystallization of Atorvastatin Calcium Batch ATC-26-088, crystallization temperature spiked to 28.5 deg C (spec 12.0-16.0 deg C) for 42 minutes. In-process HPLC showed Related Substance Impurity D at 0.28% against specification NMT 0.15%.",
    product_intermediate: "Atorvastatin Calcium Trihydrate API",
    batch_lot_no: "ATC-26-088",
    process_stage: "Final Stage Crystallization & Isolation",
    equipment_id: "Crystallizer Tank CR-104 & Chilling Unit CU-02",
    date_time_occurrence: "2026-10-14 06:30 IST",
    reported_by: "Dr. Rajesh Sharma (Lead Production Executive)",
    area_department: "API Production Block 4 / Synthesis & Purification",
    immediate_action_taken: "Halted crystallization, engaged manual secondary brine cooling, quarantined batch in CR-104 with QA tamper-evident locks, and isolated downstream centrifuge CF-04.",
    impact_assessment: "Batch ATC-26-088 fails CQA for Related Substance Impurity D (0.28% vs NMT 0.15%). Critical risk to drug substance purity and stability profile.",
    severity: "Major"
  },
  risk_assessment: {
    severity: "Major",
    product_patient_impact: "Direct impact on API chemical purity and potential patient exposure to elevated diastereomeric degradant. Fails USP/Ph. Eur. monograph specification.",
    batch_disposition: "Quarantine / Hold (Tamper-evident seal applied; reject or reprocessing validation required)",
    next_recommended_action: "Execute Root Cause Analysis (RCA) on Chilling Unit CU-02 valve failure, inspect thermocouple TT-104A calibration, and initiate HPLC confirmatory re-testing.",
    reasoning: "Under ICH Q7 Section 13 (Rejection and Re-use of Materials) and 21 CFR 211.192, an out-of-specification impurity excursion in an active pharmaceutical ingredient requires a thorough QA investigation extending to other potentially affected batches sharing the same equipment or cooling utility."
  },
  evidence_available: [
    {
      id: "EV-01",
      description: "SCADA Temperature Trend Log showing temperature overshoot from 14.1 deg C to 28.5 deg C over 42 min",
      source: "SCADA Historian Block 4 / TT-104A",
      category: "Process Utility Log",
      verified: true
    },
    {
      id: "EV-02",
      description: "In-process HPLC chromatogram showing Impurity D peak area of 0.28%",
      source: "QC HPLC System-08 / Report #QC-AR-2026-9921",
      category: "Analytical Report",
      verified: true
    },
    {
      id: "EV-03",
      description: "Chilling Unit CU-02 pneumatic solenoid valve actuation log indicating mechanical stick-slip",
      source: "Plant Maintenance DCS Log",
      category: "Equipment Maintenance",
      verified: true
    },
    {
      id: "EV-04",
      description: "Thermocouple TT-104A calibration certificate expired 18 days prior to batch processing",
      source: "Instrumentation Metrology Record",
      category: "Metrology / Calibration",
      verified: true
    }
  ],
  missing_evidence: [
    {
      id: "GAP-01",
      gap: "Secondary brine supply header pressure and flow rate logs during 05:00 - 07:00 window",
      priority: "High",
      why_needed: "Determine whether utility supply loss was isolated to CR-104 or a facility-wide cooling tower failure (ICH Q7 Section 4.2)",
      status: "Pending"
    },
    {
      id: "GAP-02",
      gap: "Historical trend analysis of Impurity D across previous 20 batches of Atorvastatin",
      priority: "Medium",
      why_needed: "Assess process capability (Cpk) and rule out starting raw material lot variation",
      status: "Pending"
    },
    {
      id: "GAP-03",
      gap: "Solvent purity certificate of analysis (Methanol / Ethyl Acetate) used in batch ATC-26-088",
      priority: "Low",
      why_needed: "Rule out acid-catalyzed degradation caused by raw material solvent acidity",
      status: "Pending"
    }
  ],
  five_whys: [
    {
      step: 1,
      question: "Why did Batch ATC-26-088 fail the Impurity D specification (0.28% vs NMT 0.15%)?",
      answer: "The crystallizing slurry experienced an uncontrolled temperature excursion up to 28.5 deg C for 42 minutes, favoring kinetic formation of the diastereomer impurity.",
      evidence: "In-process HPLC QC-AR-2026-9921 & Reaction kinetics validation dossier",
      confidence: "High"
    },
    {
      step: 2,
      question: "Why did the slurry temperature rise from the 12-16 deg C setpoint to 28.5 deg C?",
      answer: "The secondary chilled brine circulation through Crystallizer CR-104 cooling jacket stopped flowing during the exothermic seed crystal growth phase.",
      evidence: "SCADA Historian Channel TT-104A and flow transmitter FT-104",
      confidence: "High"
    },
    {
      step: 3,
      question: "Why did the chilled brine circulation stop flowing?",
      answer: "The pneumatic control valve CV-104 on the brine supply line jammed in the 8% open position due to actuator diaphragm seal stiffening and moisture in instrument air.",
      evidence: "Maintenance physical teardown report for valve CV-104",
      confidence: "High"
    },
    {
      step: 4,
      question: "Why did the pneumatic control valve stick and fail to respond to the SCADA cooling demand?",
      answer: "Desiccant dryer DD-02 on the compressed instrument air supply had saturated, allowing water condensate into the pneumatic positioner pilot port.",
      evidence: "Utility air dewpoint log showing +4 deg C vs specification -40 deg C",
      confidence: "Medium"
    },
    {
      step: 5,
      question: "Why was the saturated desiccant dryer not detected or replaced before causing valve failure?",
      answer: "Preventive maintenance frequency for air dryer desiccant was set to quarterly instead of monthly based on seasonal high-humidity monsoon conditions, with no automated online dewpoint alarm interlock.",
      evidence: "Preventive Maintenance SOP PM-UT-042 and maintenance work order history",
      confidence: "High"
    }
  ],
  fishbone: {
    man: [
      { id: "F-MAN-1", text: "Operator delayed manual backup cooling switchover by 14 minutes", is_root_cause: false },
      { id: "F-MAN-2", text: "Shift handover did not highlight instrument air dewpoint drift", is_root_cause: false }
    ],
    machine: [
      { id: "F-MAC-1", text: "Pneumatic valve CV-104 actuator stuck due to moisture condensation in pilot port", is_root_cause: true },
      { id: "F-MAC-2", text: "Instrument air dryer DD-02 desiccant saturated without automatic alarm", is_root_cause: true },
      { id: "F-MAC-3", text: "Thermocouple TT-104A had 18-day overdue calibration drift (+1.2 deg C)", is_root_cause: false }
    ],
    method: [
      { id: "F-MET-1", text: "PM frequency for air dryer not adjusted for monsoon ambient humidity", is_root_cause: true },
      { id: "F-MET-2", text: "Alarm limits for jacket return temperature not configured on SCADA primary view", is_root_cause: false }
    ],
    material: [
      { id: "F-MAT-1", text: "Starting raw material met monograph specifications", is_root_cause: false },
      { id: "F-MAT-2", text: "Chilled brine glycol concentration (35% w/w) was within specification", is_root_cause: false }
    ],
    measurement: [
      { id: "F-MEA-1", text: "HPLC method validated and system suitability passed (RSD 0.6%)", is_root_cause: false },
      { id: "F-MEA-2", text: "No continuous online dew point monitoring sensor downstream of dryer DD-02", is_root_cause: true }
    ],
    environment: [
      { id: "F-ENV-1", text: "Unusually high ambient relative humidity (94%) during monsoon week in plant", is_root_cause: false },
      { id: "F-ENV-2", text: "Block 4 utility bay ambient temperature elevated to 38 deg C", is_root_cause: false }
    ]
  },
  root_cause_candidates: [
    {
      id: "RC-01",
      cause: "Moisture contamination in instrument air caused pneumatic valve CV-104 to seize, cutting off crystallizer jacket chilling.",
      category: "Equipment / Machine",
      likelihood: "High",
      supporting_evidence: "Maintenance valve teardown found water droplets in positioner pilot chamber; air dewpoint log was +4 deg C (limit -40 deg C).",
      classification: "Probable Root Cause",
      status: "AI Suggested",
      confirmed_by: null,
      confirmed_at: null
    },
    {
      id: "RC-02",
      cause: "Inadequate preventive maintenance frequency for instrument air desiccant dryer during high humidity season without online dew point alarm interlock.",
      category: "Maintenance / Method",
      likelihood: "High",
      supporting_evidence: "SOP PM-UT-042 specifies quarterly change; desiccant was last inspected 82 days ago under 90%+ ambient relative humidity.",
      classification: "Probable Root Cause",
      status: "AI Suggested",
      confirmed_by: null,
      confirmed_at: null
    },
    {
      id: "RC-03",
      cause: "Thermocouple TT-104A calibration drift (+1.2 deg C) delayed operator detection of crystallizer jacket temperature rise.",
      category: "Measurement / Metrology",
      likelihood: "Medium",
      supporting_evidence: "Calibration certificate expired 18 days prior; post-incident check revealed 1.2 deg C offset.",
      classification: "Contributing Factor",
      status: "AI Suggested",
      confirmed_by: null,
      confirmed_at: null
    }
  ],
  capa_recommendations: [
    {
      id: "CAPA-01",
      type: "Correction",
      action: "Dismantle, clean, re-seat, and rebuild pneumatic valve CV-104 positioner; flush airline with dry nitrogen and replace dryer DD-02 desiccant bed.",
      rationale: "Directly eliminates active moisture blockage and restores crystallizer chilling capability for CR-104.",
      linked_root_cause: "RC-01",
      owner_role: "Lead Instrumentation Engineer",
      due_window: "7 Days",
      effectiveness_check: "Zero stiction in stroke test and leak rate check of valve CV-104 under 6 bar operating pressure.",
      status: "Suggested"
    },
    {
      id: "CAPA-02",
      type: "Corrective Action",
      action: "Revise SOP PM-UT-042 to establish dynamic monthly desiccant changeouts during monsoon months (June-October) and install an inline continuous dew point transmitter with automated SCADA low-threshold alarm (-30 deg C).",
      rationale: "Prevents recurring moisture intrusion into pneumatic actuators across all Block 4 synthesis reactors.",
      linked_root_cause: "RC-02",
      owner_role: "Utility Engineering Manager & QA Change Control",
      due_window: "30 Days",
      effectiveness_check: "Verification of continuous dew point monitoring below -35 deg C across 60 days of plant operations without airline water condensation.",
      status: "Suggested"
    },
    {
      id: "CAPA-03",
      type: "Preventive Action",
      action: "Implement SCADA rate-of-change temperature alarms on all API crystallization vessels and recalibrate all expired and near-due temperature sensors across Block 4.",
      rationale: "Provides immediate early-warning notification to operators if temperature deviates more than 1.5 deg C/min, preventing prolonged thermal excursions.",
      linked_root_cause: "RC-03",
      owner_role: "Automation Engineering Lead & Metrology QA",
      due_window: "45 Days",
      effectiveness_check: "Audit of 100% calibration compliance for all critical process parameter (CPP) instruments in Block 4 with automated computerized calibration lockouts.",
      status: "Suggested"
    }
  ],
  active_tab: "5whys",
  last_updated_fields: [
    "incident_details",
    "risk_assessment",
    "evidence_available",
    "missing_evidence",
    "five_whys",
    "fishbone",
    "root_cause_candidates",
    "capa_recommendations"
  ]
};
