/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import NotifService from './NotifService';

export default class PushNotificationsDemo extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.notif = new NotifService(
      this.onRegister.bind(this),
      this.onNotif.bind(this),
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.spacer} />
        <TextInput
          style={styles.textField}
          value={this.state.registerToken}
          placeholder="Register token"
        />
        <View style={styles.spacer} />

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            this.notif.checkPermission(this.handlePerm.bind(this));
          }}>
          <Text>Check Permission</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            this.notif.requestPermissions();
          }}>
          <Text>Request Permissions</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            this.notif.abandonPermissions();
          }}>
          <Text>Abandon Permissions</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            this.notif.getScheduledLocalNotifications(notifs =>
              console.log(notifs),
            );
          }}>
          <Text>Console.Log Scheduled Local Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            this.notif.getDeliveredNotifications(notifs => console.log(notifs));
          }}>
          <Text>Console.Log Delivered Notifications</Text>
        </TouchableOpacity>
        <View style={styles.spacer} />

        {this.state.fcmRegistered && <Text>FCM Configured !</Text>}

        <View style={styles.spacer} />
      </View>
    );
  }

  onRegister(token) {
    this.setState({registerToken: token.token, fcmRegistered: true});

    // Forward the device token to MagicBell
    fetch('https://api.magicbell.com/push_subscriptions', {
      method: 'POST',
      headers: {
        'X-MAGICBELL-API-KEY': MAGICBELL_API_KEY,
        'X-MAGICBELL-USER-EXTERNAL-ID': CURRENT_USER_ID,
      },
      body: JSON.stringify({
        push_subscription: {
          device_token: token,
          platform: Platform.OS,
        },
      }),
    });
  }

  onNotif(notif) {
    Alert.alert(notif.title, notif.message);
  }

  handlePerm(perms) {
    Alert.alert('Permissions', JSON.stringify(perms));
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    borderWidth: 1,
    borderColor: '#000000',
    margin: 5,
    padding: 10,
    width: '70%',
    borderRadius: 5,
  },
  textField: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#AAAAAA',
    margin: 5,
    padding: 10,
    width: '70%',
  },
  spacer: {
    height: 30,
  },
});
