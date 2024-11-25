import {createSlice} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  projects: [],
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setProjects(state, action) {
      state.projects = action.payload;
    },
    addProject(state, action) {
      state.projects.push(action.payload);
      AsyncStorage.setItem('projects', JSON.stringify(state.projects)); // Persist to AsyncStorage
    },
    updateProject: (state, action) => {
      const index = state.projects.findIndex(
        proj => proj.id === action.payload.id,
      );
      if (index !== -1) {
        state.projects[index] = {...state.projects[index], ...action.payload};
      }
      AsyncStorage.setItem('projects', JSON.stringify(state.projects));
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
