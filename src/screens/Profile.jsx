import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import useGlobal from '../core/global'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import utils from '../core/utils'
import Thumbnail from '../common/Thumbnail'

const ProfileImage = () => {

  const uploadThumbnail = useGlobal(state => state.uploadThumbnail)
  const user = useGlobal(state => state.user)

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          launchImageLibrary({ includeBase64: true }, (response) => {
            if (response.didCancel) return
            const file = response.assets[0]
            uploadThumbnail(file)
          })
        }}
        style={{ marginBottom: 20 }}>
        <Thumbnail size={180} url={user.thumbnail} />
        <View style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          backgroundColor: '#202020',
          width: 40,
          height: 40,
          borderRadius: 20,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 3,
          borderColor: 'white'
        }}>
          <FontAwesomeIcon
            icon='pencil'
            size={15}
            color='#d0d0d0'
          />
        </View>
      </TouchableOpacity>
    </>
  )
}


const ProfileLogout = () => {
  const logout = useGlobal(state => state.logout)
  return (
    <>
      <TouchableOpacity onPress={logout} style={{
        flexDirection: 'row',
        height: 45,
        borderRadius: 26,
        alignItems: 'center',
        paddingHorizontal: 26,
        backgroundColor: '#202020',
        marginTop: 40,
      }}>
        <FontAwesomeIcon icon='right-from-bracket' size={20} color='#d0d0d0' style={{ marginRight: 12, }} />
        <Text style={{
          fontWeight: 'bold',
          color: '#d0d0d0',
        }}>Logout</Text>
      </TouchableOpacity>
    </>
  )
}


export default function Profile() {

  const user = useGlobal(state => state.user)


  return (
    <View style={{
      flex: 1,
      alignItems: 'center',
      paddingTop: 100,
    }}>
      <ProfileImage />
      {/* <Image
        // source={require('../assets/profile.png')}
        source={user.thumbnail}
        style={{ width: 180, height: 180, borderRadius: 90, backgroundColor: '#e0e0e0', marginRight: 4, marginBottom: 20 }}
      /> */}
      <Text style={{
        textAlign: 'center',
        color: '#303030',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 6,
      }}>{user.name}</Text>
      <Text style={{
        textAlign: 'center',
        color: '#606060',
        fontSize: 14,
      }}>@{user.username}</Text>

      <ProfileLogout />
    </View>
  )
}

const styles = StyleSheet.create({})