import { StyleSheet, TouchableOpacity, View, Image } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Friends from './Friends'
import Requests from './Requests'
import Profile from './Profile'
import { useEffect, useLayoutEffect } from 'react'
import utils from '../core/utils'

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import useGlobal from '../core/global'
import Thumbnail from '../common/Thumbnail'


const Tab = createBottomTabNavigator();


export default function Home({ navigation }) {

  const socketConnect = useGlobal(state => state.socketConnect)
  const socketClose = useGlobal(state => state.socketClose)
  const user = useGlobal(state => state.user)

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false
    })
  }, [])

  useEffect(() => {
    socketConnect()
    return () => {
      socketClose()
    }
  }, [])

  const onSearch = () => {
    navigation.navigate('Search')
  }


  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => ({
        headerLeft: () => (
          <View style={{ marginLeft: 16 }}>
            <Thumbnail size={28} url={user.thumbnail} />
          </View>
        ),
        headerRight: () => (
          <TouchableOpacity
            onPress={onSearch}
          >
            <FontAwesomeIcon
              style={{ marginRight: 16 }}
              icon='magnifying-glass'
              size={22}
              color='#404040'
            />
          </TouchableOpacity>
        ),
        tabBarIcon: ({ focus, color, size }) => {
          const icons = {
            Requests: 'bell',
            Friends: 'inbox',
            Profile: 'user',
          }
          const icon = icons[route.name]
          return (
            < FontAwesomeIcon icon={icon} size={28} color={color} />
          )
        },
        tabBarActiveTintColor: '#202020',
        tabBarShowLabel: false,
      })} >
      <Tab.Screen name='Requests' component={Requests} />
      <Tab.Screen name='Friends' component={Friends} />
      <Tab.Screen name='Profile' component={Profile} />
    </Tab.Navigator >
  )
}

const styles = StyleSheet.create({})