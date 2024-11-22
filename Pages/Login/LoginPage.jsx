import React from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';

const LoginPage = ({navigation}) => {
  return (
    <View style={Styles.container}>
      <Text style={Styles.header}>Login</Text>
      <TextInput style={Styles.input} placeholder="Username" />
      <TextInput style={Styles.input} placeholder="Password" secureTextEntry />
      <Button
        title="Login"
        onPress={() => {
          navigation.navigate('Home');
        }}
      />
    </View>
  );
};

export default LoginPage;

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'blue',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});
