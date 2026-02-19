"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";
import toast from "react-hot-toast";
import Link from "next/link";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    try {
      await api("/auth/register", "POST", { email, password });
      toast.success("Registered successfully");

      router.push("/login");
    } catch (error) {
      toast.error("Registration failed");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 shadow rounded"
      >
        <h2 className="text-xl font-bold text-center">Register</h2>

        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full rounded-lg"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full rounded-lg"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="bg-green-500 text-white px-4 py-2 w-full rounded-full">
          Register
        </button>
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-600 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
