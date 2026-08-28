import { Icon } from 'react-native-elements';
import { colors } from '@/src/theme';
import type { FieldStyleProps } from './types';

interface FieldIconProps {
    name: string;
    type?: string;
    /** Call-site `iconProps` — each key wins over the type's default. */
    override?: FieldStyleProps['iconProps'];
}

/** Leading-icon preset for FieldShell. Size and color come from the theme unless overridden. */
export default function FieldIcon({ name, type = 'material', override }: FieldIconProps) {
    return (
        <Icon
            name={override?.name ?? name}
            type={override?.type ?? type}
            size={override?.size ?? 22}
            color={override?.color ?? colors.accentFocus}
        />
    );
}

/**
 * For field types with no icon of their own (price, duration, free text): renders
 * one only if the call site named it via `iconProps`.
 */
export function OptionalFieldIcon({ override }: { override?: FieldStyleProps['iconProps'] }) {
    if (!override?.name) return null;
    return <FieldIcon name={override.name} override={override} />;
}
