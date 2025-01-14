import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
  FlatList,
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
    // Handle case when project is undefined due to deletion or invalid ID
    if (!project && !loading) {
      navigation.navigate('Home');
    }
    setLoading(false);
  }, [project, navigation, loading]);

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
    if (!project) return;

    const billingPeriods = project.billingPeriods || [];
    const activeBillingPeriod = billingPeriods.find(bp => !bp.billed);

    if (!activeBillingPeriod) {
      const newBillingPeriod = {
        id: Date.now(),
        start: new Date().toISOString(),
        end: null,
        earnings: 0,
        duration: 0,
        billed: false,
      };

      const updatedProject = {
        ...project,
        billingPeriods: [...billingPeriods, newBillingPeriod],
      };

      dispatch(updateProject(updatedProject));
    }

    setStartTime(new Date());
    setTimerActive(true);
  };

  const handleStopTimer = () => {
    setTimerActive(false);

    if (project) {
      const hoursWorked = timeElapsed / 3600;
      const earnings = hoursWorked * project.payPerHour;

      const updatedBillingPeriods = project.billingPeriods.map(bp => {
        if (!bp.billed) {
          const duration = (bp.duration || 0) + timeElapsed;
          return {
            ...bp,
            earnings: (bp.earnings || 0) + earnings,
            duration,
          };
        }
        return bp;
      });

      const updatedProject = {
        ...project,
        lastSession: timeElapsed,
        todayTime: (project.todayTime || 0) + timeElapsed,
        weekTime: (project.weekTime || 0) + timeElapsed,
        monthTime: (project.monthTime || 0) + timeElapsed,
        earnings: (project.earnings || 0) + earnings,
        billingPeriods: updatedBillingPeriods,
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

  const handleBillingPeriodsPress = () => {
    navigation.navigate('BillingPeriods', {projectId: id});
  };

  const handleSeeAllTasks = () => {
    navigation.navigate('Tasks', {projectId: id});
  };

  const ToggleTaskCompleted = taskId => {
    const updatedTasks = project.tasks.map(task =>
      task.id === taskId ? {...task, completed: !task.completed} : task,
    );

    const updatedProject = {
      ...project,
      tasks: updatedTasks,
    };

    dispatch(updateProject(updatedProject));
  };

  const renderTaskItem = ({item}) => (
    <TouchableOpacity
      style={[styles.taskItem, item.completed && {backgroundColor: '#d3ffd3'}]}
      onPress={() => ToggleTaskCompleted(item.id)}>
      <Text>{item.name}</Text>
      <Text>Status: {item.completed ? 'Completed' : 'Not Completed'}</Text>
    </TouchableOpacity>
  );

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
  const highlightedTasks =
    project?.tasks?.filter(task => task.highlighted) || [];

  return (
    <View style={styles.container}>
      <ProjectHeader project={project} onBack={() => navigation.goBack()} />
      <Text style={styles.header}>{project?.name || 'Unnamed Project'}</Text>

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
        <View style={styles.statsItem}>
          <Text style={styles.stat}>Time worked</Text>
          <Text>{formatTime(project?.totalTime || 0)}</Text>
        </View>
        <View style={styles.statsItem}>
          <Text style={styles.stat}>Billing period:</Text>
          <Text>{formatTime(project?.BpTime || 0)}</Text>
        </View>
      </View>

      {/* Tasks */}
      <View style={styles.tasksContainer}>
        <Text style={styles.tasksHeader}>Highlighted Tasks</Text>
        <FlatList
          data={highlightedTasks}
          keyExtractor={item => item.id.toString()}
          renderItem={renderTaskItem}
        />
        <TouchableOpacity
          onPress={handleSeeAllTasks}
          style={styles.billingPeriodButton}>
          <Text style={styles.billingPeriodButtonText}>See all tasks</Text>
        </TouchableOpacity>
      </View>

      {/* Actions */}
      <TouchableOpacity
        onPress={handleBillingPeriodsPress}
        style={styles.billingPeriodButton}>
        <Text style={styles.billingPeriodButtonText}>
          See all billing periods
        </Text>
      </TouchableOpacity>
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
    paddingTop: 50,
    padding: 20,
    width: '100%',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 30,
    paddingRight: 30,
  },
  statsItem: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 8,
    padding: 10,
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
    color: 'white',
  },
  billingPeriodButton: {
    backgroundColor: 'blue',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  billingPeriodButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  tasksContainer: {
    marginBottom: 20,
    alignItems: 'center',
    width: 350,
  },
  tasksHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  taskItem: {
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 8,
    marginBottom: 10,
    width: '100%',
  },
});
