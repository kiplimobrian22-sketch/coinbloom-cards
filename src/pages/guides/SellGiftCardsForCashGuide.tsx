import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { ArrowRight, DollarSign, Shield, Zap, CheckCircle } from "lucide-react";

const SellGiftCardsForCashGuide = () => {
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "How to Sell Gift Cards for Cash Safely in 2026",
    description:
      "A complete guide to exchanging gift cards for cash safely: how the process works, what rates to expect, payment speed, and how to avoid scams.",
    author: { "@type": "Organization", name: "All Giftcards" },
    publisher: { "@type": "Organization", name: "All Giftcards" },
    mainEntityOfPage:
      "https://coinbloom-cards.lovable.app/guides/sell-gift-cards-for-cash",
  };

  return (
    <div className="min-h-screen">
      <SEO
        title="How to Sell Gift Cards for Cash Safely | All Giftcards Guide"
        description="Step-by-step guide to gift card exchange for cash: safety checks, the best rates, payment speed, and how to compare platforms before you sell."
        path="/guides/sell-gift-cards-for-cash"
        ogType="article"
        jsonLd={articleJsonLd}
      />
      <Header />

      <main className="py-24 px-6 lg:px-8">
        <article className="mx-auto max-w-3xl prose prose-lg dark:prose-invert">
          <h1 className="text-4xl font-bold text-foreground sm:text-5xl mb-6">
            How to Sell Gift Cards for Cash Safely
          </h1>
          <p className="text-lg text-muted-foreground">
            Unused gift cards collect dust in drawers and inboxes every day. A
            gift card exchange lets you turn that unused balance into cash —
            but only if you pick a platform that pays fairly, pays quickly,
            and protects your card details.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4">What a gift card exchange actually does</h2>
          <p className="text-muted-foreground">
            A gift card exchange verifies the balance on your card, buys it
            from you at a discount to face value, then resells it to a buyer
            who wants to shop at that retailer. The discount is what pays for
            verification, fraud protection, and the platform itself.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4">Safety first: what to check before you sell</h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex gap-3"><Shield className="h-5 w-5 text-primary shrink-0 mt-1" />Verify the site uses HTTPS and encrypts card data in transit.</li>
            <li className="flex gap-3"><Shield className="h-5 w-5 text-primary shrink-0 mt-1" />Look for verified customer reviews dating back at least a year.</li>
            <li className="flex gap-3"><Shield className="h-5 w-5 text-primary shrink-0 mt-1" />Confirm the payout method up front — credit card, bank, or PayPal.</li>
            <li className="flex gap-3"><Shield className="h-5 w-5 text-primary shrink-0 mt-1" />Never share your card code over email, SMS, or social media.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-12 mb-4">How fast should payment arrive?</h2>
          <p className="text-muted-foreground">
            Reputable platforms verify cards in minutes and release payment
            within 24–48 hours. Anything longer is a red flag. On All
            Giftcards, payouts to your credit card typically arrive within a
            business day of verification.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4">Compare rates before you commit</h2>
          <p className="text-muted-foreground">
            Rates vary by brand and demand. Popular brands like Amazon,
            Target, and iTunes typically fetch up to 95% of face value. Niche
            or regional brands fetch less. Always check the live rate on the
            sell page before submitting a card.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4">Step-by-step: selling a gift card for cash</h2>
          <ol className="space-y-3 text-muted-foreground list-decimal pl-6">
            <li>Pick the brand and enter the face-value amount.</li>
            <li>Enter the card code (and PIN, if your brand requires one).</li>
            <li>Upload front and back photos for physical cards, or check the digital card box.</li>
            <li>Choose payment method — for cash payouts, a credit card is required for CVV verification.</li>
            <li>Submit and watch your email for verification and payout updates.</li>
          </ol>

          <h2 className="text-2xl font-bold mt-12 mb-4">Try a verification first if you're unsure</h2>
          <p className="text-muted-foreground">
            If you bought the card secondhand or you're not sure it's still
            valid, run it through a balance check before selling. It takes
            minutes and avoids a rejected submission.
          </p>

          <div className="not-prose grid gap-4 md:grid-cols-3 my-12">
            <div className="p-6 rounded-lg bg-muted/20 text-center">
              <Zap className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Fast payouts</h3>
              <p className="text-sm text-muted-foreground">Cash to your card within 24–48 hours.</p>
            </div>
            <div className="p-6 rounded-lg bg-muted/20 text-center">
              <DollarSign className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Up to 95% value</h3>
              <p className="text-sm text-muted-foreground">Competitive live rates per brand.</p>
            </div>
            <div className="p-6 rounded-lg bg-muted/20 text-center">
              <CheckCircle className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Free verification</h3>
              <p className="text-sm text-muted-foreground">Check any balance before selling.</p>
            </div>
          </div>

          <div className="not-prose flex flex-col sm:flex-row gap-4 mt-12">
            <Button size="lg" className="btn-hero" asChild>
              <Link to="/sell">
                Sell or Exchange a Gift Card
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/verify">Check a balance first</Link>
            </Button>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default SellGiftCardsForCashGuide;
