// Redux Imports
import { useSelector } from "react-redux";
import { RootState } from "./store/store";

// Import Components
import Sidebar from "./components/layout/Sidebar/Sidebar";
import ProjectMap from "./components/layout/ProjectMap/ProjectMap";
import SettingsPanel from "@components/layout/SettingsPanel/SettingsPanel";

// Import Styles
import "./App.css";

// Import Types
import { useEffect } from "react";
import { ReactFlowProvider } from "reactflow";

function App() {
  const isPanelOpen = useSelector((state: RootState) => state.ui.isPanelOpen);
  const projects = useSelector((state: RootState) => state.projects.projects);

  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects));
  }, [projects]);

  return (
    <ReactFlowProvider>
      <div className="App">
        <Sidebar />
        {isPanelOpen && <SettingsPanel />}
        {/* Main content area */}
        <ProjectMap />
      </div>
    </ReactFlowProvider>
  );
}

export default App;
