import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { closePanel } from "../../../../store/UiSlice"; // Adjust the import path as necessary
import { updateProject, deleteProject } from "../../../../store/projectsSlice"; // Adjust the import path as necessary
import { RootState } from "../../../../store/store"; // Adjust the import path as necessary
import { Trash2, X } from "lucide-react"; // Adjust the import path as necessary
type ProjectProperty = "name" | "goal" | "description";
export default function ProjectSettingsPanel() {
  const projectID = useSelector((state: RootState) => state.ui.openProjectId);
  const projectData = useSelector((state: RootState) =>
    projectID !== null
      ? state.projects.projects.find((p) => p.id === projectID)
      : null
  );
  console.log("ProjectSettingsPanel projectData:", projectData);
  const dispatch = useDispatch();

  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  // useRef to hold the debounce timeout ID
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const handleCloseSettings = () => {
    dispatch(closePanel());
  };
  const handleChange = (prop: ProjectProperty, value: string) => {
    // Ensure a project is selected before attempting to update
    if (projectID === null || projectData === undefined) {
      console.warn("No project selected or project data not found.");
      return;
    }

    // Clear any existing debounce timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set status to idle while typing, so no message is shown immediately
    setSaveStatus("idle");
    dispatch(
      updateProject({
        id: projectID,
        prop: prop,
        value: value,
      })
    );
    // Start a new debounce timeout
    debounceTimeoutRef.current = setTimeout(() => {
      // Set status to success and then clear it after 2 seconds
      setSaveStatus("success");
      setTimeout(() => {
        setSaveStatus("idle");
      }, 3000); // Success message visible for 2 seconds
    }, 3000); // Debounce for 3 seconds
  };

  // Cleanup the timeout when the component unmounts
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const handleDeleteProject = () => {
    if (
      window.prompt(
        `Are you sure you want to delete ${projectData?.name}?\nThen please enter the project name to confirm.`
      ) === projectData?.name
    ) {
      if (projectID !== null) {
        dispatch(deleteProject(projectID));
      } else {
        console.warn("No valid project ID to delete.");
      }
    } else {
      window.alert("Project name does not match. Deletion cancelled.");
    }
  };

  if (!projectData) {
    return (
      <div className="settingsPanelContent">
        <h2 className="settingsPanelTitle">No project selected</h2>
        <div className="settingsPanelButtonDiv">
          <button onClick={handleCloseSettings}>
            <X size="1rem" />
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="settingsPanelContent">
      <h2 className="settingsPanelTitle">{projectData.name}</h2>
      {/* Save Status Message */}
      <div className="settingsPanelStatusMessage">
        {saveStatus === "success" && (
          <p className="success">Updated {projectData.name} successfully!</p>
        )}
        {saveStatus === "error" && (
          <p className="error">Error saving changes.</p>
        )}
      </div>
      <div className="settingsPanelInputDiv">
        <label>Project Name:</label>
        <input
          type="text"
          value={projectData.name}
          onChange={(e) => {
            handleChange("name", e.target.value);
          }}
        />
      </div>
      <div className="settingsPanelInputDiv">
        <label>Project Goal:</label>
        <input
          type="text"
          value={projectData.goal}
          onChange={(e) => {
            handleChange("goal", e.target.value);
          }}
        />
      </div>
      <div className="settingsPanelInputDiv">
        <label>Project Description:</label>
        <textarea
          value={projectData.description}
          onChange={(e) => {
            handleChange("description", e.target.value);
          }}
          rows={5}
        />
      </div>

      <div className="settingsPanelButtonDiv">
        <button className="delete" onClick={handleDeleteProject}>
          {<Trash2 size={"1rem"} />}Delete
        </button>
        <button onClick={handleCloseSettings}>
          <X size="1rem" />
          Close
        </button>
      </div>
    </div>
  );
}
