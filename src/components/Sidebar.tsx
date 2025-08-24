import React from 'react'
import {
  Dimensions,
  Modal,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

const { width, height } = Dimensions.get('window')

type Props = {
  isVisible: boolean
  onClose: () => void
  onLogin: () => void
  onSignup: () => void
}

export default function Sidebar({
  isVisible,
  onClose,
  onLogin,
  onSignup,
}: Props) {
  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <SafeAreaView style={styles.container}>
        {/* Overlay background */}
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={onClose}
        >
          {/* Sidebar panel */}
          <TouchableOpacity
            style={styles.sidebar}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Header section with title and close button */}
            <View style={styles.header}>
              <Text style={styles.title}>Menu</Text>
              <TouchableOpacity
                onPress={onClose}
                style={styles.closeButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Content section - can be expanded for menu items */}
            <View style={styles.content}>
              {/* Add your menu items here if needed */}
            </View>

            {/* Bottom Section */}
            <View style={styles.bottomSection}>
              <TouchableOpacity
                style={styles.authButton}
                onPress={onLogin}
                activeOpacity={0.8}
              >
                <Text style={styles.authButtonText1}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.authButton, styles.signupButton]}
                onPress={onSignup}
                activeOpacity={0.8}
              >
                <Text style={styles.authButtonText2}>Register</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </SafeAreaView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  sidebar: {
    width: Math.min(width * 0.75, 300), // Max width of 300px for larger screens
    minWidth: 250, // Minimum width for very small screens
    height: '100%',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight || 0,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: -2, height: 0 },
    shadowRadius: 6,
    elevation: 10,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  content: {
    flex: 1,
    paddingVertical: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
    borderRadius: 15,
    backgroundColor: '#f5f5f5',
    minWidth: 30,
    minHeight: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 18,
    color: '#666',
    fontWeight: 'bold',
  },
  item: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  bottomSection: {
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  authButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#dc3545',
    minHeight: 50,
    justifyContent: 'center',
  },
  signupButton: {
    backgroundColor: '#dc3545',
    borderWidth: 0,
    marginBottom: 0,
  },
  authButtonText1: {
    color: '#dc3545',
    fontWeight: 'bold',
    fontSize: 16,
  },
  authButtonText2: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
})
