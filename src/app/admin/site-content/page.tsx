"use client";

import { getSiteContentAdmin, updateSiteContent } from "@/api/SiteContentApi";
import { Field, Input } from "@/components/ui/Input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Save } from "lucide-react";

const ta =
  "w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-brand-500/50 outline-none font-mono leading-relaxed";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-6 space-y-5">
      <p className="text-xs uppercase tracking-wider text-brand-400 font-mono">{title}</p>
      {children}
    </div>
  );
}

export default function SiteContentPage() {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm<any>();

  const { data, isLoading } = useQuery({
    queryFn: getSiteContentAdmin,
    queryKey: ["site-content"],
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!data) return;
    reset({
      name: data.name ?? "",
      role: data.role ?? "",
      location: data.location ?? "",
      brand: data.brand ?? "",
      rev: data.rev ?? "",
      sealText: data.sealText ?? "",
      hero: {
        eyebrow: data.hero?.eyebrow ?? "",
        headLead: data.hero?.headLead ?? "",
        headAmber: data.hero?.headAmber ?? "",
        lede: data.hero?.lede ?? "",
      },
      contact: {
        github: data.contact?.github ?? "",
        githubLabel: data.contact?.githubLabel ?? "",
        linkedin: data.contact?.linkedin ?? "",
        linkedinLabel: data.contact?.linkedinLabel ?? "",
        email: data.contact?.email ?? "",
        studio: data.contact?.studio ?? "",
        studioLabel: data.contact?.studioLabel ?? "",
      },
      heroSpec: (data.hero?.spec ?? []).join(", "),
      coverDisciplines: (data.coverDisciplines ?? []).join(", "),
      notes: (data.notes ?? []).join("\n"),
      sectionFloors: (data.sectionFloors ?? [])
        .map((f: any) => `${f.label} | ${f.techTop} | ${f.techBottom}`)
        .join("\n"),
    });
  }, [data, reset]);

  const mutation = useMutation({
    mutationFn: updateSiteContent,
    onError: (e: any) => toast.error(e.message || "Could not save"),
    onSuccess: () => {
      toast.success("Site content saved");
      queryClient.invalidateQueries({ queryKey: ["site-content"] });
    },
  });

  const onSubmit = (form: any) => {
    const list = (s: string, sep: string) =>
      (s || "").split(sep).map((x) => x.trim()).filter(Boolean);
    const payload = {
      name: form.name,
      role: form.role,
      location: form.location,
      brand: form.brand,
      rev: form.rev,
      sealText: form.sealText,
      hero: {
        eyebrow: form.hero.eyebrow,
        headLead: form.hero.headLead,
        headAmber: form.hero.headAmber,
        lede: form.hero.lede,
        spec: list(form.heroSpec, ","),
      },
      coverDisciplines: list(form.coverDisciplines, ","),
      notes: list(form.notes, "\n"),
      sectionFloors: list(form.sectionFloors, "\n").map((line) => {
        const [label, techTop, techBottom] = line.split("|").map((s) => s.trim());
        return { label, techTop: techTop || "", techBottom: techBottom || "" };
      }),
      contact: { ...form.contact },
    };
    mutation.mutate(payload);
  };

  if (isLoading) {
    return (
      <div className="text-zinc-500 flex items-center gap-2">
        <Loader2 size={16} className="animate-spin" /> Loading site content…
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-brand-400 mb-3">
          <ArrowLeft size={14} /> Back to dashboard
        </Link>
        <h1 className="font-signika text-3xl md:text-4xl font-bold text-zinc-100">Site content</h1>
        <p className="text-zinc-500 mt-1">Hero, bio, notes, section-cut and contact — everything on the home page, from the database.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Section title="Identity">
          <div className="grid md:grid-cols-2 gap-5">
            <Field label="Name" htmlFor="name"><Input id="name" {...register("name")} /></Field>
            <Field label="Role / title" htmlFor="role"><Input id="role" {...register("role")} /></Field>
            <Field label="Location" htmlFor="location"><Input id="location" {...register("location")} /></Field>
            <Field label="Rev (e.g. 2026.07)" htmlFor="rev"><Input id="rev" {...register("rev")} /></Field>
            <Field label="Brand (nav wordmark)" htmlFor="brand"><Input id="brand" {...register("brand")} /></Field>
            <Field label="Seal text (circular)" htmlFor="sealText"><Input id="sealText" {...register("sealText")} /></Field>
          </div>
        </Section>

        <Section title="Hero">
          <Field label="Eyebrow" htmlFor="hero.eyebrow"><Input id="hero.eyebrow" {...register("hero.eyebrow")} /></Field>
          <div className="grid md:grid-cols-2 gap-5">
            <Field label="Headline — lead" htmlFor="hero.headLead"><Input id="hero.headLead" {...register("hero.headLead")} /></Field>
            <Field label="Headline — amber part" htmlFor="hero.headAmber"><Input id="hero.headAmber" {...register("hero.headAmber")} /></Field>
          </div>
          <Field label="Spec strip (comma-separated)" htmlFor="heroSpec"><Input id="heroSpec" {...register("heroSpec")} /></Field>
          <Field label="Bio / lede" htmlFor="hero.lede">
            <textarea id="hero.lede" rows={4} className={ta} {...register("hero.lede")} />
          </Field>
          <Field label="Cover discipline stamp (comma-separated: WEB, APP, API, DB, PAY, OPS)" htmlFor="coverDisciplines">
            <Input id="coverDisciplines" {...register("coverDisciplines")} />
          </Field>
        </Section>

        <Section title="General notes (one per line — HTML like <b>…</b> allowed)">
          <textarea rows={7} className={ta} {...register("notes")} />
        </Section>

        <Section title="Section-cut floors (one per line:  LABEL | top line | bottom line)">
          <textarea rows={6} className={ta} {...register("sectionFloors")} />
          <p className="text-xs text-zinc-600">Add <span className="font-mono">*</span> to a bottom line to mark it as an external (blue) service, e.g. <span className="font-mono">Stripe*</span>.</p>
        </Section>

        <Section title="Contact">
          <div className="grid md:grid-cols-2 gap-5">
            <Field label="GitHub URL" htmlFor="contact.github"><Input id="contact.github" {...register("contact.github")} /></Field>
            <Field label="GitHub label" htmlFor="contact.githubLabel"><Input id="contact.githubLabel" {...register("contact.githubLabel")} /></Field>
            <Field label="LinkedIn URL" htmlFor="contact.linkedin"><Input id="contact.linkedin" {...register("contact.linkedin")} /></Field>
            <Field label="LinkedIn label" htmlFor="contact.linkedinLabel"><Input id="contact.linkedinLabel" {...register("contact.linkedinLabel")} /></Field>
            <Field label="Email" htmlFor="contact.email"><Input id="contact.email" {...register("contact.email")} /></Field>
            <Field label="Studio URL" htmlFor="contact.studio"><Input id="contact.studio" {...register("contact.studio")} /></Field>
            <Field label="Studio label" htmlFor="contact.studioLabel"><Input id="contact.studioLabel" {...register("contact.studioLabel")} /></Field>
          </div>
        </Section>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium transition disabled:opacity-50"
        >
          {mutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          Save site content
        </button>
      </form>
    </div>
  );
}
