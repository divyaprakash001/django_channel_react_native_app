import { TouchableOpacity, Text } from "react-native"



function SocialBtn({ title, onPress, bgColor }) {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: bgColor,
        height: 42,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        paddingHorizontal: 50,
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


export default SocialBtn