import { useEffect, useState } from 'react';
import { AppSkinSettings } from '../core/types';

interface ThemeConfig {
  primaryColor: string;
  primaryHover: string;
  secondaryColor: string;
  secondaryHover: string;
  accentColor: string;
  backgroundColor: string;
  surfaceColor: string;
  textColor: string;
  textMutedColor: string;
  fontLoaded: boolean;
}

const defaultTheme: ThemeConfig = {
  primaryColor: '#f59e0b',
  primaryHover: '#d97706',
  secondaryColor: '#ea580c',
  secondaryHover: '#c2410c',
  accentColor: '#111827',
  backgroundColor: '#f8fafc',
  surfaceColor: '#ffffff',
  textColor: '#111827',
  textMutedColor: '#6b7280',
  fontLoaded: false,
};

const lightenColor = (hex: string, percent: number): string => {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;
  return '#' + (
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  ).toString(16).slice(1);
};

export const useTheme = (settings: AppSkinSettings | null): ThemeConfig => {
  const [fontLoaded, setFontLoaded] = useState(false);

  const theme: ThemeConfig = {
    primaryColor: settings?.primaryColor || defaultTheme.primaryColor,
    primaryHover: settings?.primaryColor
      ? lightenColor(settings.primaryColor, -15)
      : defaultTheme.primaryHover,
    secondaryColor: settings?.secondaryColor || defaultTheme.secondaryColor,
    secondaryHover: settings?.secondaryColor
      ? lightenColor(settings.secondaryColor, -15)
      : defaultTheme.secondaryHover,
    accentColor: settings?.accentColor || defaultTheme.accentColor,
    backgroundColor: settings?.backgroundColor || defaultTheme.backgroundColor,
    surfaceColor: '#ffffff',
    textColor: '#111827',
    textMutedColor: '#6b7280',
    fontLoaded,
  };

  useEffect(() => {
    const root = document.documentElement;

    root.style.setProperty('--primary', theme.primaryColor);
    root.style.setProperty('--primary-hover', theme.primaryHover);
    root.style.setProperty('--secondary', theme.secondaryColor);
    root.style.setProperty('--secondary-hover', theme.secondaryHover);
    root.style.setProperty('--accent', theme.accentColor);
    root.style.setProperty('--background', theme.backgroundColor);
    root.style.setProperty('--surface', theme.surfaceColor);
    root.style.setProperty('--text', theme.textColor);
    root.style.setProperty('--text-muted', theme.textMutedColor);
  }, [theme.primaryColor, theme.secondaryColor, theme.accentColor, theme.backgroundColor]);

  useEffect(() => {
    if (!settings?.googleFontUrl) {
      setFontLoaded(false);
      return;
    }

    const existingLink = document.querySelector(`link[href="${settings.googleFontUrl}"]`);
    if (existingLink) {
      setFontLoaded(true);
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = settings.googleFontUrl;

    link.onload = () => {
      if (settings.googleFontName) {
        document.documentElement.style.setProperty(
          '--font-brand',
          `"${settings.googleFontName}", system-ui, sans-serif`
        );
      }
      setFontLoaded(true);
    };

    link.onerror = () => {
      setFontLoaded(false);
    };

    document.head.appendChild(link);

    return () => {
    };
  }, [settings?.googleFontUrl, settings?.googleFontName]);

  return theme;
};
