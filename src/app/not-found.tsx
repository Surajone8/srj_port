import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center px-6">
      <span className="font-mono text-sm text-blue-500 font-bold mb-2">404 — FRAME NOT FOUND</span>
      <h1 className="text-4xl font-bold tracking-tight text-white mb-4">
        Missing Canvas Node
      </h1>
      <p className="text-slate-400 max-w-md text-sm mb-8">
        The prototype frame or case study node you are looking for has been moved or archived.
      </p>
      <Button asChild>
        <Link href="/">Back to Canvas</Link>
      </Button>
    </div>
  );
}
