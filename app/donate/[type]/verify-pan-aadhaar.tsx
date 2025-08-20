// src/screens/VerifPanAadhaarRN.tsx
import { useAuth } from "@/src/context/auth-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

import {
    apiAadhaarGenerate,
    apiAadhaarVerify,
    apiMobileGenerate,
    apiMobileVerify,
    apiPanVerify,
    apiUserProfile,
} from "@/src/services/api";
import { handleApiErrors } from "@/src/utils/helper/api.helper";

type Props = {
  setShowPersonalAndBilling?: (v: boolean) => void;
  setAadhaarDetails?: (v: any) => void;
  aadhaarDetails?: any;
  setPanDetails?: (v: any) => void;
  typeContent?: { mode?: "e_donation" | string };
  setEdonationVerify?: (v: boolean) => void;
};

export default function VerifPanAadhaarRN({
  setShowPersonalAndBilling = () => {},
  setAadhaarDetails = () => {},
  aadhaarDetails,
  setPanDetails = () => {},
  typeContent,
  setEdonationVerify = () => {},
}: Props) {
  const [chosenVerifyType, setChosenVerifyType] = useState<"pan" | "aadhaar">("pan");

  const [isPanVerifyLoading, setIsPanVerifyLoading] = useState(false);
  const [isAadhaarVerifyLoading, setIsAadhaarVerifyLoading] = useState(false);
  const [isAadhaarOtpVerifyLoading, setIsAadhaarOtpVerifyLoading] = useState(false);
  const [isAadhaarOtpSent, setIsAadhaarOtpSent] = useState(false);

  const [isMobileVerifyLoading, setIsMobileVerifyLoading] = useState(false);
  const [isMobileOtpVerifyLoading, setIsMobileOtpVerifyLoading] = useState(false);
  const [isMobileOtpSent, setIsMobileOtpSent] = useState(false);
  const [isMobileOtpData, setIsMobileOtpData] = useState<any>({});

  const { triggerAuth } = useAuth();

  // PAN
  const {
    control: panControl,
    handleSubmit: verifyPanHandleSubmit,
    reset: verifyPanReset,
    formState: { errors: panErrors },
  } = useForm({ defaultValues: { pan: "" } });

  // Aadhaar
  const {
    control: aadhaarControl,
    handleSubmit: verifyAadhaarHandleSubmit,
    reset: verifyAadhaarReset,
    formState: { errors: aadhaarErrors },
  } = useForm({ defaultValues: { aadhaar: "" } });

  // Aadhaar OTP
  const {
    control: aadhaarOtpControl,
    handleSubmit: verifyAadhaarOtpHandleSubmit,
    reset: verifyAadhaarOtpReset,
    formState: { errors: aadhaarOtpErrors },
  } = useForm({ defaultValues: { otp: "" } });

  // Mobile
  const {
    control: mobileControl,
    handleSubmit: verifyMobileHandleSubmit,
    reset: verifyMobileReset,
    formState: { errors: mobileErrors },
  } = useForm({ defaultValues: { mobile_number: "" } });

  // Mobile OTP
  const {
    control: mobileOtpControl,
    handleSubmit: verifyMobileOtpHandleSubmit,
    reset: verifyMobileOtpReset,
    formState: { errors: mobileOtpErrors },
  } = useForm({ defaultValues: { otp: "" } });

  const successToast = (msg: string) => Alert.alert("Success", msg);
  const errorToast = (msg: string) => Alert.alert("Error", msg);

  // PAN verify
  const onVerifyPanSubmit = async (data: any) => {
    try {
      setIsPanVerifyLoading(true);
      const res = await apiPanVerify(data);
      setPanDetails(res.data);
      successToast("Verified");
      setShowPersonalAndBilling(true);
    } catch (err: any) {
      const message = handleApiErrors(err);
      if (message) errorToast(message);
    } finally {
      setIsPanVerifyLoading(false);
    }
  };

  // Aadhaar generate
  const onVerifyAadhaarSubmit = async (data: any) => {
    try {
      setIsAadhaarVerifyLoading(true);
      const res = await apiAadhaarGenerate(data);
      setAadhaarDetails(res.data);

      if (res.data?.message === "Aadhaar found") {
        setIsAadhaarOtpSent(false);
        setShowPersonalAndBilling(true);
        successToast(res.data?.message);
      } else {
        successToast(res.data?.message);
        setShowPersonalAndBilling(false);
        setIsAadhaarOtpSent(true);
      }
    } catch (err: any) {
      const message = handleApiErrors(err);
      if (message) errorToast(message);
    } finally {
      setIsAadhaarVerifyLoading(false);
    }
  };

  // Aadhaar OTP verify
  const onVerifyAadhaarOtpSubmit = async (data: any) => {
    try {
      setIsAadhaarOtpVerifyLoading(true);
      const payload = {
        aadhaar: aadhaarDetails?.data?.aadhaar,
        request_id: aadhaarDetails?.data?.request_id,
        otp: data?.otp,
      };
      await apiAadhaarVerify(payload);
      successToast("Verified");
      setShowPersonalAndBilling(true);
    } catch (err: any) {
      const message = handleApiErrors(err);
      if (message) errorToast(message);
    } finally {
      setIsAadhaarOtpVerifyLoading(false);
    }
  };

  // Mobile generate
  const onVerifyMobileSubmit = async (data: any) => {
    try {
      setIsMobileVerifyLoading(true);
      const res = await apiMobileGenerate(data);
      setIsMobileOtpData(res?.data);
      successToast(res?.data?.message ?? "OTP sent");
      setShowPersonalAndBilling(false);
      setIsMobileOtpSent(true);
    } catch (err: any) {
      const message = handleApiErrors(err);
      if (message) errorToast(message);
    } finally {
      setIsMobileVerifyLoading(false);
    }
  };

  // Mobile OTP verify
  const onVerifyMobileOtpSubmit = async (data: any) => {
    try {
      setIsMobileOtpVerifyLoading(true);

      const payload = {
        mobile_number: isMobileOtpData?.data?.mobile_number,
        request_id: isMobileOtpData?.data?.request_id,
        otp: data?.otp,
      };

      const res = await apiMobileVerify(payload);

      // Save tokens & user info
      await AsyncStorage.setItem("acmec.api_token", res.data?.token ?? "");
      try {
        const profile = await apiUserProfile();
        await AsyncStorage.setItem("acmec.user_auth_status", "true");
        await AsyncStorage.setItem("acmec.user_name", profile.data?.name ?? "");
        await AsyncStorage.setItem("acmec.user_email", profile.data?.email ?? "");
        await triggerAuth();
      } catch (innerErr: any) {
        const message = handleApiErrors(innerErr);
        if (message) errorToast(message);
      }

      successToast("Verified");
      setShowPersonalAndBilling(true);
      setEdonationVerify(true);
    } catch (err: any) {
      const message = handleApiErrors(err);
      if (message) errorToast(message);
    } finally {
      setIsMobileOtpVerifyLoading(false);
    }
  };

  const TabButton = ({ active, label, onPress, rounded }: { active: boolean; label: string; onPress?: () => void; rounded: "left" | "right" }) => (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} className="h-9">
      <LinearGradient
        colors={active ? ["#f44336", "#ff9800"] : ["transparent", "transparent"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className={[
          "h-9 px-6 items-center justify-center border border-yellow-400",
          rounded === "left" ? "rounded-l-lg" : "rounded-r-lg",
          active ? "shadow" : "",
        ].join(" ")}
      >
        <Text className={active ? "text-white font-bold uppercase" : "text-gray-700 font-semibold uppercase"}>{label}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const GradientButton = ({
    title,
    loading,
    onPress,
  }: {
    title: string;
    loading?: boolean;
    onPress?: () => void;
  }) => (
    <TouchableOpacity onPress={onPress} disabled={loading} activeOpacity={0.9} className="mt-2 w-auto self-start rounded-lg overflow-hidden">
      <LinearGradient colors={["#f44336", "#ff9800"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="px-6 py-2">
        <View className="flex-row items-center">
          {loading ? <ActivityIndicator /> : null}
          <Text className="text-white font-bold ml-2">{loading ? "Please wait..." : title}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      {typeContent?.mode === "e_donation" ? (
        <View className="border-2 border-yellow-400 bg-yellow-100/50 rounded-lg p-4 mt-5">
          <View className="flex flex-col gap-3 mb-4">
            <Text className="text-base text-gray-700">Please verify your Mobile to continue.</Text>
            <View className="flex-row">
              <View className="w-24">
                <LinearGradient colors={["#f44336", "#ff9800"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="h-9 rounded-lg items-center justify-center border border-yellow-400">
                  <Text className="text-white font-bold">MOBILE</Text>
                </LinearGradient>
              </View>
            </View>
          </View>

          {/* Mobile Number Form */}
          <View className="gap-2">
            {!isMobileOtpSent && (
              <View>
                <Controller
                  control={mobileControl}
                  name="mobile_number"
                  rules={{ required: "Mobile is required" }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Enter Your Mobile No."
                      keyboardType="phone-pad"
                      className="w-full rounded-lg px-3 py-3 bg-white border border-gray-300"
                    />
                  )}
                />
                {mobileErrors.mobile_number && <Text className="text-red-600 mt-1">{String(mobileErrors.mobile_number.message)}</Text>}

                <GradientButton title="Get OTP" loading={isMobileVerifyLoading} onPress={verifyMobileHandleSubmit(onVerifyMobileSubmit)} />
              </View>
            )}

            {/* Mobile OTP Form */}
            {isMobileOtpSent && (
              <View className="mt-3">
                <Text className="text-sm mb-1">
                  Enter OTP <Text className="text-red-600">*</Text>
                </Text>
                <Controller
                  control={mobileOtpControl}
                  name="otp"
                  rules={{ required: "OTP is required" }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Enter OTP"
                      keyboardType="number-pad"
                      className="w-full rounded-lg px-3 py-3 bg-white border border-gray-300"
                    />
                  )}
                />
                {mobileOtpErrors.otp && <Text className="text-red-600 mt-1">{String(mobileOtpErrors.otp.message)}</Text>}

                <GradientButton title="Submit" loading={isMobileOtpVerifyLoading} onPress={verifyMobileOtpHandleSubmit(onVerifyMobileOtpSubmit)} />
              </View>
            )}
          </View>
        </View>
      ) : (
        <View className="border-2 border-yellow-400 bg-yellow-100/50 rounded-lg p-4 mt-5">
          <View className="mb-4">
            <Text className="text-lg font-semibold text-red-600 mb-3">Please verify your PAN or Aadhaar card to continue.</Text>

            <View className="flex-row">
              <TabButton
                label="PAN"
                rounded="left"
                active={chosenVerifyType === "pan"}
                onPress={() => {
                  setChosenVerifyType("pan");
                  verifyPanReset();
                  setIsAadhaarOtpSent(false);
                }}
              />
              <TabButton
                label="Aadhaar"
                rounded="right"
                active={chosenVerifyType === "aadhaar"}
                onPress={() => {
                  setChosenVerifyType("aadhaar");
                  verifyAadhaarReset();
                }}
              />
            </View>
          </View>

          {/* PAN FORM */}
          {chosenVerifyType === "pan" ? (
            <View>
              <Controller
                control={panControl}
                name="pan"
                rules={{ required: "PAN is required" }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Enter Your PAN No."
                    autoCapitalize="characters"
                    className="w-full rounded-lg px-3 py-3 bg-white border border-gray-300"
                  />
                )}
              />
              {panErrors.pan && <Text className="text-red-600 mt-1">{String(panErrors.pan.message)}</Text>}

              <GradientButton title="Verify" loading={isPanVerifyLoading} onPress={verifyPanHandleSubmit(onVerifyPanSubmit)} />
            </View>
          ) : (
            <>
              {/* AADHAAR FORM */}
              {!isAadhaarOtpSent && (
                <View>
                  <Controller
                    control={aadhaarControl}
                    name="aadhaar"
                    rules={{ required: "Aadhaar is required" }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <TextInput
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder="Enter Your Aadhaar No."
                        keyboardType="number-pad"
                        className="w-full rounded-lg px-3 py-3 bg-white border border-gray-300"
                      />
                    )}
                  />
                  {aadhaarErrors.aadhaar && <Text className="text-red-600 mt-1">{String(aadhaarErrors.aadhaar.message)}</Text>}

                  <GradientButton title="Get OTP" loading={isAadhaarVerifyLoading} onPress={verifyAadhaarHandleSubmit(onVerifyAadhaarSubmit)} />
                </View>
              )}

              {/* AADHAAR OTP FORM */}
              {isAadhaarOtpSent && (
                <View className="mt-3">
                  <Text className="text-sm mb-1">
                    Enter OTP <Text className="text-red-600">*</Text>
                  </Text>
                  <Controller
                    control={aadhaarOtpControl}
                    name="otp"
                    rules={{ required: "OTP is required" }}
                    render={({ field: { value, onChange, onBlur} }) => (
                      <TextInput
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder="Enter OTP"
                        keyboardType="number-pad"
                        className="w-full rounded-lg px-3 py-3 bg-white border border-gray-300"
                      />
                    )}
                  />
                  {aadhaarOtpErrors.otp && <Text className="text-red-600 mt-1">{String(aadhaarOtpErrors.otp.message)}</Text>}

                  <GradientButton title="Submit" loading={isAadhaarOtpVerifyLoading} onPress={verifyAadhaarOtpHandleSubmit(onVerifyAadhaarOtpSubmit)} />
                </View>
              )}
            </>
          )}
        </View>
      )}
    </ScrollView>
  );
}
