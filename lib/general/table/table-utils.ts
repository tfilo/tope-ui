import type { Column, RowObject } from './Table.types';

/**
 * Helper method to create valid columns definition for table
 *
 * @param cols
 * @returns cols properly typed
 */
export const createColumns = <TData extends RowObject>(cols: { [K in keyof TData]: Column<TData, K> }[keyof TData][]) => cols;
