import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FileText } from "lucide-react";
import SEO from "@/components/SEO";

const TermsOfService = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="Terms of Service | All Giftcards"
        description="The terms and conditions governing your use of the All Giftcards platform for buying, selling, and verifying gift cards."
        path="/terms"
      />
      <Header />
      
      <main className="py-24 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <div className="inline-flex p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary-glow/20 mb-6">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground sm:text-5xl mb-6">
              Terms of Service
            </h1>
            <p className="text-muted-foreground">
              Last updated: January 2025
            </p>
          </div>

          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Agreement to Terms</h2>
              <p className="text-muted-foreground">
                By accessing or using GiftHub's services, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Use of Services</h2>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground mb-2">Eligibility</h3>
                <p className="text-muted-foreground">
                  You must be at least 18 years old to use our services. By using GiftHub, you represent that you meet this requirement.
                </p>
                
                <h3 className="text-xl font-semibold text-foreground mb-2">Account Responsibilities</h3>
                <p className="text-muted-foreground">
                  You are responsible for:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Maintaining the confidentiality of your account</li>
                  <li>All activities that occur under your account</li>
                  <li>Providing accurate and complete information</li>
                  <li>Notifying us of any unauthorized use</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Gift Card Transactions</h2>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground mb-2">Verification</h3>
                <p className="text-muted-foreground">
                  All gift cards submitted for verification or sale are subject to our verification process. We reserve the right to reject any gift card that:
                </p>
                <ul className="list-disc pl-6 mt-2 text-muted-foreground space-y-2">
                  <li>Has been previously used or redeemed</li>
                  <li>Is expired or invalid</li>
                  <li>Is fraudulent or obtained illegally</li>
                  <li>Does not meet our quality standards</li>
                </ul>

                <h3 className="text-xl font-semibold text-foreground mb-2">Selling Gift Cards</h3>
                <p className="text-muted-foreground">
                  When selling gift cards, you represent and warrant that:
                </p>
                <ul className="list-disc pl-6 mt-2 text-muted-foreground space-y-2">
                  <li>You are the rightful owner of the gift card</li>
                  <li>The gift card is genuine and has not been tampered with</li>
                  <li>The gift card has the balance you claim</li>
                  <li>You have not and will not use the gift card after submission</li>
                </ul>

                <h3 className="text-xl font-semibold text-foreground mb-2">Buying Gift Cards</h3>
                <p className="text-muted-foreground">
                  All gift cards purchased through GiftHub are guaranteed to be valid at the time of purchase. If you experience any issues, please contact our support team within 24 hours.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Payment Terms</h2>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Payments for sold gift cards are processed within 24-48 hours of verification</li>
                <li>Our commission rates are clearly displayed before transaction confirmation</li>
                <li>Exchange transactions incur a 10% fee</li>
                <li>All prices are in USD unless otherwise specified</li>
                <li>Refunds are subject to our refund policy</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Prohibited Activities</h2>
              <p className="text-muted-foreground mb-4">
                You may not:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Use our services for any illegal purpose</li>
                <li>Submit fraudulent or stolen gift cards</li>
                <li>Attempt to manipulate or exploit our verification system</li>
                <li>Interfere with or disrupt our services</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Impersonate any person or entity</li>
                <li>Collect user information without authorization</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Intellectual Property</h2>
              <p className="text-muted-foreground">
                All content, features, and functionality of GiftHub are owned by us and protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, or distribute our content without permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Limitation of Liability</h2>
              <p className="text-muted-foreground">
                GiftHub shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services. Our total liability shall not exceed the amount you paid us in the past 12 months.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Disclaimers</h2>
              <p className="text-muted-foreground">
                Our services are provided "as is" without warranties of any kind. We do not guarantee uninterrupted, timely, secure, or error-free service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Termination</h2>
              <p className="text-muted-foreground">
                We may terminate or suspend your account immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users or our business.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Changes to Terms</h2>
              <p className="text-muted-foreground">
                We reserve the right to modify these Terms at any time. We will notify users of significant changes via email or through our platform. Continued use after changes constitutes acceptance.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Governing Law</h2>
              <p className="text-muted-foreground">
                These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Contact Information</h2>
              <p className="text-muted-foreground">
                For questions about these Terms of Service, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-muted/20 rounded-lg">
                <p className="text-foreground font-semibold">Email: legal@gifthub.com</p>
                <p className="text-muted-foreground">Address: 123 Gift Street, NYC 10001</p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsOfService;
