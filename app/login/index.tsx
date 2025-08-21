import Breadcrumb from '@/src/components/breadcrumb'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Link, useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Login() {
  // ✅ Correct breadcrumb object for BreadcrumbProps
  const breadcrumb = {
    title: 'Login',
    path: [
      { label: 'Home', link: '/' },
      { label: 'Login' }, // last item usually has no link
    ],
  }

  const router = useRouter()
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()
  const [isLoading, setIsLoading] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState(false)

  const onSubmit = (data: any) => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      reset()
      router.replace('/') // Navigate to home
    }, 2000)
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* ✅ Breadcrumb */}
        <Breadcrumb breadcrumb={breadcrumb} />

        {/* ✅ Login Form */}
        <View className="flex-1 justify-center px-6 py-10">
          <View className="mx-auto w-full max-w-md rounded-2xl border-2 border-yellow-400 bg-yellow-100 p-6 shadow">
            {/* Email */}
            <Text className="mb-1 text-sm">
              Email Address <Text className="text-red-600">*</Text>
            </Text>
            <Controller
              control={control}
              name="email"
              rules={{
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Invalid email',
                },
              }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  className="mb-1 rounded-lg bg-white px-3 py-2"
                  placeholder="Enter email"
                  value={value}
                  onChangeText={onChange}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={{ borderWidth: 0 }}
                />
              )}
            />
            {errors.email && (
              <Text className="mb-2 text-xs text-red-500">
                {typeof errors.email?.message === 'string'
                  ? errors.email.message
                  : ''}
              </Text>
            )}

            {/* Password */}
            <Text className="mb-1 text-sm">
              Password <Text className="text-red-600">*</Text>
            </Text>
            <View className="relative">
              <Controller
                control={control}
                name="password"
                rules={{ required: 'Password is required' }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    className=" rounded-lg bg-white px-3 py-2 pr-10"
                    placeholder="Enter password"
                    value={value}
                    onChangeText={onChange}
                    secureTextEntry={!passwordVisible}
                  />
                )}
              />
              <Pressable
                onPress={() => setPasswordVisible(!passwordVisible)}
                className="absolute right-3 top-3"
              >
                <Ionicons
                  name={passwordVisible ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="gray"
                />
              </Pressable>
            </View>
            {errors.password && (
              <Text className="mb-2 text-xs text-red-500">
                {typeof errors.password?.message === 'string'
                  ? errors.password.message
                  : ''}
              </Text>
            )}

            {/* Remember + Forgot */}
            <View className="mt-2 flex-row items-center justify-between">
              <View className="flex-row items-center">
                <TouchableOpacity className="mr-2 h-4 w-4 rounded border border-gray-400 bg-white" />
                <Text className="text-sm">Remember me</Text>
              </View>
              <Link href="/forget-password" asChild>
                <TouchableOpacity>
                  <Text className="text-sm text-red-600">Forget Password?</Text>
                </TouchableOpacity>
              </Link>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
              className="mt-6 flex-row items-center justify-center rounded-lg bg-red-600 py-3"
            >
              {!isLoading ? (
                <Text className="font-semibold text-white">Login</Text>
              ) : (
                <View className="flex-row items-center space-x-2">
                  <ActivityIndicator size="small" color="yellow" />
                  <Text className="text-white">Please wait...</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
