import { useEffect, useMemo, useState } from "react";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import {
  ArrowLeft,
  Heart,
  Search,
  Trash2,
  RefreshCw,
  LogOut,
} from "lucide-react";
import { motion } from "framer-motion";
import AdminLogin from "./AdminLogin";

import { db } from "../lib/firebase";

function toMillis(value) {
  if (!value) return 0;
  if (typeof value.toMillis === "function") return value.toMillis();
  if (typeof value.seconds === "number") return value.seconds * 1000;
  return 0;
}

function formatDate(value) {
  if (!value) return "—";
  const date = typeof value.toDate === "function" ? value.toDate() : new Date(value);
  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function AdminDashboard() {

  const [loggedIn, setLoggedIn] = useState(
  localStorage.getItem("adminLoggedIn") === "true"
);
const [previewImage, setPreviewImage] = useState(null);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "responses"), (snap) => {
      const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      rows.sort((a, b) => toMillis(b.updatedAt) - toMillis(a.updatedAt));
      setItems(rows);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => {
      const hay = [
        item.name,
        item.sessionId,
        item.finalChoice,
        item.task3Text,
        item.task5Text,
        item.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [items, search]);

  const onDelete = async (id) => {
    if (!window.confirm("Delete this submission?")) return;
    await deleteDoc(doc(db, "responses", id));
  };

  const total = items.length;
  const completed = items.filter((x) => x.finalChoice === "yes").length;
  const maybe = items.filter((x) => x.finalChoice === "maybe").length;
  const inProgress = items.filter((x) => x.status !== "completed" && x.step > 0 && x.step < 7).length;

  if (!loggedIn) {
  return <AdminLogin onSuccess={() => setLoggedIn(true)} />;
}

  return (
    <div className="min-h-screen romantic-bg px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="glass-card rounded-[28px] p-5 sm:p-6 mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-script text-3xl text-love-burgundy">Admin Dashboard</p>
              <p className="text-sm text-love-muted mt-1">Live submissions from the Love Challenge app.</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
  localStorage.removeItem("adminLoggedIn");
  window.location.href = "/";
}}
                className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-love-burgundy shadow-sm hover:bg-white"
              >
                <ArrowLeft size={16} /> Back to app
              </button>

              <button
  type="button"
  onClick={() => {
    localStorage.removeItem("adminLoggedIn");
    window.location.reload();
  }}
  className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-600"
>
  <LogOut size={16} />
  Logout
</button>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Stat label="Total" value={total} />
            <Stat label="Completed" value={completed} icon={<Heart size={15} />} />
            <Stat label="Maybe" value={maybe} />
            <Stat label="In progress" value={inProgress} icon={<RefreshCw size={15} />} />
          </div>

          <div className="mt-5 flex items-center gap-3 rounded-full bg-white/70 px-4 py-3 shadow-inner">
            <Search size={16} className="text-love-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, text, status..."
              className="w-full bg-transparent outline-none text-sm text-love-burgundy placeholder:text-love-muted"
            />
          </div>
        </div>

        {loading ? (
          <div className="glass-card rounded-[28px] p-10 text-center text-love-muted">
            Loading submissions...
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-card rounded-[28px] p-10 text-center text-love-muted">
            No submissions yet.
          </div>
        ) : (
          <div className="grid gap-5 xl:grid-cols-2">
            {filtered.map((item) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-[28px] p-5 sm:p-6"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-script text-3xl text-love-burgundy">{item.name || "Anonymous"}</h2>
                      <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-love-burgundy">
                        {item.finalChoice || item.status || "in progress"}
                      </span>
                    </div>
                    <p className="text-xs text-love-muted mt-1">
                      {item.sessionId} · {formatDate(item.updatedAt || item.createdAt)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onDelete(item.id)}
                    className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-rose-600 shadow-sm hover:bg-white"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>

                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                  <MediaCard
  title="Selfie"
  url={item.task1Photo}
  setPreviewImage={setPreviewImage}
/>
                  <MediaCard
  title="Reminder Photo"
  url={item.task2Photo}
  setPreviewImage={setPreviewImage}
/>
                  <MediaCard title="Voice Note" url={item.task4Audio} audio />
                  <div className="rounded-3xl bg-white/60 p-4">
                    <SectionTitle title="Task 3 · Three things" />
                    <p className="whitespace-pre-wrap text-sm text-love-body leading-relaxed">
                      {item.task3Text || "—"}
                    </p>
                  </div>
                  <div className="rounded-3xl bg-white/60 p-4">
                    <SectionTitle title="Task 5 · Promise" />
                    <p className="whitespace-pre-wrap text-sm text-love-body leading-relaxed">
                      {item.task5Text || "—"}
                    </p>
                  </div>
                  <div className="rounded-3xl bg-white/60 p-4">
                    <SectionTitle title="Meta" />
                    <dl className="space-y-2 text-sm text-love-body">
                      <div className="flex justify-between gap-3"><dt>Step</dt><dd>{item.step ?? "—"}</dd></div>
                      <div className="flex justify-between gap-3"><dt>Completed</dt><dd>{Array.isArray(item.completed) ? item.completed.length : 0}</dd></div>
                      <div className="flex justify-between gap-3"><dt>Choice</dt><dd>{item.finalChoice || "—"}</dd></div>
                      <div className="flex justify-between gap-3"><dt>UID</dt><dd className="truncate max-w-[220px]">{item.uid || "—"}</dd></div>
                      <div className="flex justify-between gap-3"><dt>Browser</dt><dd className="truncate max-w-[220px]">{item.browser || "—"}</dd></div>
                    </dl>
                  </div>
                </div>

                {item.answers && (
                  <div className="mt-4 rounded-3xl bg-white/60 p-4">
                    <SectionTitle title="Raw answers" />
                    <pre className="overflow-x-auto text-xs text-love-body whitespace-pre-wrap">{JSON.stringify(item.answers, null, 2)}</pre>
                  </div>
                )}
              </motion.article>
            ))}
          </div>
        )}
            </div>
    </div>
  );
}

function Stat({ label, value, icon }) {
  return (
    <div className="rounded-3xl bg-white/75 p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-love-muted">{label}</p>
        {icon && <span className="text-love-blushActive">{icon}</span>}
      </div>
      <p className="mt-2 font-script text-4xl text-love-burgundy leading-none">{value}</p>
    </div>
  );
}

function SectionTitle({ title }) {
  return <p className="mb-2 text-xs font-bold uppercase tracking-widest text-love-muted">{title}</p>;
}
function MediaCard({
  title,
  url,
  audio = false,
  setPreviewImage,
}) {
  return (
    <div className="rounded-3xl bg-white/60 p-4">
      <SectionTitle title={title} />

      {audio ? (
        url ? (
          <audio controls src={url} className="w-full" />
        ) : (
          <p className="text-sm text-love-muted">—</p>
        )
      ) : url ? (
        <img
          src={url}
          alt={title}
          onClick={() => setPreviewImage(url)}
          className="h-56 w-full rounded-2xl object-cover cursor-zoom-in hover:scale-[1.02] transition"
        />
      ) : (
        <p className="text-sm text-love-muted">—</p>
      )}
    </div>
  );
}
