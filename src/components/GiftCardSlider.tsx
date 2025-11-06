const GiftCardSlider = () => {
  const giftCards = [
    { name: "Apple", color: "from-gray-800 to-gray-900" },
    { name: "Steam", color: "from-blue-600 to-blue-800" },
    { name: "Roblox", color: "from-red-500 to-red-700" },
    { name: "Currys", color: "from-blue-500 to-blue-700" },
    { name: "PlayStation", color: "from-blue-700 to-blue-900" },
    { name: "Best Buy", color: "from-yellow-400 to-yellow-600" },
    { name: "Walmart", color: "from-blue-400 to-blue-600" },
    { name: "John Lewis", color: "from-green-700 to-green-900" },
    { name: "Ikea", color: "from-yellow-300 to-blue-600" },
  ];

  // Duplicate the array to create seamless loop
  const duplicatedCards = [...giftCards, ...giftCards];

  return (
    <div className="py-8 bg-muted/10 overflow-hidden">
      <div className="relative">
        <div className="flex gap-6 animate-slide-infinite">
          {duplicatedCards.map((card, index) => (
            <div
              key={`${card.name}-${index}`}
              className="flex items-center gap-3 px-6 py-3 bg-card border border-border/50 rounded-lg flex-shrink-0"
            >
              <div className={`w-8 h-8 rounded-md bg-gradient-to-br ${card.color} flex-shrink-0`} />
              <span className="text-sm font-medium text-foreground whitespace-nowrap">
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
