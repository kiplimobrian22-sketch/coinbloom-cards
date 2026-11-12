import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Gift, Search } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { giftCards } from "@/data/giftcards";
import { giftCardLogo, giftCardSlug } from "@/lib/giftcard-pages";

const GiftCardDirectory = () => {
  const [search, setSearch] = useState("");
  const cards = useMemo(
    () =>
      giftCards
        .filter((card) => card.name.toLowerCase().includes(search.trim().toLowerCase()))
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name)),
    [search],
  );

  return (
    <div className="min-h-screen">
      <Seo
        title="Gift Card Brands | All Giftcards"
        description="Browse every supported gift card brand. Open a dedicated card page for verification details and an easy-to-share link."
        path="/cards"
      />
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="mb-10 max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">All Giftcards</p>
          <h1 className="text-4xl font-bold text-foreground sm:text-5xl">Find your gift card</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Browse supported brands and open a card page to share it or start verification.
          </p>
        </div>

        <div className="relative mb-8 max-w-xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            aria-label="Search gift cards"
            className="pl-10"
            placeholder="Search gift cards"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <p className="mb-4 text-sm text-muted-foreground" aria-live="polite">
          {cards.length} {cards.length === 1 ? "card" : "cards"}
        </p>

        {cards.length ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => {
              const logo = giftCardLogo(card);
              return (
                <Link
                  key={card.name}
                  to={`/cards/${giftCardSlug(card.name)}`}
                  className="group flex min-h-24 items-center gap-4 border-b border-border px-3 py-4 transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-border bg-card">
                    {logo ? (
                      <img src={logo} alt={`${card.name} logo`} className="h-8 w-8 object-contain" />
                    ) : (
                      <Gift className="h-5 w-5 text-primary" aria-hidden="true" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold text-foreground">{card.name}</span>
                    <span className="mt-1 block text-sm text-muted-foreground">
                      {card.requiresPin ? "Card number and PIN" : "Card code only"}
                    </span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-lg font-medium text-foreground">No cards match “{search}”</p>
            <Button className="mt-4" variant="outline" onClick={() => setSearch("")}>Clear search</Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default GiftCardDirectory;