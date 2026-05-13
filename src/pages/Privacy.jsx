import SEO from '../components/SEO';

export default function Privacy() {
  const lastUpdated = 'May 14, 2026';

  return (
    <>
      <SEO 
        title="Privacy Policy" 
        description="Privacy Policy for PdfNest - Learn how we protect your data and ensure your privacy while using our online tools."
        canonical="/privacy"
      />
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="glass p-8 md:p-12 rounded-3xl border border-white/10">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground mb-8 text-sm">Last Updated: {lastUpdated}</p>

          <div className="space-y-8 text-muted-foreground leading-relaxed">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction</h2>
              <p>
                Welcome to PdfNest. We are committed to protecting your personal information and your right to privacy. 
                Our mission is to provide powerful online tools while keeping your data secure and private.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Zero Server-Side Processing</h2>
              <p>
                Unlike many other online tool providers, PdfNest processes your files **locally in your browser**. 
                Your PDFs, images, and code never leave your computer and are never uploaded to our servers. 
                This ensures maximum privacy and security for your sensitive documents.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. Data We Collect</h2>
              <p>
                We do not collect any personal data or documents. We may collect minimal, non-identifying analytical 
                data (such as page views) to help us improve our services and understand how our tools are being used.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Cookies</h2>
              <p>
                We use essential cookies to provide a better user experience and to remember your preferences (like dark mode). 
                We do not use tracking cookies for advertising purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Third-Party Services</h2>
              <p>
                We use Google AdSense to serve advertisements. Google may use cookies to serve ads based on a user's prior visits to our website or other websites. 
                You can opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" className="text-primary hover:underline">Google Ad Settings</a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at 
                <a href="mailto:sayadulmorsalin123@gmail.com" className="text-primary hover:underline ml-1">sayadulmorsalin123@gmail.com</a>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
