import { STATUS } from "../utils/constants";

export default function Dot({ status }) {
  const s = STATUS[status];
  return (
    <span style={{ width: 7, height: 7, borderRadius: "50%", background: s.dot, display: "inline-block", flexShrink: 0 }} />
  );
}
