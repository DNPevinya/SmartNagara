import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BASE_URL } from '../../src/config';

export default function HomeScreen({ 
  userFirstName, 
  userId, 
  onNavigateToSubmit, 
  onNavigateToView, 
  onNavigateToDetails, 
  onNavigateToNotifications 
}) {
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0 });
  const [loadingStats, setLoadingStats] = useState(true);

  const SERVER_URL = BASE_URL;

  useEffect(() => {
    fetchStats();
  }, [userId]);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/api/complaints/stats/${userId || 1}`);
      const data = await response.json();
      setStats({
        total: data.total || 0,
        pending: data.pending || 0,
        resolved: data.resolved || 0
      });
    } catch (error) {
      console.error("Dashboard Stats Error:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  const activities = [
    { id: 1, title: 'Waste Management', desc: 'Complaint #CMB-4920 resolved.', time: '2H AGO', color: '#28C76F', icon: 'check-circle' },
    { id: 2, title: 'Street Light Repair', desc: 'Assigned to Urban Dept.', time: 'YESTERDAY', color: '#FF9F43', icon: 'dots-horizontal-circle' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.topNavBar}>
        <View>
          <Text style={styles.greetingText}>Ayubowan, {userFirstName || 'Citizen'}</Text>
          <Text style={styles.navTitle}>Home Dashboard</Text>
        </View>
        <TouchableOpacity style={styles.notificationBtn} onPress={onNavigateToNotifications} activeOpacity={0.7}>
          <Ionicons name="notifications-outline" size={24} color="#1E293B" />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* STATS SECTION */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Summary</Text>
        </View>
        
        <View style={styles.statsRow}>
          {loadingStats ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator color="#0041C7" size="large" />
            </View>
          ) : (
            <>
              <StatCard label="TOTAL" value={stats.total} color="#0041C7" icon="file-document-outline" />
              <StatCard label="PENDING" value={stats.pending} color="#FF9F43" icon="clock-outline" />
              <StatCard label="RESOLVED" value={stats.resolved} color="#28C76F" icon="check-decagram-outline" />
            </>
          )}
        </View>

        {/* QUICK ACTIONS SECTION */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <TouchableOpacity activeOpacity={0.8} onPress={onNavigateToSubmit}>
          <LinearGradient colors={['#0041C7', '#0D85D8']} start={{x: 0, y: 0}} end={{x: 1, y: 1}} style={styles.primaryAction}>
            <View style={styles.primaryActionContent}>
              <View style={styles.actionIconContainer}>
                <Ionicons name="add" size={26} color="#0041C7" />
              </View>
              <View style={styles.actionTextContainer}>
                <Text style={styles.primaryActionText}>Submit New Complaint</Text>
                <Text style={styles.primaryActionSubText}>Report an urban issue instantly</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#fff" opacity={0.8} />
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.8} style={styles.secondaryAction} onPress={onNavigateToView}>
          <View style={[styles.actionIconContainer, { backgroundColor: '#F1F5F9' }]}>
            <Ionicons name="list-outline" size={24} color="#0160C9" />
          </View>
          <View style={styles.actionTextContainer}>
            <Text style={styles.secondaryActionText}>View My Complaints</Text>
            <Text style={styles.secondaryActionSubText}>Check status and updates</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#94A3B8" />
        </TouchableOpacity>

        {/* RECENT ACTIVITY SECTION */}
        <View style={[styles.sectionHeader, { marginTop: 30 }]}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity onPress={onNavigateToView} activeOpacity={0.6}>
              <Text style={styles.seeAllLink}>See all</Text>
            </TouchableOpacity>
        </View>
        
        {activities.map((item) => (
          <TouchableOpacity key={item.id} onPress={() => onNavigateToDetails()} activeOpacity={0.7}>
            <ActivityItem {...item} />
          </TouchableOpacity>
        ))}

        {/* MAP SECTION */}
        <Text style={[styles.sectionTitle, { marginTop: 30 }]}>City Pulse & Services</Text>
        <Text style={styles.mapInfo}>Explore active utility points and local authorities</Text>
        <View style={styles.mapContainer}>
          <MapView 
            style={styles.map} 
            initialRegion={{ latitude: 6.9271, longitude: 79.8612, latitudeDelta: 0.05, longitudeDelta: 0.05 }}
          >
            <Marker 
              coordinate={{ latitude: 6.9271, longitude: 79.8612 }} 
              title="Colombo Municipal Council"
              description="Local Authority Headquarters"
              pinColor="#0041C7" 
            />
          </MapView>
        </View>
        
      </ScrollView>
    </SafeAreaView>
  );
}


const StatCard = ({ label, value, color, icon }) => (
  <View style={styles.statCard}>
    <View style={[styles.statIconWrapper, { backgroundColor: color + '15' }]}>
      <MaterialCommunityIcons name={icon} size={20} color={color} />
    </View>
    <Text style={[styles.statValue, { color }]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const ActivityItem = ({ title, desc, time, icon, color }) => (
  <View style={styles.activityCard}>
    <View style={[styles.iconCircle, { backgroundColor: color + '15' }]}>
      <MaterialCommunityIcons name={icon} size={24} color={color} />
    </View>
    <View style={{ flex: 1, paddingRight: 10 }}>
      <Text style={styles.actTitle}>{title}</Text>
      <Text style={styles.actDesc} numberOfLines={1}>{desc}</Text>
    </View>
    <Text style={styles.actTime}>{time}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  topNavBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 25, paddingTop: 15, paddingBottom: 10, backgroundColor: '#F8FAFC' },
  greetingText: { fontSize: 13, color: '#64748B', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  navTitle: { fontSize: 26, fontWeight: '800', color: '#0041C7' },
  notificationBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3, borderWidth: 1, borderColor: '#E2E8F0' },
  notificationDot: { position: 'absolute', top: 12, right: 14, width: 10, height: 10, borderRadius: 5, backgroundColor: '#EF4444', borderWidth: 2, borderColor: '#fff' },
  
  scrollContent: { paddingHorizontal: 25, paddingBottom: 40 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 15 },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: '#1E293B', marginTop: 25, letterSpacing: -0.5 },
  seeAllLink: { color: '#0160C9', fontWeight: '700', fontSize: 14, marginBottom: 2 },
  
  // Stats
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 },
  statCard: { width: '31%', backgroundColor: '#fff', paddingVertical: 18, paddingHorizontal: 12, borderRadius: 20, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 5, alignItems: 'center', borderWidth: 1, borderColor: '#F1F5F9' },
  statIconWrapper: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  statLabel: { fontSize: 10, fontWeight: '800', color: '#94A3B8', marginTop: 4, letterSpacing: 0.5 },
  statValue: { fontSize: 28, fontWeight: '900', lineHeight: 30 },
  loaderContainer: { flex: 1, padding: 30, justifyContent: 'center', alignItems: 'center' },
  
  // Quick Actions
  primaryAction: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, borderRadius: 24, marginTop: 15, elevation: 5, shadowColor: '#0041C7', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.25, shadowRadius: 8 },
  primaryActionContent: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  secondaryAction: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, borderRadius: 24, backgroundColor: '#fff', marginTop: 15, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.05, shadowRadius: 5, borderWidth: 1, borderColor: '#F1F5F9' },
  actionIconContainer: { width: 46, height: 46, borderRadius: 16, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  actionTextContainer: { flex: 1, justifyContent: 'center' },
  primaryActionText: { color: '#fff', fontSize: 17, fontWeight: '800', marginBottom: 2 },
  primaryActionSubText: { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '500' },
  secondaryActionText: { color: '#1E293B', fontSize: 17, fontWeight: '800', marginBottom: 2 },
  secondaryActionSubText: { color: '#64748B', fontSize: 12, fontWeight: '500' },
  
  // Activity Cards
  activityCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 20, marginTop: 12, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 3, borderWidth: 1, borderColor: '#F8FAFC' },
  iconCircle: { width: 50, height: 50, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  actTitle: { fontSize: 16, fontWeight: '800', color: '#1E293B', marginBottom: 3 },
  actDesc: { fontSize: 13, color: '#64748B', fontWeight: '500' },
  actTime: { fontSize: 11, color: '#94A3B8', fontWeight: '800', letterSpacing: 0.5 },
  
  // Map
  mapInfo: { fontSize: 13, color: '#64748B', marginTop: 5, marginBottom: 15, fontWeight: '500' },
  mapContainer: { height: 220, borderRadius: 24, overflow: 'hidden', marginTop: 5, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 6, borderWidth: 1, borderColor: '#E2E8F0' },
  map: { width: '100%', height: '100%' },
});