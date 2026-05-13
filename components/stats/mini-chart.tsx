"use client";

interface DataPoint { l: string; v: number; }

interface Props {
  data: DataPoint[];
  color: string;
  height?: number;
}

export function MiniChart({ data, color, height = 60 }: Props) {
  const max = Math.max(...data.map(d => d.v), 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <div style={{ width: "100%", background: color + "33", borderRadius: "3px 3px 0 0", height: `${(d.v / max) * 100}%`, minHeight: d.v > 0 ? 2 : 0, position: "relative" }}>
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: `${(d.v / max) * 100}%`, background: color, borderRadius: "3px 3px 0 0" }} />
          </div>
          <span style={{ fontSize: 7, color: "#64748b" }}>{d.l}</span>
        </div>
      ))}
    </div>
  );
}
