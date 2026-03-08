import { STATUS } from "../utils/constants";

export default function Dot({ status, dotRef }) {
  const s = STATUS[status];
  return (
    <span
      ref={dotRef}
      data-dot="true"
      style={{
        width: 8, height: 8, borderRadius: "50%",
        background: s.dot, display: "inline-block", flexShrink: 0,
        marginTop: "0.22rem", // alinear con primera línea de texto
      }}
    />
  );
}
