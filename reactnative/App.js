import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import LoginScreen from './src/screens/HomeScreen/index.js';

export default class App extends Component {

  async componentWillMount() {
    try {
      console.log('setting-crawfish');
      //await AsyncStorage.setItem('HASURA_AUTH_TOKEN', 'I like to save it.');
       //await AsyncStorage.setItem('mobilenumber', '999242444');
       const user = {
        status: 'Happy Learning!!',
        mobilenumber: 9283498234,
        lastseen: '10:01 AM',
        displayname: 'chinmoyeee',
        displaypic: null,
        deviceimei: '1213',
        user_id: 1
    };
      //await AsyncStorage.setItem('user', user);
    } catch (error) {
      // Error saving data
      console.log('error setting');
    }
  }
 
  render() {
    return <LoginScreen />;
  }
}