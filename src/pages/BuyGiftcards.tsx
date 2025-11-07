import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingCart, Star, CreditCard, Shield, Zap, X, Minus, Plus } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CheckoutModal from "@/components/CheckoutModal";
import { useToast } from "@/hooks/use-toast";
import amazonLogo from "@/assets/logos/amazon.png";
import itunesLogo from "@/assets/logos/itunes.png";
import googlePlayLogo from "@/assets/logos/googleplay.png";
import steamLogo from "@/assets/logos/steam.png";
import walmartLogo from "@/assets/logos/walmart.png";
import playstationLogo from "@/assets/logos/playstation.png";

const BuyGiftcards = () => {
  const { toast } = useToast();
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [cart, setCart] = useState<Array<{ id: string; name: string; amount: number; quantity: number; price: number }>>([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  
  const giftCards = [
    {
      id: 1,
      name: "Amazon",
      description: "Shop everything on Amazon with instant delivery",
      image: amazonLogo,
      denominations: [10, 25, 50, 100, 200],
      rating: 4.9,
      discount: "2% off",
      popular: true
    },
    {
      id: 2,
      name: "iTunes",
      description: "Music, movies, apps, and more from Apple",
      image: itunesLogo,
      denominations: [15, 25, 50, 100],
      rating: 4.8,
      discount: "3% off",
      popular: true
    },
    {
      id: 3,
      name: "Google Play",
      description: "Apps, games, and digital content",
      image: googlePlayLogo,
      denominations: [10, 25, 50, 100],
      rating: 4.7,
      discount: "1% off",
      popular: false
    },
    {
      id: 4,
      name: "Steam",
      description: "Gaming platform with thousands of games",
      image: steamLogo,
      denominations: [20, 50, 100],
      rating: 4.9,
      discount: "5% off",
      popular: true
    },
    {
      id: 5,
      name: "Walmart",
      description: "Shop at America's largest retailer",
      image: walmartLogo,
      denominations: [25, 50, 100, 200],
      rating: 4.6,
      discount: "2% off",
      popular: false
    },
    {
      id: 6,
      name: "PlayStation",
      description: "Games and content for PlayStation consoles",
      image: playstationLogo,
      denominations: [25, 50, 100],
      rating: 4.8,
      discount: "4% off",
      popular: true
    },
  ];

  const currencies = ["USD", "EUR", "GBP", "CAD", "AUD"];

  const handlePurchase = (cardName: string, amount: number) => {
    const existingItem = cart.find(item => item.name === cardName && item.amount === amount);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.name === cardName && item.amount === amount
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      const newItem = {
        id: `${cardName}-${amount}-${Date.now()}`,
        name: cardName,
        amount,
        quantity: 1,
        price: amount
      };
      setCart([...cart, newItem]);
    }

    toast({
      title: "Added to Cart",
      description: `${cardName} $${amount} gift card has been added to your cart.`,
    });
  };

  const updateCartQuantity = (id: string, change: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(0, item.quantity + change);
        return newQuantity === 0 ? null : { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(Boolean) as typeof cart);
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
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

          {/* Currency Selector & Cart */}
          <div className="flex justify-between items-center mb-8">
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

            <Button 
              onClick={() => setShowCart(!showCart)}
              className="relative"
              variant={showCart ? "default" : "outline"}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Cart {getTotalItems() > 0 && `(${getTotalItems()})`}
              {getTotalItems() > 0 && (
                <Badge className="ml-2 bg-primary text-primary-foreground">
                  ${getTotalPrice().toFixed(2)}
                </Badge>
              )}
            </Button>
          </div>

          {/* Cart Display */}
          {showCart && cart.length > 0 && (
            <Card className="mb-8 card-glow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Shopping Cart</span>
                  <Button variant="ghost" size="sm" onClick={() => setShowCart(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{item.name} - ${item.amount}</p>
                        <p className="text-sm text-muted-foreground">
                          ${item.price.toFixed(2)} each
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateCartQuantity(item.id, -1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="px-3 py-1 min-w-[40px] text-center">
                            {item.quantity}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateCartQuantity(item.id, 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center font-semibold text-lg">
                      <span>Total: ${getTotalPrice().toFixed(2)}</span>
                      {getTotalPrice() > 500 ? (
                        <p className="text-red-500 text-sm">Maximum purchase limit is $500</p>
                      ) : (
                        <Button 
                          className="btn-primary" 
                          disabled={getTotalPrice() > 500}
                          onClick={() => setShowCheckout(true)}
                        >
                          <CreditCard className="mr-2 h-4 w-4" />
                          Checkout
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

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
                      <img 
                        src={card.image} 
                        alt={card.name} 
                        className="w-12 h-12 object-cover rounded-lg"
                      />
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
                      {card.denominations.filter(amount => amount <= 500).map((amount) => (
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
                All payments are processed securely through PayPal. Cards bought are instantly delivered to their mail upon successful payment.
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

      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        total={getTotalPrice()}
        currency={selectedCurrency}
        cartItems={cart}
      />

      <Footer />
    </div>
  );
};

export default BuyGiftcards;