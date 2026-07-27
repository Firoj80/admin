'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-50 text-slate-900">
      <h2 className="text-xl font-bold mb-4">Something went wrong!</h2>
      <div className="p-4 bg-white border border-red-200 rounded-lg max-w-2xl overflow-auto w-full mb-4 font-mono text-sm">
        <p className="font-semibold text-red-600 mb-2">{error.name}: {error.message}</p>
        <pre className="text-slate-700 whitespace-pre-wrap">{error.stack}</pre>
      </div>
      <button
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        onClick={() => reset()}
      >
        Try again
      </button>
    </div>
  );
}
