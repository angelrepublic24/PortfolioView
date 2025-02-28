"use client";
import { createExperience } from "@/api/ExperienceApi";
import ErrorMessage from "@/components/ErrorMessage";
import { ExperienceForm} from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function () {
  const initialData: ExperienceForm = {
    company: "",
    position: "",
    description: "",
    lang: [""],
    url: "",
    user: "",
    date: [2018, "Present"],
  };

  const {register, reset, handleSubmit, formState: { errors }} = useForm({ defaultValues: initialData });

  const createMutation = useMutation({
    mutationFn: createExperience,
    onError: async (error) => {
      toast.error(error.message);
      console.log(error)
    },
    onSuccess: async(data) => {
      toast.success(data.message || "Experience created successfully");
      reset();
    },
  });


  const useFormCreate = (formData: ExperienceForm) => {

  let dateArray: [number, string | number]
  if (Array.isArray(formData.date)) {
    // Verifica que el array tenga exactamente dos elementos
    if (formData.date.length !== 2) {
      throw new Error("El array 'date' should be 2 elements");
    }
    dateArray = [
      typeof formData.date[0] === "number" ? formData.date[0] : Number(formData.date[0]),
      formData.date[1] === "Present" ? "Present" : Number(formData.date[1])
    ];
  } else {
    const parts = formData.date.split(",").map((year: string) => year.trim());
    if (parts.length !== 2) {
      throw new Error("Formato inválido en 'date'. Se espera 'inicio, fin'.");
    }
    dateArray = [
      Number(parts[0]),
      parts[1] === "Present" ? "Present" : Number(parts[1])
    ] as [number, string | number];;
  }
    createMutation.mutate({ ...formData, date: dateArray });
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(useFormCreate)}
        className="bg-[rgba(255,255,255,0.1)] px-5 py-12 rounded-lg space-y-10 mt-10"
      >
        <h1 className="text-white text-3xl font-bold">Create Experience</h1>
        <div className="grid grid-cols-1 space-y-3">
          <label htmlFor="company" className="text-2xl text-slate-500">
          Company
          </label>
          <input
            id="company"
            type="text"
            placeholder="Company"
            className="border-slate-400 bg-transparent border p-3 rounded-lg placeholder-slate-400"
            {...register("company", {
              required: "The company is required",
            })}
          />
          {errors.company && <ErrorMessage>{errors.company.message}</ErrorMessage>}
        </div>
        <div className="grid grid-cols-1 space-y-3">
          <label htmlFor="position" className="text-2xl text-slate-500">
          Position
          </label>
          <input
            id="position"
            type="text"
            placeholder="Position"
            className="border-slate-400 bg-transparent border p-3 rounded-lg placeholder-slate-400"
            {...register("position", {
              required: "The position is required",
            })}
          />
          {errors.position && <ErrorMessage>{errors.position.message}</ErrorMessage>}
        </div>
        <div className="grid grid-cols-1 space-y-3">
          <label htmlFor="description" className="text-2xl text-slate-500">
            Description
          </label>
          <textarea
            id="description"
            placeholder="Description"
            className="border-slate-400 bg-transparent border p-3 rounded-lg placeholder-slate-400 h-[150px]"
            {...register("description", {
              required: "The description is required",
            })}
          />
          {errors.description && (
            <ErrorMessage>{errors.description?.message}</ErrorMessage>
          )}
        </div>
        <div className="grid grid-cols-1 space-y-3">
          <label htmlFor="lang" className="text-2xl text-slate-500">
            Languages
          </label>
          <input
            id="lang"
            type="text"
            placeholder="lang"
            className="border-slate-400 bg-transparent border p-3 rounded-lg placeholder-slate-400"
            {...register("lang", {
              required: "The lang is required",
            })}
          />
          {errors.lang &&
            Array.isArray(errors.lang) &&
            errors.lang.map((error, index) => (
              <ErrorMessage key={index}>{error.message}</ErrorMessage>
            ))}
        </div>
        <div className="grid grid-cols-1 space-y-3">
          <label htmlFor="url" className="text-2xl text-slate-500">
            Url
          </label>
          <input
            id="url"
            type="text"
            placeholder="Url"
            className="border-slate-400 bg-transparent border p-3 rounded-lg placeholder-slate-400"
            {...register("url", {
              required: "The url is required",
            })}
          />
          {errors.url && <ErrorMessage>{errors.url.message}</ErrorMessage>}
        </div>

        <div className="grid grid-cols-1 space-y-3">
          <label htmlFor="date" className="text-2xl text-slate-500">
            Date
          </label>
          <input
            id="date"
            type=""
            placeholder="Date"
            className="border-slate-400 bg-transparent border p-3 rounded-lg placeholder-slate-400"
            {...register("date", {
              required: "The year is required",
            })}
          />
          {errors.date && <ErrorMessage>{errors.date.message}</ErrorMessage>}
        </div>

        <input
          type="submit"
          className="bg-cyan-400 p-3 text-lg w-full uppercase text-slate-600 rounded-lg font-bold cursor-pointer"
          value="Create Experience"
        />
      </form>
    </>
  );
}
