import appleLogo from "@/assets/logos/apple.png";
import steamLogo from "@/assets/logos/steam.png";
import robloxLogo from "@/assets/logos/roblox.png";
import currysLogo from "@/assets/logos/currys.png";
import playstationLogo from "@/assets/logos/playstation.png";
import bestbuyLogo from "@/assets/logos/bestbuy.png";
import walmartLogo from "@/assets/logos/walmart.png";
import johnlewisLogo from "@/assets/logos/johnlewis.png";
import ikeaLogo from "@/assets/logos/ikea.png";
import xboxLogo from "@/assets/logos/xbox.png";
import amazonLogo from "@/assets/logos/amazon.png";
import asdaLogo from "@/assets/logos/asda.png";
import argosLogo from "@/assets/logos/argos.png";
import lululemonLogo from "@/assets/logos/lululemon.png";

const GiftCardSlider = () => {
  const giftCards = [
    { name: "Apple", logo: appleLogo },
    { name: "Steam", logo: steamLogo },
    { name: "Roblox", logo: robloxLogo },
    { name: "Currys", logo: currysLogo },
    { name: "PlayStation", logo: playstationLogo },
    { name: "Best Buy", logo: bestbuyLogo },
    { name: "Walmart", logo: walmartLogo },
    { name: "John Lewis", logo: johnlewisLogo },
    { name: "Ikea", logo: ikeaLogo },
    { name: "Xbox", logo: xboxLogo },
    { name: "Amazon", logo: amazonLogo },
    { name: "Asda", logo: asdaLogo },
    { name: "Argos", logo: argosLogo },
    { name: "Lululemon", logo: lululemonLogo },
  ];

  // Duplicate the array to create seamless loop
  const duplicatedCards = [...giftCards, ...giftCards];

  return (
    <div className="fixed bottom-0 left-0 right-0 py-3 bg-background/95 backdrop-blur-sm border-t border-border overflow-hidden z-50">
      <div className="relative">
        <div className="flex gap-4 animate-slide-infinite">
          {duplicatedCards.map((card, index) => (
            <div
              key={`${card.name}-${index}`}
              className="flex items-center gap-2 px-4 py-2 bg-card/80 border border-border/50 rounded-md flex-shrink-0"
            >
              <img 
                src={card.logo} 
                alt={`${card.name} logo`}
                className="w-6 h-6 object-contain flex-shrink-0"
              />
              <span className="text-xs font-medium text-foreground whitespace-nowrap">
                {card.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GiftCardSlider;
