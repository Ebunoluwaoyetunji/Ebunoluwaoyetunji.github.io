// Visible marker for content Ebun still needs to supply.
export default function Todo({ children }) {
  return <span className="todo">TODO (Ebun): {children}</span>;
}

// Renders a content value that may be text, a { todo } object, or a list of
// both, e.g. ['Dec 2024 to ', { todo: 'end date' }].
export function Text({ value }) {
  if (value == null) return null;
  if (Array.isArray(value)) return value.map((v, i) => <Text key={i} value={v} />);
  if (typeof value === 'object' && value.todo) return <Todo>{value.todo}</Todo>;
  return value;
}

// True only for a bare { todo } placeholder, not for real content that also
// carries a todo note (like a screen with a "replace with a bigger export" note).
export const isTodo = (value) =>
  value != null && typeof value === 'object' && !Array.isArray(value) && !!value.todo && Object.keys(value).length === 1;
