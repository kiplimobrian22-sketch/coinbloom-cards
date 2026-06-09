import { useParams, Link } from "react-router-dom";
import { balancePages } from "@/data/balancePages";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Shield, ChevronDown, ChevronUp, ArrowRight } from "lucide-react";
import { useState } from "react";

const GiftCardBalance = () => {
  const { brand } = useParams();
  const page = balancePages.find(p => p.slug === brand);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  if (!page) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="py-24 text-center">
          <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
          <Link to="/verify"><Button>Go to Verify</Button></Link>
        </main>
        <Footer />
      </div>
    );
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": page.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
    }))
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": `How to Check ${page.brand} Gift Card Balance`,
    "description": page.metaDescription,
    "step": page.steps.map((step, i) => ({
      "@type": "HowToStep",
      "position": i + 1,
      "name": step.title,
      "text": step.description
    }))
  };

  return (
    <div className="min-h-screen">
      <SEO
        title={page.title}
        description={page.metaDescription}
        path={`/check-gift-card-balance/${page.slug}`}
        keywords={page.keywords.join(", ")}
        jsonLd={[faqSchema, howToSchema]}
      />
      <Header />
      <main className="py-24 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Shield className="h-4 w-4" />
              Free • Instant • Secure
            </div>
            <h1 className="text-4xl font-bold text-foreground sm:text-5xl mb-6">
              Check {page.brand} Gift Card Balance
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">{page.heroText}</p>
            <Link to={`/verify?brand=${page.slug}`}>
              <Button size="lg" className="btn-primary text-lg px-8 py-4">
                <Shield className="mr-2 h-5 w-5" />
                Check {page.brand} Balance Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-16">
            {[{ label: "Instant Results", icon: "⚡" }, { label: "100% Secure", icon: "🔒" }, { label: "No Account Needed", icon: "✅" }].map(badge => (
              <div key={badge.label} className="text-center p-4 rounded-xl bg-muted/20 border border-border">
                <div className="text-2xl mb-2">{badge.icon}</div>
                <div className="text-sm font-medium text-foreground">{badge.label}</div>
              </div>
            ))}
          </div>

          <div className="mb-16">
            <h2 className="text-2xl font-bold text-foreground text-center mb-8">How to Check Your {page.brand} Gift Card Balance</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {page.steps.map((step, i) => (
                <div key={i} className="text-center p-6 rounded-xl bg-muted/20 border border-border">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-glow text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg mb-4 mx-auto">{i + 1}</div>
                  <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link to={`/verify?brand=${page.slug}`}>
                <Button size="lg" className="btn-primary">Check My {page.brand} Balance <ArrowRight className="ml-2 h-4 w-4" /></Button>
              </Link>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-2xl font-bold text-foreground text-center mb-8">Frequently Asked Questions About {page.brand} Gift Card Balance</h2>
            <div className="space-y-3">
              {page.faqs.map((faq, i) => (
                <div key={i} className="rounded-xl border border-border bg-muted/10 overflow-hidden">
                  <button className="w-full text-left px-6 py-4 flex items-center justify-between hover:bg-muted/20 transition-colors" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <span className="font-medium text-foreground pr-4">{faq.question}</span>
                    {openFaq === i ? <ChevronUp className="h-5 w-5 text-primary flex-shrink-0" /> : <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />}
                  </button>
                  {openFaq === i && <div className="px-6 pb-4 text-muted-foreground text-sm leading-relaxed">{faq.answer}</div>}
                </div>
              ))}
            </div>
          </div>

          <div className="text-center p-8 rounded-xl bg-gradient-to-r from-primary/5 to-primary-glow/5 border border-primary/20">
            <h2 className="text-xl font-bold text-foreground mb-2">Check Other Gift Card Balances</h2>
            <p className="text-muted-foreground mb-6">We support all major gift card brands</p>
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              {balancePages.filter(p => p.slug !== page.slug).map(p => (
                <Link key={p.slug} to={`/check-gift-card-balance/${p.slug}`}>
                  <Button variant="outline" size="sm" className="hover:bg-primary/10 hover:border-primary">{p.brand}</Button>
                </Link>
              ))}
            </div>
            <Link to="/verify">
              <Button className="btn-primary"><Shield className="mr-2 h-4 w-4" />Check Any Gift Card Balance</Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GiftCardBalance;
