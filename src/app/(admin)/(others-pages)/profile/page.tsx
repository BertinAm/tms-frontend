import React, { Suspense } from "react";
import ProfileClient from "./ProfileClient";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default function ProfilePage() {
  return (
    <Suspense>
      <ProfileClient />
    </Suspense>
  );
}