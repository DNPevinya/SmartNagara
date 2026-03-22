import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ChatScreen({ onBack, complaintId }) {
  const [messages, setMessages] = useState([
    { id: '1', text: 'Ayubowan! We have received your report regarding the pothole.', sender: 'Officer', time: '10:30 AM' },
    { id: '2', text: 'A technical team is scheduled for inspection tomorrow morning.', sender: 'Officer', time: '10:32 AM' },
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (input.trim()) {
      const newMsg = { id: Date.now().toString(), text: input, sender: 'You', time: 'Just now' };
      setMessages([...messages, newMsg]);
      setInput('');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Ionicons name="chevron-back" size={26} color="#0041C7" />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Text style={styles.name}>Authority Support</Text>
          <Text style={styles.sub}>Tracking {complaintId}</Text>
        </View>
        <View style={{ width: 26 }} /> 
      </View>

      <FlatList 
        data={messages}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={[styles.bubble, item.sender === 'You' ? styles.userBubble : styles.officerBubble]}>
            <Text style={[styles.msgText, item.sender === 'You' && { color: '#fff' }]}>{item.text}</Text>
            <Text style={[styles.time, item.sender === 'You' && { color: '#E0E7FF' }]}>{item.time}</Text>
          </View>
        )}
      />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.inputBar}>
          <TouchableOpacity style={styles.attachBtn}>
            <Ionicons name="add" size={24} color="#1CA3DE" />
          </TouchableOpacity>
          <TextInput 
            style={styles.input} 
            placeholder="Write your message..." 
            placeholderTextColor="#94A3B8"
            value={input} 
            onChangeText={setInput} 
          />

          <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 15, 
    backgroundColor: '#fff', 
    borderBottomWidth: 1, 
    borderBottomColor: '#F1F5F9' 
  },
  headerTitle: { flex: 1, marginLeft: 15 },
  name: { fontSize: 16, fontWeight: 'bold', color: '#0041C7' }, 
  sub: { fontSize: 11, color: '#0160C9' }, 
  list: { padding: 20 },
  bubble: { padding: 14, borderRadius: 18, marginBottom: 12, maxWidth: '80%' },
  officerBubble: { 
    backgroundColor: '#fff', 
    alignSelf: 'flex-start', 
    borderBottomLeftRadius: 4, 
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    borderWidth: 1,
    borderColor: '#3ACBE820' 
  },
  userBubble: { 
    backgroundColor: '#0041C7', 
    alignSelf: 'flex-end', 
    borderBottomRightRadius: 4, 
    elevation: 2 
  },
  msgText: { fontSize: 14, color: '#1E293B', lineHeight: 20 },
  time: { fontSize: 10, color: '#94A3B8', marginTop: 4, textAlign: 'right' },
  inputBar: { 
    flexDirection: 'row', 
    padding: 15, 
    backgroundColor: '#fff', 
    alignItems: 'center', 
    borderTopWidth: 1, 
    borderTopColor: '#3ACBE840', 
    paddingBottom: Platform.OS === 'ios' ? 30 : 15 
  },
  attachBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  input: { 
    flex: 1, 
    backgroundColor: '#F8FAFC', 
    borderRadius: 20, 
    paddingHorizontal: 15, 
    height: 40, 
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: '#3ACBE8' 
  },
  sendBtn: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: '#0041C7', 
    justifyContent: 'center', 
    alignItems: 'center' 
  }
});