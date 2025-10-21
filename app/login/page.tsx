"use client";

import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import Link from "next/link";
import {useState, FormEvent, useEffect} from "react";
import {useAuth} from "@/contexts/AuthContext";
import {useRouter} from "next/navigation";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const {login, isAuthenticated, loading} = useAuth();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, loading, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        // Redirect to dashboard on successful login
        router.push("/dashboard");
      } else {
        setError(result.error || "Login failed");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }
  return (
    <>
      <section className="h-screen flex flex-col justify-center px-5">
        <div className="mx-auto border-1 shadow-2xs rounded-2xl w-full max-w-lg">
          <form className=" px-10 py-5" onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            {/* Email */}
            <div className="mb-5 w-full">
              <Label className="block mb-2">Your Email</Label>
              <Input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
                placeholder="Email"
                required
                disabled={isLoading}
              />
            </div>

            <div className="mb-5">
              <Label className="block  mb-2">Password</Label>
              <Input
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full "
                placeholder="Password"
                required
                disabled={isLoading}
              />
            </div>

            <div className="mb-3 items-center gap-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full dark:bg-white dark:text-black bg-black dark:hover:bg-gray-200 text-white py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Please Wait..." : "Login"}
              </button>
            </div>
            <span className=" text-sm font-mono">
              {" "}
              Dont have an account? {""}
              <Link href="/register" className=" font-medium underline ">
                Create Account
              </Link>
            </span>
          </form>
        </div>
      </section>
    </>
  );
};

export default Login;
