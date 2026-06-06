import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Shield, Users, Zap, Award } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="About All Giftcards — Trusted Gift Card Marketplace"
        description="Learn about All Giftcards, the trusted platform helping thousands buy, sell, exchange, and verify gift cards safely since 2020."
        path="/about"
      />
      <Header />
      
      <main className="py-24 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-foreground sm:text-5xl mb-6">
              About GiftHub
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Your trusted platform for secure gift card transactions since 2020
            </p>
          </div>

          <div className="prose prose-lg max-w-none mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-4">Our Story</h2>
            <p className="text-muted-foreground mb-6">
              GiftHub was founded with a simple mission: to make gift card transactions safe, easy, and accessible to everyone. We recognized that millions of people have unused gift cards sitting in drawers, while others are looking for discounted ways to shop at their favorite stores.
            </p>
            <p className="text-muted-foreground mb-6">
              Today, we've helped thousands of customers buy, sell, and verify gift cards from over 100 major brands. Our platform combines cutting-edge security technology with exceptional customer service to ensure every transaction is smooth and secure.
            </p>

            <h2 className="text-2xl font-bold text-foreground mb-4 mt-12">Our Mission</h2>
            <p className="text-muted-foreground mb-6">
              To create the world's most trusted gift card marketplace, where buyers and sellers can transact with confidence, knowing their money and information are protected every step of the way.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 mb-16">
            {[
              {
                icon: Shield,
                title: "Secure Transactions",
                description: "Bank-level encryption and fraud protection on every transaction"
              },
              {
                icon: Zap,
                title: "Fast Processing",
                description: "Instant verification and quick payouts within 24-48 hours"
              },
              {
                icon: Users,
                title: "Trusted by Thousands",
                description: "Over 50,000+ satisfied customers and growing daily"
              },
              {
                icon: Award,
                title: "Best Rates",
                description: "Competitive pricing with up to 95% value for your gift cards"
              }
            ].map((value, index) => (
              <div key={value.title} className="p-6 rounded-lg bg-muted/20 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <value.icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Join Our Community</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Whether you're looking to buy gift cards at a discount or convert your unused cards into cash, GiftHub is here to help. Join thousands of happy customers today.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
