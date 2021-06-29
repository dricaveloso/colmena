import React from "react";
import Button from "component/ui/Button";
import { useRouter } from "next/router";

function SkipButton({ title }) {
  const router = useRouter();

  return (
    <Button
      title={title}
      variant="outlined"
      handleClick={() => router.push("/complete-register")}
    />
  );
}

export default SkipButton;
