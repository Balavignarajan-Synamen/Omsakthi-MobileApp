// components/Footer.tsx
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
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


      <View style={{ flexDirection: isTablet ? "column" : "row", gap: 12, marginVertical: 16, width: "100%", justifyContent: "center", alignItems: "center" }}>
        <Link
          href="/"
          style={{
        backgroundColor: "#fff",
        color: "#a7150b",
        borderRadius: 8,
        textTransform: "uppercase",
        fontWeight: "600",
        fontSize: isTablet ? 16 : 14,
        paddingVertical: 12,
        paddingHorizontal: 20,
        width: isTablet ? "60%" : "45%",
        textAlign: "center",
        marginBottom: isTablet ? 12 : 0,
          }}
        >
          Donate Us
        </Link>
        <Link
          href="/contact"
          style={{
        backgroundColor: "#fff",
        color: "#a7150b",
        borderRadius: 8,
        textTransform: "uppercase",
        fontWeight: "600",
        fontSize: isTablet ? 16 : 14,
        paddingVertical: 12,
        paddingHorizontal: 20,
        width: isTablet ? "60%" : "45%",
        textAlign: "center",
          }}
        >
          Contact Us
        </Link>
      </View>

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
    width: "100%",
  },
  logoContainer: {
    marginBottom: 10,
  },
  aboutText: {
    textAlign: "center",
    color: "#fff",
    lineHeight: 22,
    marginBottom: 10,
    fontWeight: "bold",
  },
  copyText: {
    textAlign: "center",
    // color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    backgroundColor: "yellow",
    width: "100%",
    paddingVertical: 8,
  },
});
