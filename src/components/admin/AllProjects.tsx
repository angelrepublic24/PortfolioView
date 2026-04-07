"use client";
import { IProject } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteImage,
  deleteProject,
  reorderProjects,
  toggleProjectVisibility,
} from "@/api/ProjectApi";
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
  FolderGit2,
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
  projects: IProject[];
}

interface RowProps {
  project: IProject;
  onToggleVisibility: (id: string) => void;
  onDelete: (project: IProject) => void;
  draggable: boolean;
}

function ProjectRow({ project, onToggleVisibility, onDelete, draggable }: RowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project._id });

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
        project.hidden ? "border-zinc-800 opacity-70" : "border-zinc-800"
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

      <div className="relative w-full md:w-32 h-24 rounded-lg overflow-hidden bg-zinc-950 flex-shrink-0">
        {project.image ? (
          <Image
            src={project.image}
            alt={project.name}
            fill
            sizes="128px"
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-zinc-700">
            <FolderGit2 size={24} />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-zinc-100 font-medium truncate">{project.name}</h3>
          {project.hidden && (
            <span className="text-[10px] uppercase tracking-wider text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-full px-2 py-0.5">
              Hidden
            </span>
          )}
        </div>
        <p className="text-xs text-zinc-500 mb-2 font-mono">{project.date}</p>
        {project.lang && (
          <ul className="flex flex-wrap gap-1">
            {project.lang.slice(0, 5).map((l, i) => (
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
        {project.url && (
          <Link
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            title="Open live"
            className="p-2 text-zinc-500 hover:text-brand-400 hover:bg-zinc-800/60 rounded-lg transition"
          >
            <ExternalLink size={15} />
          </Link>
        )}
        <button
          onClick={() => onToggleVisibility(project._id)}
          title={project.hidden ? "Show" : "Hide"}
          className="p-2 text-zinc-500 hover:text-brand-400 hover:bg-zinc-800/60 rounded-lg transition"
        >
          {project.hidden ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
        <Link
          href={`/admin/create/project?id=${project._id}`}
          title="Edit"
          className="p-2 text-zinc-500 hover:text-brand-400 hover:bg-zinc-800/60 rounded-lg transition"
        >
          <Pencil size={15} />
        </Link>
        <button
          onClick={() => onDelete(project)}
          title="Delete"
          className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}

export const AllProjects = ({ projects }: Props) => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "visible" | "hidden">("all");
  const [pendingDelete, setPendingDelete] = useState<IProject | null>(null);
  const [items, setItems] = useState<IProject[]>(projects);

  // Sync local items with prop changes (e.g., after invalidate)
  useEffect(() => {
    setItems(projects);
  }, [projects]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const filtered = useMemo(() => {
    return items.filter((p) => {
      if (filter === "visible" && p.hidden) return false;
      if (filter === "hidden" && !p.hidden) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()))
        return false;
      return true;
    });
  }, [items, search, filter]);

  // Drag is only allowed when no search/filter is active
  const draggable = !search && filter === "all";

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["projects"] });
    queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
  };

  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onError: (e) => toast.error(e.message),
    onSuccess: () => {
      toast.success("Project deleted");
      invalidate();
      setPendingDelete(null);
    },
  });

  const deleteImageMutation = useMutation({ mutationFn: deleteImage });

  const visibilityMutation = useMutation({
    mutationFn: toggleProjectVisibility,
    onError: (e) => toast.error(e.message),
    onSuccess: () => {
      toast.success("Visibility updated");
      invalidate();
    },
  });

  const reorderMutation = useMutation({
    mutationFn: reorderProjects,
    onError: (e) => {
      toast.error(e.message);
      // Revert on error
      setItems(projects);
    },
    onSuccess: () => {
      toast.success("Order saved");
      invalidate();
    },
  });

  const extractPublicId = (imageUrl: string | null | undefined) => {
    if (!imageUrl) return null;
    const parts = imageUrl.split("/");
    const filename = parts.pop();
    const folder = parts.pop();
    if (filename && folder) return `${folder}/${filename.split(".")[0]}`;
    return null;
  };

  const handleDelete = (project: IProject) => {
    deleteMutation.mutate(project._id, {
      onSuccess: () => {
        const publicId = extractPublicId(project.image);
        if (publicId) deleteImageMutation.mutate(publicId);
      },
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((i) => i._id === active.id);
    const newIndex = items.findIndex((i) => i._id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const newItems = arrayMove(items, oldIndex, newIndex);
    setItems(newItems);

    // Persist order
    reorderMutation.mutate(
      newItems.map((p, idx) => ({ id: p._id, order: idx }))
    );
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="font-mono text-xs text-brand-400 mb-2">Content</p>
          <h1 className="font-signika text-3xl md:text-4xl font-bold text-zinc-100">
            Projects
          </h1>
          <p className="text-zinc-500 mt-1 text-sm">
            {projects.length} total ·{" "}
            {projects.filter((p) => !p.hidden).length} visible
          </p>
        </div>
        <Link
          href="/admin/create/project"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium transition shadow-[0_0_25px_-8px_rgba(139,92,246,0.6)]"
        >
          <Plus size={16} /> New project
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
            placeholder="Search projects…"
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
          <FolderGit2 className="mx-auto text-zinc-700 mb-3" size={32} />
          <p className="text-zinc-500">No projects match your filters.</p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={filtered.map((p) => p._id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {filtered.map((project) => (
                <ProjectRow
                  key={project._id}
                  project={project}
                  draggable={draggable}
                  onToggleVisibility={(id) => visibilityMutation.mutate(id)}
                  onDelete={(p) => setPendingDelete(p)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete project?"
        description={`This will permanently delete "${pendingDelete?.name}" and its image. This action cannot be undone.`}
        loading={deleteMutation.isPending}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => pendingDelete && handleDelete(pendingDelete)}
      />
    </div>
  );
};
