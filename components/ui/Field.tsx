"use client";

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  multiline?: boolean;
  type?: string;
}

export default function Field({ label, value, onChange, onBlur, placeholder, multiline, type = "text" }: FieldProps) {
  const base: React.CSSProperties = {
    width: "100%", background: "#1e1e2a", border: "1px solid #2c2c3a",
    borderRadius: "3px", color: "#fff", fontSize: "13px", padding: "10px 12px",
    outline: "none", fontFamily: "inherit",
  };
  return (
    <div style={{ marginBottom: "16px" }}>
      <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#4a4a5c", marginBottom: "6px" }}>
        {label}
      </p>
      {multiline
        ? <textarea rows={3} value={value} onChange={e => onChange(e.target.value)} onBlur={onBlur} placeholder={placeholder} style={{ ...base, resize: "vertical" }} />
        : <input type={type} value={value} onChange={e => onChange(e.target.value)} onBlur={onBlur} placeholder={placeholder} style={base} />
      }
    </div>
  );
}
