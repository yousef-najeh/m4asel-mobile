import { OptionalFieldIcon } from './FieldIcon';
import FieldShell from './FieldShell';
import type { TypedFieldProps } from './types';

/** Whole-number input (minutes, counts) — integer keypad, no decimal separator. */
export default function DurationField({ iconProps, ...props }: TypedFieldProps) {
    return (
        <FieldShell
            leading={<OptionalFieldIcon override={iconProps} />}
            keyboardType="number-pad"
            autoCorrect={false}
            {...props}
        />
    );
}
