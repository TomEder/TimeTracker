import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const ProjectHeader = ({project, onBack}) => {
  if (!project) {
    // Prevent rendering if project is not loaded
    return null;
  }

  const getColor = bgColor => {
    switch (bgColor) {
      case 1:
        return '#91511F'; // Color 1
      case 2:
        return '#037C58'; // Color 2
      case 3:
        return '#721A70'; // Color 3
      case 4:
        return '#671313'; // Color 4
      default:
        return '#333'; // Default color
    }
  };

  return (
    <View style={[styles.headerContainer]}>
      {/* Back Button */}
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={[styles.backText, {color: getColor(project.bgColor)}]}>
          &#8592; {/* Left Arrow */}
        </Text>
      </TouchableOpacity>

      {/* Project Name */}
      <Text style={[styles.projectLabel, {color: getColor(project.bgColor)}]}>
        Project
      </Text>
      <Text style={[styles.projectName, {color: getColor(project.bgColor)}]}>
        {project.name || 'Unnamed Project'}
      </Text>

      {/* Horizontal Line */}
      <View
        style={[styles.divider, {borderBottomColor: getColor(project.bgColor)}]}
      />

      {/* Hourly Pay & Total Earnings */}
      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Text style={[styles.statLabel, {color: getColor(project.bgColor)}]}>
            Hourly pay
          </Text>
          <Text style={[styles.statValue, {color: getColor(project.bgColor)}]}>
            {project.payPerHour ? `${project.payPerHour} kr` : 'N/A'}
          </Text>
        </View>
        <View style={styles.stat}>
          <Text style={[styles.statLabel, {color: getColor(project.bgColor)}]}>
            Total earnings
          </Text>
          <Text style={[styles.statValue, {color: getColor(project.bgColor)}]}>
            {project.earnings ? `${project.earnings.toFixed(1)} kr` : '0.0 kr'}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ProjectHeader;

const styles = StyleSheet.create({
  headerContainer: {
    padding: 20,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    elevation: 5, // For Android shadow
  },
  backButton: {
    marginBottom: 16,
  },
  backText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  projectLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  projectName: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  divider: {
    borderBottomWidth: 1,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
