import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  incident_details: {
    incident_id: '',
    title: '',
    description: '',
    product_intermediate: '',
    batch_lot_no: '',
    process_stage: '',
    equipment_id: '',
    date_time_occurrence: '',
    reported_by: '',
    area_department: '',
    immediate_action_taken: '',
    impact_assessment: '',
    severity: 'Major',
  },
  risk_assessment: {
    severity: 'Major',
    product_patient_impact: '',
    batch_disposition: 'Hold / Quarantine',
    next_recommended_action: '',
    reasoning: '',
  },
  evidence_available: [],
  missing_evidence: [],
  five_whys: [],
  fishbone: {
    man: [],
    machine: [],
    method: [],
    material: [],
    measurement: [],
    environment: [],
  },
  root_cause_candidates: [],
  capa_recommendations: [],
  active_tab: '5whys', // '5whys' | 'fishbone'
  last_updated_fields: [],
  active_investigation_id: null,
  status: 'IN_PROGRESS',
  has_extracted: false,
  saved_investigations: [],
  toast: null,
};

export const investigationSlice = createSlice({
  name: 'investigation',
  initialState,
  reducers: {
    setFullState: (state, action) => {
      const { newState, changedFields } = action.payload;
      if (newState.incident_details) state.incident_details = { ...state.incident_details, ...newState.incident_details };
      if (newState.risk_assessment) state.risk_assessment = { ...state.risk_assessment, ...newState.risk_assessment };
      if (newState.evidence_available) state.evidence_available = newState.evidence_available;
      if (newState.missing_evidence) state.missing_evidence = newState.missing_evidence;
      if (newState.five_whys && newState.five_whys.length > 0) state.five_whys = newState.five_whys;
      if (newState.fishbone) state.fishbone = newState.fishbone;
      if (newState.root_cause_candidates && newState.root_cause_candidates.length > 0) state.root_cause_candidates = newState.root_cause_candidates;
      if (newState.capa_recommendations && newState.capa_recommendations.length > 0) state.capa_recommendations = newState.capa_recommendations;
      
      state.last_updated_fields = changedFields || [];
      state.has_extracted = true;
    },
    setActiveTab: (state, action) => {
      state.active_tab = action.payload;
    },
    clearUpdatedFields: (state) => {
      state.last_updated_fields = [];
    },
    updateRootCauseStatus: (state, action) => {
      const { id, status, confirmed_by, confirmed_at } = action.payload;
      const rc = state.root_cause_candidates.find((r) => r.id === id);
      if (rc) {
        rc.status = status;
        if (confirmed_by) rc.confirmed_by = confirmed_by;
        if (confirmed_at) rc.confirmed_at = confirmed_at;
      }
      state.last_updated_fields = ['root_cause_candidates'];
    },
    updateCapaStatus: (state, action) => {
      const { id, status } = action.payload;
      const capa = state.capa_recommendations.find((c) => c.id === id);
      if (capa) {
        capa.status = status;
      }
      state.last_updated_fields = ['capa_recommendations'];
    },
    resetInvestigation: (state) => {
      return {
        ...initialState,
        saved_investigations: state.saved_investigations,
      };
    },
    setSavedInvestigations: (state, action) => {
      state.saved_investigations = action.payload;
    },
    setActiveInvestigationId: (state, action) => {
      state.active_investigation_id = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setToast: (state, action) => {
      state.toast = action.payload;
    },
  },
});

export const {
  setFullState,
  setActiveTab,
  clearUpdatedFields,
  updateRootCauseStatus,
  updateCapaStatus,
  resetInvestigation,
  setSavedInvestigations,
  setActiveInvestigationId,
  setStatus,
  setToast,
} = investigationSlice.actions;

export default investigationSlice.reducer;
