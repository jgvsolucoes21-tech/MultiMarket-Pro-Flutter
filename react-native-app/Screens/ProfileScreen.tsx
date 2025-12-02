import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert
} from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { supabase } from '../supabaseClient'
import { COLORS, TYPOGRAPHY } from '../constants'

export default function ProfileScreen() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          setUser(user)

          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

          if (error && error.code !== 'PGRST116') {
            console.error('Error fetching profile:', error)
          } else if (data) {
            setProfile(data)
          }
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    getProfile()
  }, [])

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8
    })

    if (!result.cancelled && result.assets && result.assets.length > 0) {
      await uploadAvatar(result.assets[0].uri)
    }
  }

  const uploadAvatar = async (imageUri: string) => {
    setUploading(true)
    try {
      const response = await fetch(imageUri)
      const blob = await response.blob()
      const fileExt = 'jpg'
      const fileName = `${user.id}.${fileExt}`

      const { error } = await supabase.storage
        .from('avatars')
        .upload(fileName, blob, { upsert: true })

      if (error) throw error

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('id', user.id)

      if (updateError) throw updateError

      setProfile({ ...profile, avatar_url: data.publicUrl })
      Alert.alert('Éxito', 'Avatar actualizado correctamente')
    } catch (error: any) {
      Alert.alert('Error', error.message)
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.avatarSection}>
        <View style={styles.avatarContainer}>
          {profile?.avatar_url ? (
            <Image
              source={{ uri: profile.avatar_url }}
              style={styles.avatar}
            />
          ) : (
            <Text style={styles.avatarPlaceholder}>👤</Text>
          )}
        </View>

        <TouchableOpacity
          style={[styles.uploadButton, uploading && styles.buttonDisabled]}
          onPress={pickImage}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.uploadButtonText}>Cambiar Avatar</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user?.email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>ID de Usuario</Text>
        <Text style={styles.value}>{user?.id?.substring(0, 8)}...</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Nombre Completo</Text>
        <Text style={styles.value}>{profile?.full_name || 'No configurado'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Teléfono</Text>
        <Text style={styles.value}>{profile?.phone || 'No configurado'}</Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background
  },
  avatarSection: {
    backgroundColor: COLORS.primary,
    paddingVertical: 30,
    alignItems: 'center'
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 4,
    borderColor: COLORS.secondary
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 60
  },
  avatarPlaceholder: {
    fontSize: 60
  },
  uploadButton: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8
  },
  uploadButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 14
  },
  buttonDisabled: {
    opacity: 0.6
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomColor: COLORS.border,
    borderBottomWidth: 1
  },
  label: {
    ...TYPOGRAPHY.small,
    color: COLORS.textLight,
    fontWeight: '600',
    marginBottom: 4
  },
  value: {
    ...TYPOGRAPHY.body,
    color: COLORS.text
  }
})
