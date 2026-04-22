export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "boolean"
  | "date"
  | "datetime"
  | "select"
  | "tags"
  | "image"
  | "slug";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  hint?: string;
  options?: { value: string; label: string }[];
  step?: number;
  defaultValue?: unknown;
  placeholder?: string;
  /** For 'slug' — derive from this field when empty */
  derivedFrom?: string;
};

export type ColumnRender = {
  key: string;
  label: string;
  render?: "image" | "bool" | "date" | "text" | "tag";
};

export type ResourceConfig = {
  slug: string;
  singular: string;
  plural: string;
  apiPath: string;
  titleField: string;
  listColumns: ColumnRender[];
  fields: Field[];
};
