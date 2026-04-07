"use client";
import {
  createProject,
  deleteImage,
  getProjectById,
  updateProject,
  uploadImage,
} from "@/api/ProjectApi";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { Field, Input } from "@/components/ui/Input";
import { ProductForm } from "@/types";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  ImagePlus,
  Loader2,
  Trash2,
} from "lucide-react";
import Image from "next/image";

const initialData: ProductForm = {
  name: "",
  description: "",
  lang: [],
  url: "",
  image: "",
  user: "",
  date: new Date().getFullYear(),
  hidden: false,
};

function ProjectFormInner() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const isEdit = Boolean(editId);

  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const {
    register,
    control,
    reset,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductForm & { langString: string }>({
    defaultValues: { ...initialData, langString: "" },
  });

  // Load project data when editing
  const { data: existing, isLoading: loadingExisting } = useQuery({
    queryFn: () => getProjectById(editId!),
    queryKey: ["project", editId],
    enabled: isEdit,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (existing) {
      reset({
        name: existing.name,
        description: existing.description || "",
        lang: existing.lang || [],
        url: existing.url || "",
        image: existing.image || "",
        user: existing.user || "",
        date: existing.date,
        hidden: existing.hidden || false,
        langString: (existing.lang || []).join(", "),
      });
      setImageUrl(existing.image || null);
    }
  }, [existing, reset]);

  const hidden = watch("hidden");

  const uploadMutation = useMutation({
    mutationFn: uploadImage,
    onError: (e) => toast.error(e.message),
    onSuccess: (data) => {
      toast.success("Image uploaded");
      setImageUrl(data.image);
    },
  });

  const removeImageMutation = useMutation({
    mutationFn: deleteImage,
    onSuccess: () => {
      setImageUrl(null);
      toast.success("Image removed");
    },
  });

  const createMutation = useMutation({
    mutationFn: createProject,
    onError: (e) => toast.error(e.message),
    onSuccess: () => {
      toast.success("Project created");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      router.push("/admin/projects");
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateProject,
    onError: (e) => toast.error(e.message),
    onSuccess: () => {
      toast.success("Project updated");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", editId] });
      router.push("/admin/projects");
    },
  });

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) uploadMutation.mutate(e.target.files[0]);
  };

  const extractPublicId = (url: string | null) => {
    if (!url) return null;
    const parts = url.split("/");
    const filename = parts.pop();
    const folder = parts.pop();
    if (filename && folder) return `${folder}/${filename.split(".")[0]}`;
    return null;
  };

  const handleRemoveImage = () => {
    const publicId = extractPublicId(imageUrl);
    if (publicId) removeImageMutation.mutate(publicId);
    else setImageUrl(null);
  };

  const onSubmit = (formData: ProductForm & { langString: string }) => {
    const { langString, user, ...rest } = formData;
    const payload: Partial<ProductForm> = {
      ...rest,
      image: imageUrl,
      lang: langString
        ? langString.split(",").map((s) => s.trim()).filter(Boolean)
        : rest.lang,
      date: Number(rest.date),
    };

    if (isEdit && editId) {
      updateMutation.mutate({ id: editId, formData: payload });
    } else {
      // Backend reads user from JWT (req.user) on create
      createMutation.mutate(payload);
    }
  };

  if (isEdit && loadingExisting) {
    return (
      <div className="text-zinc-500 flex items-center gap-2">
        <Loader2 size={16} className="animate-spin" /> Loading project…
      </div>
    );
  }

  const submitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <Link
          href="/admin/projects"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-brand-400 mb-3"
        >
          <ArrowLeft size={14} /> Back to projects
        </Link>
        <h1 className="font-signika text-3xl md:text-4xl font-bold text-zinc-100">
          {isEdit ? "Edit project" : "New project"}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: fields */}
        <div className="lg:col-span-2 space-y-5 bg-zinc-900/40 border border-zinc-800 rounded-xl p-6">
          <Field label="Name" error={errors.name?.message} htmlFor="name">
            <Input
              id="name"
              placeholder="My awesome project"
              {...register("name", { required: "Name is required" })}
            />
          </Field>

          <Field
            label="Description"
            error={errors.description?.message}
            hint="Use the toolbar above to format text — headings, lists, links and more."
          >
            <Controller
              control={control}
              name="description"
              rules={{ required: "Description is required" }}
              render={({ field }) => (
                <RichTextEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Describe what this project does, why it matters, the tech, the result…"
                />
              )}
            />
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field
              label="Tech stack"
              hint="Comma-separated, e.g. Next.js, MongoDB"
              htmlFor="langString"
            >
              <Input
                id="langString"
                placeholder="Next.js, NestJS, MongoDB"
                {...register("langString")}
              />
            </Field>

            <Field label="Year" error={errors.date?.message as string} htmlFor="date">
              <Input
                id="date"
                type="number"
                placeholder="2025"
                {...register("date", { required: "Year is required" })}
              />
            </Field>
          </div>

          <Field label="Live URL" error={errors.url?.message} htmlFor="url">
            <Input
              id="url"
              type="url"
              placeholder="https://example.com"
              {...register("url")}
            />
          </Field>
        </div>

        {/* Right: image + visibility + actions */}
        <div className="space-y-6">
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-6">
            <p className="text-xs uppercase tracking-wider text-zinc-400 mb-3">
              Cover image
            </p>
            {imageUrl ? (
              <div className="space-y-3">
                <div className="relative aspect-video rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950">
                  <Image
                    src={imageUrl}
                    alt="cover"
                    fill
                    sizes="320px"
                    className="object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="inline-flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300"
                >
                  <Trash2 size={12} /> Remove image
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center aspect-video border border-dashed border-zinc-700 rounded-lg cursor-pointer hover:border-brand-500/40 hover:bg-brand-500/5 transition">
                {uploadMutation.isPending ? (
                  <Loader2 size={20} className="animate-spin text-brand-400" />
                ) : (
                  <>
                    <ImagePlus size={20} className="text-zinc-500 mb-2" />
                    <span className="text-xs text-zinc-500">
                      Click to upload
                    </span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-6">
            <p className="text-xs uppercase tracking-wider text-zinc-400 mb-3">
              Visibility
            </p>
            <button
              type="button"
              onClick={() => setValue("hidden", !hidden)}
              className={`flex items-center justify-between w-full px-4 py-3 rounded-lg border transition ${
                hidden
                  ? "border-amber-500/30 bg-amber-500/10 text-amber-300"
                  : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
              }`}
            >
              <span className="flex items-center gap-2 text-sm">
                {hidden ? <EyeOff size={14} /> : <Eye size={14} />}
                {hidden ? "Hidden from site" : "Visible on site"}
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wider">
                {hidden ? "Draft" : "Public"}
              </span>
            </button>
          </div>

          <div className="space-y-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium transition disabled:opacity-50 shadow-[0_0_30px_-8px_rgba(139,92,246,0.6)]"
            >
              {submitting && <Loader2 size={14} className="animate-spin" />}
              {isEdit ? "Save changes" : "Create project"}
            </button>
            <Link
              href="/admin/projects"
              className="block text-center w-full px-4 py-2.5 rounded-lg border border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-white text-sm transition"
            >
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ProjectFormInner />
    </Suspense>
  );
}
