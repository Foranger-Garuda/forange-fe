"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiFetch } from "@/lib/utils";

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
      const data = await apiFetch("/authentication/register", {
        method: "POST",
        body: JSON.stringify({ email, password, full_name: fullName }),
      });
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => router.push('/login'), 1500);
    } catch (err) {
      setError((err as Error).message || "Registration failed");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Left Panel */}
      <div className="flex flex-col justify-center items-center basis-[10%] lg:flex-1 bg-[#138048] text-white p-10 relative">
        <div className="text-[48px] lg:text-[72px] font-bold flex items-center relative">
          <img src="/gro.png" alt="logo gro" className="w-40 lg:w-100 h-auto" />
        </div>
        <div className="absolute bottom-0 left-0 p-4">
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex flex-col justify-center basis-[90%] lg:flex-1 bg-[#121212] text-white p-10 relative">
        <Link
          href="/login"
          className="absolute top-5 right-8 text-sm underline"
        >
          Login
        </Link>
        <div className="w-full max-w-md mx-auto px-4 text-center">
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
            {error && <div className="text-red-500 text-xs mb-2">{error}</div>}
            {success && (
              <div className="text-green-500 text-xs mb-2">{success}</div>
            )}
            <Button className="w-full p-3 bg-white text-black font-bold hover:text-white">
              Sign Up
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
