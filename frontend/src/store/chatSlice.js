import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [
    {
      id: 'welcome-1',
      role: 'assistant',
      content: 'Welcome to the **API Pharmaceutical RCA Copilot**. I assist quality assurance and production teams in investigating deviations under ICH Q7 & 21 CFR 211.192.\n\nYou can:\n- **Paste deviation text** or **upload an incident report / email (PDF, TXT, EML)**.\n- Click **"Load Sample Incident"** to explore a real crystallization OOS investigation.\n- Run **5 Whys & Fishbone RCA**, **Missing Evidence Analysis**, and **CAPA Recommendations**.\n- Dictate field updates in natural language (e.g., *"Change batch number to ATC-26-092"*).',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tool_badge: null,
    },
  ],
  isLoading: false,
  activeTool: null,
  selectedFile: null,
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setActiveTool: (state, action) => {
      state.activeTool = action.payload;
    },
    setSelectedFile: (state, action) => {
      state.selectedFile = action.payload;
    },
    clearChat: (state) => {
      state.messages = [initialState.messages[0]];
    },
  },
});

export const {
  addMessage,
  setLoading,
  setActiveTool,
  setSelectedFile,
  clearChat,
} = chatSlice.actions;

export default chatSlice.reducer;
