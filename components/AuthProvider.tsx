"use client";

import {SessionProvider} from "next-auth/react";

export default function AuthProvider({children}: {children: React.ReactNode}) {
  return (
    <SessionProvider
      // Reduce the refetch interval to avoid unnecessary requests
      refetchInterval={5 * 60} // 5 minutes instead of default 1 minute
      refetchOnWindowFocus={false} // Don't refetch when window gets focus
    >
      {children}
    </SessionProvider>
  );
}
