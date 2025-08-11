import React, { Suspense } from "react";
import VerifyOtpClient from "./VerifyOtpClient";

// Force dynamic rendering to avoid prerender issues with search params
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default function VerifyOTPPage() {
  return (
    <Suspense>
      <VerifyOtpClient />
    </Suspense>
  );
}
