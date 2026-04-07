"use client";
import { Field, Input } from "@/components/ui/Input";
import Logo from "@/components/ui/Logo";
import api from "@/global/Global";
import { LoginForm } from "@/types";
import { isAxiosError } from "axios";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const initialData: LoginForm = { email: "", password: "" };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: initialData });

  const handleLogin = async (formData: LoginForm) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", formData);
      localStorage.setItem("AUTH_TOKEN", data.token);
      toast.success(data.msg || "Welcome back");
      router.push("/admin");
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.msg || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-grid-pattern bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)] pointer-events-none" />
      <div className="absolute inset-0 bg-radial-violet pointer-events-none" />

      <div className="relative w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-brand-400 mb-6"
        >
          <ArrowLeft size={14} /> Back to portfolio
        </Link>

        <div className="bg-zinc-900/60 backdrop-blur-lg border border-zinc-800 rounded-2xl p-8 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <Logo size={44} showText={false} href={null} />
            <h1 className="mt-4 font-signika text-2xl font-bold text-zinc-100">
              Welcome back
            </h1>
            <p className="text-sm text-zinc-500 mt-1">
              Sign in to manage your portfolio
            </p>
          </div>

          <form onSubmit={handleSubmit(handleLogin)} className="space-y-5" noValidate>
            <Field label="Email" htmlFor="email" error={errors.email?.message}>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Invalid email",
                  },
                })}
              />
            </Field>

            <Field
              label="Password"
              htmlFor="password"
              error={errors.password?.message}
            >
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password", { required: "Password is required" })}
              />
            </Field>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium transition disabled:opacity-50 shadow-[0_0_30px_-8px_rgba(139,92,246,0.6)]"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
