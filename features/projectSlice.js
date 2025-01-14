import {createSlice} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  projects: [
    {
      id: 1,
      name: 'Project Name',
      tasks: [
        {id: 1, name: 'Task 1', completed: false, highlighted: true},
        {id: 2, name: 'Task 2', completed: false, highlighted: false},
      ],
      billingPeriods: [],
      // other project properties...
    },
  ],
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setProjects(state, action) {
      state.projects = action.payload;
    },
    addProject(state, action) {
      state.projects.push({
        ...action.payload,
        tasks: [], // Ensure tasks array is initialized
      });
      AsyncStorage.setItem('projects', JSON.stringify(state.projects));
    },
    updateProject(state, action) {
      const index = state.projects.findIndex(
        proj => proj.id === action.payload.id,
      );
      if (index !== -1) {
        // Get the existing tasks array first
        const existingTasks = state.projects[index].tasks || [];

        // Merge the existing project with the incoming updates
        state.projects[index] = {
          ...state.projects[index],
          ...action.payload,
          tasks: action.payload.tasks || existingTasks, // Preserve existing tasks if none provided
        };
        AsyncStorage.setItem('projects', JSON.stringify(state.projects));
      }
    },
    deleteProject(state, action) {
      state.projects = state.projects.filter(
        proj => proj.id !== action.payload,
      );
      AsyncStorage.setItem('projects', JSON.stringify(state.projects)); // Persist updates
    },
  },
});

export const {setProjects, addProject, updateProject, deleteProject} =
  projectsSlice.actions;
export default projectsSlice.reducer;
