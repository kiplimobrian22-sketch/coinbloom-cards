import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingCart, Star, CreditCard, Shield, Zap } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

const BuyGiftcards = () => {
  const { toast } = useToast();
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  
  const giftCards = [
    {
      id: 1,
      name: "Amazon",
      description: "Shop everything on Amazon with instant delivery",
      image: "🛒",
      denominations: [10, 25, 50, 100, 200],
      rating: 4.9,
      discount: "2% off",
      popular: true
    },
    {
      id: 2,
      name: "iTunes",
      description: "Music, movies, apps, and more from Apple",
      image: "🎵",
      denominations: [15, 25, 50, 100],
      rating: 4.8,
      discount: "3% off",
      popular: true
    },
    {
      id: 3,
      name: "Google Play",
      description: "Apps, games, and digital content",
      image: "📱",
      denominations: [10, 25, 50, 100],
      rating: 4.7,
      discount: "1% off",
      popular: false
    },
    {
      id: 4,
      name: "Steam",
      description: "Gaming platform with thousands of games",
      image: "🎮",
      denominations: [20, 50, 100],
      rating: 4.9,
      discount: "5% off",
      popular: true
    },
    {
      id: 5,
      name: "Walmart",
      description: "Shop at America's largest retailer",
      image: "🏪",
      denominations: [25, 50, 100, 200],
      rating: 4.6,
      discount: "2% off",
      popular: false
    },
    {
      id: 6,
      name: "PlayStation",
      description: "Games and content for PlayStation consoles",
      image: "🎯",
      denominations: [25, 50, 100],
      rating: 4.8,
      discount: "4% off",
      popular: true
    },
  ];

  const currencies = ["USD", "EUR", "GBP", "CAD", "AUD"];

  const handlePurchase = (cardName: string, amount: number) => {
    toast({
      title: "Added to Cart",
      description: `${cardName} $${amount} gift card has been added to your cart.`,
    });
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="py-24 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary-glow/20 mb-6">
              <ShoppingCart className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl mb-4">
              Buy Gift Cards
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Purchase gift cards from top brands at competitive rates with instant digital delivery
            </p>
          </div>

          {/* Currency Selector */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-foreground">Currency:</label>
              <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Features */}
          <div className="grid gap-6 md:grid-cols-3 mb-16">
            {[
              {
                icon: Zap,
                title: "Instant Delivery",
                description: "Get your digital gift cards within minutes of purchase"
              },
              {
                icon: Shield,
                title: "100% Authentic",
                description: "All gift cards are sourced directly from official retailers"
              },
              {
                icon: CreditCard,
                title: "Secure Payment",
                description: "Protected by PayPal's secure payment processing"
              }
            ].map((feature, index) => (
              <div key={feature.title} className="text-center p-6 rounded-lg bg-muted/20 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <feature.icon className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Gift Cards Grid */}
          <div className="grid gap-8 lg:grid-cols-3 md:grid-cols-2">
            {giftCards.map((card, index) => (
              <Card key={card.id} className="card-glow animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{card.image}</span>
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {card.name}
                          {card.popular && (
                            <Badge className="bg-gradient-to-r from-accent to-accent/80 text-accent-foreground">
                              Popular
                            </Badge>
                          )}
                        </CardTitle>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-muted-foreground">{card.rating}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-success">
                      {card.discount}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">
                    {card.description}
                  </p>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">Available Amounts:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {card.denominations.map((amount) => (
                        <Button
                          key={amount}
                          variant="outline"
                          className="justify-between hover:bg-primary/10 hover:border-primary"
                          onClick={() => handlePurchase(card.name, amount)}
                        >
                          <span>{selectedCurrency} {amount}</span>
                          <ShoppingCart className="h-4 w-4" />
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Button className="btn-primary w-full mt-6" size="lg">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Buy Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Payment Info */}
          <div className="mt-16 p-8 rounded-lg bg-gradient-to-r from-primary/5 to-primary-glow/5 border border-primary/20">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Secure Payment Processing
              </h3>
              <p className="text-muted-foreground mb-6">
                All payments are processed securely through PayPal. You'll be redirected to complete your purchase safely.
              </p>
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4 text-success" />
                  SSL Encrypted
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CreditCard className="h-4 w-4 text-success" />
                  PayPal Protected
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Zap className="h-4 w-4 text-success" />
                  Instant Delivery
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BuyGiftcards;