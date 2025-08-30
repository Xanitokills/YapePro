import React, { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import AppNavigator from './src/navigation/AppNavigator';
import { initializeNotifications } from './src/lib/notifications';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const App: React.FC = () => {
  useEffect(() => {
    initializeNotifications();
  }, []);

  return <AppNavigator />;
};

export default App;