"use client";
import {
  createExperience,
  getExperienceById,
  updateExperience,
} from "@/api/ExperienceApi";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { Field, Input } from "@/components/ui/Input";
import { ExperienceForm } from "@/types";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";

type FormShape = {
  company: string;
  position: string;
  description: string;
  url: string;
  langString: string;
  startYear: number;
  endYear: string;
  hidden: boolean;
};

const initialData: FormShape = {
  company: "",
  position: "",
  description: "",
  url: "",
  langString: "",
  startYear: new Date().getFullYear(),
  endYear: "Present",
  hidden: false,
};

function ExperienceFormInner() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const isEdit = Boolean(editId);

  const {
    register,
    control,
    reset,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormShape>({ defaultValues: initialData });

  const { data: existing, isLoading: loadingExisting } = useQuery({
    queryFn: () => getExperienceById(editId!),
    queryKey: ["experience", editId],
    enabled: isEdit,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (existing) {
      reset({
        company: existing.company,
        position: existing.position,
        description: existing.description || "",
        url: existing.url || "",
        langString: (existing.lang || []).join(", "),
        startYear: Number(existing.date[0]),
        endYear: String(existing.date[1]),
        hidden: existing.hidden || false,
      });
    }
  }, [existing, reset]);

  const hidden = watch("hidden");

  const createMutation = useMutation({
    mutationFn: createExperience,
    onError: (e) => toast.error(e.message),
    onSuccess: () => {
      toast.success("Experience created");
      queryClient.invalidateQueries({ queryKey: ["experiences"] });
      queryClient.invalidateQueries({ queryKey: ["admin-experiences"] });
      router.push("/admin/experiences");
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateExperience,
    onError: (e) => toast.error(e.message),
    onSuccess: () => {
      toast.success("Experience updated");
      queryClient.invalidateQueries({ queryKey: ["experiences"] });
      queryClient.invalidateQueries({ queryKey: ["admin-experiences"] });
      router.push("/admin/experiences");
    },
  });

  const onSubmit = (formData: FormShape) => {
    const endYearParsed: string | number =
      formData.endYear === "Present" ? "Present" : Number(formData.endYear);

    const basePayload = {
      company: formData.company,
      position: formData.position,
      description: formData.description,
      url: formData.url,
      lang: formData.langString
        ? formData.langString.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      date: [Number(formData.startYear), endYearParsed] as [number, string | number],
      hidden: formData.hidden,
    };

    if (isEdit && editId) {
      // On update: never send `user` — it's set on create and is an ObjectId,
      // sending an empty string would break the cast on the backend.
      updateMutation.mutate({ id: editId, formData: basePayload });
    } else {
      // On create the backend pulls `user` from the JWT (req.user), so we don't need to send it.
      createMutation.mutate({ ...basePayload, user: "" } as ExperienceForm);
    }
  };

  if (isEdit && loadingExisting) {
    return (
      <div className="text-zinc-500 flex items-center gap-2">
        <Loader2 size={16} className="animate-spin" /> Loading experience…
      </div>
    );
  }

  const submitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <Link
          href="/admin/experiences"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-brand-400 mb-3"
        >
          <ArrowLeft size={14} /> Back to experiences
        </Link>
        <h1 className="font-signika text-3xl md:text-4xl font-bold text-zinc-100">
          {isEdit ? "Edit experience" : "New experience"}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5 bg-zinc-900/40 border border-zinc-800 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Company" error={errors.company?.message} htmlFor="company">
              <Input
                id="company"
                placeholder="Acme Inc."
                {...register("company", { required: "Company is required" })}
              />
            </Field>
            <Field label="Position" error={errors.position?.message} htmlFor="position">
              <Input
                id="position"
                placeholder="Senior Engineer"
                {...register("position", { required: "Position is required" })}
              />
            </Field>
          </div>

          <Field
            label="Description"
            error={errors.description?.message}
            hint="Use bullet points to describe your achievements and impact."
          >
            <Controller
              control={control}
              name="description"
              rules={{ required: "Description is required" }}
              render={({ field }) => (
                <RichTextEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Describe your role, responsibilities and impact…"
                />
              )}
            />
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Field label="Start year" htmlFor="startYear">
              <Input
                id="startYear"
                type="number"
                {...register("startYear", { required: true })}
              />
            </Field>
            <Field label="End year" hint="Use 'Present' if current" htmlFor="endYear">
              <Input
                id="endYear"
                placeholder="Present"
                {...register("endYear")}
              />
            </Field>
            <Field label="Tech stack" hint="Comma-separated" htmlFor="langString">
              <Input
                id="langString"
                placeholder="React, Node.js"
                {...register("langString")}
              />
            </Field>
          </div>

          <Field label="Company URL" htmlFor="url">
            <Input
              id="url"
              type="url"
              placeholder="https://company.com"
              {...register("url")}
            />
          </Field>
        </div>

        <div className="space-y-6">
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
              {isEdit ? "Save changes" : "Create experience"}
            </button>
            <Link
              href="/admin/experiences"
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
      <ExperienceFormInner />
    </Suspense>
  );
}
