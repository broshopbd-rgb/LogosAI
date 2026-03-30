
export interface GeneratedLogo {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
  style: LogoStyle;
}

export type LogoStyle = 'Minimalist' | 'Modern' | 'Vintage' | '3D' | 'Mascot' | 'Hand-drawn' | 'Geometric' | 'Luxury';

export interface LogoConfig {
  prompt: string;
  brandName: string;
  style: LogoStyle;
  aspectRatio: "1:1" | "3:4" | "4:3" | "16:9" | "9:16";
  isPro: boolean;
}
