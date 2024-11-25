import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {updateProject} from '../../features/projectSlice';

const BillingPeriods = ({route, navigation}) => {
  const {projectId} = route.params; // Get project ID from navigation params
  const dispatch = useDispatch();

  const project = useSelector(state =>
    state.projects.projects.find(proj => proj.id === projectId),
  );

  if (!project) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Project not found.</Text>
      </View>
    );
  }

  const {billingPeriods = []} = project;

  const handleMarkAsBilled = billingPeriodId => {
    const billingPeriod = billingPeriods.find(bp => bp.id === billingPeriodId);

    if (billingPeriod?.billed) {
      Alert.alert('Error', 'This billing period is already marked as billed.');
      return;
    }

    const updatedBillingPeriods = billingPeriods.map(bp => {
      if (bp.id === billingPeriodId) {
        return {
          ...bp,
          billed: true,
          end: bp.end || new Date().toISOString(), // Ensure end date is set
        };
      }
      return bp;
    });

    const updatedProject = {
      ...project,
      billingPeriods: updatedBillingPeriods,
    };

    dispatch(updateProject(updatedProject));
    Alert.alert('Success', 'Billing period marked as billed.');
  };

  const renderBillingPeriod = ({item}) => (
    <View
      style={[
        styles.billingPeriod,
        item.billed ? styles.billedPeriod : styles.activePeriod,
      ]}>
      <Text style={styles.text}>
        Start: {new Date(item.start).toLocaleString()}
      </Text>
      <Text style={styles.text}>
        End: {item.end ? new Date(item.end).toLocaleString() : 'In Progress'}
      </Text>
      <Text style={styles.text}>Earnings: {item.earnings.toFixed(2)} kr</Text>
      <Text style={styles.text}>
        Duration: {Math.floor(item.duration / 3600)}h{' '}
        {Math.floor((item.duration % 3600) / 60)}m
      </Text>
      {item.billed ? (
        <Text style={styles.billedText}>Status: Billed</Text>
      ) : (
        <TouchableOpacity
          style={styles.markAsBilledButton}
          onPress={() => handleMarkAsBilled(item.id)}>
          <Text style={styles.markAsBilledButtonText}>Mark as Billed</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Billing Periods</Text>
      {billingPeriods.length > 0 ? (
        <FlatList
          data={[...billingPeriods].reverse()}
          keyExtractor={item => item.id.toString()}
          renderItem={renderBillingPeriod}
        />
      ) : (
        <Text style={styles.text}>No billing periods yet.</Text>
      )}
    </View>
  );
};

export default BillingPeriods;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  billingPeriod: {
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 8,
  },
  activePeriod: {
    backgroundColor: '#f9f9f9',
  },
  billedPeriod: {
    backgroundColor: '#d4fcd4',
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  billedText: {
    fontSize: 16,
    color: 'green',
    fontWeight: 'bold',
  },
  markAsBilledButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'blue',
    alignItems: 'center',
  },
  markAsBilledButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
});
