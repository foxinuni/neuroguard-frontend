import Badge from "../ui/Badge.jsx";

export default function PatientHeader({ profile, device }) {
  const online = device?.status === "online";

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-gradient-to-r from-brand-800 via-brand-700 to-brand-600 px-6 py-5 shadow-lg shadow-brand-900/10">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 text-white text-lg font-bold">
          {(profile?.name || "P")[0]}
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">
            {profile?.name || "Paciente"}
          </h1>
          <p className="text-sm text-brand-300">{profile?.epilepsy_type || "—"}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Badge className={online
          ? "bg-success/15 text-success-light ring-success/30 backdrop-blur-sm"
          : "bg-white/10 text-white/60 ring-white/20 backdrop-blur-sm"
        }>
          <span className={`relative mr-2 inline-block h-2 w-2 rounded-full ${online ? "bg-success pulse-live" : "bg-white/40"}`} />
          {online ? "Dispositivo conectado" : "Dispositivo desconectado"}
        </Badge>
      </div>
    </div>
  );
}
