import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert
} from 'react-native'
import { supabase } from '../supabaseClient'
import { COLORS, TYPOGRAPHY } from '../constants'

export default function SignupScreen({ navigation }: any) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [loading, setLoading] = useState(false)

  async function signUpWithEmail() {
    if (!email || !password || !passwordConfirm) {
      Alert.alert('Error', 'Por favor completa todos los campos')
      return
    }

    if (password !== passwordConfirm) {
      Alert.alert('Error', 'Las contraseñas no coinciden')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password
      })

      if (error) {
        Alert.alert('Error de registro', error.message)
      } else {
        Alert.alert('Éxito', 'Verifica tu email para confirmar tu cuenta')
        navigation.navigate('Login')
      }
    } catch (error: any) {
      Alert.alert('Error', error.message)
    } finally {
      setLoading(false)
