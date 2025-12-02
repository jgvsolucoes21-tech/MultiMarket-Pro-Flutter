import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native'
import { supabase } from '../supabaseClient'
import { COLORS, TYPOGRAPHY } from '../constants'

export default function SettingsScreen() {
  const handleSignOut = async () => {
    Alert.alert('Cerrar sesión', '¿Estás seguro de que quieres cerrar sesión?', [
      {
        text: 'Cancelar',
        onPress: () => {}
      },
      {
        text: 'Sí, cerrar sesión',
        onPress: async () => {
          await supabase.auth.signOut()
        }
      }
    ])
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Configuración</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Preferencias</Text>
        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>🌙 Tema oscuro</Text>
          <Text style={styles.optionStatus}>Desactivado</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>🔔 Notificaciones</Text>
          <Text style={styles.optionStatus}>Activadas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
