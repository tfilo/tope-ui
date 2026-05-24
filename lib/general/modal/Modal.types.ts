import type { DialogHTMLAttributes, ReactNode } from 'react';
import type { Icon } from '../../common/Icon';

/**
 * Props for the Modal component.
 * Extends native Dialog attributes but overrides 'onClose' to avoid type conflicts.
 */
export interface ModalProps extends Omit<DialogHTMLAttributes<HTMLDialogElement>, 'onClose'> {
    /** Controls whether the modal is visible or hidden */
    openModal: boolean;
    /** The title of the modal displayed at the top*/
    title: string;
    /** The main content of the modal (text, components, or HTML) */
    body: ReactNode;
    /** Defines the maximum width of the modal
     * - 'normal': max-width 768px
     * - 'large': max-width 1280px
     * @default 'normal'
     */
    size?: 'normal' | 'large';
    /** Callback triggered when the modal is closed.
     * @param confirm - Returns true if the user clicked the confirm button, false otherwise.
     */
    onClose?: (confirm: boolean) => Promise<void> | void;
    /** Visual variant of the modal, affecting color and type of icon and the confirm button color
     * @default 'primary'
     */
    variant?: 'primary' | 'danger';
    /** Label for the confirmation button
     * @default 'Confirm' (localized) if confirmLabel is undefined
     */
    confirmLabel?: string;
    /** Label for the cancellation button. If set to null, the button will not be rendered.
     * @default 'Cancel' (localized) if cancelLabel is undefined
     */
    cancelLabel?: string | null;
    /** The icon component to be displayed next to the title (e.g., InformationCircleIcon)
     */
    icon?: Icon;
}
