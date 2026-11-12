import amazonLogo from "@/assets/logos/amazon.png";
import argosLogo from "@/assets/logos/argos.png";
import asdaLogo from "@/assets/logos/asda.png";
import bestbuyLogo from "@/assets/logos/bestbuy.png";
import currysLogo from "@/assets/logos/currys.png";
import ebayLogo from "@/assets/logos/ebay.png";
import googlePlayLogo from "@/assets/logos/googleplay.png";
import ikeaLogo from "@/assets/logos/ikea.png";
import itunesLogo from "@/assets/logos/itunes.png";
import johnLewisLogo from "@/assets/logos/johnlewis.png";
import lululemonLogo from "@/assets/logos/lululemon.png";
import netflixLogo from "@/assets/logos/netflix.png";
import nikeLogo from "@/assets/logos/nike.png";
import playstationLogo from "@/assets/logos/playstation.png";
import robloxLogo from "@/assets/logos/roblox.png";
import spotifyLogo from "@/assets/logos/spotify.png";
import steamLogo from "@/assets/logos/steam.png";
import targetLogo from "@/assets/logos/target.png";
import walmartLogo from "@/assets/logos/walmart.png";
import xboxLogo from "@/assets/logos/xbox.png";
import type { GiftCard } from "@/data/giftcards";
import { giftCardSlug } from "@/data/giftcard-slug";

export { giftCardSlug } from "@/data/giftcard-slug";

const cardLogos: Record<string, string> = {
  "apple-itunes": itunesLogo,
  amazon: amazonLogo,
  "google-play": googlePlayLogo,
  steam: steamLogo,
  "playstation-psn": playstationLogo,
  "xbox-microsoft": xboxLogo,
  netflix: netflixLogo,
  spotify: spotifyLogo,
  ebay: ebayLogo,
  roblox: robloxLogo,
  "best-buy": bestbuyLogo,
  walmart: walmartLogo,
  target: targetLogo,
  nike: nikeLogo,
  lululemon: lululemonLogo,
  ikea: ikeaLogo,
  argos: argosLogo,
  asda: asdaLogo,
  currys: currysLogo,
  "john-lewis": johnLewisLogo,
};

export function giftCardLogo(card: GiftCard) {
  return cardLogos[giftCardSlug(card.name)];
}

export function verificationUrl(card: GiftCard) {
  return `/verify?card=${encodeURIComponent(card.name)}`;
}