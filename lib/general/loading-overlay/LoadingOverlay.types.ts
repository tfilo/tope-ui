export type LoadingOverlayProps = {
    active: boolean;
    /** Loading text; defaults to localization.loading. */
    label?: string;
    /** Optional attribute for Playwright testing */
    'data-testid'?: string;
};
