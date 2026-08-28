import { OptionalFieldIcon } from './FieldIcon';
import FieldShell from './FieldShell';
import type { TypedFieldProps } from './types';

/**
 * Generic single-line text — deliberately carries **no** autofill hints, so use
 * it for free-form values (a service name, a note). Reach for a specific type
 * like NameField or EmailField whenever one fits; those exist precisely so the
 * OS can autofill correctly.
 *
 * Renders a leading icon only if the call site names one via `iconProps`.
 */
export default function TextField({ iconProps, ...props }: TypedFieldProps) {
    return (
        <FieldShell
            leading={<OptionalFieldIcon override={iconProps} />}
            {...props}
        />
    );
}
