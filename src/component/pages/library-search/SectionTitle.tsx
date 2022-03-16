import React from "react";
import Text from "@/components/ui/Text";

type Props = {
  children: React.ReactNode;
  className?: string | undefined;
};

export default function SearchTitle({ children, className }: Props) {
  return (
    <Text style={{ fontWeight: "bold" }} className={className}>
      {children}
    </Text>
  );
}
