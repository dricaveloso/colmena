import React from "react";
import HeaderApp from "@/components/layout/HeaderApp";
import FooterApp from "@/components/layout/FooterApp";

type Props = {
  showTermsOfUse?: boolean;
  showAbout?: boolean;
  children: React.ReactNode;
};

function LayoutIntroApp({ showTermsOfUse = true, showAbout = false, children }: Props) {
  return (
    <div>
      <HeaderApp />
      {children}
      <FooterApp about={showAbout} terms={showTermsOfUse} />
    </div>
  );
}

export default LayoutIntroApp;
