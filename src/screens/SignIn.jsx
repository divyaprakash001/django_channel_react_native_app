import { useLayoutEffect, useState } from "react"
import {
  Keyboard,
  KeyboardAvoidingView,
  SafeAreaView,
  Text,
  View,
  TouchableWithoutFeedback,
  ImageBackground,
} from "react-native"
import Input from "../common/Input"
import Button from "../common/Button"
import SocialBtn from "../common/SocialBtn"
import Title from "../common/Title"

import api from "../core/api";
import utils from "../core/utils"
import useGlobal from "../core/global"

function SignIn({ navigation }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [usernameError, setUsernameError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const login = useGlobal(state => state.login)

  // const login = useGlobal(state => state.login)

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false
    })
  }, [])

  const onSignIn = () => {
    // pass


    // check username
    const failUsername = !username
    if (failUsername) {
      setUsernameError('Username not provided')
    }

    // check password
    const failPassword = !password
    if (failPassword) {
      setPasswordError('Password not provided')
    }

    // break out of this function if there were any issues
    if (failUsername || failPassword) {
      return;
    }

    // make a signin request
    api.post('/chat/signin/', {
      username: username,
      password: password
    })
      .then(response => {
        console.log(response.data.user)


        const credentials = {
          username: username,
          password: password
        }

        if (response.data.user.username != '')
          console.log(response.data.user.username);

        login(credentials,
          response.data.user,
          response.data.tokens)

      })

      .catch(error => {
        if (error.response) {
          utils.log(error.response.data);
          utils.log(error.response.status);
          utils.log(error.response.headers);
        } else if (error.request) {
          utils.log(error.request);
        } else {
          utils.log('Error', error.message);
        }
        utils.log(error.config);

      })
    utils.log('send hua signin');
    utils.log(username);
    utils.log(password);


    // setUsername('')
    // setPassword('')

  }



  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground source={require('../assets/loginback.png')} style={{ width: '100%', height: '100%' }} resizeMode="cover">

        <KeyboardAvoidingView behavior="height" style={{ flex: 1 }}>

          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 16, marginTop: 150 }}>
              <Title text={"Realtime Chat"} color={"white"} />

              <View style={{ marginTop: 20 }}>
                <Text
                  style={{ color: '#fff', fontWeight: '600' }}>Sign in with username</Text>
                <Input
                  placeholder={'username'}
                  value={username}
                  error={usernameError}
                  setValue={setUsername}
                  setError={setUsernameError}
                />

                <Input
                  placeholder={'Password'}
                  value={password}
                  error={passwordError}
                  setValue={setPassword}
                  setError={setPasswordError}
                  secureTextEntry={true}
                />

                <Button title={'Sign In'} bgColor={'#47459b'} onPress={onSignIn} />
                <View style={{ width: '90%', height: 2, backgroundColor: 'white', marginHorizontal: 'auto', marginVertical: 30 }}></View>
                <Text style={{ color: '#fff' }}>or continue with</Text>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: 60 }}>
                  <SocialBtn bgColor={'#3B2063'} title={'Google'} />
                  <SocialBtn bgColor={'#3B2063'} title={'Facebook'} />
                </View>
              </View>






              <Text style={{ textAlign: 'center', marginTop: 40, color: '#fff' }}>
                New to this application ? <Text
                  style={{ color: 'blue' }}
                  onPress={() => navigation.navigate('SignUp')}
                >
                  Sign Up
                </Text>
              </Text>


            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView >
  )
}

export default SignIn