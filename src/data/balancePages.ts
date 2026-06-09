export interface BalancePage {
  slug: string;
  brand: string;
  keywords: string[];
  title: string;
  metaDescription: string;
  heroText: string;
  steps: { title: string; description: string }[];
  faqs: { question: string; answer: string }[];
}

export const balancePages: BalancePage[] = [
  {
    slug: "amazon",
    brand: "Amazon",
    keywords: ["check amazon gift card balance", "amazon gift card balance checker", "amazon gift card balance check online", "how to check amazon gift card balance"],
    title: "Check Amazon Gift Card Balance Instantly | All Giftcards",
    metaDescription: "Check your Amazon gift card balance instantly and for free. Enter your card code and get your balance in seconds. Fast, secure, and trusted by thousands.",
    heroText: "Check your Amazon gift card balance instantly. No account needed — just enter your card details below and get your balance in seconds.",
    steps: [
      { title: "Select Amazon", description: "Choose Amazon from the gift card brand dropdown in our verify form." },
      { title: "Enter Card Code", description: "Enter your Amazon gift card claim code — found on the back of the card or in your email." },
      { title: "Get Your Balance", description: "Submit and receive your Amazon gift card balance instantly." }
    ],
    faqs: [
      { question: "How do I check my Amazon gift card balance?", answer: "You can check your Amazon gift card balance instantly on All Giftcards. Simply select Amazon, enter your claim code, and submit. You'll see your balance in seconds." },
      { question: "Can I check my Amazon gift card balance without an Amazon account?", answer: "Yes! On All Giftcards you can check your Amazon gift card balance without logging into Amazon. Just enter the claim code in our verify tool." },
      { question: "Where is the claim code on an Amazon gift card?", answer: "The claim code is on the back of the physical card under the scratch-off area, or in the email if it's a digital gift card." },
      { question: "What if my Amazon gift card balance shows zero?", answer: "If the balance shows zero, the card may have already been redeemed. Contact Amazon support if you believe this is an error." },
      { question: "Can I check multiple Amazon gift card balances?", answer: "Yes, you can check as many Amazon gift card balances as you need using our free verify tool." }
    ]
  },
  {
    slug: "itunes",
    brand: "iTunes",
    keywords: ["check itunes gift card balance", "apple gift card balance checker", "itunes gift card balance check online", "how to check itunes gift card balance"],
    title: "Check iTunes / Apple Gift Card Balance Instantly | All Giftcards",
    metaDescription: "Check your iTunes or Apple gift card balance instantly and for free. Enter your card code and get your balance in seconds.",
    heroText: "Check your iTunes or Apple gift card balance instantly. Enter your card details below and get your balance in seconds — no Apple ID required.",
    steps: [
      { title: "Select iTunes / Apple", description: "Choose iTunes / Apple from the gift card brand dropdown." },
      { title: "Enter Card Code", description: "Enter your 16-digit iTunes gift card code found on the back of the card." },
      { title: "Get Your Balance", description: "Submit and receive your iTunes gift card balance instantly." }
    ],
    faqs: [
      { question: "How do I check my iTunes gift card balance?", answer: "Use All Giftcards' verify tool — select iTunes/Apple, enter your card code, and get your balance instantly." },
      { question: "Can I check my Apple gift card balance without an Apple ID?", answer: "Yes! Our tool lets you check your Apple gift card balance without needing an Apple ID." },
      { question: "Where is the code on an iTunes gift card?", answer: "The 16-digit code is on the back of the card under the scratch-off strip." },
      { question: "Does an iTunes gift card expire?", answer: "Apple gift cards do not expire and there are no inactivity fees." },
      { question: "Can I use an iTunes gift card on the App Store?", answer: "Yes, Apple gift cards work across the App Store, Apple Music, Apple TV+, and iCloud storage." }
    ]
  },
  {
    slug: "google-play",
    brand: "Google Play",
    keywords: ["check google play gift card balance", "google play gift card balance checker", "google play gift card balance check online", "how to check google play gift card balance"],
    title: "Check Google Play Gift Card Balance Instantly | All Giftcards",
    metaDescription: "Check your Google Play gift card balance instantly and for free. Enter your card code and get your balance in seconds.",
    heroText: "Check your Google Play gift card balance instantly. No Google account needed — just enter your card code and get your balance right away.",
    steps: [
      { title: "Select Google Play", description: "Choose Google Play from the gift card brand dropdown." },
      { title: "Enter Card Code", description: "Enter your Google Play gift card code — 16 characters found on the back of the card." },
      { title: "Get Your Balance", description: "Submit and receive your Google Play gift card balance instantly." }
    ],
    faqs: [
      { question: "How do I check my Google Play gift card balance?", answer: "Use All Giftcards — select Google Play, enter your card code, and get your balance instantly." },
      { question: "Where is the code on a Google Play gift card?", answer: "The code is on the back of the card under the scratch-off area. It's 16 characters long." },
      { question: "Does a Google Play gift card expire?", answer: "Google Play gift cards do not have an expiration date." },
      { question: "Can I check my Google Play balance without a Google account?", answer: "Yes, our verify tool checks your balance without requiring a Google account." },
      { question: "What can I buy with a Google Play gift card?", answer: "Google Play gift cards can be used for apps, games, movies, TV, books, and Google One storage." }
    ]
  },
  {
    slug: "steam",
    brand: "Steam",
    keywords: ["check steam gift card balance", "steam wallet balance checker", "steam gift card balance check online", "how to check steam gift card balance"],
    title: "Check Steam Gift Card Balance Instantly | All Giftcards",
    metaDescription: "Check your Steam gift card or wallet balance instantly and for free. Enter your card code and get your balance in seconds.",
    heroText: "Check your Steam gift card balance instantly. Enter your Steam wallet code and get your balance right away.",
    steps: [
      { title: "Select Steam", description: "Choose Steam from the gift card brand dropdown." },
      { title: "Enter Wallet Code", description: "Enter your Steam wallet code — found on the back of the card or in your email." },
      { title: "Get Your Balance", description: "Submit and get your Steam gift card balance instantly." }
    ],
    faqs: [
      { question: "How do I check my Steam gift card balance?", answer: "Use All Giftcards — select Steam, enter your wallet code, and get your balance immediately." },
      { question: "Where is the code on a Steam gift card?", answer: "The code is on the back of the card under the scratch-off area." },
      { question: "Does a Steam gift card expire?", answer: "Steam wallet codes do not expire." },
      { question: "Can I check my Steam balance without a Steam account?", answer: "Yes, our tool verifies your Steam gift card balance without needing a Steam account." },
      { question: "What can I buy with a Steam gift card?", answer: "Steam gift cards can be used to buy games, DLC, in-game items, and Steam hardware." }
    ]
  },
  {
    slug: "roblox",
    brand: "Roblox",
    keywords: ["check roblox gift card balance", "roblox gift card balance checker", "roblox gift card balance check online", "how to check roblox gift card balance"],
    title: "Check Roblox Gift Card Balance Instantly | All Giftcards",
    metaDescription: "Check your Roblox gift card balance instantly and for free. Enter your card code and find out how much Robux you have in seconds.",
    heroText: "Check your Roblox gift card balance instantly. Enter your card code and find out how much Robux is on your card right now.",
    steps: [
      { title: "Select Roblox", description: "Choose Roblox from the gift card brand dropdown." },
      { title: "Enter Card Code", description: "Enter your Roblox gift card PIN — found on the back of the card." },
      { title: "Get Your Balance", description: "Submit and find out your Roblox gift card balance instantly." }
    ],
    faqs: [
      { question: "How do I check my Roblox gift card balance?", answer: "Use All Giftcards — select Roblox, enter your card PIN, and get your balance right away." },
      { question: "Where is the PIN on a Roblox gift card?", answer: "The PIN is on the back of the card under the scratch-off area." },
      { question: "Does a Roblox gift card expire?", answer: "Roblox gift cards do not expire." },
      { question: "How much Robux does a $10 Roblox gift card give?", answer: "A $10 Roblox gift card typically gives 800 Robux." },
      { question: "Can I check my Roblox gift card balance without a Roblox account?", answer: "Yes, our verify tool checks your Roblox gift card balance without needing a Roblox account." }
    ]
  },
  {
    slug: "netflix",
    brand: "Netflix",
    keywords: ["check netflix gift card balance", "netflix gift card balance checker", "netflix gift card balance check online", "how to check netflix gift card balance"],
    title: "Check Netflix Gift Card Balance Instantly | All Giftcards",
    metaDescription: "Check your Netflix gift card balance instantly and for free. Enter your card code and get your balance in seconds.",
    heroText: "Check your Netflix gift card balance instantly. Enter your card code below and find out how much credit you have left.",
    steps: [
      { title: "Select Netflix", description: "Choose Netflix from the gift card brand dropdown." },
      { title: "Enter Card Code", description: "Enter your Netflix gift card PIN — found on the back of the card or in your email." },
      { title: "Get Your Balance", description: "Submit and receive your Netflix gift card balance instantly." }
    ],
    faqs: [
      { question: "How do I check my Netflix gift card balance?", answer: "Use All Giftcards — select Netflix, enter your card PIN, and get your balance instantly." },
      { question: "Where is the code on a Netflix gift card?", answer: "The PIN is on the back of the physical card, or in the email for digital cards." },
      { question: "Does a Netflix gift card expire?", answer: "Netflix gift cards do not have an expiration date." },
      { question: "Can I use a Netflix gift card for any subscription plan?", answer: "Yes, Netflix gift cards can be used for any Netflix subscription plan." },
      { question: "Can I check my Netflix gift card balance without a Netflix account?", answer: "Yes, our verify tool lets you check your Netflix gift card balance without logging into Netflix." }
    ]
  },
  {
    slug: "playstation",
    brand: "PlayStation",
    keywords: ["check playstation gift card balance", "psn gift card balance checker", "playstation store gift card balance", "how to check psn gift card balance"],
    title: "Check PlayStation / PSN Gift Card Balance Instantly | All Giftcards",
    metaDescription: "Check your PlayStation or PSN gift card balance instantly and for free. Enter your card code and get your balance in seconds.",
    heroText: "Check your PlayStation or PSN gift card balance instantly. Enter your card details and get your balance right away.",
    steps: [
      { title: "Select PlayStation", description: "Choose PlayStation from the gift card brand dropdown." },
      { title: "Enter Card Code", description: "Enter your PSN gift card code — found on the back of the card." },
      { title: "Get Your Balance", description: "Submit and receive your PlayStation gift card balance instantly." }
    ],
    faqs: [
      { question: "How do I check my PlayStation gift card balance?", answer: "Use All Giftcards — select PlayStation, enter your card code, and get your PSN wallet balance instantly." },
      { question: "Where is the code on a PlayStation gift card?", answer: "The 12-digit code is on the back of the card under the scratch-off area." },
      { question: "Does a PlayStation gift card expire?", answer: "PlayStation gift cards do not expire." },
      { question: "Can I use a PlayStation gift card on PS4 and PS5?", answer: "Yes, PlayStation gift cards work on both PS4 and PS5 consoles." },
      { question: "Can I check my PSN balance without a PlayStation account?", answer: "Yes, our verify tool checks your PSN gift card balance without needing a PlayStation account." }
    ]
  },
  {
    slug: "walmart",
    brand: "Walmart",
    keywords: ["check walmart gift card balance", "walmart gift card balance checker", "walmart gift card balance check online", "how to check walmart gift card balance"],
    title: "Check Walmart Gift Card Balance Instantly | All Giftcards",
    metaDescription: "Check your Walmart gift card balance instantly and for free. Enter your card number and PIN to get your balance in seconds.",
    heroText: "Check your Walmart gift card balance instantly. Enter your card number and PIN below to find out your remaining balance.",
    steps: [
      { title: "Select Walmart", description: "Choose Walmart from the gift card brand dropdown." },
      { title: "Enter Card Number & PIN", description: "Enter your Walmart gift card number and PIN found on the back of the card." },
      { title: "Get Your Balance", description: "Submit and receive your Walmart gift card balance instantly." }
    ],
    faqs: [
      { question: "How do I check my Walmart gift card balance?", answer: "Use All Giftcards — select Walmart, enter your card number and PIN, and get your balance instantly." },
      { question: "Where is the PIN on a Walmart gift card?", answer: "The PIN is on the back of the card under the scratch-off area." },
      { question: "Does a Walmart gift card expire?", answer: "Walmart gift cards do not expire and have no fees." },
      { question: "Can I use a Walmart gift card online?", answer: "Yes, Walmart gift cards can be used in-store and online at Walmart.com." },
      { question: "Can I check my Walmart gift card balance without going to the store?", answer: "Yes, use our online verify tool to check your Walmart gift card balance from anywhere." }
    ]
  }
];
