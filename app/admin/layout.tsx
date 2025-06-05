export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-black overflow-x-hidden">
      {children}
    </div>
  )
} 