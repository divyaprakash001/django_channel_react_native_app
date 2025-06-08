import { TouchableOpacity, Text } from "react-native"



function Button({ title, onPress, bgColor }) {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: bgColor,
        height: 52,
        borderRadius: 26,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20
      }}
      onPress={onPress}
    >
      <Text
        style={{
          color: 'white',
          fontSize: 16,
          fontWeight: 'bold'
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  )
}


export default Button