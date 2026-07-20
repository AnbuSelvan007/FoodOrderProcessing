import { Avatar } from 'antd';
import type { AvatarProps } from 'antd';

interface AppAvatarProps extends AvatarProps {
  /** Full name used to generate initials if no `src` is provided. */
  name?: string;
}

/** Extracts up to 2 initials from a full name. */
function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

/** Generates a consistent HSL color from a name string. */
function getColorFromName(name: string): string {
  let hash = 0;
  for (const char of name) {
    hash = char.charCodeAt(0) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${String(hue)}, 55%, 50%)`;
}

/**
 * Avatar with automatic initials and color generation when no image is provided.
 */
export function AppAvatar({ name, style, children, ...rest }: AppAvatarProps) {
  const showInitials = !rest.src && !rest.icon && !children && name;

  return (
    <Avatar
      style={{
        backgroundColor: showInitials ? getColorFromName(name) : undefined,
        fontWeight: 600,
        fontSize: '0.85em',
        ...style,
      }}
      {...rest}
    >
      {showInitials ? getInitials(name) : children}
    </Avatar>
  );
}
