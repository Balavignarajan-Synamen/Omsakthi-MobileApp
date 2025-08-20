import React from "react";
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

type Props = {
  isVisible: boolean;
  onClose: () => void;
  onLogin: () => void;
  onSignup: () => void;
};

export default function Sidebar({ isVisible, onClose, onLogin, onSignup }: Props) {
  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      {/* Overlay background */}
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1}
        onPress={onClose}
      >
        {/* Sidebar panel */}
        <View style={styles.sidebar}>
          {/* Header section with title and close button */}
          <View style={styles.header}>
            <Text style={styles.title}>Menu</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={[styles.itemText, { color: "red" }]}>Close</Text>
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
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sidebar: {
    width: width * 0.7,
    backgroundColor: "#fff",
    padding: 20,
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: -2, height: 0 },
    shadowRadius: 6,
    elevation: 10,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  item: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  itemText: {
    fontSize: 16,
    color: "#333",
  },
  bottomSection: {
    paddingVertical: 20,
  },
  authButton: {
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "red",
  },
  signupButton: {
    backgroundColor: "red",
    borderWidth: 0,
  },
  authButtonText1: {
    color: "red",
    fontWeight: "bold",
    fontSize: 16,
  },
  authButtonText2: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});