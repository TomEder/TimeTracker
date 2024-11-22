import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProjectHeader from './ProjectHeader';

const Project = ({route, navigation}) => {
  const {id} = route.params; // Get project ID from navigation params
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timerActive, setTimerActive] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [startTime, setStartTime] = useState(null);

  // Fetch project data from AsyncStorage
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const storedProjects = await AsyncStorage.getItem('projects');
        const projects = storedProjects ? JSON.parse(storedProjects) : [];
        const currentProject = projects.find(proj => proj.id === id);

        if (!currentProject) {
          Alert.alert('Error', 'Project not found');
          navigation.goBack();
          return;
        }

        setProject(currentProject);
      } catch (error) {
        console.error('Error fetching project:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, navigation]);

  // Update project in AsyncStorage
  const updateProject = async updatedProject => {
    try {
      const storedProjects = await AsyncStorage.getItem('projects');
      const projects = storedProjects ? JSON.parse(storedProjects) : [];

      const projectIndex = projects.findIndex(proj => proj.id === id);
      if (projectIndex !== -1) {
        projects[projectIndex] = updatedProject;
        await AsyncStorage.setItem('projects', JSON.stringify(projects));
      }

      setProject(updatedProject);
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  // Timer logic
  useEffect(() => {
    let interval;
    if (timerActive) {
      interval = setInterval(() => {
        const currentTime = new Date();
        const elapsed = Math.floor((currentTime - startTime) / 1000);
        setTimeElapsed(elapsed);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, startTime]);

  const handleStartTimer = () => {
    setStartTime(new Date());
    setTimerActive(true);
  };

  const handleStopTimer = () => {
    setTimerActive(false);

    const updatedProject = {
      ...project,
      lastSession: timeElapsed,
      todayTime: (project.todayTime || 0) + timeElapsed,
      weekTime: (project.weekTime || 0) + timeElapsed,
      monthTime: (project.monthTime || 0) + timeElapsed,
    };

    updateProject(updatedProject);
    setTimeElapsed(0);
  };

  const handleDeleteProject = async () => {
    Alert.alert(
      'Delete Project',
      'Are you sure you want to delete this project?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const storedProjects = await AsyncStorage.getItem('projects');
              const projects = storedProjects ? JSON.parse(storedProjects) : [];
              const filteredProjects = projects.filter(proj => proj.id !== id);
              await AsyncStorage.setItem(
                'projects',
                JSON.stringify(filteredProjects),
              );

              Alert.alert('Success', 'Project deleted.');
              navigation.goBack();
            } catch (error) {
              console.error('Error deleting project:', error);
              Alert.alert('Error', 'Failed to delete the project.');
            }
          },
        },
      ],
    );
  };

  const formatTime = totalSeconds => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#33B58E" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ProjectHeader project={project} onBack={() => navigation.goBack()} />
      <Text style={styles.header}>{project.name}</Text>

      {/* Timer */}
      <View style={styles.timerContainer}>
        <TouchableOpacity
          onPress={timerActive ? handleStopTimer : handleStartTimer}
          style={[
            styles.timerButton,
            {backgroundColor: timerActive ? 'red' : 'green'},
          ]}>
          <Text style={styles.timerButtonText}>
            {timerActive ? 'Stop' : 'Start'}
          </Text>
        </TouchableOpacity>
        <Text style={styles.timerText}>{formatTime(timeElapsed)}</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <Text style={styles.stat}>
          Last Session: {formatTime(project.lastSession || 0)}
        </Text>
        <Text style={styles.stat}>
          Today: {formatTime(project.todayTime || 0)}
        </Text>
        <Text style={styles.stat}>
          This Week: {formatTime(project.weekTime || 0)}
        </Text>
        <Text style={styles.stat}>
          This Month: {formatTime(project.monthTime || 0)}
        </Text>
      </View>

      {/* Actions */}
      <TouchableOpacity
        onPress={handleDeleteProject}
        style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>Delete Project</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Project;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#171718',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  timerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
  },
  timerButton: {
    padding: 15,
    borderRadius: 50,
  },
  timerButtonText: {
    fontWeight: 'bold',
  },
  timerText: {
    fontSize: 18,
  },
  statsContainer: {
    marginBottom: 20,
  },
  stat: {
    fontSize: 16,
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
