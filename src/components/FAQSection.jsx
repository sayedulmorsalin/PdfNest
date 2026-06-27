import { ArrowRight } from 'lucide-react';

/**
 * FAQ Section with accessible accordion
 * Schema markup is handled by SEO component via buildFAQSchema()
 * 
 * @param {Array} faqs - [{q: "Question?", a: "Answer."}]
 * @param {string} title - Section title (default: "Frequently Asked Questions")
 */
export default function FAQSection({ faqs, title = "Frequently Asked Questions" }) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 space-y-3">
          <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
          <p className="text-muted-foreground">Common questions answered about this tool.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div 
              key={i} 
              className="glass p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors group"
            >
              <details className="cursor-pointer">
                <summary className="text-base font-semibold list-none flex justify-between items-center text-white group-open:text-primary transition-colors">
                  {faq.q}
                  <span className="text-primary group-open:rotate-180 transition-transform ml-4 shrink-0">
                    <ArrowRight className="w-4 h-4 rotate-90" />
                  </span>
                </summary>
                <p className="mt-4 text-muted-foreground leading-relaxed text-sm animate-in fade-in slide-in-from-top-2">
                  {faq.a}
                </p>
              </details>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
