import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from 'react-native'
import { COLORS, TYPOGRAPHY } from '../constants'

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Bienvenido a MultiMarket Pro</Text>
        <Text style={styles.subtitle}>Gestiona tus mercados fácilmente</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🏪 Mercados Activos</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sin mercados registrados</Text>
          <Text style={styles.cardText}>Crea tu primer mercado para comenzar</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Estadísticas</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Mercados</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Productos</Text>
          </View>
