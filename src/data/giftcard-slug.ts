export function giftCardSlug(name: string) {
  return name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function verificationSlug(name: string) {
  if (name.toLowerCase() === "playstation (psn)") return "psn";
  return giftCardSlug(name);
}

export function verificationPath(name: string) {
  return `/checkbalance/${verificationSlug(name)}`;
}