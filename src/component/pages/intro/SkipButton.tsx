import React from "react";
import Button from "component/ui/Button";
import { useRouter } from "next/router";
import { ButtonVariantEnum } from "enums";

type Props = {
  title: string;
};

function SkipButton({ title }: Props) {
  const router = useRouter();

  return (
    <Button
      title={title}
      variant={ButtonVariantEnum.OUTLINED}
      handleClick={() => router.push("/complete-register")}
    />
  );
}

export default SkipButton;
