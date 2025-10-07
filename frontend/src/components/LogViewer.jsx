import { useEffect, useRef, useState } from "react";

export default function LogViewer({ fetchLog, depId }) {
  const [log, setLog] = useState("");
  const timerRef = useRef(null);

  useEffect(() => {
    const pull = async () => {
      const text = await fetchLog(depId);
      if (text) setLog((l) => (l ? l + "\n" : "") + text);
    };
    pull();
    timerRef.current = setInterval(pull, 2000);
    return () => clearInterval(timerRef.current);
  }, [depId, fetchLog]);

  return (
    <pre className="bg-black text-green-300 p-3 rounded max-h-72 overflow-auto whitespace-pre-wrap">
      {log || "waiting for logs..."}
    </pre>
  );
}
