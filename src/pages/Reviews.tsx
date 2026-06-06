import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote, ChevronLeft, ChevronRight, User } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const Reviews = () => {
  const [currentReview, setCurrentReview] = useState(0);

  const reviews = [
    {
      id: 1,
      name: "Amanda Martinez",
      rating: 5,
      title: "Perfect Experience!",
      content: "Just completed another transaction with GiftHub and as always, it was seamless. The platform continues to improve and their service is top-notch. Highly recommend to anyone!",
      date: "November 2025",
      verified: true,
      service: "Sell Giftcards"
    },
    {
      id: 2,
      name: "James Patterson",
      rating: 5,
      title: "Reliable and Fast",
      content: "Been using GiftHub throughout 2025 and they never disappoint. Fast processing, great rates, and excellent communication. This is my go-to platform for gift cards.",
      date: "October 2025",
      verified: true,
      service: "Buy Giftcards"
    },
    {
      id: 3,
      name: "Lisa Anderson",
      rating: 5,
      title: "Best Gift Card Service",
      content: "I've tried multiple platforms but GiftHub stands out. Their verification is quick, rates are competitive, and customer service is responsive. Been a customer since early 2025.",
      date: "September 2025",
      verified: true,
      service: "Verify Giftcard"
    },
    {
      id: 4,
      name: "Marcus Johnson",
      rating: 4,
      title: "Great Platform",
      content: "Sold multiple gift cards through GiftHub this year. The process is straightforward and payments are always on time. Only minor suggestion would be faster verification for large amounts.",
      date: "August 2025",
      verified: true,
      service: "Sell Giftcards"
    },
    {
      id: 5,
      name: "Sophia Lee",
      rating: 5,
      title: "Excellent Customer Care",
      content: "Had an issue with a transaction and their support team went above and beyond to help. Resolved everything within a few hours. This level of service is rare these days!",
      date: "July 2025",
      verified: true,
      service: "Buy Giftcards"
    },
    {
      id: 6,
      name: "Daniel Brown",
      rating: 5,
      title: "Trustworthy and Secure",
      content: "Security is my top concern when dealing with gift cards online. GiftHub has proven to be completely trustworthy. Used them multiple times with zero issues.",
      date: "June 2025",
      verified: true,
      service: "Sell Giftcards"
    },
    {
      id: 7,
      name: "Rachel White",
      rating: 5,
      title: "Fast Verification",
      content: "The verification service is incredibly fast! Got results within an hour which saved me from a potential scam. Worth every penny for peace of mind.",
      date: "May 2025",
      verified: true,
      service: "Verify Giftcard"
    },
    {
      id: 8,
      name: "Kevin Torres",
      rating: 4,
      title: "Good Exchange Rates",
      content: "Been exchanging gift cards on GiftHub for months now. Their rates are consistently better than competitors. The 10% discount for exchanges is a great bonus!",
      date: "April 2025",
      verified: true,
      service: "Sell Giftcards"
    },
    {
      id: 9,
      name: "Michelle Garcia",
      rating: 5,
      title: "Professional Service",
      content: "Very impressed with the professionalism of this platform. Everything is clear, transparent, and secure. This is how gift card services should operate!",
      date: "March 2025",
      verified: true,
      service: "Buy Giftcards"
    },
    {
      id: 10,
      name: "Brian Cooper",
      rating: 5,
      title: "Highly Recommended",
      content: "Found GiftHub early this year and haven't looked back. They offer the best rates, fastest processing, and most reliable service. Can't recommend them enough!",
      date: "February 2025",
      verified: true,
      service: "Sell Giftcards"
    },
    {
      id: 11,
      name: "Jennifer Davis",
      rating: 5,
      title: "Amazing Start to 2025",
      content: "Started using GiftHub in January and it's been fantastic. The verification feature alone has saved me hundreds of dollars by catching invalid cards. Great service!",
      date: "January 2025",
      verified: true,
      service: "Verify Giftcard"
    },
    {
      id: 12,
      name: "Sarah Johnson",
      rating: 5,
      title: "Excellent Service!",
      content: "I've been using GiftHub for over a year now and I'm consistently impressed with their service. Fast verification, competitive rates, and excellent customer support. Highly recommended!",
      date: "December 2024",
      verified: true,
      service: "Sell Giftcards"
    },
    {
      id: 13,
      name: "Michael Chen",
      rating: 5,
      title: "Trustworthy Platform",
      content: "Was skeptical at first but GiftHub proved to be completely legitimate. Sold my Amazon gift cards and received payment within 24 hours. Great experience overall.",
      date: "November 2024",
      verified: true,
      service: "Buy Giftcards"
    },
    {
      id: 14,
      name: "Emily Rodriguez",
      rating: 4,
      title: "Quick and Easy",
      content: "The verification process was straightforward and the results came back faster than expected. Really helpful for checking gift cards before making purchases.",
      date: "November 2024",
      verified: true,
      service: "Verify Giftcard"
    },
    {
      id: 15,
      name: "David Thompson",
      rating: 5,
      title: "Best Rates Available",
      content: "Compared rates with other platforms and GiftHub consistently offers the best value. Professional service and secure transactions. Will definitely use again.",
      date: "October 2024",
      verified: true,
      service: "Sell Giftcards"
    },
    {
      id: 16,
      name: "Jessica Wilson",
      rating: 5,
      title: "Outstanding Support",
      content: "Had a question about my transaction and their support team responded within hours with a detailed solution. Really impressed with their customer care.",
      date: "October 2024",
      verified: true,
      service: "Buy Giftcards"
    },
    {
      id: 17,
      name: "Robert Kim",
      rating: 4,
      title: "Smooth Exchange Process",
      content: "Exchanged my iTunes cards for Amazon credit. The process was smooth and straightforward. Received the new gift card within 48 hours as promised.",
      date: "September 2024",
      verified: true,
      service: "Sell Giftcards"
    }
  ];

  const stats = [
    { label: "Total Reviews", value: "2,500+" },
    { label: "Average Rating", value: "4.8" },
    { label: "5-Star Reviews", value: "89%" },
    { label: "Verified Users", value: "95%" }
  ];

  const nextReview = () => {
    setCurrentReview((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen">
      <SEO
        title="Customer Reviews & Ratings | All Giftcards"
        description="See verified reviews from thousands of customers who buy, sell, and verify gift cards on All Giftcards. 4.8/5 average rating."
        path="/reviews"
      />
      <Header />
      
      <main className="py-24 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex p-4 rounded-lg bg-gradient-to-br from-yellow-400/10 to-yellow-600/20 mb-6">
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl mb-4">
              Customer Reviews
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See what our customers say about their experience with GiftHub
            </p>
          </div>

          {/* Stats */}
          <div className="grid gap-6 md:grid-cols-4 mb-16">
            {stats.map((stat, index) => (
              <div 
                key={stat.label} 
                className="text-center p-6 rounded-lg bg-muted/20 animate-fade-in" 
                style={{ animationDelay: `${index * 0.1}s` }}
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

          {/* Featured Review Carousel */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-foreground text-center mb-8">
              Featured Reviews
            </h2>
            <div className="relative max-w-4xl mx-auto">
              <Card className="card-glow">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary-glow/20 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground flex items-center gap-2">
                          {reviews[currentReview].name}
                          {reviews[currentReview].verified && (
                            <Badge variant="secondary" className="text-xs">
                              Verified
                            </Badge>
                          )}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {reviews[currentReview].date} • {reviews[currentReview].service}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {renderStars(reviews[currentReview].rating)}
                    </div>
                  </div>

                  <div className="relative">
                    <Quote className="absolute -top-2 -left-2 h-8 w-8 text-primary/20" />
                    <h4 className="text-lg font-semibold text-foreground mb-3 pl-6">
                      {reviews[currentReview].title}
                    </h4>
                    <p className="text-muted-foreground pl-6 text-lg leading-relaxed">
                      {reviews[currentReview].content}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Navigation */}
              <div className="flex items-center justify-center gap-4 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevReview}
                  aria-label="Previous review"
                  className="hover:bg-primary/10 hover:border-primary"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex gap-2">
                  {reviews.map((_, index) => (
                    <button
                      key={index}
                      aria-label={`Go to review ${index + 1}`}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentReview 
                          ? "bg-primary" 
                          : "bg-muted-foreground/30"
                      }`}
                      onClick={() => setCurrentReview(index)}
                    />
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextReview}
                  aria-label="Next review"
                  className="hover:bg-primary/10 hover:border-primary"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* All Reviews Grid */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-foreground text-center mb-8">
              All Reviews
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {reviews.map((review, index) => (
                <Card 
                  key={review.id} 
                  className="card-glow animate-fade-in" 
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-primary-glow/20 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground text-sm">
                            {review.name}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {review.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {renderStars(review.rating)}
                      </div>
                    </div>

                    <h4 className="font-medium text-foreground mb-2">
                      {review.title}
                    </h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {review.content.length > 120 
                        ? `${review.content.substring(0, 120)}...` 
                        : review.content}
                    </p>
                    
                    <div className="flex items-center justify-between mt-4">
                      <Badge variant="outline" className="text-xs">
                        {review.service}
                      </Badge>
                      {review.verified && (
                        <Badge variant="secondary" className="text-xs">
                          Verified
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-gradient-to-r from-primary/5 to-primary-glow/5 rounded-lg p-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Ready to Join Our Satisfied Customers?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Experience the trusted platform that thousands of users rely on for their gift card needs
            </p>
            <Button size="lg" className="btn-hero">
              Get Started Today
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Reviews;