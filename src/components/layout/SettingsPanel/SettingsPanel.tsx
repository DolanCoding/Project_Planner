import React from "react";
import ProjectSettingsPanel from "./ProjectSettingsPanel/ProjectSettingsPanel";
import NodeSettingsPanel from "./NodeSettingsPanel/NodeSettingsPanel";
import NoteSettingsPanel from "./NoteSettingsPanel/NoteSettingsPanel";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import "./SettingsPanel.css";

export default function SettingsPanel() {
  const type = useSelector((state: RootState) => state.ui.panelType);
  const isLeftSidebarOpen = useSelector(
    (state: RootState) => state.ui.isLeftSidebarOpen
  );
  console.log("SettingsPanel type:", type);
  if (type === "projectSettings") {
    return (
      <div
        className={`settingsPanelOverlay ${
          isLeftSidebarOpen ? "withLeftSidebar" : ""
        }`}
      >
        <ProjectSettingsPanel />
      </div>
    );
  }

  if (type === "nodeSettings") {
    return <NodeSettingsPanel />;
  }

  if (type === "noteSettings") {
    return <NoteSettingsPanel />;
  }

  return null;
}
