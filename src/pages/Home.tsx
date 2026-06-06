import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, CreditCard, DollarSign, Shield, Star, ArrowRight, Wallet, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GiftCardSlider from "@/components/GiftCardSlider";
import SEO from "@/components/SEO";

const homeJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "All Giftcards",
    url: "https://coinbloom-cards.lovable.app/",
    logo: "https://coinbloom-cards.lovable.app/favicon.ico",
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "All Giftcards",
    url: "https://coinbloom-cards.lovable.app/",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://coinbloom-cards.lovable.app/buy?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  },
];

const Home = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState<number>(0);
  const [currency, setCurrency] = useState<string>('USD');

  useEffect(() => {
    if (user) {
      fetchBalance();
    }
  }, [user]);

  const fetchBalance = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('user_balances')
      .select('amount, pending_amount, currency')
      .eq('user_id', user.id)
      .single();
    
    if (data) {
      setBalance((data.amount || 0) + (data.pending_amount || 0));
      setCurrency(data.currency || 'USD');
    }
  };

  const features = [
    {
      icon: CheckCircle,
      title: "Check Balance",
      description: "Instantly check the balance and status of your gift cards",
      href: "/verify",
      color: "text-success",
    },
    {
      icon: CreditCard,
      title: "Buy Giftcards",
      description: "Purchase gift cards from top brands at competitive rates",
      href: "/buy",
      color: "text-primary",
    },
    {
      icon: DollarSign,
      title: "Sell Giftcards",
      description: "Convert your unused gift cards into cash or exchange them",
      href: "/sell",
      color: "text-accent",
    },
  ];

  const benefits = [
    {
      icon: Shield,
      title: "Secure Transactions",
      description: "Bank-level security with encrypted data protection",
    },
    {
      icon: Star,
      title: "Trusted Platform",
      description: "Over 10,000+ satisfied customers worldwide",
    },
    {
      icon: ArrowRight,
      title: "Instant Processing",
      description: "Lightning-fast verification and transaction processing",
    },
  ];

  return (
    <div className="min-h-screen">
      <SEO
        title="All Giftcards — Check, Buy, Sell & Exchange Gift Cards"
        description="All Giftcards lets you check balances, buy discounted gift cards, and sell or exchange unused cards securely with 24/7 support."
        path="/"
        jsonLd={homeJsonLd}
      />
      <Header />
      <main>
      
      
      {/* Hero Section */}
      <section className="hero-section py-24 px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 to-background/80" />
        <div className="relative mx-auto max-w-7xl text-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Your <span className="bg-gradient-to-r from-primary-glow to-accent bg-clip-text text-transparent">Gift Card</span>
              <br />
              Trading Hub
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              From quick balance checks to global trading, our encrypted platform ensures every step of your gift card journey is simple, secure, and trusted by thousands worldwide.
            </p>
          </div>
          
          {user && (
            <div className="mb-6 animate-fade-in">
              <Card className="inline-block bg-gradient-to-r from-primary/10 to-primary-glow/10 border-primary/20">
                <CardContent className="p-4 flex items-center gap-3">
                  <Wallet className="h-6 w-6 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Available Balance</p>
                    <p className="text-2xl font-bold text-primary">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: currency
                      }).format(balance)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          <div className="mt-10 flex items-center justify-center gap-6 animate-slide-up">
            <Button size="lg" className="btn-hero" asChild>
              <Link to={user ? "/dashboard" : "/auth"}>
                {user ? "Go to Dashboard" : "Get Started"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-foreground border-foreground/20 hover:border-primary" asChild>
              <Link to="/verify">
                Check Balance
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 animate-float">
          <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary-glow/20 rounded-full blur-xl" />
        </div>
        <div className="absolute bottom-20 right-10 animate-float" style={{ animationDelay: "1s" }}>
          <div className="w-16 h-16 bg-gradient-to-br from-accent/20 to-success/20 rounded-full blur-xl" />
        </div>
      </section>

      {/* Main Features */}
      <section className="py-24 px-6 lg:px-8 bg-background/50">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Everything You Need
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose from our comprehensive suite of gift card services
            </p>
          </div>
          
          <div className="grid gap-8 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={feature.title} className="card-glow group cursor-pointer animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-8 text-center">
                  <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br from-background to-card mb-6 group-hover:scale-110 transition-transform ${feature.color}`}>
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {feature.description}
                  </p>
                  <Link to={feature.href}>
                    <Button className="btn-primary w-full">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Why Choose GiftcardsHub?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Experience the difference with our trusted platform
            </p>
          </div>
          
          <div className="grid gap-8 lg:grid-cols-3">
            {benefits.map((benefit, index) => (
              <div key={benefit.title} className="text-center animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="inline-flex p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary-glow/10 mb-6">
                  <benefit.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Reviews Section */}
      <section className="py-24 px-6 lg:px-8 bg-muted/20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <div className="inline-flex p-4 rounded-lg bg-gradient-to-br from-yellow-400/10 to-yellow-600/20 mb-6 animate-float">
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl mb-4 animate-fade-in">
              What Our Customers Say
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Join thousands of satisfied customers who trust us with their gift card needs
            </p>
          </div>

          {/* Review Stats */}
          <div className="grid gap-6 md:grid-cols-4 mb-12">
            {[
              { label: "Total Reviews", value: "2,500+" },
              { label: "Average Rating", value: "4.8" },
              { label: "5-Star Reviews", value: "89%" },
              { label: "Verified Users", value: "95%" }
            ].map((stat, index) => (
              <div 
                key={stat.label} 
                className="text-center p-6 rounded-lg bg-card/50 border animate-fade-in hover:bg-card/80 transition-all duration-300" 
                style={{ animationDelay: `${index * 0.1 + 0.3}s` }}
              >
                <div className="text-2xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Featured Reviews */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
            {[
              {
                name: "Sarah Johnson",
                rating: 5,
                title: "Excellent Service!",
                content: "Fast verification, competitive rates, and excellent customer support. Highly recommended!",
                service: "Sell Giftcards"
              },
              {
                name: "Michael Chen", 
                rating: 5,
                title: "Trustworthy Platform",
                content: "Sold my Amazon gift cards and received payment within 24 hours. Great experience overall.",
                service: "Buy Giftcards"
              },
              {
                name: "Emily Rodriguez",
                rating: 4,
                title: "Quick and Easy",
                content: "The balance check was straightforward and results came back faster than expected.",
                service: "Check Balance"
              }
            ].map((review, index) => (
              <div 
                key={review.name}
                className="card-glow p-6 animate-slide-up"
                style={{ animationDelay: `${index * 0.2 + 0.5}s` }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary-glow/20 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{review.name}</h4>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < review.rating ? "text-yellow-400 fill-current" : "text-muted-foreground/30"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <h5 className="font-medium text-foreground mb-2">{review.title}</h5>
                <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                  {review.content}
                </p>
                <Badge variant="outline" className="text-xs">
                  {review.service}
                </Badge>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button 
              variant="outline" 
              className="hover:bg-primary/10 hover:border-primary animate-fade-in" 
              style={{ animationDelay: '1.1s' }}
              asChild
            >
              <Link to="/reviews">View All Reviews</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 lg:px-8 bg-gradient-to-r from-primary/5 to-primary-glow/5">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of users who trust GiftcardsHub for secure gift card transactions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="btn-hero" asChild>
              <Link to="/auth">
                Start Trading Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Link to="/reviews">
              <Button variant="outline" size="lg" className="text-foreground border-foreground/20 hover:border-primary">
                Read Reviews
              </Button>
            </Link>
          </div>
        </div>
      </section>

      </main>
      <Footer />
      
      <GiftCardSlider />
    </div>
  );
};

export default Home;