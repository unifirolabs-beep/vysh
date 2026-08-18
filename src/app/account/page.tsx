import React, { Suspense } from "react";
import { AccountClient } from "./AccountClient";

export const metadata = {
  title: "My Account | Vysh Pure 925 Silver",
  description: "View your order history, manage shipping addresses, and account details.",
};

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs">Loading Account...</div>}>
      <AccountClient />
    </Suspense>
  );
}
