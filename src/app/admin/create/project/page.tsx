"use client";
import {
  createProject,
  deleteImage,
  getProjectById,
  updateProject,
  uploadImage,
} from "@/api/ProjectApi";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { Field, Input, Textarea } from "@/components/ui/Input";
import { STATUS_META } from "@/lib/stack";
import { ProductForm, ProjectStatus } from "@/types";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Eye,
  EyeOff,
  ImagePlus,
  LayoutTemplate,
  Loader2,
  Plus,
  Rows3,
  Trash2,
  X,
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
  links: [],
  summary: "",
  status: null,
  featured: false,
  gallery: [],
};

/** Suggestions for the extra destinations a product can ship on. */
const LINK_PRESETS = ["Website", "iOS App", "Android App", "Web App", "Case study", "GitHub"];

const STATUSES = Object.keys(STATUS_META) as ProjectStatus[];

function ProjectFormInner() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const isEdit = Boolean(editId);

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploadingPhotos, setUploadingPhotos] = useState(0);

  const {
    register,
    control,
    reset,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<ProductForm & { langString: string }>({
    defaultValues: { ...initialData, langString: "" },
  });

  const { fields: linkFields, append: appendLink, remove: removeLink } = useFieldArray({
    control,
    name: "links",
  });

  const {
    fields: photoFields,
    append: appendPhoto,
    remove: removePhoto,
    move: movePhoto,
  } = useFieldArray({
    control,
    name: "gallery",
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
        links: existing.links || [],
        summary: existing.summary || "",
        status: existing.status ?? null,
        featured: existing.featured ?? false,
        gallery: existing.gallery || [],
        langString: (existing.lang || []).join(", "),
      });
      setImageUrl(existing.image || null);
    }
  }, [existing, reset]);

  const hidden = watch("hidden");
  const featured = watch("featured");

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
    onSuccess: (_data, { formData }) => {
      // Photos taken out of the gallery leave Cloudinary only once the save went through.
      const kept = new Set((formData.gallery ?? []).map((g) => g.publicId));
      for (const g of existing?.gallery ?? []) {
        if (g.publicId && !kept.has(g.publicId)) deleteImage(g.publicId).catch(() => {});
      }
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

  // One at a time, so the plates keep the order the files were picked in.
  const handlePhotos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (!files.length) return;
    setUploadingPhotos(files.length);
    for (const file of files) {
      try {
        const data = await uploadImage(file);
        if (!data?.image) throw new Error();
        appendPhoto({ url: data.image, publicId: data.publicId, caption: "" });
      } catch {
        toast.error(`Couldn't upload ${file.name}`);
      }
      setUploadingPhotos((n) => n - 1);
    }
  };

  const handleRemovePhoto = (i: number) => {
    const publicId = getValues(`gallery.${i}.publicId`);
    removePhoto(i);
    // Uploaded in this session and never saved — nothing else points at it.
    const saved = (existing?.gallery ?? []).some((g) => g.publicId === publicId);
    if (publicId && !saved) deleteImage(publicId).catch(() => {});
  };

  const onSubmit = (formData: ProductForm & { langString: string }) => {
    const { langString, user, ...rest } = formData;

    const links = (rest.links ?? []).map((l) => ({
      label: l.label?.trim() ?? "",
      url: l.url?.trim() ?? "",
    }));
    // Never drop a half-filled row on the floor behind a success toast.
    if (links.some((l) => Boolean(l.label) !== Boolean(l.url))) {
      toast.error("Every extra link needs both a label and a URL");
      return;
    }

    const payload: Partial<ProductForm> = {
      ...rest,
      image: imageUrl,
      lang: langString
        ? langString.split(",").map((s) => s.trim()).filter(Boolean)
        : rest.lang,
      date: Number(rest.date),
      links: links.filter((l) => l.label && l.url),
      summary: rest.summary?.trim() ?? "",
      gallery: (rest.gallery ?? [])
        .filter((g) => g.url)
        .map((g) => ({ url: g.url, publicId: g.publicId, caption: g.caption?.trim() || undefined })),
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
            label="Summary"
            htmlFor="summary"
            hint="One or two lines under the name on the home sheet. Leave empty to use the start of the description."
          >
            <Textarea
              id="summary"
              rows={3}
              maxLength={280}
              className="min-h-[76px]"
              placeholder="A rent-a-car marketplace where double booking is impossible at the database level…"
              {...register("summary")}
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

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm text-zinc-300">Extra links</label>
              <button
                type="button"
                onClick={() => appendLink({ label: "", url: "" })}
                className="inline-flex items-center gap-1.5 text-xs text-brand-400 hover:text-brand-300"
              >
                <Plus size={12} /> Add link
              </button>
            </div>
            <p className="text-xs text-zinc-500 mb-3">
              For products that ship on more than one surface — e.g. a website{" "}
              <span className="text-zinc-400">and</span> a mobile app. Each one is shown as its own
              button on the project sheet. The Live URL above is always listed first.
            </p>

            {linkFields.length === 0 ? (
              <p className="text-xs text-zinc-600 border border-dashed border-zinc-800 rounded-lg px-4 py-3">
                No extra links — only the Live URL is shown.
              </p>
            ) : (
              <div className="space-y-2">
                {linkFields.map((field, i) => (
                  <div key={field.id} className="flex items-start gap-2">
                    <div className="w-40 shrink-0">
                      <Input
                        list="link-label-presets"
                        placeholder="iOS App"
                        {...register(`links.${i}.label` as const)}
                      />
                    </div>
                    <div className="flex-1">
                      <Input
                        type="url"
                        placeholder="https://apps.apple.com/…"
                        {...register(`links.${i}.url` as const)}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeLink(i)}
                      aria-label="Remove link"
                      className="mt-2.5 text-zinc-600 hover:text-red-400 transition"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <datalist id="link-label-presets">
              {LINK_PRESETS.map((p) => (
                <option key={p} value={p} />
              ))}
            </datalist>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm text-zinc-300">Photos</label>
              <label
                className={`inline-flex items-center gap-1.5 text-xs text-brand-400 hover:text-brand-300 ${
                  uploadingPhotos > 0 ? "pointer-events-none opacity-60" : "cursor-pointer"
                }`}
              >
                {uploadingPhotos > 0 ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Plus size={12} />
                )}
                {uploadingPhotos > 0 ? `Uploading ${uploadingPhotos}…` : "Add photos"}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/gif,image/webp"
                  multiple
                  onChange={handlePhotos}
                  disabled={uploadingPhotos > 0}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-xs text-zinc-500 mb-3">
              Screenshots and photos for the project page, shown as numbered plates in this
              order — click one there to see it full size. PNG, JPG, GIF or WebP.
            </p>

            {photoFields.length === 0 ? (
              <p className="text-xs text-zinc-600 border border-dashed border-zinc-800 rounded-lg px-4 py-3">
                No photos yet — the project page skips the plates section.
              </p>
            ) : (
              <div className="space-y-2">
                {photoFields.map((field, i) => (
                  <div key={field.id} className="flex items-center gap-3">
                    <div className="relative w-24 aspect-video shrink-0 rounded-md overflow-hidden border border-zinc-800 bg-[#16191D]">
                      <Image src={field.url} alt="" fill sizes="96px" className="object-contain" />
                    </div>
                    <div className="flex-1">
                      <Input
                        placeholder="Caption — e.g. Agency dashboard, fleet calendar"
                        {...register(`gallery.${i}.caption` as const)}
                      />
                    </div>
                    <div className="flex items-center text-zinc-600">
                      <button
                        type="button"
                        onClick={() => movePhoto(i, i - 1)}
                        disabled={i === 0}
                        aria-label="Move photo up"
                        className="p-1.5 hover:text-zinc-300 disabled:opacity-30 disabled:hover:text-zinc-600 transition"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => movePhoto(i, i + 1)}
                        disabled={i === photoFields.length - 1}
                        aria-label="Move photo down"
                        className="p-1.5 hover:text-zinc-300 disabled:opacity-30 disabled:hover:text-zinc-600 transition"
                      >
                        <ArrowDown size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(i)}
                        aria-label="Remove photo"
                        className="p-1.5 hover:text-red-400 transition"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: image + visibility + actions */}
        <div className="space-y-6">
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-6">
            <p className="text-xs uppercase tracking-wider text-zinc-400 mb-1">
              Logo
            </p>
            <p className="text-xs text-zinc-500 mb-3">
              Shown on a dark plate on the home and the project page — a transparent PNG works best.
            </p>
            {imageUrl ? (
              <div className="space-y-3">
                <div className="relative aspect-[16/10] rounded-lg overflow-hidden border border-zinc-800 bg-[#16191D]">
                  <Image
                    src={imageUrl}
                    alt="logo"
                    fill
                    sizes="320px"
                    className="object-contain p-5"
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

          <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-6 space-y-4">
            <p className="text-xs uppercase tracking-wider text-zinc-400">
              Home sheet
            </p>
            <button
              type="button"
              onClick={() => setValue("featured", !featured)}
              className={`flex items-center justify-between w-full px-4 py-3 rounded-lg border transition ${
                featured
                  ? "border-brand-500/30 bg-brand-500/10 text-brand-300"
                  : "border-zinc-700 bg-zinc-900/60 text-zinc-400"
              }`}
            >
              <span className="flex items-center gap-2 text-sm">
                {featured ? <LayoutTemplate size={14} /> : <Rows3 size={14} />}
                {featured ? "Featured project sheet" : "Archive list only"}
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wider">
                {featured ? "Sheet" : "Ref"}
              </span>
            </button>
            <Field label="Status" htmlFor="status" hint="Auto reads it from the description.">
              <select
                id="status"
                className="w-full bg-zinc-900/60 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/20"
                {...register("status", { setValueAs: (v) => v || null })}
              >
                <option value="">Auto</option>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_META[s].label}
                  </option>
                ))}
              </select>
            </Field>
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
