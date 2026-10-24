"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Runtime error caught:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-6">
      <span className="font-mono text-sm text-red-400 font-bold mb-2">PROTOTYPE RENDER EXCEPTION</span>
      <h2 className="text-3xl font-bold text-white mb-4">Something went wrong</h2>
      <p className="text-slate-400 text-sm max-w-md mb-8">
        An error occurred during canvas evaluation. Try resetting the prototype state.
      </p>
      <Button onClick={() => reset()} variant="secondary">
        Reset Canvas State
      </Button>
    </div>
  );
}
