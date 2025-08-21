// import { Breadcrumb } from '@/components/Breadcrumb';
import Breadcrumb from '@/src/components/breadcrumb';
import { useAuth } from '@/src/context/auth-context';
// import { useTrust } from '@/context/trustContext';
import { useTrust } from '@/src/context/trust-context';
import {
  apiCreateDonations,
  apiDonationTypeBySlug,
  apiGetCountries,
  apiGetReceipt,
  apiGetStates,
  apiRazorpayCallback,
  apiRazorpayCreate,
  apiUserProfile,
  apiUserRegister
} from '@/src/services/api';
// import { console.log } from '@/services/toast.service';
import { handleApiErrors } from '@/src/utils/helper/api.helper';
import { generateUUID } from '@/src/utils/helper/glober.helper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { ActivityIndicator, Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DonateCheckout from './checkout';
import DonateReceipt from './receipt';
import VerifPanAadhaar from './verify-pan-aadhaar';

export default function DonateType() {
  const { selectedTrust } = useTrust();
  const router = useRouter();
  const params = useLocalSearchParams();
  const type = params.type as string;
  const trustId = params.trust_id as string;
  
  const [breadcrumb, setBreadcrumb] = useState({
    title: "",
    path: [
      { label: "Home", link: "/" },
      { label: "Donate", link: `/${selectedTrust?.slug}/donate` },
    ],
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
    trigger,
    unregister,
  } = useForm({});
  
  const { triggerAuth, isAuthenticated } = useAuth();

  const [screenType, setScreenType] = useState<"form" | "checkout" | "receipt">("form");
  const [isTypeContentLoading, setIsTypeContentLoading] = useState<boolean>(true);
  const [typeContent, setTypeContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPersonalAndBilling, setShowPersonalAndBilling] = useState<boolean>(true);
  const [typeContentItems, setTypeContentItems] = useState<any>([]);
  const [countries, setCountries] = useState<any>({});
  const [states, setStates] = useState<any>({});
  const [aadhaarDetails, setAadhaarDetails] = useState<any>({});
  const [panDetails, setPanDetails] = useState<any>({});
  const [donationInfo, setDonationInfo] = useState<any>({});
  const [changedItems, setChangedItems] = useState<number[]>([]);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState<boolean>(false);
  const [isReceiptLoading, setIsReceiptLoading] = useState<boolean>(false);
  const [uuid, setUuid] = useState<string>("");
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const [isAuthStatus, setIsAuthStatus] = useState<boolean>(true);
  const [selectedDates, setSelectedDates] = useState<any>([new Date()]);
  const [includeCourier, setIncludeCourier] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [qty, setQty] = useState<number>(1);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [eDonationVerify, setEdonationVerify] = useState<boolean>(false);
  const [latcharchanaiAmount, setLatcharchanaiAmount] = useState<any>(0);
  const [includeDailyAbhisegam, setIncludeDailyAbhisegam] = useState(false);
  const [dailyAbhisegamAmount, setDailyAbhisegamAmount] = useState(0);
  const [dateError, setDateError] = useState(false);
  const [isQtyChanged, setIsQtyChanged] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState<number | null>(null);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "members",
  });

  const maxMembers = 5;
  const canAddMore = fields.length < maxMembers;

  useEffect(() => {
    if (type) donationTypes(type);
  }, [type]);

  useEffect(() => {
    const authStatus = localStorage.getItem("acmec.user_auth_status");
    if (authStatus) {
      setIsAuthStatus(false);
    } else {
      setIsAuthStatus(true);
    }
  }, []);

  useEffect(() => {
    getCountries();
  }, []);

  useEffect(() => {
    setValue("name", aadhaarDetails?.data?.user_full_name);
    setValue("postalcode", aadhaarDetails?.data?.address_zip);
    const house = aadhaarDetails?.data?.user_address?.house || "";
    const street = aadhaarDetails?.data?.user_address?.street || "";
    const post = aadhaarDetails?.data?.user_address?.po || "";
    const vtc = aadhaarDetails?.data?.user_address?.vtc || "";
    setValue("addressline1", `${house}`.trim());
    setValue("addressline2", `${street} , ${vtc}`.trim());
    setValue("city", aadhaarDetails?.data?.user_address?.dist);
  }, [aadhaarDetails]);

  useEffect(() => {
    setValue("name", panDetails?.data?.user_full_name);
    setValue("postalcode", panDetails?.data?.user_address?.zip);
    const line_1 = panDetails?.data?.user_address?.line_1 || "";
    const street = panDetails?.data?.user_address?.street_name || "";
    const line_2 = panDetails?.data?.user_address?.line_2 || "";
    setValue("addressline1", `${line_1}  ${street}`.trim());
    setValue("addressline2", `${line_2}`.trim());
    setValue("city", panDetails?.data?.user_address?.city);
  }, [panDetails]);

  useEffect(() => {
    let items = typeContent?.items || [];
    items = items.map((item: any) => ({
      name: item.name,
      description: item.description,
      amount: item.amount,
      qty: 0,
      date: item?.date,
    }));

    setTypeContentItems(items);
  }, [typeContent]);

  const donationTypes = (slug: string) => {
    apiDonationTypeBySlug(slug, selectedTrust?.id)
      .then((res: any) => {
        setIsTypeContentLoading(false);
        setTypeContent(res.data);
        setLatcharchanaiAmount(res.data?.amount);

        setBreadcrumb({
          title: res.data.name,
          path: [
            { label: "Home", link: "/" },
            { label: "Donate", link: `/${selectedTrust?.slug}/donate` },
            { label: res.data.name, link: "" },
          ],
        });
        
        if (res.data?.mode === "e_donation") {
          setShowPersonalAndBilling(false);
        }

        if (res.data?.mode === "eighty_g") {
          setShowPersonalAndBilling(false);
        }
      })
      .catch((err: any) => {
        const message: string | null = handleApiErrors(err);
        if (message) console.log(message);
        setIsTypeContentLoading(false);
      });
  };

  const getCountries = () => {
    apiGetCountries()
      .then((res: any) => {
        setCountries(res.data);
        const defaultCountryCode = "in";
        setValue("country", defaultCountryCode);
        getStates(defaultCountryCode);
      })
      .catch((err: any) => {
        const message: string | null = handleApiErrors(err);
        if (message) console.log(message);
      });
  };

  const handleCountryChange = (value: string) => {
    getStates(value);
  };

  const getStates = (country_id: any) => {
    apiGetStates(country_id)
      .then((res: any) => {
        setStates(res.data);
        setValue("state", "in-tn");
      })
      .catch((err: any) => {
        const message: string | null = handleApiErrors(err);
        if (message) console.log(message);
      });
  };

  const handleQtyChange = (newQty: number, index: number) => {
    setTypeContentItems((prevItems: any) => prevItems.map((item: any, i: number) => (i === index ? { ...item, qty: newQty } : item)));
    setValue(`qty-${index}`, newQty);
    if (!changedItems.includes(index)) {
      setChangedItems((prev) => [...prev, index]);
    }
  };

  const handleNavaratriabhishegamQtyChange = (newQty: number, index: number, date: string, itemAmount: any) => {
    setIsQtyChanged(true);
    setTypeContentItems((prevItems: any) => {
      const updatedItems = prevItems.map((item: any, i: number) => {
        if (i === index) {
          const amount = newQty * (itemAmount || typeContent?.amount);
          return { ...item, qty: newQty, amount, date: date };
        }
        return item;
      });

      return updatedItems;
    });

    setValue(`qty-${index}`, newQty);
  };

  useEffect(() => {
    if (typeContent?.item_has_name && typeContent?.has_items && typeContent?.item_has_count && !typeContent?.item_has_date) {
      const defaultIndex = 0;
      const defaultItem = typeContent.items[defaultIndex];
      const defaultAmount = defaultItem.amount;
      const defaultQty = 1;

      const initializedItems = typeContent.items.map((item: any, index: number) => ({
        ...item,
        qty: index === defaultIndex ? defaultQty : 0,
      }));

      setSelectedIndex(defaultIndex);
      setSelectedAmount(defaultAmount);
      setQty(defaultQty);
      setTypeContentItems(initializedItems);
      setValue("donatetype", defaultAmount);
      setValue("qty", defaultQty);
    }
  }, [typeContent]);

  const handleDonationChange = (value: string) => {
    const selectedAmount = Number(value);
    const initialQty = 1;
    const total = selectedAmount * initialQty;

    const newIndex = typeContentItems.findIndex((item: any) => item.amount === selectedAmount);

    const updatedItems = typeContentItems.map((item: any, index: any) => {
      if (index === newIndex) {
        return { ...item, qty: initialQty, amount: total };
      }
      if (index === selectedIndex) {
        return { ...item, qty: 0 };
      }
      return item;
    });

    setTypeContentItems(updatedItems);
    setSelectedAmount(selectedAmount);
    setQty(initialQty);
    setSelectedIndex(newIndex);
    setValue("donatetype", selectedAmount);
    setValue("qty", initialQty);
  };

  const handleSingleQtyChange = (value: string) => {
    const newQty = Number(value);
    setQty(newQty);
    setValue("qty", newQty);

    const updatedItems = typeContentItems.map((item: any, index: any) =>
      index === selectedIndex
        ? {
            ...item,
            qty: newQty,
            amount: newQty * selectedAmount,
          }
        : item,
    );

    setTypeContentItems(updatedItems);
  };

  const handleClear = () => {
    setTypeContentItems((prevItems: any) => prevItems.map((item: any, index: number) => ({ ...item, qty: index === 0 ? 1 : 0 })));
  };

  const handleReset = () => {
    setIsQtyChanged(false);
    setTypeContentItems((prevItems: any) => prevItems.map((item: any, index: number) => ({ ...item, qty: 0, amount: 0 })));

    typeContentItems.forEach((_: any, index: any) => {
      setValue(`qty-${index}`, 0);
    });
  };

  const handleonSubmit = (data: any) => {
    setIsLoading(true);

    let finalAmount = data?.amount;
    let finalItems: any = [];

    finalItems = [{ name: data?.donatetype, count: 1 }];

    if (typeContent?.item_has_name && typeContent?.item_has_count && typeContent?.item_has_amount) {
      finalAmount = typeContentItems.reduce((accumulator: any, item: any) => accumulator + item.amount * item.qty, 0);

      finalItems = typeContentItems
        .filter((item: any) => item.qty !== 0)
        .map((item: any) => ({
          name: item.name,
          count: item.qty,
        }));
    }
    
    const formatDateToYMD = (date: any): string => {
      const year = date?.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}/${month}/${day}`;
    };

    if (typeContent?.has_dates && typeContent?.date_list) {
      const dates = Array.isArray(data.date) ? data.date : [data.date];

      finalItems = dates.map((d: string) => ({
        name: data?.donatetype,
        count: 1,
        date: formatDateToYMD(d),
      }));
    }

    if (typeContent?.has_dates && data?.date && typeContent?.date_list == null) {
      const dates = Array.isArray(data.date) ? data.date : [data.date];

      finalItems = dates.map((d: string) => ({
        name: data?.donatetype,
        count: 1,
        date: formatDateToYMD(d),
      }));
    }

    if (typeContent?.item_has_date && data?.date) {
      finalItems = typeContentItems
        .filter((item: any) => item.qty !== 0)
        .map((item: any) => ({
          name: item.name,
          count: item.qty,
          amount: item?.amount,
          date: formatDateToYMD(data?.date),
        }));
    }
    
    if (typeContent?.has_items && typeContent?.item_has_count) {
      finalAmount = data?.donatetype;
      finalItems = typeContentItems
        .filter((item: any) => item.qty !== 0)
        .map((item: any) => ({
          name: item.name,
          count: item.qty,
          amount: data?.donatetype,
        }));
    }

    if (eDonationVerify) {
      finalItems = [{ name: data?.donatetype, amount: data?.amount, email: data?.email }];
    }

    if (typeContent?.has_members) {
      finalAmount = latcharchanaiAmount;
      finalItems = [
        {
          name: data.name,
          nakshatra: data.nakshatra,
        },
        ...data.members,
      ];
    }

    if (typeContent?.item_has_name && typeContent?.has_items && typeContent?.item_has_count && typeContent?.item_has_date) {
      finalAmount = totalAmount;
      finalItems = typeContentItems
        .filter((item: any) => item.qty !== 0)
        .map((item: any) => ({
          name: item.name,
          count: item.qty,
          amount: item?.amount,
          date: item?.date?.replace(/-/g, "/"),
        }));
    }

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
      payment_method: "razorpay",
      items: finalItems,
      trust_id: selectedTrust?.id,
      pan: panDetails?.data?.pan_number,
      aadhaar: aadhaarDetails?.data?.pan_number,
      city: data?.city,
      details: data?.details,
      include_abhishegam: includeDailyAbhisegam,
      add_postal: includeCourier,
    };

    localStorage.setItem("uuid", postData?.uuid);

    const userAuthStatus = JSON.parse(localStorage.getItem("acmec.user_auth_status") || "false");

    if (isShowPassword) {
      if (!userAuthStatus) {
        apiUserRegister({ name: data?.name, email: data?.email, password: data?.password, phone: data?.phone }).then((res: any) => {
          const token = res.data?.token;
          if (token) {
            localStorage.setItem("acmec.api_token", res.data?.token);
            apiUserProfile()
              .then((res: any) => {
                setIsLoading(false);
                reset();
                localStorage.setItem("acmec.user_auth_status", "true");
                localStorage.setItem("acmec.user_name", res.data?.name);
                localStorage.setItem("acmec.user_email", res.data?.email);
                triggerAuth();
              })
              .catch((err: any) => {
                setIsLoading(false);
                const message: string | null = handleApiErrors(err);
                if (message) console.log(message);
              });
          }
          apiCreateDonations(postData)
            .then((res: any) => {
              setIsLoading(false);
              setDonationInfo(res.data);
              setScreenType("checkout");
            })
            .catch((err: any) => {
              const message: string | null = handleApiErrors(err);
              if (message) console.log(message);
              setIsLoading(false);
            });
        });
      } else {
        apiCreateDonations(postData)
          .then((res: any) => {
            setIsLoading(false);
            setDonationInfo(res.data);
            setScreenType("checkout");
          })
          .catch((err: any) => {
            const message: string | null = handleApiErrors(err);
            if (message) console.log(message);
            setIsLoading(false);
          });
      }
    } else {
      apiCreateDonations(postData)
        .then((res: any) => {
          setIsLoading(false);
          setDonationInfo(res.data);
          setScreenType("checkout");
        })
        .catch((err: any) => {
          const message: string | null = handleApiErrors(err);
          if (message) console.log(message);
          setIsLoading(false);
        });
    }
  };

  const payRazorpay = () => {
    setIsCheckoutLoading(true);
    const postData = { donation_id: donationInfo?.id };
    apiRazorpayCreate(postData)
      .then((res: any) => {
        // For React Native, you would typically use a WebView or deep linking for Razorpay
        // This is a simplified implementation
        Alert.alert(
          "Payment",
          "Redirecting to payment gateway...",
          [
            {
              text: "OK",
              onPress: () => {
                // Simulate payment success
                const callbackRequest = {
                  donation_id: donationInfo?.id,
                  razorpay_order_id: "mock_order_id",
                  razorpay_payment_id: "mock_payment_id",
                  razorpay_signature: "mock_signature",
                };

                apiRazorpayCallback(callbackRequest)
                  .then((res: any) => {
                    setScreenType("receipt");
                  })
                  .catch((err: any) => {
                    const message: string | null = handleApiErrors(err);
                    if (message) console.log(message);
                    setIsCheckoutLoading(false);
                  });
              },
            },
          ]
        );
      })
      .catch((err: any) => {
        const message: string | null = handleApiErrors(err);
        if (message) console.log(message);
        setIsCheckoutLoading(false);
      });
  };

  const getDonationReceipt = async () => {
    setIsReceiptLoading(true);
    const postData = {
      donation_id: donationInfo?.id,
      uuid: localStorage.getItem("uuid"),
    };

    try {
      const response = await apiGetReceipt(postData);
      // In React Native, you might want to use a PDF viewer component
      // or open the PDF in an external app
      Alert.alert("Receipt", "Receipt downloaded successfully");
    } catch (error) {
      const message: string | null = handleApiErrors(error);
      if (message) console.log(message);
    }
  };

  const handleCreateAccount = (isChecked: boolean) => {
    setIsShowPassword(isChecked);
  };

  const addDate = () => {
    setSelectedDates([...selectedDates, new Date()]);
  };

  const removeDate = (index: number) => {
    setSelectedDates((prevDates: any[]) => {
      const newDates = prevDates.filter((_, i) => i !== index);
      return newDates;
    });

    unregister(`date.${index}`);
  };

  const handleDateChange = (index: number, event: any, value: Date | undefined) => {
    if (event.type === 'set' && value) {
      const newDateStr = value.toDateString();

      const isDuplicate = selectedDates.some((date: Date | null, i: number) => {
        if (i === index || !date) return false;
        return date.toDateString() === newDateStr;
      });

      if (isDuplicate) {
        console.log("This date is already selected.");
        return;
      }
      
      const newDates = [...selectedDates];
      newDates[index] = value;
      setSelectedDates(newDates);
      setValue(`date.${index}`, value);
      setDateError(false);
      setShowDatePicker(null);
    } else {
      setShowDatePicker(null);
    }
  };

  const allowedDates = typeContent?.date_list?.map((d: string) => new Date(d)) || [];

  const modifiedQtyCount = typeContentItems.filter((item: any) => item.qty > 0).length;

  const totalAmount = typeContentItems.reduce((acc: any, item: any) => acc + item.qty * (typeContent?.amount || 0), 0) + (includeCourier ? typeContent?.postal_fee : 0) + (includeDailyAbhisegam && isQtyChanged ? dailyAbhisegamAmount * modifiedQtyCount : 0);

  if (isTypeContentLoading) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <ActivityIndicator size="large" color="#e53e3e" />
        <Text className="mt-4 text-gray-600">Loading donation information...</Text>
      </View>
    );
  }

  if (!typeContent) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-2xl text-red-600 font-bold mb-4">404 Page not found</Text>
        <Text className="text-base text-gray-600 mb-8 text-center">
          Looks like something's broken. It's not you it's us.
          How about going back to the home page?
        </Text>
        <TouchableOpacity 
          className="bg-gray-200 px-4 py-2 rounded-lg"
          onPress={() => router.push("/")}
        >
          <Text className="text-gray-700 uppercase font-semibold">Back to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (screenType === "checkout") {
    return (
      <DonateCheckout 
        donationInfo={donationInfo} 
        setIsCheckoutLoading={setIsCheckoutLoading} 
        isCheckoutLoading={isCheckoutLoading} 
        payRazorpay={payRazorpay} 
      />
    );
  }

  if (screenType === "receipt") {
    return (
 <DonateReceipt 
 setIsReceiptLoading={setIsReceiptLoading}  // ✅ Correct prop name
      isReceiptLoading={isReceiptLoading} 
      getDonationReceipt={getDonationReceipt} 
/>


    );
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <Breadcrumb breadcrumb={breadcrumb} />
      
      <View className="p-4">
        <View className="items-center mb-6">
          <Text className="text-2xl md:text-4xl font-bold text-red-600 mb-2">Donate Now</Text>
          <View className="w-32 h-1 bg-red-600 mb-6" />
        </View>

        <View className="space-y-6">
          {isAuthStatus && (
            <View className="flex-row items-center my-3">
              <TouchableOpacity 
                onPress={() => handleCreateAccount(!isShowPassword)}
                className="w-4 h-4 border border-gray-300 rounded mr-2 justify-center items-center"
                style={{ backgroundColor: isShowPassword ? '#e53e3e' : 'transparent' }}
              >
                {isShowPassword && <Text className="text-white text-xs">✓</Text>}
              </TouchableOpacity>
              <Text className="text-base text-gray-800 font-medium">
                Create new user account? If already have an account, login from profile
              </Text>
            </View>
          )}

          {/* Dynamic Inputs */}
          <View className="border-2 border-yellow-400 bg-yellow-100 rounded-lg p-4 mt-5">
            {/* Fixed amount */}
            {typeContent?.amount != null && typeContent?.minimum_amount == null && !typeContent?.has_members && !typeContent?.has_items && (
              <>
                <View className="mb-4">
                  <Text className="text-base text-red-600 mb-1">
                    Amount <Text className="text-red-600">*</Text>
                  </Text>
                  <TextInput
                    value={typeContent?.amount.toString()}
                    {...register("amount", {
                      required: "Amount is required",
                    })}
                    onChangeText={(text) => {
                      setValue("amount", text);
                      trigger("amount");
                    }}
                    className="w-full rounded-lg border-0 px-3 py-2 bg-white  border-gray-300"
                    keyboardType="numeric"
                  />
                  {errors.amount && <Text className="text-red-600 text-xs">{(errors.amount as any).message}</Text>}
                </View>
              </>
            )}

            {/* Minimum amount value */}
            {typeContent?.amount == null && typeContent?.minimum_amount != null && (
              <View className="mb-4">
                <Text className="text-base text-red-600 mb-1">
                  Amount <Text className="text-red-600">*</Text>
                </Text>
                <TextInput
                  defaultValue={typeContent?.amount?.toString()}
                  {...register("amount", {
                    required: "Amount is required",
                  })}
                  onChangeText={(text) => {
                    setValue("amount", text);
                    trigger("amount");
                  }}
                  className="w-full rounded-lg border-0 px-3 py-2 bg-white border border-gray-300"
                  keyboardType="numeric"
                />
                {errors.amount && <Text className="text-red-600 text-xs">{(errors.amount as any).message}</Text>}
              </View>
            )}

            {/* amount and minimum_amount don't have a value */}
            {typeContent?.amount == null && typeContent?.minimum_amount == null && !typeContent?.has_items && (
              <View className="mb-4">
                <Text className="text-base text-red-600 mb-1">
                  Amount <Text className="text-red-600">*</Text>
                </Text>
                <TextInput
                  defaultValue={""}
                  {...register("amount", {
                    required: "Amount is required",
                  })}
                  onChangeText={(text) => {
                    setValue("amount", text);
                    trigger("amount");
                  }}
                  className="w-full rounded-lg border-0 px-3 py-2 bg-white border border-gray-300"
                  keyboardType="numeric"
                />
                {errors.amount && <Text className="text-red-600 text-xs">{(errors.amount as any).message}</Text>}
              </View>
            )}

            {/* Fixed Select */}
            {!typeContent?.has_items && !typeContent?.has_members && (
              <View className="mb-4">
                <Text className="text-base text-red-600 mb-1">
                  Donation Type
                </Text>
                <View className="border border-gray-300 rounded-lg bg-white">
                  <Picker
                    selectedValue={typeContent?.code}
                    onValueChange={() => {}}
                    enabled={false}
                  >
                    <Picker.Item label={typeContent?.name} value={typeContent?.code} />
                  </Picker>
                </View>
                <TextInput
                  {...register("donatetype", {
                    required: "Donation type is required",
                  })}
                  value={typeContent.code}
                  style={{ display: 'none' }}
                />
                {errors.donatetype && <Text className="text-red-600 text-xs">{(errors.donatetype as any).message}</Text>}
              </View>
            )}

            {/* Amavasai Velvi */}
            {typeContent?.has_dates && typeContent?.date_list != null && typeContent?.date_list?.length > 0 && (
              <>
                <View className="mb-4">
                  <Text className="text-base text-red-600 mb-1">
                    Date <Text className="text-red-600">*</Text>
                  </Text>

                  {selectedDates.map((date: any, index: any) => (
                    <View key={index} className="flex-row items-center mb-2">
                      <TouchableOpacity 
                        onPress={() => setShowDatePicker(index)}
                        className="flex-1 border border-gray-300 rounded-lg p-2 bg-white"
                      >
                        <Text>{date ? date.toLocaleDateString() : "Select a Date"}</Text>
                      </TouchableOpacity>
                      
                      {showDatePicker === index && (
                        <DateTimePicker
                          value={date || new Date()}
                          mode="date"
                          display="default"
                          onChange={(event, selectedDate) => handleDateChange(index, event, selectedDate)}
                          minimumDate={new Date()}
                        />
                      )}
                      
                      {selectedDates.length > 1 && index !== 0 && (
                        <TouchableOpacity 
                          onPress={() => removeDate(index)}
                          className="ml-2 p-2"
                        >
                          <Text className="text-red-600 text-lg">×</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  ))}

                  {typeContent?.multiple_dates && (
                    <TouchableOpacity 
                      onPress={addDate}
                      className="mt-2"
                    >
                      <Text className="text-sm text-red-600 font-semibold">Add Date</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <View className="items-center">
                  <Text className="text-xl font-bold my-2 text-red-600">
                    Total Amount: INR {typeContent?.amount * selectedDates.length}
                  </Text>
                </View>
              </>
            )}

            {/* Other donation type sections would follow similar patterns */}

            {typeContent?.has_postal && (
              <View className="items-center mt-4">
                <View className="flex-row items-center">
                  <TouchableOpacity 
                    onPress={() => setIncludeCourier(!includeCourier)}
                    className="w-4 h-4 border border-gray-300 rounded mr-2 justify-center items-center"
                    style={{ backgroundColor: includeCourier ? '#e53e3e' : 'transparent' }}
                  >
                    {includeCourier && <Text className="text-white text-xs">✓</Text>}
                  </TouchableOpacity>
                  <Text className="text-lg text-gray-700">Send Prasadham by Courier</Text>
                </View>
              </View>
            )}
          </View>

          {showPersonalAndBilling && (
            <>
              {isShowPassword && showPersonalAndBilling && (
                <View className="border-2 border-yellow-400 bg-yellow-100 rounded-lg p-4 my-6">
                  <Text className="uppercase font-semibold text-red-600 pb-2 border-b border-gray-200">Account Detail</Text>

                  <View className="mt-4">
                    <View className="mb-4">
                      <Text className="text-base text-red-600 mb-1">
                        Password <Text className="text-red-600">*</Text>
                      </Text>
                      <TextInput
                        {...register("password", { required: "Password is required" })}
                        secureTextEntry
                        className="w-full rounded-lg border-0 px-3 py-2 bg-white border border-gray-300"
                      />
                      {errors.password && <Text className="text-red-600 text-xs">{(errors.password as any).message}</Text>}
                    </View>

                    <View className="mb-4">
                      <Text className="text-base text-red-600 mb-1">
                        Confirm Password <Text className="text-red-600">*</Text>
                      </Text>
                      <TextInput
                        {...register("confirmpassword", { required: "Confirm Password is required" })}
                        secureTextEntry
                        className="w-full rounded-lg border-0 px-3 py-2 bg-white border border-gray-300"
                      />
                      {errors.confirmpassword && <Text className="text-red-600 text-xs">{(errors.confirmpassword as any).message}</Text>}
                    </View>
                  </View>
                </View>
              )}

              {/* Personal Detail */}
              <View className="border-2 border-yellow-400 bg-yellow-100 rounded-lg p-4 my-6">
                <Text className="uppercase text-xl font-semibold text-red-600 pb-2">Personal Detail</Text>

                <View className="pb-6 border-b border-red-600">
                  <View className="mb-4">
                    <Text className="text-base text-red-600 mb-1">
                      Name <Text className="text-red-600">*</Text>
                    </Text>
                    <TextInput
                      {...register("name", { required: "Name is required" })}
                      className="w-full rounded-lg border-0 px-3 py-2 bg-white  border-gray-300"
                    />
                    {errors.name && <Text className="text-red-600 text-xs">{(errors.name as any).message}</Text>}
                  </View>

                  <View className="mb-4">
                    <Text className="text-base text-red-600 mb-1">
                      Email Address <Text className="text-red-600">*</Text>
                    </Text>
                    <TextInput
                      {...register("email", { 
                        required: "Email is required", 
                        pattern: {
                          value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
                          message: "Invalid email address"
                        } 
                      })}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      className="w-full rounded-lg border-0 px-3 py-2 bg-white border border-gray-300"
                    />
                    {errors.email && <Text className="text-red-600 text-xs">{(errors.email as any).message}</Text>}
                  </View>

                  <View className="mb-4">
                    <Text className="text-base text-red-600 mb-1">
                      Phone Number <Text className="text-red-600">*</Text>
                    </Text>
                    <TextInput
                      {...register("phone", { required: "Phone is required" })}
                      keyboardType="phone-pad"
                      className="w-full rounded-lg border-0 px-3 py-2 bg-white border border-gray-300"
                    />
                    {errors.phone && <Text className="text-red-600 text-xs">{(errors.phone as any).message}</Text>}
                  </View>
                </View>

                <Text className="uppercase font-semibold text-red-600 text-xl py-2">Billing Detail</Text>
                
                <View className="mb-4">
                  <Text className="text-base text-red-600 mb-1">
                    Address Line 1 <Text className="text-red-600">*</Text>
                  </Text>
                  <TextInput
                    {...register("addressline1", { required: "Address is required" })}
                    className="w-full rounded-lg border-0 px-3 py-2 bg-white border border-gray-300"
                  />
                  {errors.addressline1 && <Text className="text-red-600 text-xs">{(errors.addressline1 as any).message}</Text>}
                </View>

                <View className="mb-4">
                  <Text className="text-base text-red-600 mb-1">
                    Address Line 2
                  </Text>
                  <TextInput
                    {...register("addressline2")}
                    className="w-full rounded-lg border-0 px-3 py-2 bg-white border border-gray-300"
                  />
                </View>

                <View className="mb-4">
                  <Text className="text-base text-red-600 mb-1">
                    Country <Text className="text-red-600">*</Text>
                  </Text>
                  <View className="border border-gray-300 rounded-lg bg-white">
                    <Picker
                      {...register("country", { required: "Country is required" })}
                      onValueChange={handleCountryChange}
                    >
                      {Object.keys(countries).map((key: any) => (
                        <Picker.Item key={key} label={countries[key]} value={key} />
                      ))}
                    </Picker>
                  </View>
                  {errors.country && <Text className="text-red-600 text-xs">{(errors.country as any).message}</Text>}
                </View>

                <View className="mb-4">
                  <Text className="text-base text-red-600 mb-1">
                    State <Text className="text-red-600">*</Text>
                  </Text>
                  <View className="border border-gray-300 rounded-lg bg-white">
                    <Picker
                      {...register("state", { required: "State is required" })}
                    >
                      {Object.keys(states).map((key: any) => (
                        <Picker.Item key={key} label={states[key]} value={key} />
                      ))}
                    </Picker>
                  </View>
                  {errors.state && <Text className="text-red-600 text-xs">{(errors.state as any).message}</Text>}
                </View>

                <View className="mb-4">
                  <Text className="text-base text-red-600 mb-1">
                    City <Text className="text-red-600">*</Text>
                  </Text>
                  <TextInput
                    {...register("city", { required: "City is required" })}
                    className="w-full rounded-lg border-0 px-3 py-2 bg-white  border-gray-300"
                  />
                  {errors.city && <Text className="text-red-600 text-xs">{(errors.city as any).message}</Text>}
                </View>

                <View className="mb-4">
                  <Text className="text-base text-red-600 mb-1">
                    Zip / Postal Code <Text className="text-red-600">*</Text>
                  </Text>
                  <TextInput
                    {...register("postalcode", { required: "Postal Code is required" })}
                    keyboardType="numeric"
                    className="w-full rounded-lg border-0 px-3 py-2 bg-white border border-gray-300"
                  />
                  {errors.postalcode && <Text className="text-red-600 text-xs">{(errors.postalcode as any).message}</Text>}
                </View>
              </View>

              <TouchableOpacity
                onPress={handleSubmit(handleonSubmit)}
                disabled={isLoading}
                className="overflow-hidden rounded-lg"
              >
                <LinearGradient
                  colors={['#e53e3e', '#ed8936']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="py-4 px-8 items-center"
                >
                  {isLoading ? (
                    <View className="flex-row items-center">
                      <ActivityIndicator color="white" />
                      <Text className="text-white font-bold ml-2">Please wait ...</Text>
                    </View>
                  ) : (
                    <Text className="text-white font-bold">Donate Now</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
      
      {!showPersonalAndBilling && (
        <VerifPanAadhaar 
          setEdonationVerify={setEdonationVerify} 
          typeContent={typeContent} 
          setPanDetails={setPanDetails} 
          aadhaarDetails={aadhaarDetails} 
          setAadhaarDetails={setAadhaarDetails} 
          setShowPersonalAndBilling={setShowPersonalAndBilling} 
        />
      )}
    </ScrollView>
  );
}