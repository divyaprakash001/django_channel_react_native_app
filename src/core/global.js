import { create } from "zustand";
import secure from "./secure";
import api, { ADDRESS } from "./api";
import { parse } from "react-native-svg";
import { useReducer } from "react";

// ----------------------
// socket receive message handlers
// ----------------------

function responseRequestConnect(set, get, connection) {
  const user = get().user
  //  if i was the one that made the request, 
  // update the search list row
  if (user.username === connection.sender.username) {
    const searchList = [...get().searchList]
    const searchIndex = searchList.findIndex(
      request => request.username === connection.receiver.username
    )
    if (searchIndex >= 0) {
      searchList[searchIndex].status = 'pending-them'
      set((state) => ({
        searchList: searchList
      }))
    }

    // if they were the one that send the connect request,
    // add request to request lists
  } else {
    // do something
    const requestList = [...get().requestList]
    const requestIndex = requestList.findIndex(
      request => request.sender.username === connection.sender.username
    )
    if (requestIndex === -1) {
      requestList.unshift(connection)
      set((state) => ({
        requestList: requestList
      }))
    }
  }

}

function responseRequestList(set, get, requestList) {
  set((state) => ({
    requestList: requestList
  }))
}



function messageSendRequest(set, get, data) {
  const username = data.friend.username
  // move friendlist item for this friend to the start of list, 
  // update the preview text 
  // and update the time stamp
  const friendlist = [...get().friendList]
  const friendIndex = friendlist.findIndex(
    item => item.friend.username === username
  )
  if (friendIndex >= 0) {
    const item = friendlist[friendIndex]
    item.preview = data.message.text
    item.updated = data.created
    friendlist.splice(friendIndex, 1)
    friendlist.unshift(item)
    set((state) => ({
      friendList: friendlist
    }))
  }

  // if the messafe data doesnot belong to this friend then donot update the messafe list, as a fresh
  // messageList will be loaded te next time the user opens the correct chat window
  if (username !== get().messagesUsername) { }

  const messagesList = [data.message, ...get().messagesList]
  set((state) => ({
    messagesList: messagesList
  }))

}

function messageListRequest(set, get, data) {
  set((state) => ({
    messagesList: [...get().messagesList, ...data.messages],
    messagesUsername: data.friend.username,
  }))
}




function responseRequestFriends(set, get, friendList) {
  set((state) => ({
    friendList: friendList
  }))
}


function responseFriendNew(set, get, friend) {
  const friendList = [friend, ...get().friendList]
  set((state) => ({
    friendList: friendList
  }))
}



function responseRequestAccept(set, get, acceptedConnection) {
  const user = get().user
  // if i was the one that accepted the requesy, remove
  if (user.username === acceptedConnection.receiver.username) {
    const requestList = [...get().requestList]
    const requestIndex = requestList.findIndex(
      request => request.id === acceptedConnection.id
    )
    if (requestIndex >= 0) {
      requestList.splice(requestIndex, 1)
      set((state) => ({
        requestList: requestList
      }))
    }

    // if the corresponding user is contained within the searchList for the acceptor or the acceptee,
    // update the state of the searchList Item
    const sl = get().searchList
    if (sl === null) return
    const searchList = [...sl]
    let searchIndex = -1
    // if this user accepted
    if (useReducer.username === acceptedConnection.receiver.username) {
      searchIndex = searchList.findIndex(
        user => user.username === acceptedConnection.sender.username
      )
    } else {
      searchIndex = searchList.findIndex(
        user => user.username === acceptedConnection.receiver.username
      )
    }
    if (searchIndex >= 0) {
      searchList[searchIndex].status = 'connected'
      set((state) => ({
        searchList: searchList
      }))
    }


  }



}

function responseSearch(set, get, data) {
  set((state) => ({
    searchList: data
  }))
}


function responseThumbnail(set, get, data) {
  set((state) => ({
    user: data
  }))
}





const useGlobal = create((set, get) => ({

  // ---------------------------
  // initialization
  // ---------------------------

  initialized: false,

  init: async () => {
    const credentials = await secure.get('credentials')
    if (credentials) {

      try {
        const response = await api.post('/chat/signin/', {
          username: credentials.username,
          password: credentials.password
        })

        if (response.status !== 200) {
          throw 'Authentication error!'
        }

        const user = response.data.user
        const tokens = response.data.tokens

        secure.set('tokens', tokens)
        console.log('signin ho gya buai');

        set((state) => ({
          initialized: true,
          authenticated: true,
          user: user
        }))
        return

      } catch (error) {
        console.log('yseGlobal init : ', error);
      }
    }
    set((state) => ({
      initialized: true,

    }))
  }
  ,


  // ------------------------------
  // authentication
  // ------------------------------


  authenticated: false,
  user: {},

  login: (credentials, user, tokens) => {
    secure.set('credentials', credentials)
    secure.set('tokens', tokens)
    set((state) => ({
      authenticated: true,
      user: user,
    }))
  },

  logout: () => {
    secure.wipe()
    set((state) => ({
      authenticated: false,
      user: {},
    }))
  },

  // ---------------------
  // Websocket
  // --------------------

  socket: null,

  socketConnect: async () => {

    const tokens = await secure.get('tokens')

    const url = `ws://${ADDRESS}/chat/?token=${tokens.access}`

    const socket = new WebSocket(url)

    socket.onopen = () => {
      console.log('socket.onopen');
      socket.send(JSON.stringify({
        source: 'request.list'
      }))

      socket.send(JSON.stringify({
        source: 'friend.list'
      }))
    }
    socket.onmessage = (e) => {
      console.log('socket.onmessage');
      // convert data to javascript object
      const parsed = JSON.parse(e.data)
      console.log('socket.onmessage data==>', parsed);

      const responses = {
        'message.send': messageSendRequest,
        'message.list': messageListRequest,
        'request.connect': responseRequestConnect,
        'request.list': responseRequestList,
        'request.accept': responseRequestAccept,
        'friend.list': responseRequestFriends,
        'friend.new': responseFriendNew,
        'search': responseSearch,
        'thumbnail': responseThumbnail,
      }

      const resp = responses[parsed.source]
      if (!resp) {
        console.log('parsed.sourse ', parsed.source + " not found");
        return
      }
      // call response function
      resp(set, get, parsed.data)

    }
    socket.onerror = () => {
      console.log('socket.onerror');
    }
    socket.onclose = () => {
      console.log('socket.onclose');
    }

    set((state) => ({
      socket: socket
    }))

  },

  socketClose: () => {
    const socket = get().socket
    if (socket) {
      socket.close()
    }
    set((state) => ({
      socket: null
    }))
    console.log('socket close hua bro');

  },


  // -------------------------
  // Search
  // -------------------------

  searchList: null,
  searchUsers: (query) => {
    if (query) {
      const socket = get().socket
      socket.send(JSON.stringify({
        source: 'search',
        query: query,
      }))
    } else {
      set((state) => ({
        searchList: null
      }))
    }
  },


  // -------------------------
  // Friend Lists
  // -------------------------

  friendList: null,


  // ------------------------------
  // Messages
  // ------------------------------
  messagesList: [],
  messagesUsername: null,
  messageList: (connectionId, page = 0) => {
    if (page === 0) {
      set((state) => ({
        messagesList: [],
        messagesUsername: null,
      }))
    }
    const socket = get().socket
    socket.send(JSON.stringify({
      source: 'message.list',
      connectionId: connectionId,
      page: page
    }))
  },


  messageSend: (connectionId, message) => {
    const socket = get().socket
    socket.send(JSON.stringify({
      source: 'message.send',
      connectionId: connectionId,
      message: message
    }))
  },


  // ------------------------------
  // Request Connect
  // ------------------------------



  requestList: null,

  requestAccept: (username) => {
    const socket = get().socket
    socket.send(JSON.stringify({
      source: 'request.accept',
      username: username,
    }))
  },


  requestConnect: (username) => {
    console.log("request connected is called for ", username)
    const socket = get().socket
    socket.send(JSON.stringify({
      source: 'request.connect',
      username: username,
    }))

  },


  // -------------------------
  // Upload Thumbnail
  // -------------------------
  uploadThumbnail: (file) => {
    const socket = get().socket
    socket.send(JSON.stringify({
      source: 'thumbnail',
      base64: file.base64,
      filename: file.fileName,
    }))
  },




}))




export default useGlobal;