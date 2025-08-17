import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, CreditCard, DollarSign, Shield, Star, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Home = () => {
  const features = [
    {
      icon: CheckCircle,
      title: "Verify Giftcard",
      description: "Instantly verify the authenticity and balance of your gift cards",
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
      <Header />
      
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
              Buy, sell, verify, and exchange gift cards securely. Join thousands of users who trust 
              our platform for all their gift card needs.
            </p>
          </div>
          
          <div className="mt-10 flex items-center justify-center gap-6 animate-slide-up">
            <Button size="lg" className="btn-hero">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-foreground border-foreground/20 hover:border-primary">
              Learn More
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
            <Button size="lg" className="btn-hero">
              Start Trading Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Link to="/reviews">
              <Button variant="outline" size="lg" className="text-foreground border-foreground/20 hover:border-primary">
                Read Reviews
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;