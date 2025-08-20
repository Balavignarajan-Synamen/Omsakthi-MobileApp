import { FontAwesome } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useState } from 'react'
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Sidebar from './Sidebar'

export default function Header() {
  const { width } = useWindowDimensions()
  const isTablet = width >= 768
  const [isSidebarVisible, setIsSidebarVisible] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible)
  }

  const handleLogin = () => {
    console.log('Login pressed')
    setIsSidebarVisible(false)
    // Add your login navigation/functionality here
  }

  const handleSignup = () => {
    console.log('Signup pressed')
    setIsSidebarVisible(false)
    // Add your signup navigation/functionality here
  }

  return (
    <>
      <SafeAreaView style={styles.container}>
        {/* Follow Us Button */}
        <TouchableOpacity style={[styles.followButton, { width: width }]}>
          <Text style={styles.followText}>Follow us :</Text>
          <FontAwesome
            name="youtube-play"
            size={isTablet ? 36 : 18}
            color="red"
          />
        </TouchableOpacity>

        {/* Logo */}
        {/* <View style={[styles.logoContainer, { width: width }]}> */}
        <LinearGradient
          colors={['#a7150bf2', '#fd580bf2']} // 95% opacity
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.logoContainer}
        >
          <Image
            source={require('../../assets/images/logoacmec-footer.png')}
            style={{
              width: isTablet ? width * 0.6 : width * 0.8,
              height: isTablet ? 70 : 50,
              alignSelf: 'center',
            }}
            resizeMode="contain"
          />
        </LinearGradient>

        {/* </View> */}

        {/* Profile Button */}
        <TouchableOpacity style={[styles.profileButton, { width: width }]}>
          <Text style={styles.profileText}>Profile</Text>
          <TouchableOpacity onPress={toggleSidebar}>
            <FontAwesome name="bars" size={isTablet ? 36 : 30} color="#fff" />
          </TouchableOpacity>
        </TouchableOpacity>
      </SafeAreaView>

      {/* Sidebar */}
      <Sidebar
        isVisible={isSidebarVisible}
        onClose={toggleSidebar}
        onLogin={handleLogin}
        onSignup={handleSignup}
      />
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  followButton: {
    backgroundColor: '#ffc107',
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  followText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 12,
  },
  logoContainer: {
    backgroundColor: 'rgba(167, 21, 11, 1)',
    paddingVertical: 4,
  },
  profileButton: {
    borderRadius: 0,
    backgroundColor: '#a7150b',
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileText: {
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'white',
    color: '#dc2626',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  menuIcon: {
    color: 'white',
    fontSize: 20,
  },
})
