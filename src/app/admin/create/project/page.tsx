"use client";
import { createProject, deleteImage, uploadImage } from "@/api/ProjectApi";
import ErrorMessage from "@/components/ErrorMessage";
import { ProductForm } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function () {
  const queryClient = useQueryClient();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [publicId, setPublicId] = useState<string | null>(null);
  const [deleteTimer, setDeleteTimer] = useState<NodeJS.Timeout | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);



  const initialData: ProductForm = {
    name: "",
    description: "",
    lang: [""],
    url: "",
    image: "",
    user: "",
    date: 0,
  };

  const {register, reset, handleSubmit, formState: { errors }} = useForm({ defaultValues: initialData });

  const uploadMutation = useMutation({
    mutationFn: uploadImage,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success("Image uploaded successfully");
      setImageUrl(data.image)
      setPublicId(data.publicId)
      localStorage.setItem("uploadedImageId", data.publicId);

      if (formSubmitted) {
        return;
      }
      
      if (deleteTimer) clearTimeout(deleteTimer);
      const timer = setTimeout(() => {
        deletingImage(data.publicId);
        localStorage.removeItem("uploadedImageId")
      },2 * 60 * 1000); // ⏳ 5 minutos antes de borrar la imagen automáticamente
      setDeleteTimer(timer);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteImage,
    onSuccess: (data) => {
      toast.error("Image deleted due to inactivity.");
      setImageUrl(null);
      setPublicId(null);
      localStorage.removeItem("uploadedImageId");
    },
  });

  const deletingImage = async (publicIdToDelete: string | null) => {
    if (!publicIdToDelete) {
        console.warn("⚠ No hay publicId disponible, no se puede eliminar la imagen.");
        return;
    }
    await deleteMutation.mutate(publicIdToDelete);
  };

  const createMutation = useMutation({
    mutationFn: createProject,
    onError: async (error) => {
      toast.error(error.message);
    },
    onSuccess: async(data) => {
      if (deleteTimer) clearTimeout(deleteTimer);
      toast.success(data.message || "Project created successfully");
      setFormSubmitted(true);
      localStorage.removeItem("uploadedImageId")
      reset();
      
    },
  });

  

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.files){
      uploadMutation.mutate(e.target.files[0]);
    }
    
  };

  const useFormCreate = async (formData: ProductForm) => {
    createMutation.mutate({...formData, image: imageUrl});
  };

  useEffect(() => {
    const storedPublicId = localStorage.getItem("uploadedImageId");
  
    if (storedPublicId) {
      deletingImage(storedPublicId);
    }
  
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!formSubmitted) {
        const storedPublicId = localStorage.getItem("uploadedImageId");
        if (storedPublicId) {
          deletingImage(storedPublicId);
        }
      }
    };
  
    window.addEventListener("beforeunload", handleBeforeUnload);
  
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [formSubmitted]);
  return (
    <div className="flex justify-center py-10">
      <form
        onSubmit={handleSubmit(useFormCreate)}
        className="bg-transparent border border-purple-500 p-16 w-1/2 rounded-lg space-y-4"
      >
        <h1 className="text-white text-3xl font-bold ">Create a Project</h1>
        <div className="grid grid-cols-1 space-y-3">
          <label htmlFor="name" className="text-2xl text-slate-500">
            Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Name"
            className="border-purple-500 bg-transparent border p-3 rounded-lg placeholder-slate-400"
            {...register("name", {
              required: "The name is required",
            })}
          />
          {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
        </div>
        <div className="grid grid-cols-1 space-y-3">
          <label htmlFor="description" className="text-2xl text-slate-500">
            Description
          </label>
          <textarea
            id="description"
            placeholder="Description"
            className="border-purple-500 bg-transparent border p-3 rounded-lg placeholder-slate-400"
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
            className="border-purple-500 bg-transparent border p-3 rounded-lg placeholder-slate-400"
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
            className="border-purple-500 bg-transparent border p-3 rounded-lg placeholder-slate-400"
            {...register("url", {
              required: "The url is required",
            })}
          />
          {errors.url && <ErrorMessage>{errors.url.message}</ErrorMessage>}
        </div>

        <div className="grid grid-cols-1 space-y-3">
          <label htmlFor="date" className="text-2xl text-slate-500">
            Year
          </label>
          <input
            id="date"
            type="number"
            placeholder="Date"
            className="border-purple-500 bg-transparent border p-3 rounded-lg placeholder-slate-400"
            {...register("date", {
              required: "The year is required",
            })}
          />
          {errors.date && <ErrorMessage>{errors.date.message}</ErrorMessage>}
        </div>

        <div className="grid grid-cols-1 space-y-3">
          <label htmlFor="file" className="text-2xl text-slate-500">
            Image
          </label>
          <input
            id="file"
            accept="image/*"
            type="file"
            className="border-purple-500 bg-transparent border p-3 rounded-lg placeholder-slate-400"
            {...register("image")}
            onChange={handleImage}
          />
          {errors.image && <ErrorMessage>{errors.image.message}</ErrorMessage>}
        </div>

        <input
          type="submit"
          className="bg-purple-400 hover:border-purple-500 p-3 text-lg w-full uppercase text-slate-600 rounded-lg font-bold cursor-pointer"
          value="Create Project"
        />
      </form>
    </div>
  );
}
