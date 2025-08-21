-- Create missing enum types that are referenced in the database
CREATE TYPE currency_code AS ENUM (
  'USD', 'CAD', 'AUD', 'GBP', 'EUR'
);

CREATE TYPE country_code AS ENUM (
  'US', 'CA', 'AU', 'GB', 'DE', 'FR', 'ES', 'IT', 'NL', 'BE', 'AT', 'IE', 'PT', 'FI', 'SE', 'DK', 'NO', 'CH', 'LU'
);

CREATE TYPE transaction_type AS ENUM (
  'signup_bonus', 'referral_bonus', 'gift_card_sale', 'gift_card_purchase', 'withdrawal', 'deposit'
);