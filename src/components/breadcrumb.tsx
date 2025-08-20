import { useNavigation } from "@react-navigation/native";
import React from "react";
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface BreadcrumbItem {
  label: string;
  link?: string;
}

interface BreadcrumbProps {
  breadcrumb: {
    title: string;
    path: BreadcrumbItem[];
  };
}

export default function Breadcrumb({ breadcrumb }: BreadcrumbProps) {
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={require("../../assets/images/breadcrumb-bg.png")} // 👈 place your bg image in assets
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>{breadcrumb.title}</Text>

        <View style={styles.breadcrumbRow}>
          {breadcrumb?.path?.map((item, index) => {
            const isFirst = index === 0;
            const isLast = index === breadcrumb.path.length - 1;

            return (
              <View key={index} style={styles.breadcrumbItem}>
                {isFirst ? (
                  <TouchableOpacity
                    onPress={() => item.link && navigation.navigate(item.link as never)}
                  >
                    <Text style={styles.firstLink}>🏠 {item.label}</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.innerRow}>
                    <Text style={styles.separator}>/</Text>
                    {item.link && !isLast ? (
                      <TouchableOpacity
                        onPress={() => navigation.navigate(item.link as never)}
                      >
                        <Text style={styles.link}>{item.label}</Text>
                      </TouchableOpacity>
                    ) : (
                      <Text style={styles.active}>{item.label}</Text>
                    )}
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    height: 160, // like h-40
    width: "100%",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: "center",
    margin: 'auto',
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
    textAlign: 'center',
  },
  breadcrumbRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  breadcrumbItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  firstLink: {
    fontSize: 14,
    fontWeight: "500",
    color: "#fff",
  },
  innerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  separator: {
    color: "#fff",
    marginHorizontal: 4,
  },
  link: {
    fontSize: 14,
    fontWeight: "500",
    color: "#fff",
  },
  active: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFD700", // yellow for active
  },
});
