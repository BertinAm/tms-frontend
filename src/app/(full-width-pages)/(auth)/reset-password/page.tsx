import React, { Suspense } from "react";
import ResetPasswordClient from "./ResetPasswordClient";

// Force dynamic rendering to prevent prerender issues with useSearchParams
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordClient />
    </Suspense>
  );
}
