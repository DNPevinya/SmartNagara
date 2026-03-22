import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert, Modal, Platform } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BASE_URL } from '../../src/config';

export default function ComplaintDetailsScreen({ onBack, onNavigateToChat, complaintId }) {
  // --- 🔒 LOGIC VAULT ---
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isImageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null); 

  const SERVER_URL = BASE_URL;

  useEffect(() => {
    if (complaintId) fetchComplaintDetails();
  }, [complaintId]);

  const fetchComplaintDetails = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/api/complaints/${complaintId}`);
      const result = await response.json();
      if (result.success) setComplaint(result.data);
    } catch (error) {
      console.error("Error fetching details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionsClick = () => {
    Alert.alert(
      "Complaint Options",
      "What would you like to do?",
      [
        { text: "Cancel Complaint", onPress: () => Alert.alert("Cancelled", "Complaint has been withdrawn."), style: "destructive" },
        { text: "Report a Delay", onPress: () => Alert.alert("Reported", "A delay report has been sent to the authority.") },
        { text: "Close", style: "cancel" }
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0041C7" />
        <Text style={styles.loadingText}>Loading Details...</Text>
      </SafeAreaView>
    );
  }

  if (!complaint) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Ionicons name="document-text-outline" size={64} color="#CBD5E1" />
        <Text style={styles.errorText}>Complaint not found.</Text>
        <TouchableOpacity onPress={onBack} style={styles.goBackBtn}>
          <Text style={styles.goBackText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // --- DATA PARSING ---
  const displayId = complaint.id || complaint.complaint_id || '0000';
  const status = complaint.status ? complaint.status.toUpperCase() : 'PENDING';
  const assignedAuthority = complaint.assigned_authority ? complaint.assigned_authority : null;
  
  const locationText = complaint.location_text || "Unknown Location";
  const locationParts = locationText.split(',');
  const headerDistrict = locationParts.length > 1 
    ? locationParts[locationParts.length - 1].trim().toUpperCase() + " DISTRICT" 
    : "UNKNOWN DISTRICT";

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Unknown Date';
    const date = new Date(dateString);
    return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
  };

  const getStatusColor = (stat) => {
    switch (stat) {
      case 'PENDING': return '#FF9F43';
      case 'RESOLVED': return '#28C76F';
      case 'IN PROGRESS': return '#0041C7';
      default: return '#FF9F43';
    }
  };

  const statusColor = getStatusColor(status);

  // 🌟 THE FIX: Parse the comma-separated string into an array of full URLs
  const imageList = complaint.image_url 
    ? complaint.image_url.split(',').map(url => `${SERVER_URL}${url.trim()}`)
    : ['https://via.placeholder.com/400x200?text=No+Image+Provided'];

  const openImageModal = (url) => {
    setSelectedImageUrl(url);
    setImageModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container} edges={Platform.OS === 'android' ? ['top'] : []}>
      
      {/* FULL SCREEN IMAGE MODAL */}
      <Modal visible={isImageModalVisible} transparent={true} animationType="fade">
        <View style={styles.modalBackground}>
          <TouchableOpacity style={styles.closeModalBtn} onPress={() => setImageModalVisible(false)}>
            <Ionicons name="close-circle" size={36} color="#fff" />
          </TouchableOpacity>
          {selectedImageUrl && (
            <Image source={{ uri: selectedImageUrl }} style={styles.fullScreenImage} resizeMode="contain" />
          )}
        </View>
      </Modal>

      {/* 🌟 STANDARDIZED NAVBAR HEADER 🌟 */}
      <View style={[styles.topNavBar, Platform.OS === 'ios' && { paddingTop: 10 }]}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color="#0041C7" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
           <Text style={styles.navTitle}>Report Details</Text>
           <Text style={styles.headerSubtitle}>{headerDistrict}</Text>
        </View>
        <View style={{ width: 70 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* SUMMARY CARD */}
        <View style={styles.summaryCard}>
           <View style={styles.cardHeaderRow}>
             <Text style={styles.complaintIdText}>#SL-{displayId}</Text>
             <View style={[styles.statusBadge, { backgroundColor: statusColor + '15' }]}>
               <Text style={[styles.statusText, { color: statusColor }]}>{status}</Text>
             </View>
           </View>
           <Text style={styles.title}>{complaint.title || complaint.category}</Text>
           <View style={styles.locationRow}>
             <Ionicons name="location" size={16} color="#0041C7" />
             <Text style={styles.locationText}>{locationText}</Text>
           </View>
        </View>

        {/* 🌟 MULTIPLE IMAGES ROW 🌟 */}
        <Text style={styles.sectionLabel}>EVIDENCE PHOTOS</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScrollContainer}>
          {imageList.map((url, index) => (
            <TouchableOpacity key={index} activeOpacity={0.8} onPress={() => openImageModal(url)} style={styles.imageWrapper}>
              <Image source={{ uri: url }} style={styles.mainImage} />
              <View style={styles.viewPhotoOverlay}>
                <Ionicons name="expand" size={14} color="#fff" />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionLabel}>DESCRIPTION</Text>
        <View style={styles.descCard}>
          <Text style={styles.descText}>{complaint.description}</Text>
        </View>

        {/* AUTHORITY CARD */}
        <View style={styles.authorityCard}>
          <View style={[styles.authorityIconBox, { backgroundColor: assignedAuthority ? 'rgba(0, 65, 199, 0.1)' : '#F1F5F9' }]}>
            <MaterialCommunityIcons name="office-building" size={24} color={assignedAuthority ? '#0041C7' : '#94A3B8'} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.authorityLabel, { color: assignedAuthority ? '#0041C7' : '#64748B' }]}>ASSIGNED AUTHORITY</Text>
            <Text style={[styles.authorityName, { color: assignedAuthority ? '#1E293B' : '#94A3B8' }]} numberOfLines={1}>
              {assignedAuthority ? assignedAuthority : "Pending Assignment"}
            </Text>
          </View>
        </View>

        {/* STATUS TIMELINE */}
        <Text style={styles.sectionLabel}>STATUS TIMELINE</Text>
        <View style={styles.timelineCard}>
          
          <View style={styles.timelineRow}>
            <View style={styles.timelineLine} />
            <View style={[styles.timelineDot, { backgroundColor: '#0041C7', borderColor: '#0041C7' }]}>
              <Ionicons name="checkmark" size={12} color="#fff" />
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitleActive}>Complaint Submitted</Text>
              <Text style={styles.timelineDate}>{formatDateTime(complaint.created_at)}</Text>
            </View>
          </View>

          <View style={styles.timelineRow}>
            <View style={[styles.timelineLine, { backgroundColor: assignedAuthority ? '#0041C7' : '#E2E8F0' }]} />
            <View style={[styles.timelineDot, { backgroundColor: assignedAuthority ? '#0041C7' : '#fff', borderColor: assignedAuthority ? '#0041C7' : '#CBD5E1' }]}>
              {assignedAuthority ? <Ionicons name="checkmark" size={12} color="#fff" /> : null}
            </View>
            <View style={styles.timelineContent}>
              <Text style={[styles.timelineTitleActive, { color: assignedAuthority ? '#1E293B' : '#94A3B8' }]}>
                {assignedAuthority ? `Assigned to Authority` : "Awaiting Assignment"}
              </Text>
              <Text style={styles.timelineDate}>
                {assignedAuthority ? (complaint.updated_at ? formatDateTime(complaint.updated_at) : "Recently Assigned") : "Pending"}
              </Text>
            </View>
          </View>

          <View style={styles.timelineRow}>
            <View style={[styles.timelineLine, { backgroundColor: status === 'RESOLVED' ? '#28C76F' : '#E2E8F0' }]} />
            <View style={[styles.timelineDot, { backgroundColor: status === 'IN PROGRESS' || status === 'RESOLVED' ? '#0041C7' : '#fff', borderColor: status === 'IN PROGRESS' || status === 'RESOLVED' ? '#0041C7' : '#CBD5E1' }]}>
              {status === 'IN PROGRESS' || status === 'RESOLVED' ? <Ionicons name="checkmark" size={12} color="#fff" /> : null}
            </View>
            <View style={styles.timelineContent}>
              <Text style={[styles.timelineTitleActive, { color: status === 'IN PROGRESS' || status === 'RESOLVED' ? '#1E293B' : '#94A3B8' }]}>Work In Progress</Text>
              <Text style={styles.timelineDate}>
                {status === 'IN PROGRESS' || status === 'RESOLVED' ? "Engineers have started work" : "Pending start"}
              </Text>
            </View>
          </View>

          <View style={[styles.timelineRow, { marginBottom: 0 }]}>
            <View style={[styles.timelineDot, { backgroundColor: status === 'RESOLVED' ? '#28C76F' : '#fff', borderColor: status === 'RESOLVED' ? '#28C76F' : '#CBD5E1' }]}>
               {status === 'RESOLVED' ? <Ionicons name="checkmark" size={12} color="#fff" /> : null}
            </View>
            <View style={styles.timelineContent}>
              <Text style={[styles.timelineTitleActive, { color: status === 'RESOLVED' ? '#28C76F' : '#94A3B8' }]}>Resolved</Text>
              <Text style={styles.timelineDate}>
                {status === 'RESOLVED' ? "Issue successfully closed" : "Pending completion"}
              </Text>
            </View>
          </View>

        </View>
      </ScrollView>

      {/* FLOATING ACTION BOTTOM BAR */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={{ flex: 1 }} onPress={onNavigateToChat} activeOpacity={0.8}>
           <LinearGradient colors={['#0041C7', '#0D85D8']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.chatButton}>
             <Ionicons name="chatbubbles" size={20} color="#fff" />
             <Text style={styles.chatButtonText}>Chat with Authority</Text>
           </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionsButton} onPress={handleOptionsClick} activeOpacity={0.7}>
          <Ionicons name="ellipsis-vertical" size={24} color="#64748B" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// --- PREMIUM UI STYLES ---
const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' },
  loadingText: { marginTop: 15, color: '#64748B', fontWeight: '600', fontSize: 16 },
  errorText: { color: '#64748B', fontSize: 18, fontWeight: '700', marginTop: 15 },
  goBackBtn: { marginTop: 25, backgroundColor: '#0041C7', paddingHorizontal: 25, paddingVertical: 12, borderRadius: 12 },
  goBackText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  
  // Standardized Navbar
  topNavBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#F8FAFC' },
  backBtn: { flexDirection: 'row', alignItems: 'center', width: 70 },
  backText: { color: '#0041C7', fontSize: 16, fontWeight: '700', marginLeft: 4 },
  headerTitleContainer: { alignItems: 'center' },
  navTitle: { fontSize: 18, fontWeight: '900', color: '#1E293B' },
  headerSubtitle: { fontSize: 10, color: '#0160C9', fontWeight: '800', letterSpacing: 1, marginTop: 2 },
  
  scrollContent: { padding: 20, paddingBottom: 100 },
  
  // Summary Card
  summaryCard: { backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 25, borderWidth: 1.5, borderColor: '#E2E8F0', elevation: 2, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 5 },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  complaintIdText: { fontSize: 15, fontWeight: '900', color: '#0041C7', letterSpacing: 0.5 },
  statusBadge: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 12 },
  statusText: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  title: { fontSize: 22, fontWeight: '900', color: '#1E293B', marginBottom: 12, lineHeight: 28 },
  locationRow: { flexDirection: 'row', alignItems: 'flex-start' },
  locationText: { fontSize: 14, color: '#64748B', marginLeft: 6, fontWeight: '600', flex: 1, lineHeight: 20 },
  
  sectionLabel: { fontSize: 12, fontWeight: '800', color: '#64748B', letterSpacing: 1, marginBottom: 12, marginLeft: 5 },
  
  // Multiple Image Scroll
  imageScrollContainer: { flexDirection: 'row', marginBottom: 25 },
  imageWrapper: { width: 280, height: 180, borderRadius: 16, overflow: 'hidden', marginRight: 15, borderWidth: 1, borderColor: '#E2E8F0', backgroundColor: '#F1F5F9' },
  mainImage: { width: '100%', height: '100%' },
  viewPhotoOverlay: { position: 'absolute', bottom: 10, right: 10, backgroundColor: 'rgba(15, 23, 42, 0.7)', width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  
  // Description Card
  descCard: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 25, borderWidth: 1.5, borderColor: '#E2E8F0' },
  descText: { fontSize: 15, color: '#334155', lineHeight: 24, fontWeight: '500' },
  
  // Authority Card
  authorityCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 20, borderRadius: 20, marginBottom: 25, borderWidth: 1.5, borderColor: '#E2E8F0', elevation: 2, shadowOpacity: 0.03 },
  authorityIconBox: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  authorityLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5, marginBottom: 2 },
  authorityName: { fontSize: 16, fontWeight: '800' },
  
  // Timeline Card
  timelineCard: { backgroundColor: '#fff', borderRadius: 20, padding: 25, paddingBottom: 30, borderWidth: 1.5, borderColor: '#E2E8F0', elevation: 2, shadowOpacity: 0.03, shadowRadius: 5 },
  timelineRow: { flexDirection: 'row', marginBottom: 30, position: 'relative' },
  timelineLine: { position: 'absolute', left: 13, top: 28, bottom: -30, width: 2 },
  timelineDot: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', zIndex: 1, borderWidth: 2 },
  timelineContent: { flex: 1, marginLeft: 15, paddingTop: 4 },
  timelineTitleActive: { fontSize: 15, fontWeight: '800' },
  timelineDate: { fontSize: 13, color: '#94A3B8', marginTop: 4, fontWeight: '500' },
  
  // Bottom Bar
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', padding: 20, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E2E8F0', alignItems: 'center' },
  chatButton: { flexDirection: 'row', height: 55, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  chatButtonText: { color: '#fff', fontSize: 16, fontWeight: '800', marginLeft: 10, letterSpacing: 0.5 },
  optionsButton: { width: 55, height: 55, backgroundColor: '#F8FAFC', borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#E2E8F0' },

  // Modal
  modalBackground: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.95)', justifyContent: 'center', alignItems: 'center' },
  closeModalBtn: { position: 'absolute', top: 50, right: 25, zIndex: 10 },
  fullScreenImage: { width: '100%', height: '80%' }
});