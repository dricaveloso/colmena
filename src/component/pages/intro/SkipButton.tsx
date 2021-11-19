import React from "react";
import Button from "@/components/ui/Button";
import { useRouter } from "next/router";
import { ButtonVariantEnum } from "@/enums/index";

type Props = {
  title: string;
};

function SkipButton({ title }: Props) {
  const router = useRouter();

  const navigate = () => {
    router.push("/complete-register");
  };

  return <Button title={title} variant={ButtonVariantEnum.OUTLINED} handleClick={navigate} />;
}

export default SkipButton;
