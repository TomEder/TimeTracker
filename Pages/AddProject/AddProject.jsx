import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddProject = () => {
  const [projectName, setProjectName] = useState('');
  const [hourlyPay, setHourlyPay] = useState('');
  const [selectedColor, setSelectedColor] = useState(null);

  const navigation = useNavigation();

  const colors = [
    {id: 1, colorCode: '#EF812C'},
    {id: 2, colorCode: '#33B58E'},
    {id: 3, colorCode: '#A1299F'},
    {id: 4, colorCode: '#BE0707'},
  ];

  const handleSubmit = async () => {
    if (!projectName || !hourlyPay || !selectedColor) {
      Alert.alert('Error', 'Please fill in all fields and select a color.');
      return;
    }

    const newProject = {
      id: Date.now(),
      name: projectName,
      payPerHour: Number(hourlyPay),
      bgColor: selectedColor,
    };

    try {
      const storedProjects = await AsyncStorage.getItem('projects');
      const projects = storedProjects ? JSON.parse(storedProjects) : [];

      projects.push(newProject);

      await AsyncStorage.setItem('projects', JSON.stringify(projects));

      Alert.alert('Success', 'Project added!', [
        {text: 'OK', onPress: () => navigation.navigate('Home')},
      ]);
      console.log('Project created: ', newProject);
    } catch (error) {
      console.error('Error saving project', error);
      Alert.alert('Failed to save project.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Add a New Project</Text>

      {/* Project Name Input */}
      <TextInput
        placeholder="Project Name"
        value={projectName}
        onChangeText={setProjectName}
        style={styles.input}
      />

      {/* Hourly Pay Input */}
      <TextInput
        placeholder="Hourly Pay"
        value={hourlyPay}
        onChangeText={setHourlyPay}
        keyboardType="numeric"
        style={styles.input}
      />

      {/* Color Selection */}
      <Text style={styles.label}>Select a Color:</Text>
      <View style={styles.colorsContainer}>
        {colors.map(color => (
          <TouchableOpacity
            key={color.id}
            style={[
              styles.colorCircle,
              {
                backgroundColor: color.colorCode,
                borderWidth: selectedColor === color.id ? 2 : 0,
                borderColor:
                  selectedColor === color.id ? '#000' : 'transparent',
              },
            ]}
            onPress={() => setSelectedColor(color.id)}
          />
        ))}
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Add Project</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddProject;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  colorsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  colorCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  button: {
    backgroundColor: '#33B58E',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
