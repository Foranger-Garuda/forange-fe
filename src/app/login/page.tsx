"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { login: authLogin, token } = useAuth();

  useEffect(() => {
    if (token) {
      router.push("/");
    }
  }, [token, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:5000/authentication/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.status === 200) {
        authLogin(data.user, data.access_token);
        router.push("/");
      } else {
        setError(data.error || data.message || "Login failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Left Panel */}
      <div className="flex flex-col justify-center items-center basis-[10%] lg:flex-1 bg-[#138048] text-white p-10 relative">
        <div className="text-[48px] lg:text-[72px] font-bold flex items-center relative">
          <img src="/gro.png" alt="logo gro" className="w-40 lg:w-100 h-auto" />
        </div>
        <div className="hidden lg:block absolute bottom-0 left-0 p-4 text-sm lg:text-base">
          <p className="text-base">
            "Viralkan perubahan, wujudkan Lahan Damai."
          </p>
          <p className="text-sm opacity-80">Muhammad Iqbal</p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex flex-col justify-center basis-[90%] lg:flex-1 bg-[#121212] text-white p-10 relative">
        <Link
          href="/register"
          className="absolute top-5 right-8 text-sm underline"
        >
          Register
        </Link>
        <div className="w-full max-w-md mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-2">Sign In</h2>
          <p className="text-sm mb-6">
            Enter your email and password to sign in
          </p>
          <form onSubmit={handleSubmit}>
            <Input
              type="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mb-4 rounded-md border border-gray-700 bg-[#1e1e1e] text-white"
            />
            <Input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mb-4 rounded-md border border-gray-700 bg-[#1e1e1e] text-white"
            />
            {error && <div className="text-red-500 text-xs mb-2">{error}</div>}
            <Button className="w-full p-3 bg-white text-black font-bold hover:text-white">
              Sign In
            </Button>
          </form>
          <p className="text-xs text-gray-400 mt-4">
            By signing in, you agree to our{" "}
            <Link href="#" className="underline text-gray-400">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="underline text-gray-400">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
