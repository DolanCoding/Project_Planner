import { createSlice, PayloadAction, createAction } from "@reduxjs/toolkit";
import { Project } from "../types/project";
import { Node } from "reactflow";
import { Edge } from "reactflow";

interface ProjectsState {
  projects: Project[];
  openProjectId: string | null;
}

type UpdateProjectPayload =
  | { id: string; prop: "name"; value: string }
  | { id: string; prop: "goal"; value: string }
  | { id: string; prop: "description"; value: string };

// Load projects from localStorage if available
const saved = localStorage.getItem("projects");

function migrateNodes(nodes: any[]) {
  return nodes.map((node) => {
    // Only migrate if root-level width/height are missing but present in data
    if (
      (node.data?.width && !node.width) ||
      (node.data?.height && !node.height)
    ) {
      return {
        ...node,
        width: node.data.width ?? node.width,
        height: node.data.height ?? node.height,
      };
    }
    return node;
  });
}

const initialState: ProjectsState = {
  projects: saved
    ? JSON.parse(saved).map((project: any) => ({
        ...project,
        nodes: migrateNodes(project.nodes),
      }))
    : [
        {
          id: "0",
          name: "Project 1",
          createdAt: "25.5.2025",
          goal: "Project Alphas goal...",
          description: "Details for Project Alpha...",
          nodes: [
            {
              id: "1748191707859",
              type: "default",
              position: {
                x: -473.92675374162735,
                y: 33.70903257805463,
              },
              data: {
                label: "App",
                width: 291,
                height: 60,
                handles: [
                  {
                    id: "h1748191707859_k724ze",
                    type: "source",
                    position: "top",
                  },
                  {
                    id: "h1748191707859_3fzdht",
                    type: "source",
                    position: "top",
                  },
                ],
                color: "#2c4e22",
                borderRadius: 7,
              },
            },
            {
              id: "1748191715771",
              type: "default",
              position: {
                x: -366.4411737332318,
                y: -121.13956802531459,
              },
              data: {
                label: "Project map buttons",
                width: 256,
                height: 60,
                handles: [
                  {
                    id: "h1748191715771_qumzzu",
                    type: "source",
                    position: "top",
                  },
                  {
                    id: "h1748277788815_rycmj4",
                    type: "source",
                    position: "right",
                  },
                  {
                    id: "h1748278012935_wfeysm",
                    type: "target",
                    position: "bottom",
                  },
                ],
                borderRadius: 7,
                color: "#33417a",
              },
            },
            {
              id: "1748191715955",
              type: "default",
              position: {
                x: -658.2249263426982,
                y: -283.6672584447019,
              },
              data: {
                label: "Sidebar",
                width: 100,
                height: 60,
                handles: [
                  {
                    id: "h1748191715955_ev1xbm",
                    type: "source",
                    position: "top",
                  },
                  {
                    id: "h1748191715955_xa9ytb",
                    type: "target",
                    position: "bottom",
                  },
                ],
                color: "#33417a",
              },
            },
            {
              id: "1748191972211",
              type: "default",
              position: {
                x: -638.5065617610886,
                y: -765.0014625844873,
              },
              data: {
                label: "Project",
                width: 167,
                height: 60,
                handles: [
                  {
                    id: "h1748191972211_h3mg9s",
                    type: "target",
                    position: "bottom",
                  },
                  {
                    id: "h1748277887295_v7m1y5",
                    type: "target",
                    position: "bottom",
                  },
                ],
                borderRadius: 7,
                color: "#762828",
              },
            },
            {
              id: "1748192245235",
              type: "default",
              position: {
                x: -50.276342189371746,
                y: -434.03517689935586,
              },
              data: {
                label: "Node/Note Settings Panel",
                width: 171,
                height: 60,
                handles: [
                  {
                    id: "h1748192245235_xza500",
                    type: "source",
                    position: "top",
                  },
                  {
                    id: "h1748192245235_wwyey9",
                    type: "target",
                    position: "bottom",
                  },
                ],
                borderRadius: 7,
                color: "#33417a",
              },
            },
            {
              id: "1748209626879",
              type: "note",
              position: {
                x: -647.5,
                y: -129,
              },
              data: {
                note: "Lets you create and manage The Projects aswell as giving the Project a Goal and description.",
                width: 180,
                height: 89,
                handles: [
                  {
                    id: "h1748209626879_tpcmew",
                    type: "source",
                    position: "top",
                  },
                  {
                    id: "h1748209626879_ofj7x3",
                    type: "target",
                    position: "bottom",
                  },
                ],
                label: "",
              },
            },
            {
              id: "1748277460495",
              type: "note",
              position: {
                x: -671.6317445264888,
                y: -421.9843449602395,
              },
              data: {
                note: "Saves the Project in an Project Object",
                width: 180,
                height: 80,
                handles: [
                  {
                    id: "h1748277460495_xg5xbx",
                    type: "source",
                    position: "top",
                  },
                  {
                    id: "h1748277460495_p3jyvl",
                    type: "target",
                    position: "bottom",
                  },
                ],
                label: "",
              },
            },
            {
              id: "1748277893631",
              type: "default",
              position: {
                x: -289.33333727634715,
                y: -267.1462255351103,
              },
              data: {
                label: "Nodes",
                width: 100,
                height: 60,
                handles: [
                  {
                    id: "h1748277893631_ooirbf",
                    type: "source",
                    position: "top",
                  },
                  {
                    id: "h1748277893631_9p7b2y",
                    type: "target",
                    position: "bottom",
                  },
                ],
                color: "#33417a",
              },
            },
            {
              id: "1748277945406",
              type: "default",
              position: {
                x: -14.986754389134433,
                y: -228.63078325415339,
              },
              data: {
                label: "Notes",
                width: 100,
                height: 60,
                handles: [
                  {
                    id: "h1748277945407_1jvwgr",
                    type: "source",
                    position: "top",
                  },
                  {
                    id: "h1748277945407_6frf1r",
                    type: "target",
                    position: "bottom",
                  },
                  {
                    id: "h1748278117686_h9t0ax",
                    type: "source",
                    position: "right",
                  },
                ],
                color: "#33417a",
              },
            },
            {
              id: "1748278149118",
              type: "default",
              position: {
                x: -397.36874235773524,
                y: -533.5770767324111,
              },
              data: {
                label: "ProjectSlice (store)",
                width: 167,
                height: 60,
                handles: [
                  {
                    id: "h1748278149119_6kb2nz",
                    type: "source",
                    position: "top",
                  },
                  {
                    id: "h1748278149119_q5qnjz",
                    type: "target",
                    position: "right",
                  },
                ],
                borderRadius: 7,
                color: "#733091",
              },
            },
            {
              id: "1748278281502",
              type: "note",
              position: {
                x: -46.45107800566908,
                y: -128.31623898737814,
              },
              data: {
                note: "Lets you position a new note\n",
                width: 141,
                height: 80,
                handles: [
                  {
                    id: "h1748278281503_3svg6m",
                    type: "source",
                    position: "top",
                  },
                  {
                    id: "h1748278281503_6qczz7",
                    type: "target",
                    position: "bottom",
                  },
                ],
                label: "",
              },
            },
            {
              id: "1748278350136",
              type: "note",
              position: {
                x: -159.14065816378871,
                y: -532.5746673035165,
              },
              data: {
                note: "Lets you set width / height for both Notes and Nodes aswell as the color and label for Nodes\n",
                width: 180,
                height: 88,
                handles: [
                  {
                    id: "h1748278350136_lbvbjm",
                    type: "source",
                    position: "top",
                  },
                  {
                    id: "h1748278350136_dti7dz",
                    type: "target",
                    position: "bottom",
                  },
                ],
                label: "",
              },
            },
            {
              id: "1748278466575",
              type: "note",
              position: {
                x: -443.3407635761392,
                y: -653.3159901286415,
              },
              data: {
                note: "The changed values get saved to the Project Object by the ProjectSlice of the redux store.",
                width: 201,
                height: 80,
                handles: [
                  {
                    id: "h1748278466576_a73yk9",
                    type: "source",
                    position: "top",
                  },
                  {
                    id: "h1748278466576_z4ffte",
                    type: "target",
                    position: "bottom",
                  },
                ],
                label: "",
              },
            },
          ],
          edges: [
            {
              id: "1748192020699",
              source: "1748191707859",
              target: "1748191715955",
              sourceHandle: "h1748191707859_k724ze",
              targetHandle: "h1748191715955_xa9ytb",
              type: "default",
            },
            {
              id: "1748277666583",
              source: "1748191715955",
              target: "1748191972211",
              sourceHandle: "h1748191715955_ev1xbm",
              targetHandle: "h1748191972211_h3mg9s",
              type: "default",
            },
            {
              id: "1748277963999",
              source: "1748191715771",
              target: "1748277893631",
              sourceHandle: "h1748191715771_qumzzu",
              targetHandle: "h1748277893631_9p7b2y",
              type: "default",
            },
            {
              id: "1748277966294",
              source: "1748191715771",
              target: "1748277945406",
              sourceHandle: "h1748277788815_rycmj4",
              targetHandle: "h1748277945407_6frf1r",
              type: "default",
            },
            {
              id: "1748278024470",
              source: "1748191707859",
              target: "1748191715771",
              sourceHandle: "h1748191707859_3fzdht",
              targetHandle: "h1748278012935_wfeysm",
              type: "default",
            },
            {
              id: "1748278176470",
              source: "1748192245235",
              target: "1748278149118",
              sourceHandle: "h1748192245235_xza500",
              targetHandle: "h1748278149119_q5qnjz",
              type: "default",
            },
            {
              id: "1748278207622",
              source: "1748278149118",
              target: "1748191972211",
              sourceHandle: "h1748278149119_6kb2nz",
              targetHandle: "h1748277887295_v7m1y5",
              type: "default",
            },
            {
              id: "1748278245230",
              source: "1748277945406",
              target: "1748192245235",
              sourceHandle: "h1748277945407_1jvwgr",
              targetHandle: "h1748192245235_wwyey9",
              type: "default",
            },
            {
              id: "1748278249494",
              source: "1748277893631",
              target: "1748192245235",
              sourceHandle: "h1748277893631_ooirbf",
              targetHandle: "h1748192245235_wwyey9",
              type: "default",
            },
          ],
        },
      ],
  openProjectId: "0",
};

const generateHandleId = () =>
  `h${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setOpenProject: (state, action: PayloadAction<string | null>) => {
      state.openProjectId = action.payload;
    },
    addNewProject: (state, action: PayloadAction<Project>) => {
      state.projects.push(action.payload);
    },
    updateProject: (
      state,
      action: PayloadAction<UpdateProjectPayload> // <--- This is where it's used
    ) => {
      console.log("Update project action: ", action);
      const project = state.projects.find((p) => p.id === action.payload.id);
      if (project) {
        switch (action.payload.prop) {
          case "name":
            console.log("Updating project name");
            project.name = action.payload.value;
            break;
          case "goal":
            project.goal = action.payload.value;
            break;
          case "description":
            project.description = action.payload.value;
            break;
        }
      }
    },
    deleteProject: (state, action: PayloadAction<string>) => {
      state.projects = state.projects.filter((p) => p.id !== action.payload);
    },
    addNodeToProject: (
      state,
      action: PayloadAction<{ projectId: string; node: Node }>
    ) => {
      const project = state.projects.find(
        (p) => p.id === action.payload.projectId
      );
      if (project) {
        const minHandleSpacing = 40;
        const minWidth = Math.max(
          100,
          1 * minHandleSpacing // one top or bottom handle initially
        );
        const minHeight = Math.max(
          60,
          1 * minHandleSpacing // one left or right handle initially
        );

        interface NodeHandle {
          id: string;
          type: "source" | "target";
          position: "top" | "bottom" | "left" | "right";
          [key: string]: any;
        }

        interface NodeDataWithHandles {
          width?: number;
          height?: number;
          handles: NodeHandle[];
          [key: string]: any;
        }

        // Use root-level width/height if provided, otherwise fallback to data or minimums
        const width =
          typeof action.payload.node.width === "number"
            ? action.payload.node.width
            : Math.max(action.payload.node.data?.width || 100, minWidth);
        const height =
          typeof action.payload.node.height === "number"
            ? action.payload.node.height
            : Math.max(action.payload.node.data?.height || 60, minHeight);

        const borderRadius =
          typeof action.payload.node.data?.borderRadius === "number"
            ? action.payload.node.data.borderRadius
            : 7;

        const nodeWithDefaults: Node<NodeDataWithHandles> = {
          ...action.payload.node,
          width,
          height,
          data: {
            ...action.payload.node.data,
            width,
            height,
            borderRadius, // <-- ensure this is set!
            handles: [
              { id: generateHandleId(), type: "source", position: "top" },
              { id: generateHandleId(), type: "target", position: "bottom" },
              ...(action.payload.node.data?.handles || []).map(
                (h: Partial<NodeHandle>) => ({
                  ...h,
                  id: h.id || generateHandleId(),
                })
              ),
            ],
          },
        };
        project.nodes.push(nodeWithDefaults);
      }
    },
    updateNodePosition: (
      state,
      action: PayloadAction<{
        projectId: string;
        nodeId: string;
        position: { x: number; y: number };
      }>
    ) => {
      const project = state.projects.find(
        (p) => p.id === action.payload.projectId
      );
      if (project) {
        const node = project.nodes.find((n) => n.id === action.payload.nodeId);
        if (node) {
          node.position = action.payload.position;
        }
      }
    },
    updateNodeLabel: (
      state,
      action: PayloadAction<{
        projectId: string;
        nodeId: string;
        label: string;
        note?: string;
        width?: number;
        height?: number;
        borderRadius?: number;
      }>
    ) => {
      const project = state.projects.find(
        (p) => p.id === action.payload.projectId
      );
      if (project) {
        const node = project.nodes.find((n) => n.id === action.payload.nodeId);
        if (node) {
          // Update root-level width/height
          if (typeof action.payload.width === "number") {
            node.width = action.payload.width;
          }
          if (typeof action.payload.height === "number") {
            node.height = action.payload.height;
          }
          node.data = {
            ...node.data,
            label: action.payload.label,
            // Optionally keep width/height in data for legacy reasons
            ...(typeof action.payload.width === "number" && {
              width: action.payload.width,
            }),
            ...(typeof action.payload.height === "number" && {
              height: action.payload.height,
            }),
            ...(typeof action.payload.borderRadius === "number" && {
              borderRadius: action.payload.borderRadius,
            }),
          };
          if (action.payload.note !== undefined) {
            node.data.note = action.payload.note;
          }
        }
      }
    },

    updateNodeHandles: (
      state,
      action: PayloadAction<{
        projectId: string;
        nodeId: string;
        handles: any[];
      }>
    ) => {
      const project = state.projects.find(
        (p) => p.id === action.payload.projectId
      );
      if (project) {
        const node = project.nodes.find((n) => n.id === action.payload.nodeId);
        if (node) {
          node.data = {
            ...node.data,
            handles: action.payload.handles,
          };
        }
      }
    },

    updateNodeColor: (
      state,
      action: PayloadAction<{
        projectId: string | number;
        nodeId: string;
        color: string;
      }>
    ) => {
      const project = state.projects.find(
        (p) => p.id === action.payload.projectId
      );
      if (project) {
        const node = project.nodes.find((n) => n.id === action.payload.nodeId);
        if (node) {
          node.data = {
            ...node.data,
            color: action.payload.color,
          };
        }
      }
    },

    addEdgeToProject: (
      state,
      action: PayloadAction<{ projectId: string; edge: Edge }>
    ) => {
      const project = state.projects.find(
        (p) => p.id === action.payload.projectId
      );
      if (project) {
        project.edges.push(action.payload.edge);
      }
    },

    deleteNodeFromProject: (
      state,
      action: PayloadAction<{ projectId: string; nodeId: string }>
    ) => {
      const project = state.projects.find(
        (p) => p.id === action.payload.projectId
      );
      if (project) {
        project.nodes = project.nodes.filter(
          (n) => n.id !== action.payload.nodeId
        );
        // Optionally, remove edges connected to this node:
        project.edges = project.edges.filter(
          (e) =>
            e.source !== action.payload.nodeId &&
            e.target !== action.payload.nodeId
        );
      }
    },

    updateEdgeInProject: (
      state,
      action: PayloadAction<{
        projectId: string;
        edgeId: string;
        newSource: string;
        newTarget: string;
        newSourceHandle?: string | null;
        newTargetHandle?: string | null;
      }>
    ) => {
      const project = state.projects.find(
        (p) => p.id === action.payload.projectId
      );
      if (project) {
        const edge = project.edges.find((e) => e.id === action.payload.edgeId);
        if (edge) {
          edge.source = action.payload.newSource;
          edge.target = action.payload.newTarget;
          edge.sourceHandle = action.payload.newSourceHandle;
          edge.targetHandle = action.payload.newTargetHandle;
        }
      }
    },
    removeEdgeFromNode: (
      state,
      action: PayloadAction<{
        projectId: string;
        edgeId: string;
      }>
    ) => {
      const project = state.projects.find(
        (p) => p.id === action.payload.projectId
      );
      if (project) {
        project.edges = project.edges.filter(
          (e) => e.id !== action.payload.edgeId
        );
      }
    },
  },
});

export const {
  setOpenProject,
  addNewProject,
  updateProject,
  deleteProject,
  addNodeToProject,
  updateNodePosition,
  updateNodeLabel,
  updateNodeHandles,
  updateNodeColor,
  addEdgeToProject,
  deleteNodeFromProject,
  updateEdgeInProject,
  removeEdgeFromNode,
} = projectsSlice.actions;
export default projectsSlice.reducer;
