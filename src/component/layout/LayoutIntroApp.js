import React from "react";
import HeaderApp from "component/layout/HeaderApp";
import FooterApp from "component/layout/FooterApp";

function LayoutIntroApp({
  showTermsOfUse = true,
  showAbout = false,
  children,
}) {
  return (
    <div>
      <HeaderApp />
      {children}
      <FooterApp about={showAbout} terms={showTermsOfUse} />
    </div>
  );
}

export default LayoutIntroApp;
