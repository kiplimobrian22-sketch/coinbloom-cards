import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote, ChevronLeft, ChevronRight, User } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Reviews = () => {
  const [currentReview, setCurrentReview] = useState(0);

  const reviews = [
    {
      id: 1,
      name: "Sarah Johnson",
      rating: 5,
      title: "Excellent Service!",
      content: "I've been using GiftHub for over a year now and I'm consistently impressed with their service. Fast verification, competitive rates, and excellent customer support. Highly recommended!",
      date: "December 2024",
      verified: true,
      service: "Sell Giftcards"
    },
    {
      id: 2,
      name: "Michael Chen",
      rating: 5,
      title: "Trustworthy Platform",
      content: "Was skeptical at first but GiftHub proved to be completely legitimate. Sold my Amazon gift cards and received payment within 24 hours. Great experience overall.",
      date: "November 2024",
      verified: true,
      service: "Buy Giftcards"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      rating: 4,
      title: "Quick and Easy",
      content: "The verification process was straightforward and the results came back faster than expected. Really helpful for checking gift cards before making purchases.",
      date: "November 2024",
      verified: true,
      service: "Verify Giftcard"
    },
    {
      id: 4,
      name: "David Thompson",
      rating: 5,
      title: "Best Rates Available",
      content: "Compared rates with other platforms and GiftHub consistently offers the best value. Professional service and secure transactions. Will definitely use again.",
      date: "October 2024",
      verified: true,
      service: "Sell Giftcards"
    },
    {
      id: 5,
      name: "Jessica Wilson",
      rating: 5,
      title: "Outstanding Support",
      content: "Had a question about my transaction and their support team responded within hours with a detailed solution. Really impressed with their customer care.",
      date: "October 2024",
      verified: true,
      service: "Buy Giftcards"
    },
    {
      id: 6,
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
      <Header />
      
      <div className="py-24 px-6 lg:px-8">
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
                  className="hover:bg-primary/10 hover:border-primary"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex gap-2">
                  {reviews.map((_, index) => (
                    <button
                      key={index}
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
      </div>

      <Footer />
    </div>
  );
};

export default Reviews;