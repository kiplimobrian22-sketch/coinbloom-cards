import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, Copy, Gift, KeyRound, Share2, ShieldCheck } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { giftCards } from "@/data/giftcards";
import { giftCardLogo, giftCardSlug, verificationUrl } from "@/lib/giftcard-pages";
import { toast } from "sonner";

const GiftCardDetail = () => {
  const { cardSlug } = useParams();
  const card = giftCards.find((item) => giftCardSlug(item.name) === cardSlug);
  const [copied, setCopied] = useState(false);

  if (!card) return <Navigate to="/cards" replace />;

  const logo = giftCardLogo(card);
  const path = `/cards/${giftCardSlug(card.name)}`;
  const description = `${card.name} gift card details and verification. See which card information is needed and open a preselected verification form.`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${path}`);
      setCopied(true);
      toast.success("Card link copied");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy the card link");
    }
  };

  const shareCard = async () => {
    const url = `${window.location.origin}${path}`;
    if (!navigator.share) {
      await copyLink();
      return;
    }
    try {
      await navigator.share({ title: `${card.name} | All Giftcards`, text: description, url });
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") await copyLink();
    }
  };

  return (
    <div className="min-h-screen">
      <Seo
        title={`${card.name} Gift Card | All Giftcards`}
        description={description}
        path={path}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: `${card.name} Gift Card | All Giftcards`,
          description,
          url: `https://coinbloom-cards.lovable.app${path}`,
        }}
      />
      <Header />

      <main className="mx-auto max-w-5xl px-6 py-10 lg:px-8">
        <Link to="/cards" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All gift cards
        </Link>

        <section className="mt-8 border-b border-border pb-10">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-center">
            <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-md border border-border bg-card p-4">
              {logo ? (
                <img src={logo} alt={`${card.name} logo`} className="max-h-full max-w-full object-contain" />
              ) : (
                <Gift className="h-12 w-12 text-primary" aria-hidden="true" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">Gift card guide</p>
              <h1 className="text-4xl font-bold text-foreground sm:text-5xl">{card.name}</h1>
              <p className="mt-3 text-lg text-muted-foreground">Verification details and card information needed for {card.name} gift cards.</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button asChild className="btn-primary">
                  <Link to={verificationUrl(card)}><ShieldCheck aria-hidden="true" /> Verify this card</Link>
                </Button>
                <Button variant="outline" onClick={shareCard}>
                  <Share2 aria-hidden="true" /> Share card
                </Button>
                <Button variant="ghost" onClick={copyLink} aria-label="Copy card page link">
                  {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
                  {copied ? "Copied" : "Copy link"}
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-8 py-9 md:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Information needed</h2>
            <p className="mt-2 text-muted-foreground">Choose {card.name} on the verification form and enter the details requested for this card type.</p>
          </div>
          <div className="flex items-start gap-4 border-l-2 border-primary px-5 py-1">
            <KeyRound className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            <div>
              <h3 className="font-semibold text-foreground">{card.requiresPin ? "Card number and PIN" : "Card code only"}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {card.requiresPin
                  ? "The verification form will ask for the card number or code and its PIN."
                  : "The verification form will ask for the gift card code. A separate PIN field is not required for this card."}
              </p>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-4 border-t border-border py-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 shrink-0 text-success" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">The form will open with {card.name} selected.</p>
          </div>
          <Button asChild>
            <Link to={verificationUrl(card)}>Continue to verification <ShieldCheck aria-hidden="true" /></Link>
          </Button>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default GiftCardDetail;