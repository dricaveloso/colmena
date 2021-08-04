import React, { useEffect } from "react";
import { signOut } from "next-auth/client";
import { useRouter } from "next/router";
import CenterProgress from "@/components/ui/CenterProgress";

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      await signOut({ redirect: false });
      router.replace("/login");
    })();
  }, [router]);

  return <CenterProgress />;
}
