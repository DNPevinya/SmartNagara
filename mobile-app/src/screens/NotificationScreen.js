import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function NotificationScreen({ onBack }) {
  // MOCK DATA ---
  const notifications = [
    {
      id: 1,
      title: 'Complaint Resolved',
      message: 'Your complaint #CMB-4920 (Waste Management) has been marked as resolved.',
      time: '2 hours ago',
      type: 'success',
      icon: 'check-circle',
    },
    {
      id: 2,
      title: 'Engineer Assigned',
      message: 'An officer from the Urban Development Dept has been assigned to your request.',
      time: 'Yesterday',
      type: 'info',
      icon: 'account-hard-hat',
    },
    {
      id: 3,
      title: 'New Comment',
      message: 'The Road Authority added a comment to your report: "Work will start on Monday."',
      time: '2 days ago',
      type: 'comment',
      icon: 'message-text-outline',
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      
      <View style={styles.topNavBar}>
        <View style={styles.navLeft}>
          <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={24} color="#1E293B" />
          </TouchableOpacity>
          <View>
            <Text style={styles.greetingText}>ALERTS</Text>
            <Text style={styles.navTitle}>Notifications</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.markReadBtn} activeOpacity={0.7}>
          <Ionicons name="checkmark-done-outline" size={22} color="#0041C7" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {notifications.map((item) => (
          <TouchableOpacity key={item.id} style={styles.notificationCard} activeOpacity={0.7}>
            <View style={[styles.iconContainer, styles[item.type + 'Icon']]}>
              <MaterialCommunityIcons name={item.icon} size={26} color={styles[item.type + 'Color'].color} />
            </View>
            <View style={styles.textContainer}>
              <View style={styles.titleRow}>
                <Text style={styles.notifTitle}>{item.title}</Text>
                <Text style={styles.notifTime}>{item.time}</Text>
              </View>
              <Text style={styles.notifMessage} numberOfLines={2}>
                {item.message}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
        
        <View style={styles.endOfList}>
          <Ionicons name="checkmark-circle-outline" size={24} color="#CBD5E1" />
          <Text style={styles.endOfListText}>You're all caught up!</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  

  topNavBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 15, paddingBottom: 15, backgroundColor: '#F8FAFC' },
  navLeft: { flexDirection: 'row', alignItems: 'center' },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginRight: 15, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3, borderWidth: 1, borderColor: '#E2E8F0' },
  greetingText: { fontSize: 12, color: '#94A3B8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 },
  navTitle: { fontSize: 26, fontWeight: '800', color: '#0041C7' },
  markReadBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0, 65, 199, 0.08)', justifyContent: 'center', alignItems: 'center' },

  // List & Cards
  listContent: { paddingHorizontal: 25, paddingTop: 10, paddingBottom: 40 },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 20,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  iconContainer: { width: 52, height: 52, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  textContainer: { flex: 1, justifyContent: 'center' },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  notifTitle: { fontSize: 16, fontWeight: '800', color: '#1E293B' },
  notifTime: { fontSize: 11, color: '#94A3B8', fontWeight: '600' },
  notifMessage: { fontSize: 13, color: '#64748B', lineHeight: 20, fontWeight: '500' },
  successIcon: { backgroundColor: 'rgba(40, 199, 111, 0.12)' },
  successColor: { color: '#28C76F' },
  infoIcon: { backgroundColor: 'rgba(1, 96, 201, 0.12)' }, 
  infoColor: { color: '#0160C9' }, 
  commentIcon: { backgroundColor: 'rgba(28, 163, 222, 0.12)' }, 
  commentColor: { color: '#1CA3DE' }, 

  endOfList: { alignItems: 'center', justifyContent: 'center', marginTop: 30, opacity: 0.7 },
  endOfListText: { color: '#94A3B8', fontSize: 13, fontWeight: '600', marginTop: 8 }
});