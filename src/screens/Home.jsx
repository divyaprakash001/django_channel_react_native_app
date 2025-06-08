import { StyleSheet, TouchableOpacity, View, Image } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Friends from './Friends'
import Requests from './Requests'
import Profile from './Profile'
import { useLayoutEffect } from 'react'


import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'


const Tab = createBottomTabNavigator();


export default function Home({ navigation }) {

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false
    })
  }, [])


  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => ({
        headerLeft: () => (
          <View style={{ marginLeft: 16 }}>
            <Image
              source={require('../assets/profile.png')}
              style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: '#e0e0e0', marginRight: 4 }}
            />
          </View>
        ),
        headerRight: () => (
          <TouchableOpacity>
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