import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - CircuitOS',
  description: 'CircuitOS privacy policy. How we collect, use, and protect your information.',
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen grid-bg">
      <Nav />
      <section className="pt-36 pb-20 px-6">
        <div className="max-w-3xl mx-auto prose prose-invert prose-sm">
          <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
          <p className="text-[#a1a1aa] mb-4">Last updated: February 17, 2026</p>

          <p className="text-[#a1a1aa] leading-relaxed">
            DriveBrandGrowth LLC (&quot;CircuitOS,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates the usecircuitos.com website. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our website and services.
          </p>

          <h2 className="text-xl font-semibold mt-10 mb-4">Information We Collect</h2>
          <p className="text-[#a1a1aa] leading-relaxed">
            When you request a demo or contact us, we may collect your name, email address, company name, phone number, and any other information you voluntarily provide. We also collect standard analytics data through Google Analytics 4, including page views, session duration, and general geographic location.
          </p>

          <h2 className="text-xl font-semibold mt-10 mb-4">How We Use Your Information</h2>
          <p className="text-[#a1a1aa] leading-relaxed mb-4">We use the information we collect to:</p>
          <ul className="text-[#a1a1aa] space-y-2 list-disc pl-6">
            <li>Respond to your demo requests and inquiries</li>
            <li>Provide, maintain, and improve our services</li>
            <li>Analyze website usage to improve user experience</li>
            <li>Send relevant communications about our services (with your consent)</li>
          </ul>

          <h2 className="text-xl font-semibold mt-10 mb-4">Data Sharing</h2>
          <p className="text-[#a1a1aa] leading-relaxed">
            We do not sell, trade, or rent your personal information to third parties. We may share data with service providers who assist in operating our website and conducting our business, subject to confidentiality agreements. These include analytics providers (Google Analytics) and hosting providers (Vercel).
          </p>

          <h2 className="text-xl font-semibold mt-10 mb-4">Cookies</h2>
          <p className="text-[#a1a1aa] leading-relaxed">
            Our website uses cookies and similar tracking technologies for analytics purposes through Google Analytics 4. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
          </p>

          <h2 className="text-xl font-semibold mt-10 mb-4">Data Security</h2>
          <p className="text-[#a1a1aa] leading-relaxed">
            We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.
          </p>

          <h2 className="text-xl font-semibold mt-10 mb-4">Your Rights</h2>
          <p className="text-[#a1a1aa] leading-relaxed">
            You have the right to access, correct, or delete your personal data. To exercise these rights, contact us at noel@drivebrandgrowth.com.
          </p>

          <h2 className="text-xl font-semibold mt-10 mb-4">Changes to This Policy</h2>
          <p className="text-[#a1a1aa] leading-relaxed">
            We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the &quot;Last updated&quot; date.
          </p>

          <h2 className="text-xl font-semibold mt-10 mb-4">Contact Us</h2>
          <p className="text-[#a1a1aa] leading-relaxed">
            If you have any questions about this privacy policy, please contact us at noel@drivebrandgrowth.com.
          </p>
        </div>
      </section>
      <Footer />
    </main>
  )
}
