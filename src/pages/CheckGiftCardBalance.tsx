import { Link } from "react-router-dom";
import { balancePages } from "@/data/balancePages";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Shield, ArrowRight, CheckCircle } from "lucide-react";

const CheckGiftCardBalance = () => {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      { "@type": "Question", "name": "How do I check a gift card balance?", "acceptedAnswer": { "@type": "Answer", "text": "To check a gift card balance on All Giftcards, go to our Verify page, select your gift card brand, enter the card code and PIN, and submit. You'll receive your balance result instantly." } },
      { "@type": "Question", "name": "Is it free to check a gift card balance?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, checking your gift card balance on All Giftcards is completely free. No account or registration required." } },
      { "@type": "Question", "name": "Which gift card brands are supported?", "acceptedAnswer": { "@type": "Answer", "text": "All Giftcards supports Amazon, iTunes/Apple, Google Play, Steam, Roblox, Netflix, PlayStation, Walmart, Xbox, Spotify, eBay, Target, Nike, Best Buy, Lululemon, IKEA, and many more." } },
      { "@type": "Question", "name": "Do I need an account to check my gift card balance?", "acceptedAnswer": { "@type": "Answer", "text": "No account is needed. You can check any gift card balance without signing up or logging in." } }
    ]
  };

  return (
    <div className="min-h-screen">
      <SEO
        title="Check Gift Card Balance – Amazon, iTunes, Google Play & More | All Giftcards"
        description="Check your gift card balance instantly for free. Supports Amazon, iTunes, Google Play, Steam, Roblox, Netflix, PlayStation, Walmart and more. No account needed."
        path="/check-gift-card-balance"
        keywords="check gift card balance, gift card balance checker, gift card balance check online, how to check gift card balance, free gift card balance check"
        jsonLd={faqSchema}
      />
      <Header />
      <main className="py-24 px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Shield className="h-4 w-4" />Free • Instant • Secure
            </div>
            <h1 className="text-4xl font-bold text-foreground sm:text-5xl mb-6">Check Gift Card Balance</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">Check your gift card balance instantly and for free. Supports Amazon, iTunes, Google Play, Steam, Roblox, Netflix, PlayStation and 50+ more brands. No account needed.</p>
            <Link to="/verify">
              <Button size="lg" className="btn-primary text-lg px-8">
                <Shield className="mr-2 h-5 w-5" />Check My Gift Card Balance<ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          <div className="mb-16">
            <h2 className="text-2xl font-bold text-foreground text-center mb-4">Check Balance by Gift Card Brand</h2>
            <p className="text-center text-muted-foreground mb-8">Select your brand for a step-by-step guide and instant balance check</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {balancePages.map(page => (
                <Link key={page.slug} to={`/check-gift-card-balance/${page.slug}`}>
                  <div className="p-5 rounded-xl border border-border bg-muted/10 hover:bg-primary/5 hover:border-primary transition-all cursor-pointer group">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{page.brand}</h3>
                        <p className="text-xs text-muted-foreground mt-1">Check balance →</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-2xl font-bold text-foreground text-center mb-8">Why Check Your Gift Card Balance on All Giftcards?</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                { icon: "⚡", title: "Instant Results", description: "Get your gift card balance in seconds, not minutes. No waiting, no delays." },
                { icon: "🔒", title: "100% Secure", description: "Your card details are encrypted and never stored. Your security is our priority." },
                { icon: "✅", title: "No Account Needed", description: "Check your balance without creating an account or logging in. Completely free." },
                { icon: "🌍", title: "All Major Brands", description: "Amazon, iTunes, Google Play, Steam, Roblox, Netflix and 50+ more brands supported." },
                { icon: "📱", title: "Works on Any Device", description: "Check your gift card balance on mobile, tablet, or desktop — anywhere, anytime." },
                { icon: "💬", title: "24/7 Support", description: "Our support team is available around the clock if you need any help." }
              ].map(item => (
                <div key={item.title} className="p-6 rounded-xl bg-muted/20 border border-border text-center">
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-16 p-8 rounded-xl bg-muted/10 border border-border">
            <h2 className="text-2xl font-bold text-foreground text-center mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6 max-w-3xl mx-auto">
              {[
                { q: "How do I check a gift card balance?", a: "Go to our Verify page, select your gift card brand, enter the card code and PIN, and submit. You'll get your balance instantly." },
                { q: "Is it free to check a gift card balance?", a: "Yes, completely free. No account or registration required." },
                { q: "Which gift card brands do you support?", a: "We support Amazon, iTunes/Apple, Google Play, Steam, Roblox, Netflix, PlayStation, Walmart, Xbox, Spotify, eBay, Target, Nike, Best Buy, Lululemon, IKEA and many more." },
                { q: "Do I need an account to check my gift card balance?", a: "No account needed. Just enter your card details and get your balance instantly." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{item.q}</h3>
                    <p className="text-muted-foreground text-sm">{item.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center p-8 rounded-xl bg-gradient-to-r from-primary/10 to-primary-glow/10 border border-primary/20">
            <h2 className="text-2xl font-bold text-foreground mb-3">Ready to Check Your Balance?</h2>
            <p className="text-muted-foreground mb-6">Join thousands of people who check their gift card balances on All Giftcards every day.</p>
            <Link to="/verify">
              <Button size="lg" className="btn-primary text-lg px-8">
                <Shield className="mr-2 h-5 w-5" />Check Gift Card Balance Free
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckGiftCardBalance;
