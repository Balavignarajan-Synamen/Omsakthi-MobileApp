import { Link } from "expo-router";
import { Text, TouchableOpacity } from "react-native";

import type { LinkProps } from "expo-router";

type ButtonProps = {
  title: string;
  href: LinkProps["href"];
};

export const Button = ({ title, href }: ButtonProps) => (
  <Link href={href} asChild>
    <TouchableOpacity className="mt-6 rounded-xl bg-red-500 px-6 py-3">
      <Text className="text-white font-medium">{title}</Text>
    </TouchableOpacity>
  </Link>
);
