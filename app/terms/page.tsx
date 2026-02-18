import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service - CircuitOS',
  description: 'CircuitOS terms of service. Terms and conditions for using our platform and services.',
}

export default function TermsPage() {
  return (
    <main className="min-h-screen grid-bg">
      <Nav />
      <section className="pt-36 pb-20 px-6">
        <div className="max-w-3xl mx-auto prose prose-invert prose-sm">
          <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
          <p className="text-[#a1a1aa] mb-4">Last updated: February 17, 2026</p>

          <p className="text-[#a1a1aa] leading-relaxed">
            These Terms of Service (&quot;Terms&quot;) govern your access to and use of the services provided by DriveBrandGrowth LLC (&quot;CircuitOS,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), including our website at usecircuitos.com and the CircuitOS platform.
          </p>

          <h2 className="text-xl font-semibold mt-10 mb-4">Services</h2>
          <p className="text-[#a1a1aa] leading-relaxed">
            CircuitOS provides an AI-powered revenue intelligence platform that includes lead scoring, automated outreach, content intelligence, and analytics services. Specific service terms, scope, and pricing are defined in individual service agreements between CircuitOS and each client.
          </p>

          <h2 className="text-xl font-semibold mt-10 mb-4">Account and Access</h2>
          <p className="text-[#a1a1aa] leading-relaxed">
            Access to the CircuitOS platform is provided through individual client agreements. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
          </p>

          <h2 className="text-xl font-semibold mt-10 mb-4">Acceptable Use</h2>
          <p className="text-[#a1a1aa] leading-relaxed mb-4">You agree not to:</p>
          <ul className="text-[#a1a1aa] space-y-2 list-disc pl-6">
            <li>Use the services for any unlawful purpose</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Interfere with or disrupt the services</li>
            <li>Reverse engineer or decompile any part of the platform</li>
            <li>Use the services to send unsolicited communications in violation of applicable law</li>
          </ul>

          <h2 className="text-xl font-semibold mt-10 mb-4">Intellectual Property</h2>
          <p className="text-[#a1a1aa] leading-relaxed">
            The CircuitOS platform, including its algorithms, models, and underlying technology, is the intellectual property of DriveBrandGrowth LLC. Your data remains your property. We do not claim ownership of any data you provide to or generate through the platform.
          </p>

          <h2 className="text-xl font-semibold mt-10 mb-4">Data and Privacy</h2>
          <p className="text-[#a1a1aa] leading-relaxed">
            Your use of our services is also governed by our <a href="/privacy" className="text-blue-400 hover:text-blue-300">Privacy Policy</a>. Client data is processed in accordance with individual data processing agreements.
          </p>

          <h2 className="text-xl font-semibold mt-10 mb-4">Service Availability</h2>
          <p className="text-[#a1a1aa] leading-relaxed">
            We strive to maintain high availability of our services but do not guarantee uninterrupted access. Specific uptime guarantees, where applicable, are defined in individual service level agreements.
          </p>

          <h2 className="text-xl font-semibold mt-10 mb-4">Limitation of Liability</h2>
          <p className="text-[#a1a1aa] leading-relaxed">
            To the maximum extent permitted by law, CircuitOS shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the services.
          </p>

          <h2 className="text-xl font-semibold mt-10 mb-4">Changes to Terms</h2>
          <p className="text-[#a1a1aa] leading-relaxed">
            We reserve the right to modify these Terms at any time. We will provide notice of significant changes. Your continued use of the services after changes constitutes acceptance of the modified Terms.
          </p>

          <h2 className="text-xl font-semibold mt-10 mb-4">Governing Law</h2>
          <p className="text-[#a1a1aa] leading-relaxed">
            These Terms shall be governed by and construed in accordance with the laws of the State of Texas, without regard to conflict of law provisions.
          </p>

          <h2 className="text-xl font-semibold mt-10 mb-4">Contact Us</h2>
          <p className="text-[#a1a1aa] leading-relaxed">
            If you have any questions about these Terms, please contact us at hello@usecircuitos.com.
          </p>
        </div>
      </section>
      <Footer />
    </main>
  )
}
