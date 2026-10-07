"use client";
import { useState, useEffect, useRef, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Moon, Sun, ArrowUpRight, BookOpen, X } from "lucide-react";
import type { TopicSummary as Topic } from "@/lib/schema";
import { searchTopics } from "@/lib/learning";
import { subjectById } from "@/content/subjects";
import { useProgress } from "./ProgressProvider";
const nav = [
  ["/", "오늘"],
  ["/explore/", "탐색"],
  ["/timeline/", "타임라인"],
  ["/map/", "지식 지도"],
  ["/review/", "복습"],
];
export function Shell({
  children,
  topics,
}: {
  children: ReactNode;
  topics: Topic[];
}) {
  const path = usePathname();
  const [open, setOpen] = useState(false),
    [query, setQuery] = useState(""),
    [dark, setDark] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null),
    input = useRef<HTMLInputElement>(null);
  const { error } = useProgress();
  const results = searchTopics(topics, query).slice(0, 12);
  useEffect(() => {
    setDark(document.documentElement.dataset.theme === "dark");
    const key = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);
  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open) {
      d.showModal();
      input.current?.focus();
    } else if (d.open) d.close();
  }, [open]);
  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    try {
      localStorage.setItem("knowledge.theme", next ? "dark" : "light");
    } catch {}
  }
  return (
    <>
      <a className="skip-link" href="#main">
        본문으로 건너뛰기
      </a>
      <header className="site-header">
        <Link href="/" className="brand" aria-label="다시, 지식 — 오늘">
          <span className="brand-mark">
            <BookOpen size={23} strokeWidth={1.3} />
          </span>
          <span>
            다시, 지식<small>DAILY KNOWLEDGE</small>
          </span>
        </Link>
        <nav aria-label="주 메뉴">
          {nav.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              aria-current={
                path === href || path === href.slice(0, -1) ? "page" : undefined
              }
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <button
            className="search-trigger"
            onClick={() => setOpen(true)}
            aria-label="지식 검색"
          >
            <Search size={17} />
            <span>검색</span>
            <kbd>⌘ K</kbd>
          </button>
          <button
            className="icon-button"
            onClick={toggleTheme}
            aria-label={dark ? "밝은 화면으로 전환" : "어두운 화면으로 전환"}
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>
      {error && (
        <p className="storage-warning" role="status">
          {error}
        </p>
      )}
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <footer className="site-footer">
        <Link href="/" className="footer-brand">
          다시, 지식
        </Link>
        <p>조금씩 읽고, 오래 기억하고, 서로 연결하기.</p>
        <span>개인의 속도로 쌓는 작은 백과사전</span>
      </footer>
      <dialog
        ref={dialog}
        className="search-dialog"
        onCancel={() => setOpen(false)}
        onClose={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(false);
        }}
        aria-labelledby="search-title"
      >
        <div className="search-heading">
          <label id="search-title" htmlFor="global-search">
            <Search size={20} />
            <span className="sr-only">한국어 또는 영어로 지식 검색</span>
          </label>
          <input
            id="global-search"
            ref={input}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="어떤 지식이 궁금한가요?"
            autoComplete="off"
          />
          <button
            className="icon-button"
            aria-label="검색 닫기"
            onClick={() => setOpen(false)}
          >
            <X size={20} />
          </button>
        </div>
        <div className="search-results">
          <p className="eyebrow" role="status">
            {query ? `${results.length}개의 지식` : "이런 지식은 어떤가요?"}
          </p>
          {results.length ? (
            results.map((t) => (
              <Link
                key={t.id}
                href={`/topic/${t.id}/`}
                onClick={() => setOpen(false)}
              >
                <span
                  className="subject-label"
                  style={{ color: subjectById[t.subject]?.color }}
                >
                  {subjectById[t.subject]?.title}
                </span>
                <strong>{t.title}</strong>
                <p>{t.summary}</p>
                <ArrowUpRight size={17} />
              </Link>
            ))
          ) : (
            <p className="empty">
              일치하는 글이 없습니다. 다른 표현이나 영어 이름으로 찾아보세요.
            </p>
          )}
        </div>
        <div className="search-footer">
          한국어 · 영어 · 관련 개념 검색{" "}
          <span>
            <kbd>Tab</kbd> 이동 <kbd>Esc</kbd> 닫기
          </span>
        </div>
      </dialog>
    </>
  );
}
