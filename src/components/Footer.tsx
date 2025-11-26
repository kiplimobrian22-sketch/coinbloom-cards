import { Link } from "react-router-dom";
import { CreditCard, Twitter, Facebook, Instagram, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card/50 backdrop-blur-lg border-t border-border mt-20">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Logo and description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-primary-glow">
                <CreditCard className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-primary-glow to-primary bg-clip-text text-transparent">
                GiftHub
              </span>
            </div>
            <p className="text-muted-foreground text-sm max-w-md">
              Your trusted platform for buying, selling, and exchanging gift cards securely and efficiently.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Services</h3>
                <ul className="mt-6 space-y-4">
                  <li>
                    <Link to="/verify" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      Verify Giftcard
                    </Link>
                  </li>
                  <li>
                    <Link to="/buy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      Buy Giftcards
                    </Link>
                  </li>
                  <li>
                    <Link to="/sell" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      Sell Giftcards
                    </Link>
                  </li>
                  <li>
                    <Link to="/reviews" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      Reviews
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Support</h3>
                <ul className="mt-6 space-y-4">
                  <li>
                    <Link to="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      Security
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Company</h3>
                <ul className="mt-6 space-y-4">
                  <li>
                    <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link to="/reviews" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      Reviews
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      Press
                    </Link>
                  </li>
                  <li>
                    <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      Partners
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Legal</h3>
                <ul className="mt-6 space-y-4">
                  <li>
                    <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      Cookie Policy
                    </Link>
                  </li>
                  <li>
                    <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      Compliance
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom border */}
        <div className="mt-12 border-t border-border pt-8">
          <p className="text-xs text-muted-foreground text-center">
            © 2025 GiftHub. All rights reserved. Secure gift card transactions made simple.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;