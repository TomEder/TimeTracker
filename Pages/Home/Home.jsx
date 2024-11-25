import React, {useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {setProjects} from '../../features/projectSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = ({navigation}) => {
  const projects = useSelector(state => state.projects.projects);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProjects = async () => {
      const storedProjects = await AsyncStorage.getItem('projects');
      if (storedProjects) {
        dispatch(setProjects(JSON.parse(storedProjects)));
      }
    };

    const unsubscribe = navigation.addListener('focus', fetchProjects);
    return unsubscribe;
  }, [dispatch, navigation]);

  const renderProjectItem = ({item}) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('Project', {id: item.id})}>
      <View style={styles.listItem}>
        <Text style={styles.title}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Home</Text>
      <FlatList
        data={projects}
        keyExtractor={item => item.id.toString()}
        renderItem={renderProjectItem}
      />
      <Button
        title="Add Project"
        onPress={() => navigation.navigate('AddProject')}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16},
  header: {fontSize: 24, textAlign: 'center', marginBottom: 20},
  listItem: {padding: 16, borderBottomWidth: 1, borderBottomColor: '#ccc'},
  title: {fontSize: 16},
});
