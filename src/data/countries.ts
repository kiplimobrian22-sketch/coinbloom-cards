export interface Country {
  code: string;
  name: string;
  currency: string;
  flag: string;
}

export const countries: Country[] = [
  { code: 'US', name: 'United States', currency: 'USD', flag: '🇺🇸' },
  { code: 'CA', name: 'Canada', currency: 'CAD', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', currency: 'AUD', flag: '🇦🇺' },
  { code: 'GB', name: 'United Kingdom', currency: 'GBP', flag: '🇬🇧' },
  { code: 'DE', name: 'Germany', currency: 'EUR', flag: '🇩🇪' },
  { code: 'FR', name: 'France', currency: 'EUR', flag: '🇫🇷' },
  { code: 'ES', name: 'Spain', currency: 'EUR', flag: '🇪🇸' },
  { code: 'IT', name: 'Italy', currency: 'EUR', flag: '🇮🇹' },
  { code: 'NL', name: 'Netherlands', currency: 'EUR', flag: '🇳🇱' },
  { code: 'BE', name: 'Belgium', currency: 'EUR', flag: '🇧🇪' },
  { code: 'AT', name: 'Austria', currency: 'EUR', flag: '🇦🇹' },
  { code: 'IE', name: 'Ireland', currency: 'EUR', flag: '🇮🇪' },
  { code: 'PT', name: 'Portugal', currency: 'EUR', flag: '🇵🇹' },
  { code: 'FI', name: 'Finland', currency: 'EUR', flag: '🇫🇮' },
  { code: 'SE', name: 'Sweden', currency: 'EUR', flag: '🇸🇪' },
  { code: 'DK', name: 'Denmark', currency: 'EUR', flag: '🇩🇰' },
  { code: 'NO', name: 'Norway', currency: 'EUR', flag: '🇳🇴' },
  { code: 'CH', name: 'Switzerland', currency: 'EUR', flag: '🇨🇭' },
  { code: 'LU', name: 'Luxembourg', currency: 'EUR', flag: '🇱🇺' },
];

export const getCurrencyByCountry = (countryCode: string): string => {
  const country = countries.find(c => c.code === countryCode);
  return country?.currency || 'USD';
};