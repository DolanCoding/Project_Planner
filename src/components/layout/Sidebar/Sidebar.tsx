import "./Sidebar.css"; // Import your CSS styles
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux"; // Import useDispatch and useSelector
import { RootState } from "../../../store/store"; // Import RootState
import { setOpenProject, addNewProject } from "../../../store/projectsSlice"; // Example corrected path
import { setPanel, toggleSidebar, closePanel } from "../../../store/UiSlice"; // Corrected import path for UiSlice
import {
  ChevronUp,
  ChevronDown,
  Trash2,
  Plus,
  Settings,
  ChevronRight,
} from "lucide-react"; // Added ChevronRight
import { Project } from "../../../types/project"; // Import your Project type

export default function Sidebar() {
  // State to manage the collapsed state of the sidebar (vertical collapse)
  const isExpanded = useSelector(
    (state: RootState) => state.ui.isLeftSidebarOpen
  );
  // Use useSelector to get the list of projects
  const projects = useSelector((state: RootState) => state.projects.projects);
  // Use useSelector to get the currently open project ID
  const openProjectId = useSelector(
    (state: RootState) => state.projects.openProjectId
  );

  const dispatch = useDispatch(); // Assuming you are using Redux for state management
  // State for managing the list of projects (using local state for demonstration)
  const handleSidebarToggle = () => {
    dispatch(toggleSidebar()); // Dispatch action to toggle sidebar
    // Close any open panels if sidebar is collapsed
  };

  const handleAddNewProject = () => {
    const newProject = {
      id: Date.now().toString(), // Simple ID generation for demonstration
      name: `Project ${projects.length + 1}`,
      createdAt: new Date().toLocaleDateString(),
      goal: `Goal for Project ${projects.length + 1}`,
      description: `Details for Project ${projects.length + 1}...`,
      nodes: [],
      edges: [],
    };
    dispatch(addNewProject(newProject)); // Dispatch action to add new project
  };

  const handleOpenProjectSettings = (project: Project) => {
    console.log("Dispatching set panel with project:", project);
    dispatch(setPanel({ type: "projectSettings", itemId: project.id }));
  };

  const openProject = (id: string) => {
    dispatch(closePanel());
    dispatch(setOpenProject(id));
  };
  return (
    <>
      {/* Sidebar container */}
      <div className={`sidebar-container ${!isExpanded ? "collapsed" : ""}`}>
        {/* Sidebar Content - visible based on parent height/opacity */}
        <h2>Projects</h2>
        <button
          onClick={() => handleAddNewProject()}
          className={"sidebar-add-button"}
        >
          <Plus className={"sidebar-add-icon"} size={"1.5rem"} />
          New project
        </button>
        <div className={"sidebar-list-wrapper"}>
          <nav className={"sidebar-nav"}>
            <ul className={"sidebar-list"}>
              {/* Map through projects and create list items */}
              {projects.map((project) => (
                <li
                  // Add a class 'active' if this project's ID matches the openProjectId
                  className={`sidebar-list-item ${
                    project.id === openProjectId ? "selected" : ""
                  }`}
                  onClick={(e) => openProject(project.id)}
                  key={project.id}
                >
                  <div className={"sidebar-list-item-text-content"}>
                    <button className={"sidebar-list-item-label"}>
                      {project.name}
                    </button>
                    <p>Created: {project.createdAt}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent <li> click!
                      handleOpenProjectSettings(project);
                    }}
                    className={"sidebar-list-item-icons"}
                  >
                    <Settings size={"1rem"} />
                    <ChevronRight size={"1rem"} />
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Toggle Button Container - always visible at the bottom */}
        <div className="toggle-handle-container">
          <button
            onClick={handleSidebarToggle}
            className="toggle-button"
            aria-label={isExpanded ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {/* Icon changes based on collapsed state */}
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>
    </>
  );
}
