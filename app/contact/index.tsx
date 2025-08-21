// app/contact.tsx
import Breadcrumb from "@/src/components/breadcrumb";
import { apiCmsContact } from "@/src/services/api";
import { handleApiErrors } from "@/src/utils/helper/api.helper";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

type ContactForm = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export default function ContactScreen() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactForm>({
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: ContactForm) => {
    try {
      setIsLoading(true);
      const res = await apiCmsContact(data);
      console.log("Contact response =>", res);
      Alert.alert("Success", "Your message has been sent.");
      reset();
    } catch (err: any) {
      const message = handleApiErrors(err) ?? "Something went wrong.";
      Alert.alert("Error", message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ paddingBottom: 24 }}>
      {/* Breadcrumb */}
      <Breadcrumb
        breadcrumb={{
          title: "Contact",
          path: [
            { label: "Home", link: "/" },
            { label: "Contact", link: undefined },
          ],
        }}
      />

      <View className="px-4">
        <View className={`w-full ${isTablet ? "flex-row gap-5" : "flex-col gap-5"}`}>
          {/* Left: Form */}
          <View className={`${isTablet ? "flex-1" : ""}`}>
            <View className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm">
              {/* Name */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-neutral-800 mb-1">Name</Text>
                <Controller
                  control={control}
                  name="name"
                  rules={{ required: "Name is required" }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-neutral-900"
                      placeholder="Enter your name"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
                {errors.name && <Text className="text-red-600 mt-1 text-xs">{errors.name.message}</Text>}
              </View>

              {/* Email */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-neutral-800 mb-1">Email Address</Text>
                <Controller
                  control={control}
                  name="email"
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
                      message: "Invalid email address",
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-neutral-900"
                      placeholder="your@email.com"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
                {errors.email && <Text className="text-red-600 mt-1 text-xs">{errors.email.message}</Text>}
              </View>

              {/* Subject */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-neutral-800 mb-1">Subject</Text>
                <Controller
                  control={control}
                  name="subject"
                  rules={{ required: "Subject is required" }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-neutral-900"
                      placeholder="Subject"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
                {errors.subject && <Text className="text-red-600 mt-1 text-xs">{errors.subject.message}</Text>}
              </View>

              {/* Message */}
              <View className="mb-5">
                <Text className="text-sm font-medium text-neutral-800 mb-1">Message</Text>
                <Controller
                  control={control}
                  name="message"
                  rules={{ required: "Message is required" }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-neutral-900"
                      placeholder="Type your message..."
                      multiline
                      numberOfLines={5}
                      textAlignVertical="top"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
                {errors.message && <Text className="text-red-600 mt-1 text-xs">{errors.message.message}</Text>}
              </View>

              {/* Submit */}
              <View>
                {!isLoading ? (
                  <TouchableOpacity
                    onPress={handleSubmit(onSubmit)}
                    className="bg-red-600 rounded-xl py-3 items-center justify-center"
                    activeOpacity={0.8}
                  >
                    <Text className="text-white font-semibold">Submit</Text>
                  </TouchableOpacity>
                ) : (
                  <View className="bg-red-600 rounded-xl py-3 items-center justify-center">
                    <ActivityIndicator size="small" color="white" />
                    <Text className="text-white font-medium mt-2">Please wait ...</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Right: Contact Info */}
          <View className={`${isTablet ? "flex-1" : ""}`}>
            <View className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm">
              <Text className="text-lg font-semibold text-red-700 mb-2">
                Adhiparasakthi Charitable Medical Educational and Cultural Trust
              </Text>
              <Text className="text-neutral-700 mb-4">
                No.1 GST Road, Adhiparasakthi Siddhar Peedam Temple Campus, Melmaruvathur,
                Chengalpet District, TamilNadu-603319, India
              </Text>

              <View className="divide-y divide-neutral-200">
                <View className="py-3 flex-row items-center">
                  <Text className="font-medium text-neutral-800 mr-2">Email:</Text>
                  <Text className="text-neutral-700">contact@acmectrust.org</Text>
                </View>
                <View className="py-3 flex-row items-center">
                  <Text className="font-medium text-neutral-800 mr-2">Landline:</Text>
                  <Text className="text-neutral-700">+91 44 2752 9313</Text>
                </View>
                <View className="py-3 flex-row items-center">
                  <Text className="font-medium text-neutral-800 mr-2">Mobile:</Text>
                  <Text className="text-neutral-700">+91 91500 45391</Text>
                </View>
                <View className="py-3 flex-row items-center">
                  <Text className="font-medium text-neutral-800 mr-2">Timing:</Text>
                  <Text className="text-red-700 font-semibold">8:00 AM To 8:00 PM</Text>
                </View>
                <View className="py-3 flex-row items-center">
                  <Text className="font-medium text-neutral-800 mr-2">Public Relation Office:</Text>
                  <Text className="text-red-700 font-semibold">+91 44 27529276</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
