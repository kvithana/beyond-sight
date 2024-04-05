import { audioEngine } from "@/controllers/init";
import { useEffect, useState } from "react";

export function Logs() {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const t = setInterval(() => setLogs(audioEngine.logs.getArray()), 1000);
    return () => clearInterval(t);
  }, [setLogs]);

  return (
    <div>
      {logs.map((log, i) => (
        <p className="font-mono text-sm my-2" key={i}>
          {log}
        </p>
      ))}
    </div>
  );
}
