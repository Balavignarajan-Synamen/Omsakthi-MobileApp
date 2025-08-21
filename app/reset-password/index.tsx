import Breadcrumb from '@/src/components/breadcrumb'
import { IBreadcrumb } from '@/src/utils/interface/breadcrumb.interface'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
    ActivityIndicator,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function ResetPassword() {
  const router = useRouter()
  const { token, email } = useLocalSearchParams() // ✅ instead of next/navigation

  // ✅ Breadcrumb
  const breadcrumb: IBreadcrumb = {
    title: 'Forget Password',
    path: [
      { label: 'Home', link: '/' },
      { label: 'Login', link: '/login' },
      { label: 'Reset Password', link: undefined },
    ],
  }

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()

  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = (data: any) => {
    setIsLoading(true)

    const postData = {
      email: email,
      token: token,
      password: data?.newpassword,
      password_confirmation: data?.confirmPassword,
    }

    // Simulate API call (replace with apiUserResetPassword)
    setTimeout(() => {
      setIsLoading(false)
      reset()
      router.push('/login')
    }, 2000)
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* ✅ Breadcrumb */}
        <Breadcrumb breadcrumb={breadcrumb} />

        <View className="flex-1 justify-center px-6 py-10">
          <View className="mx-auto w-full max-w-md rounded-2xl border border-gray-300 bg-white p-6 shadow">
            <Text className="mb-4 text-center text-xl font-semibold">
              Reset Password
            </Text>

            {/* New Password */}
            <Text className="mb-1 text-sm">
              New Password <Text className="text-red-600">*</Text>
            </Text>
            <Controller
              control={control}
              name="newpassword"
              rules={{ required: 'New Password is required' }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  className="mb-1 rounded-lg border bg-white px-3 py-2"
                  placeholder="Enter new password"
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.newpassword && (
              <Text className="mb-2 text-xs text-red-500">
                {typeof errors.newpassword?.message === 'string'
                  ? errors.newpassword.message
                  : ''}
              </Text>
            )}

            {/* Confirm Password */}
            <Text className="mb-1 text-sm">
              Confirm Password <Text className="text-red-600">*</Text>
            </Text>
            <Controller
              control={control}
              name="confirmPassword"
              rules={{ required: 'Confirm Password is required' }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  className="mb-1 rounded-lg border bg-white px-3 py-2"
                  placeholder="Enter confirm password"
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.confirmPassword && (
              <Text className="mb-2 text-xs text-red-500">
                {typeof errors.confirmPassword?.message === 'string'
                  ? errors.confirmPassword.message
                  : ''}
              </Text>
            )}

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
              className="mt-4 flex-row items-center justify-center rounded-lg bg-red-600 py-3"
            >
              {!isLoading ? (
                <Text className="font-semibold text-white">Submit</Text>
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
