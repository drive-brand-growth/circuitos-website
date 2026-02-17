import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import IntegrationBar from '@/components/IntegrationBar'
import Platform from '@/components/Platform'
import HowItWorks from '@/components/HowItWorks'
import Capabilities from '@/components/Capabilities'
import Metrics from '@/components/Metrics'
import Pricing from '@/components/Pricing'
import ContactForm from '@/components/ContactForm'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen grid-bg">
      <a href="#main-content" className="sr-only skip-link">
        Skip to main content
      </a>
      <Nav />
      <Hero />
      <IntegrationBar />
      <Platform />
      <HowItWorks />
      <Capabilities />
      <Metrics />
      <Pricing />
      <ContactForm />
      <Footer />
    </main>
  )
}
