"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setSuccess("");
      return;
    }
    setError("");
    setSuccess("");
    try {
      const res = await fetch("http://localhost:5000/authentication/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, full_name: fullName }),
      });
      const data = await res.json();
      if (res.status === 201) {
        setSuccess("Registration successful! Redirecting to login...");
        setTimeout(() => router.push("/login"), 1500);
      } else {
        setError(data.error || data.message || "Registration failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Panel */}
      <div className="flex flex-col justify-center items-center flex-1 bg-[#138048] text-white p-10 relative">
        <div className="text-[72px] font-bold flex items-center relative">
          <img src="/gro.png" alt="logo gro" />
        </div>
        <div className="absolute bottom-0 left-0 p-4">
          <p className="text-base">
            "Viralkan perubahan, wujudkan Lahan Damai."
          </p>
          <p className="text-sm opacity-80">Muhammad Iqbal</p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex flex-col justify-center flex-1 bg-[#121212] text-white p-10 relative">
        <Link
          href="/login"
          className="absolute top-5 right-8 text-sm underline"
        >
          Login
        </Link>
        <div className="max-w-sm w-full mx-auto text-center">
          <h2 className="text-2xl font-bold mb-2">Create an account</h2>
          <p className="text-sm mb-6">
            Enter your details below to create your account
          </p>
          <form onSubmit={handleSubmit}>
            <Input
              type="text"
              required
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-3 mb-4 rounded-md border border-gray-700 bg-[#1e1e1e] text-white"
            />
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
            <Input
              type="password"
              required
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 mb-4 rounded-md border border-gray-700 bg-[#1e1e1e] text-white"
            />
            {error && (
              <div className="text-red-500 text-xs mb-2">{error}</div>
            )}
            {success && (
              <div className="text-green-500 text-xs mb-2">{success}</div>
            )}
            <Button className="w-full p-3 bg-white text-black font-bold hover:text-white">
              Sign Up
            </Button>
          </form>
          <p className="text-xs text-gray-400 mt-4">
            By clicking continue, you agree to our{" "}
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
