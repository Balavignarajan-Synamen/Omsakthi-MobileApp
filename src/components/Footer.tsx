// components/Footer.tsx
import { LinearGradient } from 'expo-linear-gradient';
import { Image, StyleSheet, Text, View, useWindowDimensions } from "react-native";


export default function Footer() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768; // breakpoint

  return (
    // <View style={styles.container}>
  <LinearGradient
  colors={['#a7150bf2', '#fd580bf2']} // 95% opacity
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
  style={styles.container}
>

    {/* Logo (responsive, centered) */}
      <View style={[styles.logoContainer, { width }]}>
        <Image
          source={require("../../assets/images/logoacmec-footer.png")}
          style={{
            width: isTablet ? width * 0.5 : width * 0.7,
            height: isTablet ? 80 : 50,
            alignSelf: "center",
          }}
          resizeMode="contain"
        />
      </View>

      {/* About Text */}
      <Text
        style={[
          styles.aboutText,
          { fontSize: isTablet ? 18 : 14, paddingHorizontal: isTablet ? 40 : 20 },
        ]}
      >
        This trust is a non-profitable organization which was founded by H.H.
        Bangaru Adigalar in the year 1978 with a small corpus fund and with few
        cents of land in Melmaruvathur.
      </Text>

      {/* Copyright */}
      <Text
        style={[
          styles.copyText,
          { fontSize: isTablet ? 16 : 12, marginTop: isTablet ? 20 : 10 },
        ]}
      >
        © 2020 ACMEC TRUST - All rights reserved
      </Text>
    {/* </View> */}
</LinearGradient>

  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  backgroundColor: 'rgba(167, 21, 11, 1)', 

  },
  logoContainer: {
    marginBottom: 10,
  },
  aboutText: {
    textAlign: "center",
    color: "#fff", // gray-700
    lineHeight: 22,
    marginBottom: 10,
  },
  copyText: {
    textAlign: "center",
    color: "#fff", // gray-500
  },
});
