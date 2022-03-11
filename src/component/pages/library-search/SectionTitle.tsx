import React from "react";
import Text from "@/components/ui/Text";

type Props = {
  children: React.ReactNode;
};

export default function SearchTitle({ children }: Props) {
  return <Text style={{ fontWeight: "bold" }}>{children}</Text>;
}
