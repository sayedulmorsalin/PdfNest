import SEO from '../components/SEO';

export default function Terms() {
  const lastUpdated = 'May 14, 2026';

  return (
    <>
      <SEO 
        title="Terms & Conditions" 
        description="Terms and Conditions for using PdfNest online tools."
        canonical="/terms"
      />
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="glass p-8 md:p-12 rounded-3xl border border-white/10">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            Terms & Conditions
          </h1>
          <p className="text-muted-foreground mb-8 text-sm">Last Updated: {lastUpdated}</p>

          <div className="space-y-8 text-muted-foreground leading-relaxed">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using PdfNest, you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Description of Service</h2>
              <p>
                PdfNest provides a variety of browser-based tools including PDF editing, image compression, and code formatting. 
                These services are provided "as is" and we reserve the right to modify or discontinue any tool at any time without notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. User Conduct</h2>
              <p>
                You agree not to use our tools for any illegal purpose or to process any content that violates third-party rights. 
                Since processing happens locally, you are solely responsible for the content you process using our platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Intellectual Property</h2>
              <p>
                The design, logo, and code of PdfNest are the intellectual property of PdfNest. 
                The content you process using our tools remains your property.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Limitation of Liability</h2>
              <p>
                PdfNest shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use 
                or the inability to use our services. While we strive for accuracy, we do not guarantee the results produced by our tools.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Changes to Terms</h2>
              <p>
                We reserve the right to change these terms from time to time. Your continued use of the site will signify your 
                acceptance of any adjustment to these terms.
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
