import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import useGlobal from '../core/global'
import Thumbnail from '../common/Thumbnail'
import Empty from '../common/Empty'
import Cell from '../common/Cell'
import utils from '../core/utils'





function StartChat({ item }) {
  // const requestAccept = useGlobal(state => state.requestAccept)

  return (
    <TouchableOpacity
      style={{
        backgroundColor: '#202020',
        paddingHorizontal: 14,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center'
      }}
    // onPress={() => requestAccept(item.sender.username)}
    >
      <Text style={{ color: 'white', fontWeight: 'bold' }}>Chat</Text>
    </TouchableOpacity>
  )
}

function FriendRow({ item }) {
  const message = `${item.sender.username} is now your friend`
  //const time = '7m ago'

  return (
    <Cell>
      <Thumbnail
        url={item.sender.thumbnail}
        size={76}
      />
      <View
        style={{
          flex: 1,
          paddingHorizontal: 16
        }}
      >
        <Text
          style={{
            fontWeight: 'bold',
            color: '#202020',
            marginBottom: 4
          }}
        >
          {item.sender.name}
        </Text>
        <Text
          style={{
            color: '#606060',
          }}
        >
          {message} <Text style={{ color: '#909090', fontSize: 13 }}>
            {utils.formatTime(item.updated)}
          </Text>
        </Text>
      </View>

      <StartChat item={item} />
    </Cell>
  )
}



export default function Friends() {
  const friendList = useGlobal(state => state.friendList)
  const fetchFriends = useGlobal(state => state.fetchFriends)
  console.log('====================================');
  console.log(friendList);
  console.log('====================================');

  useEffect(() => {
    fetchFriends()
  }, [])

  // Show loading indicator
  if (friendList === null) {
    return (
      <ActivityIndicator style={{ flex: 1 }} />
    )
  }

  // Show empty if no requests
  if (friendList.length === 0) {
    return (
      <Empty icon='bell' message='No friends' />
    )
  }





  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={friendList}
        renderItem={({ item }) => (
          <FriendRow item={item} />
        )}
        keyExtractor={item => item.sender.username}
      />
    </View>
  )
}
