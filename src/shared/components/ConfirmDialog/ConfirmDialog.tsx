import { Modal } from 'antd';
import { HiOutlineExclamationTriangle } from 'react-icons/hi2';

interface ConfirmDialogOptions {
  /** Title of the confirmation dialog. */
  title: string;
  /** Descriptive body text. */
  description: string;
  /** Text for the confirm button. */
  confirmLabel?: string;
  /** Text for the cancel button. */
  cancelLabel?: string;
  /** Whether the action is destructive (red button). */
  danger?: boolean;
  /** Callback fired when the user confirms. */
  onConfirm: () => void | Promise<void>;
}

/**
 * Imperative confirmation dialog.
 *
 * Usage:
 * ```ts
 * showConfirmDialog({
 *   title: 'Delete Restaurant',
 *   description: 'This action cannot be undone.',
 *   danger: true,
 *   onConfirm: () => deleteRestaurant(id),
 * });
 * ```
 */
export function showConfirmDialog({
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = false,
  onConfirm,
}: ConfirmDialogOptions): void {
  Modal.confirm({
    title,
    content: description,
    okText: confirmLabel,
    cancelText: cancelLabel,
    okButtonProps: { danger },
    icon: <HiOutlineExclamationTriangle style={{ color: danger ? '#FF4D4F' : '#FAAD14', fontSize: 22, marginRight: 12 }} />,
    centered: true,
    onOk: onConfirm,
  });
}
