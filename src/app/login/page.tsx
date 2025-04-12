'use client'
import ErrorMessage from "@/components/ErrorMessage";
import api from "@/global/Global";
import { LoginForm } from "@/types";
import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function () {
  const router = useRouter();
  const initialData: LoginForm = {
    email: "",
    password: "",
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: initialData });

  const handleLogin = async (formData: LoginForm) => {
    try {
      const { data } = await api.post("/auth/login", formData);
      localStorage.setItem("AUTH_TOKEN", data.token);
      console.log(data);
      toast.success(data.msg);
      router.push("/admin");
    } catch (error) {
      if (isAxiosError(error)) {
        console.log(error);
        toast.error(error.response?.data.msg);
      }
    }
  };
  return (
    <div className="flex justify-center bg-black w-full">
    
      <form
        onSubmit={handleSubmit(handleLogin)}
        className="bg-transparent border border-purple-500 px-5 pb-20 pt-10 rounded-lg space-y-10 mt-10 w-1/3"
        noValidate
      >
        <h3 className="text-xl font-bold uppercase tracking-widest text-purple-500 ">
          Login
        </h3>
        <div className="grid grid-cols-1 space-y-3">
          
          <label htmlFor="email" className="text-2xl text-purple-500">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            className="bg-transparent border border-purple-500 p-3 rounded-lg placeholder-slate-400"
            {...register("email", {
              required: "The email is required",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "E-mail not valid",
              },
            })}
          />
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        </div>
        <div className="grid grid-cols-1 space-y-3">
          <label htmlFor="password" className="text-2xl text-purple-500">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            className="bg-transparent border-purple-500 border p-3 rounded-lg placeholder-slate-400"
            {...register("password", {
              required: "The password is required",
            })}
          />
          {errors.password && (
            <ErrorMessage>{errors.password.message}</ErrorMessage>
          )}
        </div>

        <input
          type="submit"
          className="bg-purple-500 text-white p-3 text-lg w-full uppercase text-slate-600 rounded-lg font-bold cursor-pointer"
          value="Log in"
        />
      </form>
    </div>
  );
}
