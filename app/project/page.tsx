"use client";
import {useSession} from "next-auth/react";
import {useRouter} from "next/navigation";
import {useEffect} from "react";

export default function Project() {
  const {data: session, status} = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="max-w-6xl mx-auto px-5 h-full lg:py-28 py-25 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render project content if not authenticated
  if (!session) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto px-5 h-full lg:py-28 py-25">
      <h1 className="text-2xl font-bold mb-4">Project Page</h1>
      <p className="text-muted-foreground">
        Welcome to your project, {session.user?.email}
      </p>
    </div>
  );
}
