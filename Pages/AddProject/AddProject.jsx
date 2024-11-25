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
import {useDispatch} from 'react-redux';
import {addProject} from '../../features/projectSlice';

const AddProject = () => {
  const [projectName, setProjectName] = useState('');
  const [hourlyPay, setHourlyPay] = useState('');
  const [selectedColor, setSelectedColor] = useState(null);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const colors = [
    {id: 1, colorCode: '#EF812C'},
    {id: 2, colorCode: '#33B58E'},
    {id: 3, colorCode: '#A1299F'},
    {id: 4, colorCode: '#BE0707'},
  ];

  const handleSubmit = () => {
    if (!projectName || !hourlyPay || !selectedColor) {
      Alert.alert('Error', 'Please fill in all fields and select a color.');
      return;
    }

    const newProject = {
      id: Date.now(),
      name: projectName,
      payPerHour: Number(hourlyPay),
      bgColor: selectedColor,
      lastSession: 0,
      todayTime: 0,
      weekTime: 0,
      monthTime: 0,
    };

    dispatch(addProject(newProject));

    Alert.alert('Success', 'Project added!', [
      {text: 'OK', onPress: () => navigation.navigate('Home')},
    ]);
  };

  const getColorCircleStyle = colorId => ({
    backgroundColor: colors.find(color => color.id === colorId)?.colorCode,
    borderWidth: selectedColor === colorId ? 2 : 0,
    borderColor: selectedColor === colorId ? '#000' : 'transparent',
  });

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add a New Project</Text>

      <TextInput
        placeholder="Project Name"
        value={projectName}
        onChangeText={setProjectName}
        style={styles.input}
      />

      <TextInput
        placeholder="Hourly Pay"
        value={hourlyPay}
        onChangeText={setHourlyPay}
        keyboardType="numeric"
        style={styles.input}
      />

      <Text style={styles.label}>Select a Color:</Text>
      <View style={styles.colorsContainer}>
        {colors.map(color => (
          <TouchableOpacity
            key={color.id}
            style={[styles.colorCircle, getColorCircleStyle(color.id)]}
            onPress={() => setSelectedColor(color.id)}
          />
        ))}
      </View>

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
