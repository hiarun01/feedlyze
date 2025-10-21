"use client";

import CreateProject from "@/components/CreateProject";
import {useAuth} from "@/contexts/AuthContext";
import {useRouter} from "next/navigation";
import {useEffect} from "react";

const DashboardPage = () => {
  const {user, loading} = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-5 h-full lg:py-28 py-25 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="max-w-6xl mx-auto px-5 h-full lg:py-28 py-25 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 items-center ">
      {/* Dashboard Header */}
      <div className="col-span-4 mb-8">
        <h1 className="text-2xl font-bold">Welcome back, {user.fullName}!</h1>
        <p className="text-muted-foreground mt-2">
          Manage your feedback projects
        </p>
      </div>
      <CreateProject />
    </div>
  );
};

export default DashboardPage;
