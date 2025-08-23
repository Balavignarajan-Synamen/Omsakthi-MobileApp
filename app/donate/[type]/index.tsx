import Breadcrumb from '@/src/components/breadcrumb'
import { useAuth } from '@/src/context/auth-context'
import DateTimePicker from '@react-native-community/datetimepicker'

import {
  apiCreateDonations,
  apiDonationTypeBySlug,
  apiGetCountries,
  apiGetReceipt,
  apiGetStates,
  apiRazorpayCreate,
  apiUserProfile,
  apiUserRegister,
} from '@/src/services/api'
import { handleApiErrors } from '@/src/utils/helper/api.helper'
import { generateUUID } from '@/src/utils/helper/glober.helper'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Link, useLocalSearchParams, useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Platform,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import DonateCheckout from './checkout'
import DonateReceipt from './receipt'
import VerifPanAadhaarRN from './verify-pan-aadhaar'

// Custom Picker component to replace @react-native-picker/picker
const CustomPicker = ({
  items,
  selectedValue,
  onValueChange,
  enabled = true,
  placeholder = 'Select an option',
}: any) => {
  const [modalVisible, setModalVisible] = useState(false)

  const selectedItem = items.find((item: any) => item.value === selectedValue)

  return (
    <>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className={`rounded-lg border border-gray-300 p-3 ${enabled ? '' : 'bg-gray-100'}`}
        disabled={!enabled}
      >
        <Text className={selectedValue ? 'text-black' : 'text-gray-400'}>
          {selectedItem ? selectedItem.label : placeholder}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="max-h-3/4 rounded-t-3xl bg-white p-4">
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-lg font-semibold">Select an option</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text className="text-lg text-acmec-red">Done</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={items}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    onValueChange(item.value)
                    setModalVisible(false)
                  }}
                  className={`border-b border-gray-100 p-3 ${
                    selectedValue === item.value ? 'bg-acmec-red/10' : ''
                  }`}
                >
                  <Text
                    className={
                      selectedValue === item.value
                        ? 'font-semibold text-acmec-red'
                        : 'text-black'
                    }
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </>
  )
}

export default function DonateType() {
  const params = useLocalSearchParams()
  const type = params.type as string
  const trustId = params.trust_id as string
  const router = useRouter()
  const { triggerAuth, isAuthenticated } = useAuth()

  const [breadcrumb, setBreadcrumb] = useState({
    title: 'Donate',
    path: [
      { label: 'Home', link: 'index' },
      { label: 'Donate', link: `/donate?trust_id=${trustId}` },
    ],
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
    trigger,
    unregister,
    watch,
  } = useForm({})

  const [screenType, setScreenType] = useState<'form' | 'checkout' | 'receipt'>(
    'form',
  )
  const [isTypeContentLoading, setIsTypeContentLoading] =
    useState<boolean>(true)
  const [typeContent, setTypeContent] = useState<any>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showPersonalAndBilling, setShowPersonalAndBilling] =
    useState<boolean>(true)
  const [typeContentItems, setTypeContentItems] = useState<any>([])
  const [countries, setCountries] = useState<any>({})
  const [states, setStates] = useState<any>({})
  const [aadhaarDetails, setAadhaarDetails] = useState<any>({})
  const [panDetails, setPanDetails] = useState<any>({})
  const [donationInfo, setDonationInfo] = useState<any>({})
  const [changedItems, setChangedItems] = useState<number[]>([])
  const [isCheckoutLoading, setIsCheckoutLoading] = useState<boolean>(false)
  const [isReceiptLoading, setIsReceiptLoading] = useState<boolean>(false)
  const [uuid, setUuid] = useState<string>('')
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false)
  const [isAuthStatus, setIsAuthStatus] = useState<boolean>(true)
  // const [selectedDates, setSelectedDates] = useState<any>([new Date()])
  const [selectedDates, setSelectedDates] = useState<any>([null]) // Always at least one, show placeholder

  const [includeCourier, setIncludeCourier] = useState(false)
  const [selectedAmount, setSelectedAmount] = useState<number>(0)
  const [qty, setQty] = useState<number>(1)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [eDonationVerify, setEdonationVerify] = useState<boolean>(false)
  const [latcharchanaiAmount, setLatcharchanaiAmount] = useState<any>(0)
  const [includeDailyAbhisegam, setIncludeDailyAbhisegam] = useState(false)
  const [dailyAbhisegamAmount, setDailyAbhisegamAmount] = useState(0)
  const [dateError, setDateError] = useState(false)
  const [isQtyChanged, setIsQtyChanged] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState<number | null>(null)
  const [userAuthStatus, setUserAuthStatus] = useState<boolean>(false)
  const [fixedAmount, setFixedAmount] = useState<number | null>(null)

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'members',
  })

  const maxMembers = 5
  const canAddMore = fields.length < maxMembers

  // --- Watch values ---
  const watchAmount = watch('amount')
  const watchDonationType = watch('donatetype')
  const watchCountry = watch('country')
  const watchState = watch('state')

  useEffect(() => {
    if (type) donationTypes(type)
  }, [type])

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authStatus = await AsyncStorage.getItem('acmec.user_auth_status')
        console.log('Auth status from storage:', authStatus)
        if (authStatus === 'true') {
          setIsAuthStatus(false)
          setUserAuthStatus(true)
        } else {
          setIsAuthStatus(true)
          setUserAuthStatus(false)
        }
      } catch (err) {
        console.error('Error reading auth status:', err)
      }
    }

    checkAuth()
  }, [])

  useEffect(() => {
    getCountries()
  }, [])

  useEffect(() => {
    setValue('name', aadhaarDetails?.data?.user_full_name)
  }, [aadhaarDetails])

  useEffect(() => {
    setValue('name', panDetails?.data?.user_full_name)
  }, [panDetails])

  // Dynamically load states whenever country changes
  useEffect(() => {
    if (watchCountry) {
      getStates(watchCountry)
      setValue('state', '') // Reset state when country changes
      setStates({})
    }
  }, [watchCountry])

  useEffect(() => {
    let items = typeContent?.items || []
    items = items.map((item: any) => ({
      name: item.name,
      description: item.description,
      amount: item.amount,
      qty: 0,
      date: item?.date,
    }))

    setTypeContentItems(items)
  }, [typeContent])

  const donationTypes = (slug: string) => {
    const params = { trust_id: trustId }
    apiDonationTypeBySlug(slug, params)
      .then((res: any) => {
        setIsTypeContentLoading(false)
        setTypeContent(res.data)
        setLatcharchanaiAmount(res.data?.amount)

        // Set fixed amount if applicable
        if (
          res.data?.amount &&
          !res.data?.minimum_amount &&
          !res.data?.has_items &&
          !res.data?.has_members
        ) {
          setFixedAmount(res.data.amount)
          setValue('amount', res.data.amount.toString())
        }

        setBreadcrumb({
          title: res.data.name,
          path: [
            { label: 'Home', link: '/' },
            { label: 'Donate', link: `/donate?trust_id=${trustId}` },
            { label: res.data.name, link: '' },
          ],
        })
        if (res.data?.mode === 'e_donation') {
          setShowPersonalAndBilling(false)
        }

        if (res.data?.mode === 'eighty_g') {
          setShowPersonalAndBilling(false)
        }
      })
      .catch((err: any) => {
        const message: string | null = handleApiErrors(err)
        if (message) console.error(message)
        setIsTypeContentLoading(false)
      })
  }

  const getCountries = () => {
    apiGetCountries()
      .then((res: any) => {
        setCountries(res.data)
      })
      .catch((err: any) => {
        const message: string | null = handleApiErrors(err)
        if (message) console.error(message)
      })
  }

  const handleCountryChange = (value: string) => {
    getStates(value)
  }

  const getStates = (country_id: any) => {
    apiGetStates(country_id)
      .then((res: any) => {
        setStates(res.data)
      })
      .catch((err: any) => {
        const message: string | null = handleApiErrors(err)
        if (message) console.error(message)
      })
  }

  const handleQtyChange = (newQty: number, index: number) => {
    setTypeContentItems((prevItems: any) =>
      prevItems.map((item: any, i: number) =>
        i === index ? { ...item, qty: newQty } : item,
      ),
    )
    setValue(`qty-${index}`, newQty)
    if (!changedItems.includes(index)) {
      setChangedItems((prev) => [...prev, index])
    }
  }

  const handleNavaratriabhishegamQtyChange = (
    newQty: number,
    index: number,
    date: string,
    itemAmount: any,
  ) => {
    setIsQtyChanged(true)
    setTypeContentItems((prevItems: any) => {
      const updatedItems = prevItems.map((item: any, i: number) => {
        if (i === index) {
          const amount = newQty * (itemAmount || typeContent?.amount)
          return { ...item, qty: newQty, amount, date: date }
        }
        return item
      })

      return updatedItems
    })

    setValue(`qty-${index}`, newQty)
  }

  useEffect(() => {
    if (
      typeContent?.item_has_name &&
      typeContent?.has_items &&
      typeContent?.item_has_count &&
      !typeContent?.item_has_date
    ) {
      const defaultIndex = 0
      const defaultItem = typeContent.items[defaultIndex]
      const defaultAmount = defaultItem.amount
      const defaultQty = 1

      const initializedItems = typeContent.items.map(
        (item: any, index: number) => ({
          ...item,
          qty: index === defaultIndex ? defaultQty : 0,
        }),
      )

      setSelectedIndex(defaultIndex)
      setSelectedAmount(defaultAmount)
      setQty(defaultQty)
      setTypeContentItems(initializedItems)
      setValue('donatetype', defaultAmount)
      setValue('qty', defaultQty)
    }
  }, [typeContent])

  const handleDonationChange = (value: string) => {
    const selectedAmount = Number(value)
    const initialQty = 1
    const total = selectedAmount * initialQty

    const newIndex = typeContentItems.findIndex(
      (item: any) => item.amount === selectedAmount,
    )

    const updatedItems = typeContentItems.map((item: any, index: any) => {
      if (index === newIndex) {
        return { ...item, qty: initialQty, amount: total }
      }
      if (index === selectedIndex) {
        return { ...item, qty: 0 }
      }
      return item
    })

    setTypeContentItems(updatedItems)
    setSelectedAmount(selectedAmount)
    setQty(initialQty)
    setSelectedIndex(newIndex)
    setValue('donatetype', selectedAmount)
    setValue('qty', initialQty)
  }

  const handleSingleQtyChange = (value: string) => {
    const newQty = Number(value)
    setQty(newQty)
    setValue('qty', newQty)

    const updatedItems = typeContentItems.map((item: any, index: any) =>
      index === selectedIndex
        ? {
            ...item,
            qty: newQty,
            amount: newQty * selectedAmount,
          }
        : item,
    )

    setTypeContentItems(updatedItems)
  }

  const handleClear = () => {
    setTypeContentItems((prevItems: any) =>
      prevItems.map((item: any, index: number) => ({
        ...item,
        qty: index === 0 ? 1 : 0,
      })),
    )
  }

  const handleReset = () => {
    setIsQtyChanged(false)
    setTypeContentItems((prevItems: any) =>
      prevItems.map((item: any, index: number) => ({
        ...item,
        qty: 0,
        amount: 0,
      })),
    )

    typeContentItems.forEach((_: any, index: any) => {
      setValue(`qty-${index}`, 0)
    })
  }

  const handleonSubmit = async (data: any) => {
    setIsLoading(true)

    let finalAmount = data?.amount || 0
    let finalItems: any = []

    // Handle different donation types
    if (
      typeContent?.item_has_name &&
      typeContent?.item_has_count &&
      typeContent?.item_has_amount
    ) {
      finalAmount = typeContentItems.reduce(
        (accumulator: any, item: any) => accumulator + item.amount * item.qty,
        0,
      )

      finalItems = typeContentItems
        .filter((item: any) => item.qty !== 0)
        .map((item: any) => ({
          name: item.name,
          count: Number(item.qty) || 0,
        }))
    } else if (typeContent?.has_dates && typeContent?.date_list) {
      const dates = Array.isArray(data.date) ? data.date : [data.date]

      finalItems = dates.map((d: string) => ({
        name: data?.donatetype || typeContent?.code,
        count: 1,
        date: formatDateToYMD(d),
      }))
    } else if (
      typeContent?.has_dates &&
      data?.date &&
      typeContent?.date_list == null
    ) {
      const dates = Array.isArray(data.date) ? data.date : [data.date]

      finalItems = dates.map((d: string) => ({
        name: data?.donatetype || typeContent?.code,
        count: 1,
        date: formatDateToYMD(d),
      }))
    } else if (typeContent?.item_has_date && data?.date) {
      finalItems = typeContentItems
        .filter((item: any) => item.qty !== 0)
        .map((item: any) => ({
          name: item.name,
          count: item.qty,
          amount: item?.amount,
          date: formatDateToYMD(data?.date),
        }))
    } else if (typeContent?.has_items && typeContent?.item_has_count) {
      finalAmount = data?.donatetype
      finalItems = typeContentItems
        .filter((item: any) => item.qty !== 0)
        .map((item: any) => ({
          name: item.name,
          count: item.qty,
          amount: data?.donatetype,
        }))
    } else if (eDonationVerify) {
      finalItems = [
        { name: data?.donatetype, amount: data?.amount, email: data?.email },
      ]
    } else if (typeContent?.has_members) {
      finalAmount = latcharchanaiAmount
      finalItems = [
        {
          name: data.name,
          nakshatra: data.nakshatra,
        },
        ...data.members,
      ]
    } else if (
      typeContent?.item_has_name &&
      typeContent?.has_items &&
      typeContent?.item_has_count &&
      typeContent?.item_has_date
    ) {
      finalAmount = totalAmount
      finalItems = typeContentItems
        .filter((item: any) => item.qty !== 0)
        .map((item: any) => ({
          name: item.name,
          count: item.qty,
          amount: item?.amount,
          date: item?.date?.replace(/-/g, '/'),
        }))
    } else {
      // Default case for simple donations
      finalItems = [
        {
          name: data?.donatetype || typeContent?.code,
          count: Number(data?.qty) || 1,
        },
      ]
    }

    // Ensure all items have required fields
    finalItems = finalItems.map((item: any) => ({
      name: item.name || typeContent?.code,
      count: item.count || 1,
      amount: item.amount || finalAmount,
      // date: item.date || formatDateToYMD(new Date()),
      ...item,
    }))

    const postData = {
      uuid: generateUUID(),
      donation_type_id: typeContent?.id,
      amount: finalAmount,
      first_name: data?.name,
      email: data?.email,
      phone: data?.phone,
      state_code: data?.state,
      country_code: data?.country,
      address1: data?.addressline1,
      address2: data?.addressline2,
      postal_code: data?.postalcode,
      payment_method: 'razorpay',
      items: finalItems,
      trust_id: trustId,
      pan: panDetails?.data?.pan_number,
      aadhaar: aadhaarDetails?.data?.pan_number,
      city: data?.city,
      details: data?.details,
    }

    console.log('Posting donation payload:', postData)

    AsyncStorage.setItem('uuid', postData?.uuid)

    if (isShowPassword && userAuthStatus) {
      try {
        const registerResponse = await apiUserRegister({
          name: data?.name,
          email: data?.email,
          password: data?.password,
          phone: data?.phone,
        })

        const token = registerResponse.data?.token
        if (token) {
          AsyncStorage.setItem('acmec.api_token', token)
          const profileResponse = await apiUserProfile()
          setIsLoading(false)
          reset()
          AsyncStorage.setItem('acmec.user_auth_status', 'true')
          AsyncStorage.setItem('acmec.user_name', profileResponse.data?.name)
          AsyncStorage.setItem('acmec.user_email', profileResponse.data?.email)
          setUserAuthStatus(true)
          setIsAuthStatus(false)
          triggerAuth()
        }

        const donationResponse = await apiCreateDonations(postData)
        setIsLoading(false)
        setDonationInfo(donationResponse.data)
        setScreenType('checkout')
      } catch (err: any) {
        setIsLoading(false)
        const message: string | null = handleApiErrors(err)
        if (message) Alert.alert('Error', message)
      }
    } else {
      try {
        const donationResponse = await apiCreateDonations(postData)
        setIsLoading(false)
        setDonationInfo(donationResponse.data)
        setScreenType('checkout')
      } catch (err: any) {
        setIsLoading(false)
        const message: string | null = handleApiErrors(err)
        if (message) Alert.alert('Error', message)
      }
    }
  }

  const payRazorpay = () => {
    setIsCheckoutLoading(true)
    const postData = { donation_id: donationInfo?.id }
    apiRazorpayCreate(postData)
      .then((res: any) => {
        // Razorpay integration would go here
        Alert.alert('Payment', 'Razorpay integration would be implemented here')
        setIsCheckoutLoading(false)
      })
      .catch((err: any) => {
        const message: string | null = handleApiErrors(err)
        if (message) console.error(message)
        setIsCheckoutLoading(false)
      })
  }

  const getDonationReceipt = async () => {
    setIsReceiptLoading(true)
    const postData = {
      donation_id: donationInfo?.id,
      uuid: await AsyncStorage.getItem('uuid'),
    }

    try {
      const response = await apiGetReceipt(postData)
      Alert.alert('Receipt', 'Receipt downloaded successfully')
    } catch (error) {
      const message: string | null = handleApiErrors(error)
      if (message) console.error(message)
    } finally {
      setIsReceiptLoading(false)
    }
  }

  const handleCreateAccount = (value: boolean) => {
    setIsShowPassword(value)
  }

  // --- Date helpers/handlers, improved UX & state management ---
  function formatDateToYMD(date: any): string {
    if (!date) return ''
    const d = date instanceof Date ? date : new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}/${month}/${day}`
  }
  // Adds new empty date for multi-date scenarios
  const addDate = () => {
    setSelectedDates([...selectedDates, null])
  }
  // Remove a selected date
  const removeDate = (index: number) => {
    setSelectedDates((prevDates: any[]) => {
      const newDates = prevDates.filter((_, i) => i !== index)
      return newDates.length ? newDates : [null]
    })
    unregister(`date.${index}`)
  }
  // Unified date change handler
  const handleDateChange = (index: number, event: any, selectedDate?: Date) => {
    if (event.type === 'dismissed') {
      setShowDatePicker(null)
      return
    }
    if (selectedDate) {
      setSelectedDates((prevDates: any) => {
        const updated = [...prevDates]
        updated[index] = selectedDate
        return updated
      })
      setValue(`date.${index}`, selectedDate)
      setDateError(false)
    }
    setShowDatePicker(null)
  }

  const allowedDates =
    typeContent?.date_list?.map((d: string) => new Date(d)) || []

  const modifiedQtyCount = typeContentItems.filter(
    (item: any) => item.qty > 0,
  ).length

  const totalAmount =
    typeContentItems.reduce(
      (acc: any, item: any) => acc + item.qty * (typeContent?.amount || 0),
      0,
    ) +
    (includeCourier ? typeContent?.postal_fee : 0) +
    (includeDailyAbhisegam && isQtyChanged
      ? dailyAbhisegamAmount * modifiedQtyCount
      : 0)

  if (isTypeContentLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <StatusBar style="dark" />
        <View className="p-4">
          {Array.from({ length: 10 }, (_, index) => (
            <View
              key={index}
              className="mb-2 h-4 rounded-lg bg-gray-100"
            ></View>
          ))}
        </View>
      </SafeAreaView>
    )
  }

  if (!typeContent) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <StatusBar style="dark" />
        <View className="flex-1 items-center justify-center p-4">
          <Text className="mb-4 text-2xl font-bold text-acmec-red">
            404 Page not found
          </Text>
          <Text className="mb-8 text-center text-base text-gray-600">
            Looks like something's broken. It's not you it's us. How about going
            back to the home page?
          </Text>
          <TouchableOpacity
            className="rounded-lg bg-gray-200 px-4 py-2"
            onPress={() => router.push('/')}
          >
            <Text className="text-sm font-semibold uppercase text-gray-700">
              Back to Home
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  if (screenType === 'checkout') {
    return (
      <>
        <Breadcrumb breadcrumb={breadcrumb} />
        <DonateCheckout
          donationInfo={donationInfo}
          setIsCheckoutLoading={setIsCheckoutLoading}
          isCheckoutLoading={isCheckoutLoading}
          payRazorpay={payRazorpay}
        />
      </>
    )
  }

  if (screenType === 'receipt') {
    return (
      <>
        <Breadcrumb breadcrumb={breadcrumb} />
        <DonateReceipt
          isReceiptLoading={isReceiptLoading}
          getDonationReceipt={getDonationReceipt}
          setIsReceiptLoading={setIsReceiptLoading}
        />
      </>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Breadcrumb breadcrumb={breadcrumb} />
      <StatusBar style="dark" />
      <ScrollView
        className="flex-1 p-4"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="mb-6 items-center">
          <Text className="mb-2 text-xl font-bold text-acmec-red md:text-2xl">
            Donate Now
          </Text>
          <View className="mb-4 h-1 w-32 bg-acmec-red"></View>
        </View>

        <View className="space-y-4">
          <View className="my-3 flex-row items-center">
            <Switch
              value={isShowPassword}
              onValueChange={handleCreateAccount}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
            />
            <Text className="ml-2 text-base font-medium text-gray-800">
              Create new user account? {''}
              If already have an account, Click{' '}
              <Link href={'/login'} className="text-acmec-red">
                here
              </Link>{' '}
              to login
            </Text>
          </View>

          {/* Dynamic Inputs */}
          <View className="mt-5 rounded-lg border border-acmec-yellow bg-white p-4 shadow-md">
            {/* Fixed amount - non-editable */}
            {fixedAmount !== null && (
              <>
                <View className="mb-4">
                  <Text className="mb-1 text-base text-acmec-red">
                    Amount <Text className="text-red-600">*</Text>
                  </Text>
                  <View className="rounded-lg border border-gray-300 bg-gray-100 p-2">
                    <Text className="text-gray-700">INR {fixedAmount}</Text>
                  </View>
                  <Controller
                    control={control}
                    name="amount"
                    rules={{
                      required: 'Amount is required',
                    }}
                    render={({ field: { value } }) => (
                      <TextInput
                        value={value?.toString() || fixedAmount.toString()}
                        className="hidden"
                        editable={false}
                      />
                    )}
                  />
                </View>
              </>
            )}

            {/* Minimum amount value */}
            {typeContent?.amount == null &&
              typeContent?.minimum_amount != null && (
                <View className="mb-4">
                  <Text className="mb-1 text-base text-acmec-red">
                    Amount <Text className="text-red-600">*</Text>
                  </Text>
                  <Controller
                    control={control}
                    name="amount"
                    rules={{
                      required: 'Amount is required',
                      validate: (value) =>
                        value >= typeContent?.minimum_amount ||
                        `Amount must be at least ${typeContent?.minimum_amount}`,
                    }}
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        value={value?.toString()}
                        onChangeText={onChange}
                        className="rounded-lg border border-gray-300 p-2"
                        keyboardType="numeric"
                      />
                    )}
                  />
                  {errors.amount && (
                    <Text className="text-xs text-acmec-red">
                      {(errors.amount as any).message}
                    </Text>
                  )}
                </View>
              )}

            {/* amount and minimum_amount don't have a value */}
            {typeContent?.amount == null &&
              typeContent?.minimum_amount == null &&
              !typeContent?.has_items &&
              fixedAmount === null && (
                <View className="mb-4">
                  <Text className="mb-1 text-base text-acmec-red">
                    Amount <Text className="text-red-600">*</Text>
                  </Text>
                  <Controller
                    control={control}
                    name="amount"
                    rules={{
                      required: 'Amount is required',
                      validate: (value) =>
                        value >= (typeContent?.minimum_amount || 0) ||
                        `Amount must be at least ${typeContent?.minimum_amount || 0}`,
                    }}
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        value={value?.toString()}
                        onChangeText={onChange}
                        className="rounded-lg border border-gray-300 p-2"
                        keyboardType="numeric"
                      />
                    )}
                  />
                  {errors.amount && (
                    <Text className="text-xs text-acmec-red">
                      {(errors.amount as any).message}
                    </Text>
                  )}
                </View>
              )}

            {/* Fixed Select */}
            {!typeContent?.has_items && !typeContent?.has_members && (
              <View className="mb-4">
                <Text className="mb-1 text-base text-acmec-red">
                  Donation Type
                </Text>
                <Controller
                  control={control}
                  name="donatetype"
                  render={({ field: { value } }) => (
                    <CustomPicker
                      items={[
                        {
                          label: typeContent?.name,
                          value: typeContent?.code,
                        },
                      ]}
                      selectedValue={value || typeContent?.code}
                      onValueChange={() => {}}
                      enabled={false}
                    />
                  )}
                />
              </View>
            )}

            {/* Date selection */}
            {/* Date selection */}
            {(typeContent?.has_dates || typeContent?.item_has_date) && (
              <View className="mb-4">
                <Text className="mb-1 text-base text-acmec-red">
                  Date <Text className="text-red-600">*</Text>
                </Text>

                {selectedDates.map((date: Date | null, index: number) => (
                  <View key={index} className="mb-3 flex-row items-center">
                    {/* Main Touchable field */}
                    <TouchableOpacity
                      className="flex-1 rounded-lg border border-gray-300 bg-white p-2"
                      onPress={() => setShowDatePicker(index)}
                    >
                      <Text className="text-gray-700">
                        {date ? new Date(date).toDateString() : 'Select a date'}
                      </Text>
                    </TouchableOpacity>

                    {/* Remove button for extra dates */}
                    {selectedDates.length > 1 && index !== 0 && (
                      <TouchableOpacity
                        className="ml-2 rounded-full bg-red-100 p-2"
                        onPress={() => removeDate(index)}
                      >
                        <Text className="text-lg text-red-600">×</Text>
                      </TouchableOpacity>
                    )}

                    <Controller
                      control={control}
                      name={`date.${index}`}
                      rules={{ required: 'Date is required' }}
                      render={({ field: { value, onChange } }) => (
                        <>
                          {showDatePicker === index &&
                            (typeContent?.date_list &&
                            typeContent.date_list.length > 0 ? (
                              // ✅ Show allowed API dates
                              Platform.OS === 'web' ? (
                                <select
                                  value={value || ''}
                                  onChange={(e) => {
                                    const newDate = new Date(e.target.value)
                                    handleDateChange(
                                      index,
                                      { type: 'set' },
                                      newDate,
                                    )
                                    onChange(newDate.toISOString())
                                  }}
                                  style={{
                                    padding: 10,
                                    borderRadius: 8,
                                    border: '1px solid #ccc',
                                    marginTop: 6,
                                    width: '100%',
                                  }}
                                >
                                  <option value="">Select a date</option>
                                  {typeContent.date_list.map(
                                    (d: string, i: number) => (
                                      <option key={i} value={d}>
                                        {new Date(d).toDateString()}
                                      </option>
                                    ),
                                  )}
                                </select>
                              ) : (
                                <View className="mt-2 rounded-lg border border-gray-300 bg-white p-2">
                                  {typeContent.date_list.map(
                                    (d: string, i: number) => (
                                      <TouchableOpacity
                                        key={i}
                                        onPress={() => {
                                          const newDate = new Date(d)
                                          handleDateChange(
                                            index,
                                            { type: 'set' },
                                            newDate,
                                          )
                                          onChange(newDate.toISOString())
                                          setShowDatePicker(null)
                                        }}
                                        className="py-2"
                                      >
                                        <Text className="text-gray-700">
                                          {new Date(d).toDateString()}
                                        </Text>
                                      </TouchableOpacity>
                                    ),
                                  )}
                                </View>
                              )
                            ) : // ✅ Fallback normal date picker (for trust_id=1 with no date_list)
                            Platform.OS === 'web' ? (
                              <input
                                type="date"
                                value={
                                  value
                                    ? new Date(value)
                                        .toISOString()
                                        .split('T')[0]
                                    : ''
                                }
                                onChange={(e) => {
                                  const newDate = new Date(e.target.value)
                                  handleDateChange(
                                    index,
                                    { type: 'set' },
                                    newDate,
                                  )
                                  onChange(newDate.toISOString())
                                }}
                                style={{
                                  padding: 10,
                                  borderRadius: 8,
                                  border: '1px solid #ccc',
                                  marginTop: 6,
                                }}
                              />
                            ) : (
                              <DateTimePicker
                                value={value ? new Date(value) : new Date()}
                                mode="date"
                                display="default"
                                onChange={(
                                  event: { type: string },
                                  selectedDate: Date | undefined,
                                ) => {
                                  if (event.type === 'set' && selectedDate) {
                                    handleDateChange(index, event, selectedDate)
                                    onChange(selectedDate.toISOString())
                                  }
                                }}
                                minimumDate={new Date()} //for upcoming dates only enabled
                              />
                            ))}
                        </>
                      )}
                    />
                  </View>
                ))}

                {errors.date && (
                  <Text className="text-xs text-acmec-red">
                    {(errors.date as any).message}
                  </Text>
                )}
              </View>
            )}

            {/* Item selection with quantity */}
            {typeContent?.has_items &&
              typeContent?.items &&
              typeContent?.item_has_count &&
              !typeContent?.item_has_description && (
                <>
                  <View className="mb-4">
                    <Text className="mb-1 text-base text-acmec-red">
                      Velvi <Text className="text-red-600">*</Text>
                    </Text>
                    <Controller
                      control={control}
                      name="donatetype"
                      rules={{ required: 'Donation is required' }}
                      render={({ field: { onChange, value } }) => (
                        <CustomPicker
                          items={typeContent?.items?.map((data: any) => ({
                            label: data.name,
                            value: data.amount,
                          }))}
                          selectedValue={value}
                          onValueChange={(itemValue: string) => {
                            onChange(itemValue)
                            handleDonationChange(itemValue)
                          }}
                        />
                      )}
                    />
                    {errors.donatetype && (
                      <Text className="text-xs text-acmec-red">
                        {(errors.donatetype as any).message}
                      </Text>
                    )}
                  </View>

                  <View className="mb-4">
                    <Text className="mb-1 text-base text-acmec-red">
                      Quantity
                    </Text>
                    <Controller
                      control={control}
                      name="qty"
                      render={({ field: { onChange, value } }) => (
                        <TextInput
                          value={value?.toString() || qty.toString()}
                          onChangeText={(text) => {
                            onChange(text)
                            handleSingleQtyChange(text)
                          }}
                          className="rounded-lg border border-gray-300 p-2"
                          keyboardType="numeric"
                        />
                      )}
                    />
                  </View>

                  {typeContent?.detail_label && (
                    <View className="mb-4">
                      <Text className="mb-1 text-base text-acmec-red">
                        {typeContent?.detail_label}
                      </Text>
                      <Controller
                        control={control}
                        name="details"
                        render={({ field: { onChange, value } }) => (
                          <TextInput
                            value={value}
                            onChangeText={onChange}
                            className="rounded-lg border border-gray-300 p-2"
                          />
                        )}
                      />
                    </View>
                  )}

                  <View className="my-2 items-center">
                    <Text className="text-xl font-bold text-acmec-red">
                      Total Amount: INR{' '}
                      {selectedAmount > 0
                        ? qty * selectedAmount +
                          (includeCourier ? typeContent?.postal_fee : 0)
                        : typeContent?.items[0]?.amount +
                          (includeCourier ? typeContent?.postal_fee : 0)}
                    </Text>
                  </View>
                </>
              )}

            {/* General item selection */}
            {typeContent?.has_items &&
              typeContent?.items &&
              !typeContent?.item_has_count &&
              !typeContent?.item_has_description && (
                <>
                  <View className="mb-4">
                    <Text className="mb-1 text-base text-acmec-red">
                      Donation Type
                    </Text>
                    <Controller
                      control={control}
                      name="donatetype"
                      rules={{ required: 'Donation is required' }}
                      render={({ field: { onChange, value } }) => (
                        <CustomPicker
                          items={typeContent?.items?.map((data: any) => ({
                            label: data.name,
                            value: data.name,
                          }))}
                          selectedValue={value}
                          onValueChange={onChange}
                        />
                      )}
                    />
                    {errors.donatetype && (
                      <Text className="text-xs text-acmec-red">
                        {(errors.donatetype as any).message}
                      </Text>
                    )}
                  </View>

                  {typeContent?.detail_label && (
                    <View className="mb-4">
                      <Text className="mb-1 text-base text-acmec-red">
                        {typeContent?.detail_label}
                      </Text>
                      <Controller
                        control={control}
                        name="details"
                        render={({ field: { onChange, value } }) => (
                          <TextInput
                            value={value}
                            onChangeText={onChange}
                            className="rounded-lg border border-gray-300 p-2"
                          />
                        )}
                      />
                    </View>
                  )}
                </>
              )}

            {/* Members form */}
            {typeContent?.has_members && (
              <>
                <View className="mb-4">
                  <Text className="mb-1 text-base text-acmec-red">
                    Name <Text className="text-red-600">*</Text>
                  </Text>
                  <Controller
                    control={control}
                    name="name"
                    rules={{ required: 'Name is required' }}
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        value={value}
                        onChangeText={onChange}
                        placeholder="Please Enter the name"
                        className="rounded-lg border border-gray-300 p-2"
                      />
                    )}
                  />
                </View>

                <View className="mb-4">
                  <Text className="mb-1 text-base text-acmec-red">
                    Nakshatra <Text className="text-red-600">*</Text>
                  </Text>
                  <Controller
                    control={control}
                    name="nakshatra"
                    rules={{ required: 'Nakshatra is required' }}
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        value={value}
                        onChangeText={onChange}
                        placeholder="Please Enter the Nakshatra"
                        className="rounded-lg border border-gray-300 p-2"
                      />
                    )}
                  />
                </View>

                {fields.map((field, index) => (
                  <View key={field.id} className="mb-4">
                    <View className="flex-row items-center">
                      <View className="flex-1">
                        <Text className="mb-1 text-base text-acmec-red">
                          Name <Text className="text-red-600">*</Text>
                        </Text>
                        <Controller
                          control={control}
                          name={`members.${index}.name`}
                          rules={{ required: 'Name is required' }}
                          render={({ field: { onChange, value } }) => (
                            <TextInput
                              value={value}
                              onChangeText={onChange}
                              placeholder="Please Enter the name"
                              className="rounded-lg border border-gray-300 p-2"
                            />
                          )}
                        />
                      </View>

                      <View className="ml-2 flex-1">
                        <Text className="mb-1 text-base text-acmec-red">
                          Nakshatra <Text className="text-red-600">*</Text>
                        </Text>
                        <Controller
                          control={control}
                          name={`members.${index}.nakshatra`}
                          rules={{ required: 'Nakshatra is required' }}
                          render={({ field: { onChange, value } }) => (
                            <TextInput
                              value={value}
                              onChangeText={onChange}
                              placeholder="Please Enter the Nakshatra"
                              className="rounded-lg border border-gray-300 p-2"
                            />
                          )}
                        />
                      </View>

                      <TouchableOpacity
                        className="ml-2 p-2"
                        onPress={() => {
                          remove(index)
                          setLatcharchanaiAmount((prev: any) =>
                            Math.max(
                              typeContent?.amount || 0,
                              prev - typeContent?.amount,
                            ),
                          )
                        }}
                      >
                        <Text className="text-lg text-red-600">×</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}

                <TouchableOpacity
                  className="mb-4 rounded bg-acmec-red p-2"
                  onPress={() => {
                    if (canAddMore) {
                      append({ name: '', nakshatra: '' })
                      setLatcharchanaiAmount(
                        (prev: any) => prev + (typeContent?.amount || 0),
                      )
                    }
                  }}
                  disabled={!canAddMore}
                >
                  <Text className="text-center text-white">Add a member</Text>
                </TouchableOpacity>

                <View className="my-2 items-center">
                  <Text className="text-xl font-bold text-acmec-red">
                    Amount: INR{' '}
                    {latcharchanaiAmount +
                      (includeCourier ? typeContent?.postal_fee : 0)}
                  </Text>
                </View>
              </>
            )}

            {/* Item grid with quantity and date */}
            {typeContent?.has_items &&
              typeContent?.item_has_description &&
              typeContent?.items &&
              typeContent?.item_has_count &&
              typeContent?.item_has_date && (
                <>
                  <View className="mb-4">
                    <View className="flex-row items-center">
                      <Switch
                        value={includeDailyAbhisegam}
                        onValueChange={(value) => {
                          setIncludeDailyAbhisegam(value)
                          if (value) {
                            const params = { trust_id: trustId }
                            apiDonationTypeBySlug('daily-abhishegam', params)
                              .then((res: any) => {
                                setDailyAbhisegamAmount(res.data?.amount || 0)
                              })
                              .catch((err: any) => {
                                const message: string | null =
                                  handleApiErrors(err)
                                if (message) console.error(message)
                              })
                          } else {
                            setDailyAbhisegamAmount(0)
                          }
                        }}
                      />
                      <Text className="ml-2 text-base text-acmec-red">
                        Include Daily Abhisegam
                      </Text>
                    </View>
                  </View>

                  <View className="mb-4">
                    <View className="flex-row flex-wrap justify-between">
                      {typeContent?.items?.map((item: any, index: number) => (
                        <View
                          key={index}
                          className="mb-2 w-full p-1 md:w-1/2 lg:w-1/3"
                        >
                          <View className="rounded-lg border-2 border-acmec-yellow p-2">
                            <Text className="text-sm font-medium text-acmec-red">
                              {item?.name}
                            </Text>
                            {item?.date && (
                              <Text className="text-sm font-medium text-acmec-red">
                                {new Date(item.date).toLocaleDateString(
                                  'en-GB',
                                )}
                              </Text>
                            )}
                            <Text className="mb-2 text-xs text-acmec-red">
                              {item?.description}
                            </Text>

                            <View className="flex-row items-center justify-between">
                              {item?.amount && (
                                <Text className="font-semibold text-acmec-red">
                                  ₹ {item?.amount}
                                </Text>
                              )}
                              <View className="flex-row items-center">
                                <Text className="mr-1 text-acmec-red">
                                  Qty:
                                </Text>
                                <Controller
                                  control={control}
                                  name={`qty-${index}`}
                                  render={({ field: { value } }) => (
                                    <TextInput
                                      value={value?.toString() || '0'}
                                      onChangeText={(text) =>
                                        handleNavaratriabhishegamQtyChange(
                                          Number(text),
                                          index,
                                          item?.date,
                                          item?.amount,
                                        )
                                      }
                                      className="w-12 rounded border border-gray-300 p-1 text-center"
                                      keyboardType="numeric"
                                    />
                                  )}
                                />
                              </View>
                            </View>
                          </View>
                        </View>
                      ))}
                    </View>

                    <TouchableOpacity
                      className="mt-2 self-end"
                      onPress={handleReset}
                    >
                      <Text className="text-acmec-red underline">Reset</Text>
                    </TouchableOpacity>

                    <View className="my-2 items-center">
                      <Text className="text-xl font-bold text-acmec-red">
                        Total Amount: INR {totalAmount}
                      </Text>
                    </View>
                  </View>
                </>
              )}

            {/* Item grid with quantity only */}
            {typeContent?.has_items &&
              typeContent?.item_has_description &&
              typeContent?.items &&
              typeContent?.item_has_count &&
              !typeContent?.item_has_date && (
                <>
                  <View className="mb-4">
                    <View className="flex-row flex-wrap justify-between">
                      {typeContentItems.map((item: any, index: number) => (
                        <View
                          key={index}
                          className="mb-2 w-full p-1 md:w-1/2 lg:w-1/3"
                        >
                          <View className="rounded-lg border-2 border-acmec-yellow p-2">
                            <Text className="text-sm font-medium text-acmec-red">
                              {item?.name}
                            </Text>
                            <Text className="mb-2 text-xs text-acmec-red">
                              {item?.description}
                            </Text>

                            <View className="flex-row items-center justify-between">
                              <Text className="font-semibold text-acmec-red">
                                ₹ {item?.amount}
                              </Text>
                              <View className="flex-row items-center">
                                <Text className="mr-1 text-acmec-red">
                                  Qty:
                                </Text>
                                <Controller
                                  control={control}
                                  name={`qty-${index}`}
                                  render={({ field: { value } }) => (
                                    <TextInput
                                      value={value?.toString() || '0'}
                                      onChangeText={(text) =>
                                        handleQtyChange(Number(text), index)
                                      }
                                      className="w-12 rounded border border-gray-300 p-1 text-center"
                                      keyboardType="numeric"
                                    />
                                  )}
                                />
                              </View>
                            </View>
                          </View>
                        </View>
                      ))}
                    </View>

                    <TouchableOpacity
                      className="mt-2 self-end"
                      onPress={handleClear}
                    >
                      <Text className="text-acmec-red underline">Reset</Text>
                    </TouchableOpacity>

                    <View className="my-2 items-center">
                      <Text className="text-xl font-bold text-acmec-red">
                        Total Amount: ₹{' '}
                        {typeContentItems.reduce(
                          (accumulator: any, item: any) =>
                            accumulator + item.amount * item.qty,
                          0,
                        )}
                      </Text>
                    </View>
                  </View>
                </>
              )}

            {/* Courier option */}
            {typeContent?.has_postal && (
              <View className="mb-4 flex-row items-center">
                <Switch
                  value={includeCourier}
                  onValueChange={setIncludeCourier}
                />
                <Text className="ml-2 text-base text-gray-700">
                  Send Prasadham by Courier
                </Text>
              </View>
            )}
          </View>

          {showPersonalAndBilling && (
            <>
              {/* Account Details */}
              {isShowPassword && (
                <View className="my-4 rounded-lg border border-acmec-yellow bg-white p-4">
                  <Text className="mb-4 border-b border-b-gray-200 pb-2 font-semibold uppercase text-acmec-red">
                    Account Detail
                  </Text>

                  {/* Password */}
                  <View className="mb-4">
                    <Text className="mb-1 text-base text-acmec-red">
                      Password <Text className="text-red-600">*</Text>
                    </Text>
                    <Controller
                      control={control}
                      name="password"
                      rules={{ required: 'Password is required' }}
                      render={({ field: { onChange, value } }) => (
                        <TextInput
                          value={value}
                          onChangeText={onChange}
                          secureTextEntry
                          className="rounded-lg border border-gray-300 p-2"
                        />
                      )}
                    />
                    {errors.password && (
                      <Text className="text-xs text-acmec-red">
                        {(errors.password as any).message}
                      </Text>
                    )}
                  </View>

                  {/* Confirm Password */}
                  <View className="mb-4">
                    <Text className="mb-1 text-base text-acmec-red">
                      Confirm Password <Text className="text-red-600">*</Text>
                    </Text>
                    <Controller
                      control={control}
                      name="confirmpassword"
                      rules={{
                        required: 'Confirm Password is required',
                        validate: (value) =>
                          value === watch('password') ||
                          'Passwords do not match',
                      }}
                      render={({ field: { onChange, value } }) => (
                        <TextInput
                          value={value}
                          onChangeText={onChange}
                          secureTextEntry
                          className="rounded-lg border border-gray-300 p-2"
                        />
                      )}
                    />
                    {errors.confirmpassword && (
                      <Text className="text-xs text-acmec-red">
                        {(errors.confirmpassword as any).message}
                      </Text>
                    )}
                  </View>
                </View>
              )}

              {/* Personal Details */}
              <View className="my-4 rounded-lg border border-acmec-yellow bg-white p-4">
                <Text className="mb-4 pb-2 text-xl font-semibold uppercase text-acmec-red">
                  Personal Detail
                </Text>

                <View className="mb-4 border-b border-acmec-red pb-4">
                  <View className="mb-4">
                    <Text className="mb-1 text-base text-acmec-red">
                      Name <Text className="text-red-600">*</Text>
                    </Text>
                    <Controller
                      control={control}
                      name="name"
                      rules={{ required: 'Name is required' }}
                      render={({ field: { onChange, value } }) => (
                        <TextInput
                          value={value}
                          onChangeText={onChange}
                          className="rounded-lg border border-gray-300 p-2 text-acmec-red"
                        />
                      )}
                    />
                    {errors.name && (
                      <Text className="text-xs text-acmec-red">
                        {(errors.name as any).message}
                      </Text>
                    )}
                  </View>

                  <View className="mb-4">
                    <Text className="mb-1 text-base text-acmec-red">
                      Email Address <Text className="text-red-600">*</Text>
                    </Text>
                    <Controller
                      control={control}
                      name="email"
                      rules={{
                        required: 'Email is required',
                        pattern: {
                          value:
                            /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
                          message: 'Invalid email address',
                        },
                      }}
                      render={({ field: { onChange, value } }) => (
                        <TextInput
                          value={value}
                          onChangeText={onChange}
                          keyboardType="email-address"
                          autoCapitalize="none"
                          className="rounded-lg border border-gray-300 p-2"
                        />
                      )}
                    />
                    {errors.email && (
                      <Text className="text-xs text-acmec-red">
                        {(errors.email as any).message}
                      </Text>
                    )}
                  </View>

                  <View className="mb-4">
                    <Text className="mb-1 text-base text-acmec-red">
                      Phone Number <Text className="text-red-600">*</Text>
                    </Text>
                    <Controller
                      control={control}
                      name="phone"
                      rules={{ required: 'Phone is required' }}
                      render={({ field: { onChange, value } }) => (
                        <TextInput
                          value={value}
                          onChangeText={onChange}
                          keyboardType="phone-pad"
                          className="rounded-lg border border-gray-300 p-2"
                        />
                      )}
                    />
                    {errors.phone && (
                      <Text className="text-xs text-acmec-red">
                        {(errors.phone as any).message}
                      </Text>
                    )}
                  </View>
                </View>

                <Text className="mb-4 pb-2 text-xl font-semibold uppercase text-acmec-red">
                  Billing Detail
                </Text>

                <View className="mb-4">
                  <Text className="mb-1 text-base text-acmec-red">
                    Address Line 1 <Text className="text-red-600">*</Text>
                  </Text>
                  <Controller
                    control={control}
                    name="addressline1"
                    rules={{ required: 'Address is required' }}
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        value={value}
                        onChangeText={onChange}
                        className="rounded-lg border border-gray-300 p-2"
                      />
                    )}
                  />
                  {errors.addressline1 && (
                    <Text className="text-xs text-acmec-red">
                      {(errors.addressline1 as any).message}
                    </Text>
                  )}
                </View>

                <View className="mb-4">
                  <Text className="mb-1 text-base text-acmec-red">
                    Address Line 2
                  </Text>
                  <Controller
                    control={control}
                    name="addressline2"
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        value={value}
                        onChangeText={onChange}
                        className="rounded-lg border border-gray-300 p-2"
                      />
                    )}
                  />
                </View>

                <View className="mb-4">
                  <Text className="mb-1 text-base text-acmec-red">
                    Country <Text className="text-red-600">*</Text>
                  </Text>
                  <Controller
                    control={control}
                    name="country"
                    rules={{ required: 'Country is required' }}
                    render={({ field: { onChange, value } }) => (
                      <CustomPicker
                        items={Object.keys(countries).map((key: any) => ({
                          label: countries[key],
                          value: key,
                        }))}
                        selectedValue={value}
                        onValueChange={(itemValue: string) => {
                          onChange(itemValue)
                          handleCountryChange(itemValue)
                        }}
                      />
                    )}
                  />
                  {errors.country && (
                    <Text className="text-xs text-acmec-red">
                      {(errors.country as any).message}
                    </Text>
                  )}
                </View>

                <View className="mb-4">
                  <Text className="mb-1 text-base text-acmec-red">
                    State <Text className="text-red-600">*</Text>
                  </Text>
                  <Controller
                    control={control}
                    name="state"
                    rules={{ required: 'State is required' }}
                    render={({ field: { onChange, value } }) => (
                      <CustomPicker
                        items={Object.keys(states).map((key: any) => ({
                          label: states[key],
                          value: key,
                        }))}
                        selectedValue={value}
                        onValueChange={onChange}
                      />
                    )}
                  />
                  {errors.state && (
                    <Text className="text-xs text-acmec-red">
                      {(errors.state as any).message}
                    </Text>
                  )}
                </View>

                <View className="mb-4">
                  <Text className="mb-1 text-base text-acmec-red">
                    City <Text className="text-red-600">*</Text>
                  </Text>
                  <Controller
                    control={control}
                    name="city"
                    rules={{ required: 'City is required' }}
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        value={value}
                        onChangeText={onChange}
                        className="rounded-lg border border-gray-300 p-2"
                      />
                    )}
                  />
                  {errors.city && (
                    <Text className="text-xs text-acmec-red">
                      {(errors.city as any).message}
                    </Text>
                  )}
                </View>

                <View className="mb-4">
                  <Text className="mb-1 text-base text-acmec-red">
                    Zip / Postal Code <Text className="text-red-600">*</Text>
                  </Text>
                  <Controller
                    control={control}
                    name="postalcode"
                    rules={{ required: 'Postal Code is required' }}
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        value={value}
                        onChangeText={onChange}
                        className="rounded-lg border border-gray-300 p-2"
                        keyboardType="numeric"
                      />
                    )}
                  />
                  {errors.postalcode && (
                    <Text className="text-xs text-acmec-red">
                      {(errors.postalcode as any).message}
                    </Text>
                  )}
                </View>
              </View>

              <TouchableOpacity
                className="mb-8 items-center rounded-lg bg-acmec-red p-3"
                onPress={handleSubmit(handleonSubmit)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <View className="flex-row items-center">
                    <ActivityIndicator color="white" />
                    <Text className="ml-2 text-white">Please wait ...</Text>
                  </View>
                ) : (
                  <Text className="font-bold text-white">Donate Now</Text>
                )}
              </TouchableOpacity>
            </>
          )}
        </View>

        {!showPersonalAndBilling && (
          <VerifPanAadhaarRN
            setEdonationVerify={setEdonationVerify}
            typeContent={typeContent}
            setPanDetails={setPanDetails}
            aadhaarDetails={aadhaarDetails}
            setAadhaarDetails={setAadhaarDetails}
            setShowPersonalAndBilling={setShowPersonalAndBilling}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  )
}
