
import React from 'react';

export const LOGO_STYLES = [
  { name: 'Minimalist', description: 'Clean, simple, and iconic.', icon: '✨' },
  { name: 'Modern', description: 'Sleek lines and contemporary aesthetics.', icon: '🚀' },
  { name: 'Vintage', description: 'Classic, retro, and nostalgic feel.', icon: '📻' },
  { name: '3D', description: 'Depth, shadows, and high-impact visuals.', icon: '🧊' },
  { name: 'Mascot', description: 'Character-based and friendly.', icon: '🐻' },
  { name: 'Hand-drawn', description: 'Artistic, organic, and unique.', icon: '✍️' },
  { name: 'Geometric', description: 'Mathematical precision and shapes.', icon: '📐' },
  { name: 'Luxury', description: 'Elegant, premium, and sophisticated.', icon: '💎' },
] as const;

export const ASPECT_RATIOS = [
  { label: 'Square (1:1)', value: '1:1' },
  { label: 'Portrait (3:4)', value: '3:4' },
  { label: 'Landscape (4:3)', value: '4:3' },
] as const;
