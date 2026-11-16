import { giftCards } from "@/data/giftcards";
import { verificationPath } from "@/data/giftcard-slug";

const playstation = giftCards.find((card) => card.name === "PlayStation (PSN)");
if (!playstation || verificationPath(playstation.name) !== "/checkbalance/psn") {
  throw new Error("PlayStation verification link must be /checkbalance/psn");
}

const roblox = giftCards.find((card) => card.name === "Roblox");
if (!roblox || verificationPath(roblox.name) !== "/checkbalance/roblox") {
  throw new Error("Roblox verification link must be /checkbalance/roblox");
}

for (const card of giftCards) {
  if (!/^\/checkbalance\/[a-z0-9-]+$/.test(verificationPath(card.name))) {
    throw new Error(`Invalid verification link for ${card.name}`);
  }
}

const verificationPaths = giftCards.map((card) => verificationPath(card.name));
if (new Set(verificationPaths).size !== giftCards.length) {
  throw new Error("Every gift card must have a unique verification link");
}

console.log(`Validated direct verification links for ${giftCards.length} cards, including /checkbalance/roblox`);