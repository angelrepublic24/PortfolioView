"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ProjectImage } from "@/types";

/** The project's photos as numbered plates; a click opens the full image. */
export default function Plates({
  images,
  prefix,
  name,
}: {
  images: ProjectImage[];
  /** Sheet number the figures hang off, e.g. "A-03.2" → Fig. A-03.2/01. */
  prefix: string;
  name: string;
}) {
  const [open, setOpen] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const figure = (i: number) => `${prefix}/${String(i + 1).padStart(2, "0")}`;
  const caption = (i: number) => `Fig. ${figure(i)}${images[i].caption ? ` — ${images[i].caption}` : ""}`;
  const alt = (i: number) => images[i].caption || `${name} — figure ${i + 1}`;

  const close = useCallback(() => {
    setOpen(null);
    triggerRef.current?.focus();
  }, []);
  const step = useCallback(
    (d: number) => setOpen((i) => (i === null ? null : (i + d + images.length) % images.length)),
    [images.length]
  );

  useEffect(() => {
    if (open === null) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [open, close, step]);

  return (
    <>
      <div className="plates">
        {images.map((img, i) => (
          <figure key={`${img.url}-${i}`} className="plate">
            <button
              type="button"
              className="plate-box"
              aria-label={`Enlarge ${caption(i)}`}
              onClick={(e) => {
                triggerRef.current = e.currentTarget;
                setOpen(i);
              }}
            >
              <Image src={img.url} alt={alt(i)} fill sizes="(min-width: 860px) 540px, 100vw" className="plate-img shot" />
            </button>
            <figcaption>{caption(i)}</figcaption>
          </figure>
        ))}
      </div>

      {open !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={caption(open)} onClick={close}>
          <div className="lightbox-stage">
            <Image src={images[open].url} alt={alt(open)} fill sizes="100vw" className="lightbox-img" />
          </div>
          <div className="lightbox-bar" onClick={(e) => e.stopPropagation()}>
            <span>{caption(open)}</span>
            <span className="lightbox-btns">
              {images.length > 1 && (
                <>
                  <button type="button" onClick={() => step(-1)}>← Prev</button>
                  <button type="button" onClick={() => step(1)}>Next →</button>
                </>
              )}
              <button type="button" ref={closeRef} onClick={close}>Close ✕</button>
            </span>
          </div>
        </div>
      )}
    </>
  );
}
