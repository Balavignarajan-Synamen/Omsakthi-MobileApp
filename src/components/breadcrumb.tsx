import { router } from 'expo-router'
import React from 'react'
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

interface BreadcrumbItem {
  label: string
  link?: string | null // Allow both undefined and null
}

interface BreadcrumbProps {
  breadcrumb: {
    title: string
    path: BreadcrumbItem[]
  }
}

export default function Breadcrumb({ breadcrumb }: BreadcrumbProps) {
  return (
    <ImageBackground
      source={require('../../assets/images/temple.webp')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>{breadcrumb.title}</Text>

        <View style={styles.breadcrumbRow}>
          {breadcrumb?.path?.map((item, index) => {
            const isFirst = index === 0
            const isLast = index === breadcrumb.path.length - 1
            const hasLink = item.link !== undefined && item.link !== null // Check for both existence and non-null

            return (
              <View key={index} style={styles.breadcrumbItem}>
                {isFirst ? (
                  <TouchableOpacity
                    onPress={() => hasLink && router.push(item.link as any)}
                  >
                    <Text style={styles.firstLink}>🏠 {item.label}</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.innerRow}>
                    <Text style={styles.separator}>/</Text>
                    {hasLink && !isLast ? (
                      <TouchableOpacity
                        onPress={() => router.push(item.link as any)}
                      >
                        <Text style={styles.link}>{item.label}</Text>
                      </TouchableOpacity>
                    ) : (
                      <Text style={styles.active}>{item.label}</Text>
                    )}
                  </View>
                )}
              </View>
            )
          })}
        </View>
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  background: {
    height: 160, // like h-40
    width: '100%',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'center',
    margin: 'auto',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  breadcrumbRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  breadcrumbItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  firstLink: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
  },
  innerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  separator: {
    color: '#fff',
    marginHorizontal: 4,
  },
  link: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
  },
  active: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFD700', // yellow for active
  },
})
