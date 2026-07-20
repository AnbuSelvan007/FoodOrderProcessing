import { Card } from 'antd';
import type { CardProps } from 'antd';
import './AppCard.css';

interface AppCardProps extends CardProps {
  /** Adds a hover lift animation. */
  hoverable?: boolean;
  /** Optional image to display at the top of the card. */
  imageUrl?: string;
  /** Alt text for the image. */
  imageAlt?: string;
}

/**
 * Branded card with hover elevation and optional image header.
 */
export function AppCard({
  hoverable = false,
  imageUrl,
  imageAlt,
  className = '',
  children,
  ...rest
}: AppCardProps) {
  return (
    <Card
      hoverable={hoverable}
      className={`app-card ${hoverable ? 'app-card--hoverable' : ''} ${className}`.trim()}
      cover={
        imageUrl ? (
          <div className="app-card__image-wrapper">
            <img src={imageUrl} alt={imageAlt ?? ''} className="app-card__image" />
          </div>
        ) : undefined
      }
      {...rest}
    >
      {children}
    </Card>
  );
}
