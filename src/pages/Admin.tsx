import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { marked } from "marked";
import { useSeo } from "../useSeo";
import Logo from "../components/Logo";
import {
  validateToken,
  getToken,
  setToken,
  clearToken,
  listArticles,
  readArticle,
  saveArticle,
  deleteArticle,
  type ArticleFile,
} from "../admin/github";
import {
  parseArticle,
  buildArticle,
  slugify,
  todayISO,
  type ArticleFields,
} from "../admin/markdown";

type View = "list" | "edit";

const EMPTY: ArticleFields = {
  slug: "",
  title: "",
  description: "",
  date: todayISO(),
  tags: "",
  body: "",
};

export default function Admin() {
  useSeo({
    title: "Admin — Mahir Musleh",
    description: "Private article management.",
    canonical: "https://arcma.dev/admin",
    ogType: "website",
    noindex: true,
  });

  const [token, setTok] = useState<string | null>(getToken());
  const [login, setLogin] = useState<string | null>(null);
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState("");

  // On mount, if a token is stored, validate it silently.
  useEffect(() => {
    const t = getToken();
    if (!t) return;
    validateToken(t).then((r) => {
      if (r.ok) {
        setTok(t);
        setLogin(r.login || null);
      } else {
        clearToken();
        setTok(null);
      }
    });
  }, []);

  if (!token) {
    return (
      <AuthGate
        busy={authBusy}
        error={authError}
        onSubmit={async (t) => {
          setAuthBusy(true);
          setAuthError("");
          const r = await validateToken(t);
          setAuthBusy(false);
          if (r.ok) {
            setToken(t);
            setTok(t);
            setLogin(r.login || null);
          } else {
            setAuthError(r.error || "Authentication failed.");
          }
        }}
      />
    );
  }

  return (
    <Dashboard
      token={token}
      login={login}
      onSignOut={() => {
        clearToken();
        setTok(null);
        setLogin(null);
      }}
    />
  );
}

/* ---------- Auth gate ---------- */

function AuthGate({
  busy,
  error,
  onSubmit,
}: {
  busy: boolean;
  error: string;
  onSubmit: (token: string) => void;
}) {
  const [value, setValue] = useState("");
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg px-6 text-fg">
      <div
        aria-hidden
        className="glow pointer-events-none absolute left-1/2 top-1/3 h-72 w-[36rem] -translate-x-1/2 rounded-full"
        style={{ ["--glow-color" as string]: "rgba(99,102,241,0.22)" }}
      />
      <div className="relative w-full max-w-md">
        <div className="mb-8 flex items-center gap-3">
          <Logo size={40} />
          <div>
            <p className="font-display text-lg font-semibold">Writing Admin</p>
            <p className="text-sm text-muted">Sign in to manage articles</p>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (value.trim()) onSubmit(value.trim());
          }}
          className="rounded-2xl border border-border bg-surface p-6"
        >
          <label className="mb-2 block text-sm font-medium">GitHub access token</label>
          <input
            type="password"
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="github_pat_..."
            className="w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm outline-none transition-colors focus:border-accent"
          />
          {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={busy || !value.trim()}
            className="mt-4 w-full rounded-xl bg-fg px-4 py-3 text-sm font-semibold text-bg transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            {busy ? "Verifying..." : "Sign in"}
          </button>

          <div className="mt-5 space-y-2 border-t border-border pt-5 text-xs text-muted">
            <p>
              Use a{" "}
              <a
                href="https://github.com/settings/tokens?type=beta"
                target="_blank"
                rel="noreferrer"
                className="text-accent-glow underline underline-offset-2"
              >
                fine-grained token
              </a>{" "}
              scoped to the <span className="text-fg">acnologiaslayer.github.io</span>{" "}
              repo with <span className="text-fg">Contents: Read and write</span>.
            </p>
            <p>
              The token is verified against GitHub and stored only in this
              browser tab (sessionStorage). It never leaves your browser except
              to call GitHub directly.
            </p>
          </div>
        </form>

        <div className="mt-6 text-center">
          <Link to="/writing" className="text-sm text-muted transition-colors hover:text-fg">
            Back to writing
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ---------- Dashboard ---------- */

function Dashboard({
  token,
  login,
  onSignOut,
}: {
  token: string;
  login: string | null;
  onSignOut: () => void;
}) {
  const [view, setView] = useState<View>("list");
  const [files, setFiles] = useState<ArticleFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState("");
  const [banner, setBanner] = useState("");

  // Editing state
  const [fields, setFields] = useState<ArticleFields>(EMPTY);
  const [editingSlug, setEditingSlug] = useState<string | null>(null); // null = new
  const [editSha, setEditSha] = useState<string | undefined>(undefined);
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const refresh = async () => {
    setLoading(true);
    setListError("");
    try {
      setFiles(await listArticles(token));
    } catch (e) {
      setListError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const flash = (msg: string) => {
    setBanner(msg);
    setTimeout(() => setBanner(""), 4000);
  };

  const startNew = () => {
    setFields({ ...EMPTY, date: todayISO() });
    setEditingSlug(null);
    setEditSha(undefined);
    setSlugTouched(false);
    setFormError("");
    setView("edit");
  };

  const startEdit = async (slug: string) => {
    setFormError("");
    try {
      const { content, sha } = await readArticle(token, slug);
      setFields(parseArticle(content, slug));
      setEditingSlug(slug);
      setEditSha(sha);
      setSlugTouched(true);
      setView("edit");
    } catch (e) {
      flash("Could not open: " + (e as Error).message);
    }
  };

  const onDelete = async (f: ArticleFile) => {
    if (!confirm(`Delete "${f.slug}"? This removes it from the live site.`)) return;
    try {
      await deleteArticle(token, f.slug, f.sha, `Delete article: ${f.slug}.md (via admin)`);
      flash(`Deleted ${f.slug}. Site will redeploy shortly.`);
      refresh();
    } catch (e) {
      flash("Delete failed: " + (e as Error).message);
    }
  };

  const onSave = async () => {
    setFormError("");
    const slug = (slugTouched ? fields.slug : slugify(fields.title)).trim();
    if (!fields.title.trim()) return setFormError("Title is required.");
    if (!slug) return setFormError("Slug is required.");
    if (!fields.body.trim()) return setFormError("Body is required.");

    // Prevent overwriting a different existing file when creating/renaming.
    if (editingSlug !== slug && files.some((f) => f.slug === slug)) {
      return setFormError(`An article with slug "${slug}" already exists.`);
    }

    const markdown = buildArticle({ ...fields, slug });
    setSaving(true);
    try {
      const isNew = editingSlug === null;
      const renamed = editingSlug !== null && editingSlug !== slug;
      await saveArticle(
        token,
        slug,
        markdown,
        `${isNew ? "Publish" : "Update"} article: ${slug}.md (via admin)`,
        renamed ? undefined : editSha
      );
      // If the slug was renamed, delete the old file.
      if (renamed) {
        const old = files.find((f) => f.slug === editingSlug);
        if (old)
          await deleteArticle(token, editingSlug!, old.sha, `Rename article ${editingSlug} -> ${slug}`);
      }
      flash(`${isNew ? "Published" : "Saved"} ${slug}. Site will redeploy shortly.`);
      setView("list");
      refresh();
    } catch (e) {
      setFormError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const previewHtml = useMemo(
    () => marked.parse(fields.body || "") as string,
    [fields.body]
  );
  const effectiveSlug = slugTouched ? fields.slug : slugify(fields.title);

  return (
    <div className="min-h-screen bg-bg text-fg">
      {/* top bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-bg/90 backdrop-blur">
        <div className="mx-auto flex max-w-container items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <Logo size={28} />
            <span className="font-display text-sm font-semibold">Writing Admin</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            {login && <span className="hidden text-muted sm:inline">@{login}</span>}
            <Link to="/writing" className="text-muted transition-colors hover:text-fg">
              View site
            </Link>
            <button onClick={onSignOut} className="text-muted transition-colors hover:text-fg">
              Sign out
            </button>
          </div>
        </div>
      </header>

      {banner && (
        <div className="border-b border-accent/30 bg-accent/10 px-6 py-2.5 text-center text-sm text-accent-glow">
          {banner}
        </div>
      )}

      <main className="mx-auto max-w-container px-6 py-10">
        {view === "list" ? (
          <>
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="font-display text-2xl font-bold tracking-tight">Articles</h1>
                <p className="mt-1 text-sm text-muted">
                  {loading ? "Loading..." : `${files.length} published`}
                </p>
              </div>
              <button
                onClick={startNew}
                className="rounded-full bg-fg px-5 py-2.5 text-sm font-semibold text-bg transition-transform hover:scale-[1.03] active:scale-[0.97]"
              >
                + New article
              </button>
            </div>

            {listError && <p className="text-sm text-red-400">{listError}</p>}

            <ul className="divide-y divide-border rounded-2xl border border-border">
              {files.map((f) => (
                <li key={f.slug} className="flex items-center justify-between gap-4 px-5 py-4">
                  <button
                    onClick={() => startEdit(f.slug)}
                    className="min-w-0 flex-1 text-left"
                  >
                    <span className="block truncate font-medium">{f.slug}</span>
                    <span className="block truncate text-xs text-muted">{f.path}</span>
                  </button>
                  <div className="flex shrink-0 items-center gap-2">
                    <a
                      href={`/writing/${f.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted transition-colors hover:text-fg"
                    >
                      View
                    </a>
                    <button
                      onClick={() => startEdit(f.slug)}
                      className="rounded-lg border border-border px-3 py-1.5 text-xs transition-colors hover:border-accent/50 hover:text-accent-glow"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(f)}
                      className="rounded-lg border border-border px-3 py-1.5 text-xs text-red-400 transition-colors hover:border-red-400/50"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
              {!loading && files.length === 0 && (
                <li className="px-5 py-10 text-center text-sm text-muted">
                  No articles yet. Create your first one.
                </li>
              )}
            </ul>
          </>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <button
                onClick={() => setView("list")}
                className="flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-fg"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M11 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Back to list
              </button>
              <span className="text-xs text-muted">
                {editingSlug === null ? "New article" : `Editing ${editingSlug}`}
              </span>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              {/* Form */}
              <div className="space-y-4">
                <Field label="Title">
                  <input
                    value={fields.title}
                    onChange={(e) => setFields({ ...fields, title: e.target.value })}
                    className="admin-input"
                    placeholder="Designing APIs That Survive Scale"
                  />
                </Field>
                <Field label="Slug" hint="URL: /writing/<slug>">
                  <input
                    value={effectiveSlug}
                    onChange={(e) => {
                      setSlugTouched(true);
                      setFields({ ...fields, slug: slugify(e.target.value) });
                    }}
                    className="admin-input font-mono text-sm"
                    placeholder="designing-apis-that-survive-scale"
                  />
                </Field>
                <Field label="Description" hint="Shown in search results and social shares">
                  <textarea
                    value={fields.description}
                    onChange={(e) => setFields({ ...fields, description: e.target.value })}
                    rows={2}
                    className="admin-input resize-y"
                    placeholder="One clear sentence describing the article."
                  />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Date">
                    <input
                      type="date"
                      value={fields.date}
                      onChange={(e) => setFields({ ...fields, date: e.target.value })}
                      className="admin-input"
                    />
                  </Field>
                  <Field label="Tags" hint="Comma-separated">
                    <input
                      value={fields.tags}
                      onChange={(e) => setFields({ ...fields, tags: e.target.value })}
                      className="admin-input"
                      placeholder="Architecture, Backend"
                    />
                  </Field>
                </div>
                <Field label="Body (Markdown)">
                  <textarea
                    value={fields.body}
                    onChange={(e) => setFields({ ...fields, body: e.target.value })}
                    rows={20}
                    className="admin-input resize-y font-mono text-sm leading-relaxed"
                    placeholder={"Opening hook.\n\n## A section\n\nContent..."}
                  />
                </Field>

                {formError && <p className="text-sm text-red-400">{formError}</p>}

                <div className="flex items-center gap-3">
                  <button
                    onClick={onSave}
                    disabled={saving}
                    className="rounded-full bg-fg px-6 py-3 text-sm font-semibold text-bg transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                  >
                    {saving
                      ? "Saving..."
                      : editingSlug === null
                        ? "Publish article"
                        : "Save changes"}
                  </button>
                  <button
                    onClick={() => setView("list")}
                    className="rounded-full border border-border px-6 py-3 text-sm text-muted transition-colors hover:text-fg"
                  >
                    Cancel
                  </button>
                </div>
              </div>

              {/* Live preview */}
              <div className="lg:sticky lg:top-24 lg:self-start">
                <p className="mb-3 font-mono text-xs uppercase tracking-widest text-muted">
                  Live preview
                </p>
                <div className="rounded-2xl border border-border bg-surface p-6">
                  <h2 className="font-display text-2xl font-bold tracking-tight">
                    {fields.title || "Untitled"}
                  </h2>
                  {fields.tags && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {fields.tags.split(",").map((t) => t.trim()).filter(Boolean).map((t) => (
                        <span key={t} className="rounded-full border border-border bg-elevated px-2.5 py-0.5 text-xs text-muted">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="prose mt-6" dangerouslySetInnerHTML={{ __html: previewHtml }} />
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        {hint && <span className="text-xs text-muted">{hint}</span>}
      </span>
      {children}
    </label>
  );
}
