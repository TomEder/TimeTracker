import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {updateProject} from '../../features/projectSlice';

const Tasks = ({route}) => {
  const {projectId} = route.params;
  const dispatch = useDispatch();

  const project = useSelector(state =>
    state.projects.projects.find(proj => proj.id === projectId),
  );

  const [taskName, setTaskName] = useState('');
  const [highlighted, setHighlighted] = useState(false);

  if (!project) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Project not found.</Text>
      </View>
    );
  }

  const handleAddTask = () => {
    if (!taskName.trim()) {
      alert('Task name cannot be empty.');
      return;
    }

    const newTask = {
      id: Date.now(),
      name: taskName.trim(),
      completed: false,
      highlighted,
    };

    const updatedTasks = [...(project.tasks || []), newTask];

    const updatedProject = {
      ...project,
      tasks: updatedTasks,
    };

    dispatch(updateProject(updatedProject));
    setTaskName('');
    setHighlighted(false);
  };

  const handleDeleteTask = taskId => {
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          const updatedTasks = project.tasks.filter(task => task.id !== taskId);

          const updatedProject = {
            ...project,
            tasks: updatedTasks,
          };

          dispatch(updateProject(updatedProject));
        },
      },
    ]);
  };

  const handleToggleHighlight = taskId => {
    const updatedTasks = project.tasks.map(task =>
      task.id === taskId ? {...task, highlighted: !task.highlighted} : task,
    );

    const updatedProject = {
      ...project,
      tasks: updatedTasks,
    };

    dispatch(updateProject(updatedProject));
  };

  const renderTaskItem = ({item}) => (
    <View style={styles.taskItem}>
      <Text style={styles.taskName}>{item.name}</Text>
      <Text>Status: {item.completed ? 'Completed' : 'Not Completed'}</Text>
      <TouchableOpacity
        onPress={() => handleToggleHighlight(item.id)}
        style={[
          styles.highlightButton,
          item.highlighted && {backgroundColor: 'green'},
        ]}>
        <Text style={styles.highlightButtonText}>
          {item.highlighted ? 'Unhighlight' : 'Highlight'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleDeleteTask(item.id)}
        style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>All Tasks</Text>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Task Name"
          value={taskName}
          onChangeText={setTaskName}
        />
        <View style={styles.highlightToggleContainer}>
          <Text>Highlight Task:</Text>
          <TouchableOpacity
            onPress={() => setHighlighted(!highlighted)}
            style={[
              styles.highlightToggleButton,
              highlighted && {backgroundColor: 'green'},
            ]}>
            <Text style={styles.highlightToggleButtonText}>
              {highlighted ? 'Yes' : 'No'}
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
          <Text style={styles.addButtonText}>Add Task</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={project.tasks || []}
        keyExtractor={item => item.id.toString()}
        renderItem={renderTaskItem}
      />
    </View>
  );
};

export default Tasks;

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    alignItems: 'center',
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  formContainer: {
    marginBottom: 20,
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: '100%',
  },
  highlightToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  highlightToggleButton: {
    marginLeft: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: 'lightgray',
  },
  highlightToggleButtonText: {
    color: 'white',
  },
  addButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  taskItem: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 8,
    width: '100%',
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  taskName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  highlightButton: {
    padding: 8,
    backgroundColor: 'lightblue',
    alignSelf: 'flex-start',
    marginTop: 8,
    borderRadius: 5,
  },
  highlightButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
});
