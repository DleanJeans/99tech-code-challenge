import type { Token } from '../types';

interface TokenDisplayProps {
  token: Token;
  showPrice?: boolean;
  size?: 'sm' | 'md';
}

export const TokenDisplay: React.FC<TokenDisplayProps> = ({
  token,
  showPrice = false,
  size = 'md'
}) => {
  const iconSize = size === 'sm' ? 'w-6 h-6' : 'w-8 h-8';

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.style.display = 'none';
  };

  const isUrl = token.icon.startsWith('http') || token.icon.startsWith('/');
  const svgDataUrl = isUrl ? token.icon : `data:image/svg+xml;base64,${btoa(token.icon)}`;

  return (
    <div className="flex items-center gap-3 flex-1">
      {isUrl || token.icon ? (
        <img
          src={svgDataUrl}
          alt={token.symbol}
          className={`${iconSize} rounded-full object-cover`}
          onError={handleImageError}
        />
      ) : (
        <div className={`${iconSize} rounded-full bg-gray-600 flex items-center justify-center`}>
          <span className="text-xs text-gray-300">{token.symbol.slice(0, 2)}</span>
        </div>
      )}
      <div className="flex flex-col items-start flex-1">
        <span className="font-semibold text-base text-gray-100">{token.symbol}</span>
      </div>
      {showPrice && token.price && (
        <span className="text-sm text-gray-400 font-medium">${token.price.toFixed(6)}</span>
      )}
    </div>
  );
};

interface ChevronIconProps {
  isOpen: boolean;
}

export const ChevronIcon: React.FC<ChevronIconProps> = ({ isOpen }) => (
  <svg
    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);
