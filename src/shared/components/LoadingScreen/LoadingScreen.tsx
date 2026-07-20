import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import './LoadingScreen.css';

interface LoadingScreenProps {
  /** Optional loading message. */
  message?: string;
}

/**
 * Full-page centered loading spinner.
 * Used as the `fallback` for React `Suspense` boundaries.
 */
export function LoadingScreen({ message }: LoadingScreenProps) {
  return (
    <div className="loading-screen">
      <Spin indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />} />
      {message && <p className="loading-screen__message">{message}</p>}
    </div>
  );
}
