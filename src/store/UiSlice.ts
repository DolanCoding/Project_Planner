import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UiState {
  isLeftSidebarOpen: boolean;
  isRightSidebarOpen: boolean;
  isPanelOpen: boolean;
  panelType: string | null;
  openProjectId: string | null;
  openNodeId: string | null;
  openEdgeId: string | null;
}

const inititalState: UiState = {
  isLeftSidebarOpen: true,
  isRightSidebarOpen: false,
  isPanelOpen: false,
  panelType: null,
  openProjectId: null,
  openNodeId: null,
  openEdgeId: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState: inititalState,
  reducers: {
    toggleSidebar: (state) => {
      state.isLeftSidebarOpen = !state.isLeftSidebarOpen;
    },
    setPanel: (
      state,
      action: PayloadAction<{ type: string; itemId: string }>
    ) => {
      state.isPanelOpen = true;
      state.panelType = action.payload.type;
      switch (action.payload.type) {
        case "projectSettings":
          console.log("Opening settings for project:", action.payload.itemId);

          state.openProjectId = action.payload.itemId;
          break;
        case "nodeSettings":
          state.openNodeId = action.payload.itemId;
          state.isRightSidebarOpen = true;
          break;
        case "noteSettings": // <-- Add this line
          state.openNodeId = action.payload.itemId;
          state.isRightSidebarOpen = true;
          break;
      }
    },
    closePanel: (state) => {
      state.isPanelOpen = false;
      state.panelType = null;
      state.openProjectId = null;
      state.openNodeId = null;
      state.openEdgeId = null;
      state.isRightSidebarOpen = false;
    },
  },
});

export const { toggleSidebar, setPanel, closePanel } = uiSlice.actions;
export default uiSlice.reducer;
