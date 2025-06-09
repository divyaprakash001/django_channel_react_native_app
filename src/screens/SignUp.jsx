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
import api from "../core/api"
import utils from "../core/utils"
import useGlobal from "../core/global"

function SignUp({ navigation }) {
  const [username, setUsername] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [password1, setPassword1] = useState('')
  const [password2, setPassword2] = useState('')

  const [usernameError, setUsernameError] = useState('')
  const [firstNameError, setFirstNameError] = useState('')
  const [lastNameError, setLastNameError] = useState('')
  const [password1Error, setPassword1Error] = useState('')
  const [password2Error, setPassword2Error] = useState('')

  const login = useGlobal(state => state.login)

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false
    })
  }, [])

  const onSignUp = () => {
    // pass


    // check username
    const failUsername = !username || username.length < 5
    if (failUsername) {
      setUsernameError('Username must be >= 5 characters')
    }

    // check firstname
    const failFirstName = !firstName
    if (failFirstName) {
      setFirstNameError('First name not provided')
    }
    // check username
    const failLastName = !lastName
    if (failLastName) {
      setLastNameError('Last name not provided')
    }

    // check password1
    const failPassword1 = !password1 || password1.length < 8
    if (failPassword1) {
      setPassword1Error('Password is too short')
    }

    // check password1
    const failPassword2 = !password2 || password1 !== password2
    if (failPassword2) {
      setPassword2Error('Passwords don\'t match')
    }

    // break out of this function if there were any issues
    if (failUsername || failFirstName || failLastName || failPassword1 || failPassword2) {
      return;
    }

    utils.log("username", username)
    utils.log("first", firstName)
    utils.log("last", lastName)

    api.post('/chat/signup/', {
      username: username,
      first_name: firstName,
      last_name: lastName,
      password: password1,
    })
      .then(response => {
        const credentials = {
          username: username,
          password: password1
        }
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




  }



  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground source={require('../assets/loginback.png')} style={{ width: '100%', height: '100%' }} resizeMode="cover">

        <KeyboardAvoidingView behavior="height" style={{ flex: 1 }}>

          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 16, marginTop: 60 }}>
              <Title text={"Realtime Chat"} color={"white"} />

              <View style={{ marginTop: 60 }}>
                <Text
                  style={{ color: '#fff', fontWeight: '600' }}>Sign Up with username</Text>
                <Input
                  placeholder={'username'}
                  value={username}
                  error={usernameError}
                  setValue={setUsername}
                  setError={setUsernameError}
                />

                <Input
                  placeholder={'First Name'}
                  value={firstName}
                  error={firstNameError}
                  setValue={setFirstName}
                  setError={setFirstNameError}
                />

                <Input
                  placeholder={'Last Name'}
                  value={lastName}
                  error={lastNameError}
                  setValue={setLastName}
                  setError={setLastNameError}
                />

                <Input
                  placeholder={'Your password'}
                  value={password1}
                  error={password1Error}
                  setValue={setPassword1}
                  setError={setPassword1Error}
                  secureTextEntry={true}
                />
                <Input
                  placeholder={'Confirm password'}
                  value={password2}
                  error={password2Error}
                  setValue={setPassword2}
                  setError={setPassword2Error}
                  secureTextEntry={true}
                />

                <Button title={'Sign Up'} bgColor={'#47459b'} onPress={onSignUp} />
                <View style={{ width: '90%', height: 2, backgroundColor: 'white', marginHorizontal: 'auto', marginVertical: 30 }}></View>
                <Text style={{ color: '#fff' }}>or continue with</Text>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: 60 }}>
                  <SocialBtn bgColor={'#3B2063'} title={'Google'} />
                  <SocialBtn bgColor={'#3B2063'} title={'Facebook'} />
                </View>
              </View>

              <Text style={{ textAlign: 'center', marginTop: 40, color: '#fff' }}>
                Already hava an account ? <Text
                  style={{ color: 'blue' }}
                  onPress={() => navigation.goBack()}
                >
                  Sign In
                </Text>
              </Text>


            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView >
  )
}

export default SignUp