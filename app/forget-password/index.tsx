import Breadcrumb from '@/src/components/breadcrumb'
import { apiUserForgetPassword } from '@/src/services/api'
import { handleApiErrors } from '@/src/utils/helper/api.helper'
import { IBreadcrumb } from '@/src/utils/interface/breadcrumb.interface'
import { Link, useRouter } from 'expo-router'
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

export default function ForgetPassword() {
  const router = useRouter()

  // ✅ Breadcrumb (same structure as Next.js version)
  const breadcrumb: IBreadcrumb = {
    title: 'Forget Password',
    path: [
      { label: 'Home', link: '/' },
      { label: 'Login', link: '/login' },
      { label: 'Forget Password', link: undefined },
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

    apiUserForgetPassword(data)
      .then((res: any) => {
        if (res.data?.message) {
          console.log(res.data?.message)
        }
        setIsLoading(false)
        reset() // ✅ clear form after success
      })
      .catch((err: any) => {
        setIsLoading(false)
        const message: string | null = handleApiErrors(err)
        if (message) console.log(message)
      })
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* ✅ Breadcrumb */}
        <Breadcrumb breadcrumb={breadcrumb} />

        <View className="flex-1 justify-center px-6 py-10">
          <View className="mx-auto w-full max-w-md rounded-2xl border border-gray-300 bg-white p-6 shadow">
            {/* Form */}
            <Text className="mb-4 text-center text-xl font-semibold">
              Forget Password
            </Text>

            {/* Email Input */}
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
                  message: 'Invalid email address',
                },
              }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  className="mb-1 rounded-lg border bg-white px-3 py-2"
                  placeholder="Enter email"
                  value={value}
                  onChangeText={onChange}
                  keyboardType="email-address"
                  autoCapitalize="none"
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

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
              className="mt-4 flex-row items-center justify-center rounded-lg bg-red-600 py-3"
            >
              {!isLoading ? (
                <Text className="font-semibold text-white">Reset Password</Text>
              ) : (
                <View className="flex-row items-center space-x-2">
                  <ActivityIndicator size="small" color="yellow" />
                  <Text className="text-white">Please wait...</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Sign in Link */}
            <View className="mt-4 flex-row justify-center">
              <Text className="text-sm">Already have an account? </Text>
              <Link href="/login" asChild>
                <TouchableOpacity>
                  <Text className="text-sm font-semibold text-red-600">
                    Sign in
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
