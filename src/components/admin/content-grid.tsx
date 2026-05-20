"use client";

import { useMemo, useState } from "react";
import { ExternalLink, Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ContentItem, ContentPillar, ContentStatus, ContentType } from "@/lib/supabase/types";
import {
  CONTENT_PILLAR_LABELS,
  CONTENT_PILLARS,
  CONTENT_STATUSES,
  CONTENT_STATUS_COLORS,
  CONTENT_STATUS_LABELS,
  CONTENT_TYPE_LABELS,
  CONTENT_TYPES,
} from "@/lib/content/constants";

interface Props {
  initialItems: ContentItem[];
}

function formatDate(value: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function emptyDraft(): Partial<ContentItem> {
  return {
    title: "",
    content_type: "linkedin",
    status: "idea",
    pillar: "thought_leadership",
    channel: "",
    notes: "",
    publish_url: "",
    scheduled_for: null,
    published_at: null,
    tags: [],
  };
}

export function ContentGrid({ initialItems }: Props) {
  const [items, setItems] = useState<ContentItem[]>(initialItems);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterPillar, setFilterPillar] = useState("all");
  const [saving, setSaving] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [draft, setDraft] = useState(emptyDraft());
  const [tagInput, setTagInput] = useState("");

  const selected = items.find((i) => i.id === selectedId) ?? null;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      if (filterType !== "all" && item.content_type !== filterType) return false;
      if (filterPillar !== "all" && (item.pillar ?? "other") !== filterPillar) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        (item.notes ?? "").toLowerCase().includes(q) ||
        (item.channel ?? "").toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [items, search, filterType, filterPillar]);

  const byStatus = useMemo(() => {
    const map = Object.fromEntries(CONTENT_STATUSES.map((s) => [s, [] as ContentItem[]])) as Record<
      ContentStatus,
      ContentItem[]
    >;
    for (const item of filtered) {
      const status = CONTENT_STATUSES.includes(item.status) ? item.status : "idea";
      map[status].push(item);
    }
    for (const status of CONTENT_STATUSES) {
      map[status].sort((a, b) => a.sort_order - b.sort_order || b.updated_at.localeCompare(a.updated_at));
    }
    return map;
  }, [filtered]);

  const stats = useMemo(() => {
    const published = items.filter((i) => i.status === "published").length;
    const scheduled = items.filter((i) => i.status === "scheduled").length;
    const inProgress = items.filter((i) => i.status === "draft" || i.status === "scheduled").length;
    const thisMonth = items.filter((i) => {
      if (!i.published_at) return false;
      const d = new Date(i.published_at);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;
    return { total: items.length, published, scheduled, inProgress, thisMonth };
  }, [items]);

  async function createItem() {
    if (!draft.title?.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: draft.title,
          content_type: draft.content_type,
          status: draft.status,
          pillar: draft.pillar || null,
          channel: draft.channel || null,
          notes: draft.notes || null,
          publish_url: draft.publish_url || null,
          scheduled_for: draft.scheduled_for,
          published_at: draft.published_at,
          tags: draft.tags ?? [],
        }),
      });
      const data = (await res.json()) as { items?: ContentItem[]; error?: string };
      if (!res.ok) throw new Error(data.error || "Create failed");
      if (data.items) setItems(data.items);
      setShowCreate(false);
      setDraft(emptyDraft());
      if (data.items?.[0]) setSelectedId(data.items.find((i) => i.title === draft.title)?.id ?? null);
    } finally {
      setSaving(false);
    }
  }

  async function updateItem(id: string, patch: Partial<ContentItem>) {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/content/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const data = (await res.json()) as { items?: ContentItem[] };
      if (!res.ok) throw new Error("Update failed");
      if (data.items) setItems(data.items);
    } finally {
      setSaving(false);
    }
  }

  async function deleteItem(id: string) {
    if (!confirm("¿Eliminar esta pieza de contenido?")) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/content/${id}`, { method: "DELETE" });
      const data = (await res.json()) as { items?: ContentItem[] };
      if (!res.ok) throw new Error("Delete failed");
      if (data.items) setItems(data.items);
      setSelectedId(null);
    } finally {
      setSaving(false);
    }
  }

  function moveToStatus(item: ContentItem, status: ContentStatus) {
    const patch: Partial<ContentItem> = { status };
    if (status === "published" && !item.published_at) {
      patch.published_at = new Date().toISOString();
    }
    updateItem(item.id, patch);
  }

  function renderCard(item: ContentItem) {
    const typeLabel = CONTENT_TYPE_LABELS[item.content_type] ?? item.content_type;
    const pillarLabel = item.pillar ? CONTENT_PILLAR_LABELS[item.pillar] : null;
    const dateLabel =
      item.status === "published"
        ? formatDate(item.published_at)
        : item.status === "scheduled"
          ? formatDate(item.scheduled_for)
          : formatDate(item.updated_at);

    return (
      <button
        key={item.id}
        type="button"
        onClick={() => setSelectedId(item.id)}
        className={`w-full rounded-lg border bg-card p-3 text-left shadow-sm transition hover:border-primary/40 hover:shadow ${
          selectedId === item.id ? "border-primary ring-1 ring-primary/30" : "border-border"
        }`}
      >
        <div className="mb-2 flex flex-wrap items-center gap-1.5">
          <Badge variant="outline" className="text-[10px] font-normal">
            {typeLabel}
          </Badge>
          {pillarLabel ? (
            <Badge variant="secondary" className="text-[10px] font-normal">
              {pillarLabel}
            </Badge>
          ) : null}
        </div>
        <p className="font-medium leading-snug">{item.title}</p>
        <p className="mt-1 text-xs text-muted-foreground">{dateLabel}</p>
        {item.publish_url ? (
          <p className="mt-1 truncate text-xs text-primary">Enlace publicado</p>
        ) : null}
      </button>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-wide text-muted-foreground">Editorial</p>
          <h1 className="text-2xl font-semibold tracking-tight">Parrilla de contenido</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Organiza ideas, borradores y piezas publicadas. Haz seguimiento de fechas, enlaces y pilares
            de mensaje.
          </p>
        </div>
        <Button type="button" onClick={() => setShowCreate(true)}>
          <Plus className="mr-1.5 h-4 w-4" />
          Nueva pieza
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card size="sm">
          <CardHeader className="pb-1">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold tabular-nums">{stats.total}</CardContent>
        </Card>
        <Card size="sm">
          <CardHeader className="pb-1">
            <CardTitle className="text-sm font-medium text-muted-foreground">Publicado</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold tabular-nums">{stats.published}</CardContent>
        </Card>
        <Card size="sm">
          <CardHeader className="pb-1">
            <CardTitle className="text-sm font-medium text-muted-foreground">En curso</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold tabular-nums">{stats.inProgress}</CardContent>
        </Card>
        <Card size="sm">
          <CardHeader className="pb-1">
            <CardTitle className="text-sm font-medium text-muted-foreground">Este mes</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold tabular-nums">{stats.thisMonth}</CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-2">
        <Input
          className="h-9 max-w-xs"
          placeholder="Buscar título, notas, tags..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">Todos los formatos</option>
          {CONTENT_TYPES.map((t) => (
            <option key={t} value={t}>
              {CONTENT_TYPE_LABELS[t]}
            </option>
          ))}
        </select>
        <select
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
          value={filterPillar}
          onChange={(e) => setFilterPillar(e.target.value)}
        >
          <option value="all">Todos los pilares</option>
          {CONTENT_PILLARS.map((p) => (
            <option key={p} value={p}>
              {CONTENT_PILLAR_LABELS[p]}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
        <div className="-mx-2 overflow-x-auto px-2 pb-2">
          <div className="flex min-w-max gap-3">
            {CONTENT_STATUSES.map((status) => (
              <div
                key={status}
                className="flex w-[272px] shrink-0 flex-col rounded-xl border bg-muted/20"
              >
                <div className="flex items-center justify-between border-b px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full border px-2 py-0.5 text-xs font-medium ${CONTENT_STATUS_COLORS[status]}`}
                    >
                      {CONTENT_STATUS_LABELS[status]}
                    </span>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {byStatus[status].length}
                    </span>
                  </div>
                </div>
                <div className="flex max-h-[calc(100vh-22rem)] flex-col gap-2 overflow-y-auto p-2">
                  {byStatus[status].length === 0 ? (
                    <p className="px-2 py-6 text-center text-xs text-muted-foreground">Vacío</p>
                  ) : (
                    byStatus[status].map(renderCard)
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="rounded-xl border bg-card p-4 xl:sticky xl:top-4 xl:self-start">
          {!selected ? (
            <p className="text-sm text-muted-foreground">
              Selecciona una tarjeta para ver detalle, editar notas o mover de columna.
            </p>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-lg font-semibold leading-tight">{selected.title}</h2>
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => setSelectedId(null)}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <label className="block space-y-1 text-sm">
                <span className="font-medium">Estado</span>
                <select
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                  value={selected.status}
                  onChange={(e) => moveToStatus(selected, e.target.value as ContentStatus)}
                >
                  {CONTENT_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {CONTENT_STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block space-y-1 text-sm">
                <span className="font-medium">Formato</span>
                <select
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                  value={selected.content_type}
                  onChange={(e) =>
                    updateItem(selected.id, { content_type: e.target.value as ContentType })
                  }
                >
                  {CONTENT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {CONTENT_TYPE_LABELS[t]}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block space-y-1 text-sm">
                <span className="font-medium">Pilar</span>
                <select
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                  value={selected.pillar ?? "other"}
                  onChange={(e) =>
                    updateItem(selected.id, { pillar: e.target.value as ContentPillar })
                  }
                >
                  {CONTENT_PILLARS.map((p) => (
                    <option key={p} value={p}>
                      {CONTENT_PILLAR_LABELS[p]}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block space-y-1 text-sm">
                <span className="font-medium">Canal / cuenta</span>
                <Input
                  value={selected.channel ?? ""}
                  onChange={(e) =>
                    setItems((rows) =>
                      rows.map((r) => (r.id === selected.id ? { ...r, channel: e.target.value } : r))
                    )
                  }
                  onBlur={() => updateItem(selected.id, { channel: selected.channel })}
                />
              </label>

              <label className="block space-y-1 text-sm">
                <span className="font-medium">Programado para</span>
                <Input
                  type="datetime-local"
                  value={
                    selected.scheduled_for
                      ? new Date(selected.scheduled_for).toISOString().slice(0, 16)
                      : ""
                  }
                  onChange={(e) => {
                    const iso = e.target.value ? new Date(e.target.value).toISOString() : null;
                    updateItem(selected.id, { scheduled_for: iso });
                  }}
                />
              </label>

              <label className="block space-y-1 text-sm">
                <span className="font-medium">Fecha publicación</span>
                <Input
                  type="datetime-local"
                  value={
                    selected.published_at
                      ? new Date(selected.published_at).toISOString().slice(0, 16)
                      : ""
                  }
                  onChange={(e) => {
                    const iso = e.target.value ? new Date(e.target.value).toISOString() : null;
                    updateItem(selected.id, { published_at: iso, status: "published" });
                  }}
                />
              </label>

              <label className="block space-y-1 text-sm">
                <span className="font-medium">URL publicada</span>
                <div className="flex gap-2">
                  <Input
                    value={selected.publish_url ?? ""}
                    placeholder="https://"
                    onChange={(e) =>
                      setItems((rows) =>
                        rows.map((r) =>
                          r.id === selected.id ? { ...r, publish_url: e.target.value } : r
                        )
                      )
                    }
                    onBlur={() => updateItem(selected.id, { publish_url: selected.publish_url })}
                  />
                  {selected.publish_url ? (
                    <a
                      href={selected.publish_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  ) : null}
                </div>
              </label>

              <label className="block space-y-1 text-sm">
                <span className="font-medium">Notas</span>
                <textarea
                  className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={selected.notes ?? ""}
                  onChange={(e) =>
                    setItems((rows) =>
                      rows.map((r) => (r.id === selected.id ? { ...r, notes: e.target.value } : r))
                    )
                  }
                  onBlur={() => updateItem(selected.id, { notes: selected.notes })}
                />
              </label>

              <div className="flex flex-wrap gap-2">
                {selected.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button
                      type="button"
                      className="opacity-60 hover:opacity-100"
                      onClick={() =>
                        updateItem(selected.id, {
                          tags: selected.tags.filter((t) => t !== tag),
                        })
                      }
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Nuevo tag"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && tagInput.trim()) {
                      e.preventDefault();
                      updateItem(selected.id, {
                        tags: [...selected.tags, tagInput.trim()],
                      });
                      setTagInput("");
                    }
                  }}
                />
              </div>

              <div className="flex gap-2 border-t pt-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  disabled={saving}
                  onClick={() => moveToStatus(selected, "published")}
                >
                  Marcar publicado
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  disabled={saving}
                  onClick={() => deleteItem(selected.id)}
                >
                  Eliminar
                </Button>
              </div>
            </div>
          )}
        </aside>
      </div>

      {showCreate && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/45 p-4"
          role="presentation"
          onClick={() => setShowCreate(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border bg-background p-5 shadow-xl"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-4 text-lg font-semibold">Nueva pieza de contenido</h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="c_title">Título *</Label>
                <Input
                  id="c_title"
                  value={draft.title ?? ""}
                  onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Formato</Label>
                  <select
                    className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                    value={draft.content_type}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, content_type: e.target.value as ContentType }))
                    }
                  >
                    {CONTENT_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {CONTENT_TYPE_LABELS[t]}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Estado inicial</Label>
                  <select
                    className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                    value={draft.status}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, status: e.target.value as ContentStatus }))
                    }
                  >
                    {CONTENT_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {CONTENT_STATUS_LABELS[s]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <Label>Pilar</Label>
                <select
                  className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                  value={draft.pillar ?? "other"}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, pillar: e.target.value as ContentPillar }))
                  }
                >
                  {CONTENT_PILLARS.map((p) => (
                    <option key={p} value={p}>
                      {CONTENT_PILLAR_LABELS[p]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Notas</Label>
                <textarea
                  className="mt-1 min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={draft.notes ?? ""}
                  onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value }))}
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>
                Cancelar
              </Button>
              <Button type="button" disabled={saving || !draft.title?.trim()} onClick={createItem}>
                {saving ? "Guardando…" : "Crear"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
