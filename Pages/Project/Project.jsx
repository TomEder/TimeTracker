import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {updateProject, deleteProject} from '../../features/projectSlice';
import ProjectHeader from './ProjectHeader';

const Project = ({route, navigation}) => {
  const {id} = route.params; // Get project ID from navigation params
  const dispatch = useDispatch();
  const project = useSelector(state =>
    state.projects.projects.find(proj => proj.id === id),
  ); // Select the project from Redux store

  const [loading, setLoading] = useState(true);
  const [timerActive, setTimerActive] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    if (!project) {
      Alert.alert('Error', 'Project not found');
      navigation.goBack();
      return;
    }
    setLoading(false); // Simulate loading for effect
  }, [project, navigation]);

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

    if (project) {
      const updatedProject = {
        ...project,
        lastSession: timeElapsed,
        todayTime: (project.todayTime || 0) + timeElapsed,
        weekTime: (project.weekTime || 0) + timeElapsed,
        monthTime: (project.monthTime || 0) + timeElapsed,
      };

      dispatch(updateProject(updatedProject));
      setTimeElapsed(0);
    }
  };

  const handleDeleteProject = () => {
    Alert.alert(
      'Delete Project',
      'Are you sure you want to delete this project?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            dispatch(deleteProject(id));
            Alert.alert('Success', 'Project deleted.');
            navigation.goBack();
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

  const timerButtonColor = timerActive ? 'red' : 'green';

  return (
    <View style={styles.container}>
      <ProjectHeader project={project} onBack={() => navigation.goBack()} />
      <Text style={styles.header}>{project.name}</Text>

      {/* Timer */}
      <View style={styles.timerContainer}>
        <TouchableOpacity
          onPress={timerActive ? handleStopTimer : handleStartTimer}
          style={{
            ...styles.timerButton,
            backgroundColor: timerButtonColor,
          }}>
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
