import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen grid-bg">
      <Nav />
      <section className="pt-36 pb-24 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-sm text-blue-500 font-mono font-semibold">404</span>
          <h1 className="text-5xl md:text-6xl font-bold mt-4 mb-4">Page not found</h1>
          <p className="text-[#a1a1aa] mb-10 text-lg">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="px-8 py-3.5 btn-primary text-white rounded-lg font-semibold">
              Back to Home
            </Link>
            <Link href="/#contact" className="px-8 py-3.5 border border-[#27272a] rounded-lg font-semibold hover:bg-white/5 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
