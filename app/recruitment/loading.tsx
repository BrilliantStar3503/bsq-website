// Shown by Next.js automatically while the async Server Component in
// page.tsx resolves its BSQ AIMP fetch (typically instant on a cache hit —
// see lib/recruitment-events/client.ts's 60s revalidate window).
export default function RecruitmentLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div
        className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
        style={{ borderColor: '#ed1b2e33', borderTopColor: 'transparent' }}
        role="status"
        aria-label="Loading"
      />
    </div>
  )
}
