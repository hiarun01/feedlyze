"use client";
import CreateProject from "@/components/CreateProject";
import {useSession} from "next-auth/react";
import {useRouter} from "next/navigation";
import {useEffect} from "react";

const DashboardPage = () => {
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

  // Don't render dashboard content if not authenticated
  if (!session) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto px-5 h-auto lg:py-28 py-25 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 items-center gap-5">
      {/* Dashboard Header */}
      <div className="col-span-4 mb-8">
        <h1 className="text-2xl font-bold">
          Welcome back, {session.user?.email}
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your feedback projects
        </p>
      </div>
      <CreateProject />
    </div>
  );
};

export default DashboardPage;
