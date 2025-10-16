"use client";

import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";

import Link from "next/link";
import {useState} from "react";

const Register = () => {
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      console.log("User registered successfully:", data);
    } catch (error) {
      console.error("Error registering user:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className=" pt-10 pb-10">
        <div className="max-w-2xl mx-auto border-1 shadow-2xs rounded-2xl">
          <form className="bg-white px-10 py-5" onSubmit={handleSubmit}>
            <div className="mb-5">
              <Label className="block text-gray-700 mb-2">Your Full Name</Label>
              <Input
                type="text"
                value={user.fullName}
                onChange={(e) => setUser({...user, fullName: e.target.value})}
                name="fullName"
                className="w-full"
                placeholder="Full Name"
              />
            </div>
            {/* Email */}
            <div className="mb-5">
              <Label className="block text-gray-700 mb-2">Your Email</Label>
              <Input
                type="text"
                value={user.email}
                onChange={(e) => setUser({...user, email: e.target.value})}
                name="email"
                className="w-full"
                placeholder="Email"
              />
            </div>

            <div className="mb-5">
              <Label className="block text-gray-700 mb-2" htmlFor="Last Name">
                Password
              </Label>
              <Input
                name="password"
                value={user.password}
                onChange={(e) => setUser({...user, password: e.target.value})}
                type="password"
                className="w-full "
                placeholder="Password"
              />
            </div>

            <div className="mb-3 items-center gap-2">
              <button
                type="submit"
                className="w-full bg-black text-white py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                {loading ? "Please Wait..." : "Login"}
              </button>
            </div>
            <span className="text-gray-700 text-sm font-mono">
              {" "}
              Already have an account? {""}
              <Link href="/login" className="text-black font-medium underline ">
                Login
              </Link>
            </span>
          </form>
        </div>
      </section>
    </>
  );
};

export default Register;
