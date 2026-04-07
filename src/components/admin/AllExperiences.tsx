"use client";
import { IExperience } from "@/types";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteExperience,
  reorderExperiences,
  toggleExperienceVisibility,
} from "@/api/ExperienceApi";
import { toast } from "sonner";
import { useState, useMemo, useEffect } from "react";
import {
  Plus,
  Search,
  Eye,
  EyeOff,
  Pencil,
  Trash2,
  ExternalLink,
  Briefcase,
  GripVertical,
} from "lucide-react";
import ConfirmDialog from "./ConfirmDialog";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  experiences: IExperience[];
}

interface RowProps {
  exp: IExperience;
  onToggleVisibility: (id: string) => void;
  onDelete: (exp: IExperience) => void;
  draggable: boolean;
}

function ExperienceRow({ exp, onToggleVisibility, onDelete, draggable }: RowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: exp._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : "auto",
  } as React.CSSProperties;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex flex-col md:flex-row gap-4 p-4 bg-zinc-900/40 border rounded-xl transition-all hover:border-brand-500/30 ${
        exp.hidden ? "border-zinc-800 opacity-70" : "border-zinc-800"
      } ${isDragging ? "shadow-2xl border-brand-500/60" : ""}`}
    >
      {draggable && (
        <button
          {...attributes}
          {...listeners}
          className="hidden md:flex items-center justify-center text-zinc-600 hover:text-brand-400 cursor-grab active:cursor-grabbing"
          aria-label="Drag to reorder"
          title="Drag to reorder"
        >
          <GripVertical size={18} />
        </button>
      )}

      <div className="w-12 h-12 rounded-lg bg-brand-500/10 border border-brand-500/30 flex items-center justify-center flex-shrink-0">
        <Briefcase size={18} className="text-brand-400" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-zinc-100 font-medium truncate">
            {exp.position}{" "}
            <span className="text-brand-400">@ {exp.company}</span>
          </h3>
          {exp.hidden && (
            <span className="text-[10px] uppercase tracking-wider text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-full px-2 py-0.5">
              Hidden
            </span>
          )}
        </div>
        <p className="text-xs text-zinc-500 mb-2 font-mono">
          {exp.date[0]} — {exp.date[1]}
        </p>
        {exp.lang && (
          <ul className="flex flex-wrap gap-1">
            {exp.lang.slice(0, 6).map((l, i) => (
              <li
                key={i}
                className="text-[10px] font-mono text-brand-300 bg-brand-500/10 border border-brand-500/20 rounded-full px-2 py-0.5"
              >
                {l}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex items-center gap-1 md:flex-col md:items-end md:justify-center">
        {exp.url && (
          <Link
            href={exp.url}
            target="_blank"
            rel="noopener noreferrer"
            title="Open"
            className="p-2 text-zinc-500 hover:text-brand-400 hover:bg-zinc-800/60 rounded-lg transition"
          >
            <ExternalLink size={15} />
          </Link>
        )}
        <button
          onClick={() => onToggleVisibility(exp._id)}
          title={exp.hidden ? "Show" : "Hide"}
          className="p-2 text-zinc-500 hover:text-brand-400 hover:bg-zinc-800/60 rounded-lg transition"
        >
          {exp.hidden ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
        <Link
          href={`/admin/create/experience?id=${exp._id}`}
          title="Edit"
          className="p-2 text-zinc-500 hover:text-brand-400 hover:bg-zinc-800/60 rounded-lg transition"
        >
          <Pencil size={15} />
        </Link>
        <button
          onClick={() => onDelete(exp)}
          title="Delete"
          className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}

export const AllExperience = ({ experiences }: Props) => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "visible" | "hidden">("all");
  const [pendingDelete, setPendingDelete] = useState<IExperience | null>(null);
  const [items, setItems] = useState<IExperience[]>(experiences);

  useEffect(() => {
    setItems(experiences);
  }, [experiences]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const filtered = useMemo(() => {
    return items.filter((e) => {
      if (filter === "visible" && e.hidden) return false;
      if (filter === "hidden" && !e.hidden) return false;
      if (
        search &&
        !`${e.company} ${e.position}`.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [items, search, filter]);

  const draggable = !search && filter === "all";

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["experiences"] });
    queryClient.invalidateQueries({ queryKey: ["admin-experiences"] });
  };

  const deleteMutation = useMutation({
    mutationFn: deleteExperience,
    onError: (e) => toast.error(e.message),
    onSuccess: () => {
      toast.success("Experience deleted");
      invalidate();
      setPendingDelete(null);
    },
  });

  const visibilityMutation = useMutation({
    mutationFn: toggleExperienceVisibility,
    onError: (e) => toast.error(e.message),
    onSuccess: () => {
      toast.success("Visibility updated");
      invalidate();
    },
  });

  const reorderMutation = useMutation({
    mutationFn: reorderExperiences,
    onError: (e) => {
      toast.error(e.message);
      setItems(experiences);
    },
    onSuccess: () => {
      toast.success("Order saved");
      invalidate();
    },
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((i) => i._id === active.id);
    const newIndex = items.findIndex((i) => i._id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const newItems = arrayMove(items, oldIndex, newIndex);
    setItems(newItems);

    reorderMutation.mutate(
      newItems.map((e, idx) => ({ id: e._id, order: idx }))
    );
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="font-mono text-xs text-brand-400 mb-2">Content</p>
          <h1 className="font-signika text-3xl md:text-4xl font-bold text-zinc-100">
            Experiences
          </h1>
          <p className="text-zinc-500 mt-1 text-sm">
            {experiences.length} total ·{" "}
            {experiences.filter((e) => !e.hidden).length} visible
          </p>
        </div>
        <Link
          href="/admin/create/experience"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium transition shadow-[0_0_25px_-8px_rgba(139,92,246,0.6)]"
        >
          <Plus size={16} /> New experience
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search experiences…"
            className="w-full bg-zinc-900/60 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-brand-500/60"
          />
        </div>
        <div className="flex bg-zinc-900/60 border border-zinc-800 rounded-lg p-1">
          {(["all", "visible", "hidden"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs rounded-md capitalize transition ${
                filter === f
                  ? "bg-brand-500/20 text-brand-300"
                  : "text-zinc-500 hover:text-zinc-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {draggable ? (
        <p className="text-xs text-zinc-500 flex items-center gap-2">
          <GripVertical size={12} />
          Drag the handle to reorder. The order is reflected on the public site.
        </p>
      ) : (
        <p className="text-xs text-amber-400/80">
          Reordering is disabled while filtering or searching. Clear filters to drag.
        </p>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-zinc-800 rounded-xl">
          <Briefcase className="mx-auto text-zinc-700 mb-3" size={32} />
          <p className="text-zinc-500">No experiences match your filters.</p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={filtered.map((e) => e._id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {filtered.map((exp) => (
                <ExperienceRow
                  key={exp._id}
                  exp={exp}
                  draggable={draggable}
                  onToggleVisibility={(id) => visibilityMutation.mutate(id)}
                  onDelete={(e) => setPendingDelete(e)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete experience?"
        description={`This will permanently delete "${pendingDelete?.position} @ ${pendingDelete?.company}". This action cannot be undone.`}
        loading={deleteMutation.isPending}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() =>
          pendingDelete && deleteMutation.mutate(pendingDelete._id)
        }
      />
    </div>
  );
};
