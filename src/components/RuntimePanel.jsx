import { Cpu, ShieldCheck, Zap } from "lucide-react";

export default function RuntimePanel() {
  return (
    <section className="panel">
      <div className="panel-label">Runtime</div>
      <div className="runtime-row">
        <Cpu size={17} />
        <span>Ollama</span>
        <strong>mistral</strong>
      </div>
      <div className="runtime-row">
        <Zap size={17} />
        <span>Endpoint</span>
        <strong>/api/ollama</strong>
      </div>
      <div className="runtime-row">
        <ShieldCheck size={17} />
        <span>Mode</span>
        <strong>super</strong>
      </div>
    </section>
  );
}
