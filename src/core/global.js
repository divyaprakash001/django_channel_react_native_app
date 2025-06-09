import { create } from "zustand";
import secure from "./secure";
import api, { ADDRESS } from "./api";
import { parse } from "react-native-svg";

// ----------------------
// socket receive message handlers
// ----------------------

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
    }
    socket.onmessage = (e) => {
      console.log('socket.onmessage');
      // convert data to javascript object
      const parsed = JSON.parse(e.data)
      console.log('socket.onmessage data==>', parsed);

      const responses = {
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