import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = ({navigation}) => {
  const [projects, setProjects] = useState([]);

  //Fetch projects from AsyncStorage
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const storedProjects = await AsyncStorage.getItem('projects');
        if (storedProjects) {
          setProjects(JSON.parse(storedProjects));
        }
      } catch (error) {
        console.error('Error fetching projects', error);
        Alert.alert('Error', 'Failed to load projects');
      }
    };
    const unsubscribe = navigation.addListener('focus', fetchProjects);
    return unsubscribe;
  }, [navigation]);

  const renderProjectItem = ({item}) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('Project', {id: item.id})}>
      <View style={Styles.listItem}>
        <Text style={Styles.title}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  const handleProjectPress = projectID => {
    navigation.navigate('Project', {id: projectID});
    console.log('Project ID:', projectID);
  };

  return (
    <View style={Styles.container}>
      <Text style={Styles.header}>Home</Text>
      {projects.length > 0 ? (
        <FlatList
          data={projects}
          keyExtractor={item => item.id.toString()} // Ensure each item has a unique key
          renderItem={renderProjectItem}
        />
      ) : (
        <Text style={Styles.noProjects}>No projects yet. Add one!</Text>
      )}
      <Button
        title="Add Project"
        onPress={() => navigation.navigate('AddProject')}
      />
    </View>
  );
};

export default Home;

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingRight: 16,
    paddingLeft: 16,
    paddingTop: 100,
    paddingBottom: 50,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'blue',
    marginBottom: 20,
    textAlign: 'center', // Center the text
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 16,
  },
});
