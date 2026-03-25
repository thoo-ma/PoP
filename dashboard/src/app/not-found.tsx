import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
      <p className="font-mono text-8xl font-bold text-neutral-700">404</p>
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-neutral-100">Page not found</h1>
        <p className="text-sm text-neutral-500">
          The route you&apos;re looking for doesn&apos;t exist.
        </p>
      </div>
      <Link
        href="/"
        className="rounded-md border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm text-neutral-300 transition-colors hover:border-neutral-500 hover:text-neutral-100"
      >
        ← Back to dashboard
      </Link>
    </div>
  )
}
