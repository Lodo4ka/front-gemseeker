export type CreateTokenParams = {
  token_name: string;
  ticker: string;
  description: string;
  image: File | null;
  nsfw: boolean;
  amount_to_buy: string;
  currentToken: 'SOL' | 'TOKEN';
  socials: {
    twitter: string;
    telegram: string;
    website: string;
  };
};
