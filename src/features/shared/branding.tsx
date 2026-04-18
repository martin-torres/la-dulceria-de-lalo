import { useState } from 'react';

interface RestaurantLogoProps {
  logoUrl?: string;
  restaurantName?: string;
  primaryColor?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-12 h-12 text-sm',
  lg: 'w-16 h-16 text-lg',
};

export const RestaurantLogo = ({
  logoUrl,
  restaurantName = 'Restaurant',
  primaryColor = '#f59e0b',
  size = 'sm',
}: RestaurantLogoProps) => {
  const [imageError, setImageError] = useState(false);

  if (!logoUrl || imageError) {
    const initials = restaurantName
      .split(' ')
      .map(word => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    return (
      <div
        className={`${sizeClasses[size]} rounded-lg flex items-center justify-center font-bold text-white`}
        style={{ backgroundColor: primaryColor }}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={logoUrl}
      alt={restaurantName}
      className={`${sizeClasses[size]} object-contain rounded-lg`}
      onError={() => setImageError(true)}
    />
  );
};
