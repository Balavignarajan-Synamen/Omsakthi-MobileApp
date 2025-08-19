import { FontAwesome } from "@expo/vector-icons";
import React from 'react';
import {
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface SidebarProps {
  isVisible: boolean;
  onClose: () => void;
  onLogin: () => void;
  onSignup: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isVisible, onClose, onLogin, onSignup }) => {
  const { width } = Dimensions.get('window');
  const isTablet = width >= 768;
  const sidebarWidth = isTablet ? width * 0.4 : width * 0.8;

  // Animation for sidebar
  const translateX = new Animated.Value(sidebarWidth);

  React.useEffect(() => {
    if (isVisible) {
      Animated.timing(translateX, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateX, {
        toValue: sidebarWidth,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay */}
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1}
        onPress={onClose}
      />
      
      {/* Sidebar */}
      <Animated.View 
        style={[
          styles.sidebar, 
          { 
            width: sidebarWidth,
            transform: [{ translateX }]
          }
        ]}
      >
        {/* Top Section */}
        <View style={styles.topSection}>
          <Text style={styles.menuTitle}>Menu</Text>
          <TouchableOpacity onPress={onClose}>
            <FontAwesome name="close" size={24} color="black" />
          </TouchableOpacity>
        </View>
        
        
        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          <TouchableOpacity 
            style={styles.authButton}
            onPress={onLogin}
          >
            <Text style={styles.authButtonText1}>Login</Text>
          </TouchableOpacity>
         <TouchableOpacity 
            style={[styles.authButton, styles.signupButton]}
            onPress={onSignup}
          >
            <Text style={styles.authButtonText2}>Register</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 100,
  },
  sidebar: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#fff',
    zIndex: 101,
    padding: 20,
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#555',
    marginTop: 30,
  },
  menuTitle: {
    // color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  middleSection: {
    marginVertical: 30,
  },
  authButton: {
    backgroundColor: 'white',
    borderColor: 'red',
    borderWidth: 2,
    color: 'blue',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },
  signupButton: {
    backgroundColor: '#dc2626',
  },
    authButtonText1: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 16,
  },
  authButtonText2: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  bottomSection: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  bottomButton: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#555',
  },
  bottomButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Sidebar;