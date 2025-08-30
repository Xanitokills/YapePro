 
import * as Notifications from 'expo-notifications';
import { supabase } from './supabase';
import { Transaction } from 'types';

// Initialize notifications and request permissions
export const initializeNotifications = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    console.log('Notification permissions not granted');
    return null;
  }
  return await Notifications.getExpoPushTokenAsync();
};

// Subscribe to real-time Yape transactions
export const subscribeToYapeTransactions = (storeId: string, callback: (transaction: Transaction) => void) => {
  const subscription = supabase
    .channel('transactions')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'transactions',
        filter: `store_id=eq.${storeId}`,
      },
      (payload) => {
        const transaction = payload.new as Transaction;
        if (transaction.status === 'confirmed' && !transaction.notified) {
          callback(transaction);
        }
      }
    )
    .subscribe();
  return subscription;
};

// Send push notification for Yape payment
export const sendYapeNotification = async (transaction: Transaction) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Nuevo Pago Yape',
      body: `Pago de ${transaction.payer_name || 'Cliente'} por S/${transaction.amount} confirmado`,
      data: { transactionId: transaction.id },
    },
    trigger: null,
  });

  // Mark transaction as notified
  await supabase
    .from('transactions')
    .update({ notified: true })
    .eq('id', transaction.id);
};