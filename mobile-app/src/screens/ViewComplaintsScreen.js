import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, ActivityIndicator, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BASE_URL } from '../../src/config';

export default function ViewComplaintsScreen({ onNavigateToDetails, userId }) {
  const [filter, setFilter] = useState('All');
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(''); 

  const SERVER_URL = BASE_URL;

  useEffect(() => {
    fetchMyComplaints();
  }, []);

  const fetchMyComplaints = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/api/complaints/user/${userId || 1}`);
      const result = await response.json();
      
      if (result.success && Array.isArray(result.data)) {
        setComplaints(result.data);
      } else {
        setComplaints([]);
      }
    } catch (error) {
      console.error("Error fetching complaints:", error);
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING': return '#FF9F43';
      case 'RESOLVED': return '#28C76F';
      case 'IN PROGRESS': return '#0041C7';
      default: return '#FF9F43'; 
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown Date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const safeComplaints = Array.isArray(complaints) ? complaints : [];
  
  const filteredComplaints = safeComplaints.filter(c => {
    const matchesFilter = filter === 'All' || c.status?.toUpperCase() === filter.toUpperCase();
    const displayId = c.id || c.complaint_id || '';
    const formattedId = `#SL-${displayId}`.toLowerCase();
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = formattedId.includes(searchLower) || (c.title && c.title.toLowerCase().includes(searchLower));

    return matchesFilter && matchesSearch;
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      
      <View style={styles.topNavBar}>
        <View>
          <Text style={styles.greetingText}>OVERVIEW</Text>
          <Text style={styles.navTitle}>My Complaints</Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#64748B" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by ID or Title..."
          placeholderTextColor="#94A3B8"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtn}>
            <Ionicons name="close-circle" size={20} color="#94A3B8" />
          </TouchableOpacity>
        )}
      </View>

      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterBar}>
          {['All', 'Pending', 'In Progress', 'Resolved'].map((tab) => (
            <TouchableOpacity 
              key={tab} 
              onPress={() => setFilter(tab)} 
              style={[styles.filterTab, filter === tab && styles.filterTabActive]}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterText, filter === tab && styles.filterTextActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 📋 COMPLAINTS LIST */}
      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator size="large" color="#0041C7" style={{ marginTop: 50 }} />
        ) : filteredComplaints.length === 0 ? (
          <View style={styles.emptyContainer}>
             <Ionicons name="document-text-outline" size={60} color="#CBD5E1" />
             <Text style={styles.emptyText}>
               {searchQuery ? "No matching complaints found." : "No complaints found."}
             </Text>
          </View>
        ) : (
          filteredComplaints.map((item, index) => {
            const displayId = item.id || item.complaint_id || '0000';
            const uniqueKey = displayId !== '0000' ? displayId.toString() : index.toString();
            const statusColor = getStatusColor(item.status);
            
            // Grab only the first image if there are multiple 
            const firstImage = item.image_url ? item.image_url.split(',')[0] : null;

            return (
              <View key={uniqueKey} style={styles.complaintCard}>
                <View style={styles.cardHeader}>
                  <Text style={styles.complaintId}>#SL-{displayId}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: statusColor + '15' }]}>
                    <Text style={[styles.statusText, { color: statusColor }]}>{item.status?.toUpperCase() || 'PENDING'}</Text>
                  </View>
                </View>
                
                <Text style={styles.complaintTitle} numberOfLines={1}>{item.title || item.category}</Text>
                
                <View style={styles.cardBody}>
                  <Image 
                    source={{ uri: firstImage ? `${SERVER_URL}${firstImage}` : 'https://via.placeholder.com/150' }} 
                    style={styles.thumbImage} 
                  />
                  <View style={styles.textContainer}>
                    <Text style={styles.descText} numberOfLines={2}>{item.description}</Text>
                    <View style={styles.dateRow}>
                      <Ionicons name="calendar-outline" size={14} color="#94A3B8" />
                      <Text style={styles.dateText}>{formatDate(item.created_at)}</Text>
                    </View>
                  </View>
                </View>

                {item.status?.toUpperCase() === 'IN PROGRESS' && (
                  <View style={styles.progressContainer}>
                    <View style={[styles.progressBar, { width: '60%', backgroundColor: statusColor }]} />
                  </View>
                )}

                <TouchableOpacity style={styles.viewDetailsBtn} activeOpacity={0.7} onPress={() => onNavigateToDetails(displayId)}>
                  <Text style={styles.viewDetailsText}>View Details</Text>
                  <Ionicons name="chevron-forward" size={16} color="#0041C7" />
                </TouchableOpacity>
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  topNavBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 25, paddingTop: 15, paddingBottom: 15, backgroundColor: '#F8FAFC' },
  greetingText: { fontSize: 12, color: '#94A3B8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 },
  navTitle: { fontSize: 26, fontWeight: '800', color: '#0041C7' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', marginHorizontal: 25, marginBottom: 20, paddingHorizontal: 15, height: 55, borderRadius: 16, borderWidth: 1.5, borderColor: '#E2E8F0', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 },
  searchIcon: { marginRight: 12 },
  searchInput: { flex: 1, fontSize: 16, color: '#1E293B' },
  clearBtn: { padding: 5 },
  filterBar: { paddingHorizontal: 25, paddingBottom: 15 },
  filterTab: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, backgroundColor: '#fff', marginRight: 12, borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 }, 
  filterTabActive: { backgroundColor: '#0041C7', borderColor: '#0041C7' }, 
  filterText: { fontSize: 14, color: '#64748B', fontWeight: '600' }, 
  filterTextActive: { color: '#fff', fontWeight: '700' },
  listContent: { paddingHorizontal: 25, paddingBottom: 60 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 60 },
  emptyText: { textAlign: 'center', color: '#94A3B8', marginTop: 15, fontSize: 16, fontWeight: '500' },
  
  complaintCard: { backgroundColor: '#fff', borderRadius: 20, padding: 18, marginBottom: 18, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 6, borderWidth: 1, borderColor: '#F1F5F9' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  complaintId: { fontSize: 13, fontWeight: '800', color: '#0041C7', letterSpacing: 0.5 }, 
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  statusText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  complaintTitle: { fontSize: 18, fontWeight: '800', color: '#1E293B', marginBottom: 15 },
  
  cardBody: { flexDirection: 'row', marginBottom: 15 },
  thumbImage: { width: 85, height: 85, borderRadius: 16, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0' },
  textContainer: { flex: 1, marginLeft: 15, justifyContent: 'center' },
  descText: { fontSize: 14, color: '#64748B', lineHeight: 20, marginBottom: 8 },
  dateRow: { flexDirection: 'row', alignItems: 'center' },
  dateText: { fontSize: 12, color: '#94A3B8', marginLeft: 6, fontWeight: '600' },
  
  progressContainer: { height: 6, backgroundColor: '#F1F5F9', borderRadius: 3, marginBottom: 18, overflow: 'hidden' },
  progressBar: { height: '100%', borderRadius: 3 }, 
  
  viewDetailsBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC', paddingVertical: 14, borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0' }, 
  viewDetailsText: { fontSize: 14, color: '#0041C7', fontWeight: '800', marginRight: 6 } 
});