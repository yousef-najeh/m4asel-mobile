import type { ComponentType } from "react";
import DurationField from "./DurationField";
import EmailField from "./EmailField";
import NameField from "./NameField";
import PasswordField from "./PasswordField";
import PhoneField from "./PhoneField";
import PriceField from "./PriceField";
import TextAreaField from "./TextAreaField";
import TextField from "./TextField";
import type { FieldType, TypedFieldProps } from "./types";

/**
 * The factory: maps a `type` from a form's field config to the component that
 * renders it. Forms stay declarative data; the type knowledge lives in the
 * components.
 *
 * To add a field type: extend `FieldType`, write the component, register it here.
 */
export const FIELD_COMPONENTS: Record<FieldType, ComponentType<TypedFieldProps>> = {
  name: NameField,
  email: EmailField,
  password: PasswordField,
  phone: PhoneField,
  text: TextField,
  price: PriceField,
  duration: DurationField,
  textarea: TextAreaField,
};
