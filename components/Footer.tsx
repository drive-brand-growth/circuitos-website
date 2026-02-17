export default function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-[#27272a]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-3">
          <div>
            <span className="text-xl font-semibold"><span className="text-blue-500">//</span> Circuit<span className="text-blue-500">OS</span></span>
            <p className="text-sm text-[#71717a] mt-1">Revenue intelligence that learns.</p>
          </div>
        </div>
        <div className="flex items-center gap-8 text-sm text-[#a1a1aa]">
          <a href="/#platform" className="hover:text-white transition-colors">Platform</a>
          <a href="/#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="/#contact" className="hover:text-white transition-colors">Contact</a>
          <a href="/demo" className="hover:text-white transition-colors">Demo</a>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-10 pt-8 border-t border-[#27272a] text-center text-sm text-[#71717a]" suppressHydrationWarning>
        &copy; {new Date().getFullYear()} CircuitOS by DriveBrandGrowth. All rights reserved.
      </div>
    </footer>
  )
}
