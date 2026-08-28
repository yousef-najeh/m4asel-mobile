import type { StyleProp, TextInputProps, TextStyle, ViewStyle } from "react-native";

/**
 * Field types the registry can build. Adding one = extend this union, write the
 * component, then register it in `registry.ts`.
 */
export type FieldType =
  | "name"
  | "email"
  | "password"
  | "phone"
  | "text"
  | "price"
  | "duration"
  | "textarea";

/**
 * Per-slot style overrides. Each one is merged *after* the defaults, so a call
 * site always wins. This is what lets two screens with different visual languages
 * share the same field components.
 */
export interface FieldStyleProps {
  /** Wrapper around label + row + error. */
  containerStyle?: StyleProp<ViewStyle>;
  /** The bordered input row. */
  rowStyle?: StyleProp<ViewStyle>;
  /** Applied on top of `rowStyle` while focused. */
  focusedRowStyle?: StyleProp<ViewStyle>;
  /** Applied on top of `rowStyle` when `error` is set. */
  errorRowStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
  errorStyle?: StyleProp<TextStyle>;
  /** Retint/resize/swap the leading icon without changing the field type. */
  iconProps?: { name?: string; type?: string; size?: number; color?: string };
}

/**
 * The props every typed field accepts — identical across types so the registry
 * can index into `FIELD_COMPONENTS` and spread one prop shape.
 *
 * `secureTextEntry` is omitted on purpose: the field *type* owns that decision
 * (see PasswordField), so callers choose a type rather than a mode. `style` is
 * omitted in favour of the explicit `inputStyle`/`rowStyle` slots.
 *
 * Per-type components may add extra props, but they must be **optional** to stay
 * assignable to `ComponentType<TypedFieldProps>` under `strictFunctionTypes`.
 */
export interface TypedFieldProps
  extends Omit<TextInputProps, "secureTextEntry" | "style">,
    FieldStyleProps {
  /** Optional label rendered above the row. */
  label?: string;
  /** Validation message; also drives the error border. */
  error?: string;
}

/** One field in a form's config, keyed to a Formik value. */
export type FieldConfig<T> = {
  name: keyof T;
  type: FieldType;
  /**
   * Rare per-form overrides — e.g. signup's password needs `new-password` so the
   * OS offers to *generate* one, while login needs `current-password`. If icons
   * or placeholders start appearing here, push them into the type component instead.
   */
  props?: Partial<TypedFieldProps>;
};
