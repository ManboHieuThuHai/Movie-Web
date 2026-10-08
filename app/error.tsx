"use client";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-background px-6 text-center text-white">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
        Something went wrong
      </p>
      <h1 className="font-heading text-6xl uppercase">Unable to load this page</h1>
      <button
        type="button"
        onClick={reset}
        className="btn-glow rounded-full bg-primary px-6 py-3 text-sm font-bold"
      >
        Try again
      </button>
    </main>
  );
}
