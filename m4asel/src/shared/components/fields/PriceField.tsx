import { OptionalFieldIcon } from './FieldIcon';
import FieldShell from './FieldShell';
import type { TypedFieldProps } from './types';

/** Money input — decimal keypad, no autocorrect. Formatting stays the caller's job. */
export default function PriceField({ iconProps, ...props }: TypedFieldProps) {
    return (
        <FieldShell
            leading={<OptionalFieldIcon override={iconProps} />}
            keyboardType="decimal-pad"
            autoCorrect={false}
            {...props}
        />
    );
}
