export default function Footer() {
  return (
    <footer className="py-16 px-6 border-t border-[#27272a]">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <span className="text-xl font-semibold">
              <span className="text-blue-500">//</span> Circuit<span className="text-blue-500">OS</span>
            </span>
            <p className="text-sm text-[#71717a] mt-2 leading-relaxed">
              Revenue intelligence that learns.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#a1a1aa] mb-4">Product</h4>
            <ul className="space-y-3 text-sm text-[#71717a]">
              <li><a href="/#platform" className="hover:text-white transition-colors">Platform</a></li>
              <li><a href="/#capabilities" className="hover:text-white transition-colors">Capabilities</a></li>
              <li><a href="/#pricing" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="/demo" className="hover:text-white transition-colors">Book a Demo</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#a1a1aa] mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-[#71717a]">
              <li><a href="/#contact" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="https://www.linkedin.com/company/drivebrandgrowth" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#a1a1aa] mb-4">Legal</h4>
            <ul className="space-y-3 text-sm text-[#71717a]">
              <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[#27272a] text-center text-sm text-[#71717a]" suppressHydrationWarning>
          &copy; {new Date().getFullYear()} CircuitOS by DriveBrandGrowth. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
