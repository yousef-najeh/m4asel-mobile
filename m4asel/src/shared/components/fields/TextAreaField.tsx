import FieldShell from './FieldShell';
import { styles } from './FieldShell.styles';
import type { TypedFieldProps } from './types';

/**
 * Multi-line text. Swaps the row's fixed height for a growing, top-aligned box.
 * Its defaults are merged *before* the call site's, so `rowStyle`/`inputStyle`
 * overrides still win.
 */
export default function TextAreaField({
    numberOfLines = 3,
    rowStyle,
    inputStyle,
    ...props
}: TypedFieldProps) {
    return (
        <FieldShell
            multiline
            numberOfLines={numberOfLines}
            rowStyle={[styles.textareaRow, rowStyle]}
            inputStyle={[styles.textareaInput, inputStyle]}
            {...props}
        />
    );
}
