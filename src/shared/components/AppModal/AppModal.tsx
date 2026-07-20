import { Modal } from 'antd';
import type { ModalProps } from 'antd';

interface AppModalProps extends ModalProps {
  /** Prevent closing on backdrop click for critical modals. */
  preventClose?: boolean;
}

/**
 * Branded modal with consistent styling and optional close prevention.
 */
export function AppModal({
  preventClose = false,
  ...rest
}: AppModalProps) {
  return (
    <Modal
      maskClosable={!preventClose}
      keyboard={!preventClose}
      centered
      {...rest}
    />
  );
}
