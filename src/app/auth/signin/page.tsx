"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, signUpSchema } from "@/lib/validations";
import type { SignInInput, SignUpInput } from "@/lib/validations";
import toast from "react-hot-toast";
import { SITE_NAME } from "@/lib/site";

export default function SignInPage() {
  const [isRegister, setIsRegister] = useState(false);
  const router = useRouter();

  const signInForm = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
  });

  const signUpForm = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
  });

  const handleSignIn = async (data: SignInInput) => {
    const result = await signIn("credentials", {
      phone: data.phone,
      password: data.password || data.phone,
      redirect: false,
    });

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Welcome back!");
      if (data.phone === "03000000000") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    }
  };

  const handleSignUp = async (data: SignUpInput) => {
    const result = await signIn("credentials", {
      phone: data.phone,
      name: data.name,
      password: data.phone,
      isRegister: "true",
      redirect: false,
    });

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Account created successfully!");
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 section-padding">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">M</span>
          </div>
          <h1 className="text-3xl font-montserrat font-black">
            {isRegister ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-white/50 mt-2">
            {isRegister
              ? "Sign up to start ordering delicious food"
              : `Sign in to your ${SITE_NAME} account`}
          </p>
        </div>

        <div className="glass rounded-3xl p-8">
          {isRegister ? (
            <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-4">
              <div>
                <label className="text-sm text-white/60 mb-1 block">Full Name</label>
                <input
                  {...signUpForm.register("name")}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl
                             focus:outline-none focus:border-orange/50 transition-colors"
                  placeholder="Your name"
                />
                {signUpForm.formState.errors.name && (
                  <p className="text-red-400 text-xs mt-1">
                    {signUpForm.formState.errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm text-white/60 mb-1 block">Mobile Number</label>
                <input
                  {...signUpForm.register("phone")}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl
                             focus:outline-none focus:border-orange/50 transition-colors"
                  placeholder="03XXXXXXXXX"
                />
                {signUpForm.formState.errors.phone && (
                  <p className="text-red-400 text-xs mt-1">
                    {signUpForm.formState.errors.phone.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm text-white/60 mb-1 block">Address</label>
                <input
                  {...signUpForm.register("address")}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl
                             focus:outline-none focus:border-orange/50 transition-colors"
                  placeholder="Your delivery address"
                />
              </div>
              <div>
                <label className="text-sm text-white/60 mb-1 block">City</label>
                <input
                  {...signUpForm.register("city")}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl
                             focus:outline-none focus:border-orange/50 transition-colors"
                  placeholder="Your city"
                />
              </div>
              <button type="submit" className="w-full btn-primary py-4">
                Create Account
              </button>
            </form>
          ) : (
            <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-4">
              <div>
                <label className="text-sm text-white/60 mb-1 block">Mobile Number</label>
                <input
                  {...signInForm.register("phone")}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl
                             focus:outline-none focus:border-orange/50 transition-colors"
                  placeholder="03XXXXXXXXX"
                />
                {signInForm.formState.errors.phone && (
                  <p className="text-red-400 text-xs mt-1">
                    {signInForm.formState.errors.phone.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm text-white/60 mb-1 block">Password</label>
                <input
                  type="password"
                  {...signInForm.register("password")}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl
                             focus:outline-none focus:border-orange/50 transition-colors"
                  placeholder="Enter your password"
                />
                <p className="text-white/30 text-xs mt-1">
                  Regular users: your password is your phone number
                </p>
              </div>
              <button type="submit" className="w-full btn-primary py-4">
                Sign In
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-orange text-sm hover:underline"
            >
              {isRegister
                ? "Already have an account? Sign In"
                : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
