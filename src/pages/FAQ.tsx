import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";
import SEO from "@/components/SEO";

const FAQ = () => {
  const faqs = [
    {
      question: "How does gift card verification work?",
      answer: "Our verification process checks the balance and validity of your gift card. Simply enter your card details, and we'll verify it within 1 hour. You'll receive confirmation via email with the verified balance."
    },
    {
      question: "How long does it take to receive payment for sold gift cards?",
      answer: "Once your gift card is verified, payment is processed within 24-48 hours directly to your provided credit card. You'll receive email notifications at each step of the process."
    },
    {
      question: "What percentage of my gift card value will I receive?",
      answer: "We offer up to 95% of your gift card's face value, depending on the brand and demand. Popular brands like Amazon, iTunes, and Steam typically receive the highest rates."
    },
    {
      question: "Is it safe to buy gift cards from GiftHub?",
      answer: "Yes! All gift cards are thoroughly verified before being listed. We use bank-level encryption to protect your payment information, and we guarantee the authenticity of every gift card sold on our platform."
    },
    {
      question: "Can I exchange one gift card for another?",
      answer: "Absolutely! Our exchange service allows you to trade unwanted gift cards for ones you'll actually use. A 10% exchange fee applies, and you'll receive the new gift card within 24 hours of verification."
    },
    {
      question: "What brands do you accept?",
      answer: "We accept gift cards from over 100 major brands including Amazon, iTunes, Google Play, Steam, Walmart, Target, Nike, Best Buy, and many more. Check our verification or sell pages for the complete list."
    },
    {
      question: "What if my gift card is rejected?",
      answer: "If your gift card cannot be verified, we'll send you a detailed explanation via email. Common reasons include incorrect card details, already-used cards, or expired cards. No fees are charged for rejected cards."
    },
    {
      question: "Do you charge any fees?",
      answer: "We don't charge upfront fees for verification. For sales, our commission is built into the offer price. For exchanges, there's a 10% fee. All fees are clearly displayed before you confirm any transaction."
    },
    {
      question: "Can I track my transaction status?",
      answer: "Yes! After submitting your request, you'll receive email updates at every stage: verification received, verification complete, payment processing, and payment sent."
    },
    {
      question: "What payment methods do you accept for purchases?",
      answer: "We currently accept credit cards and PayPal for gift card purchases. All payments are processed through secure, encrypted channels."
    },
    {
      question: "Do digital e-codes work the same as physical cards?",
      answer: "Yes! Digital gift card codes work exactly like physical cards. Simply mark the 'digital card' checkbox when submitting, and you won't need to upload any images."
    },
    {
      question: "How do I contact customer support?",
      answer: "You can reach our support team via email at support@gifthub.com or use the contact form on our Contact Us page. We typically respond within 24 hours during business days."
    }
  ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <div className="min-h-screen">
      <SEO
        title="Frequently Asked Questions | All Giftcards"
        description="Got questions about buying, selling or verifying gift cards? Find answers to the most common questions on All Giftcards."
        path="/faq"
        keywords="gift card FAQ, gift card questions, how to sell gift cards"
        jsonLd={faqJsonLd}
      />
      <Header />
      
      <main className="py-24 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <div className="inline-flex p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary-glow/20 mb-6">
              <HelpCircle className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground sm:text-5xl mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Find answers to common questions about our gift card services
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border rounded-lg px-6 bg-card/50"
              >
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  <span className="font-semibold text-foreground pr-4">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-16 p-8 rounded-lg bg-gradient-to-r from-primary/5 to-primary-glow/5 border border-primary/20 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Still have questions?
            </h2>
            <p className="text-muted-foreground mb-6">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <a 
              href="/contact" 
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
