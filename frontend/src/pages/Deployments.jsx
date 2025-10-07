import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";
import { useState } from "react";
import LogViewer from "../components/LogViewer";

export default function Deployments() {
  const qc = useQueryClient();
  const [provider, setProvider] = useState("aws");
  const [selected, setSelected] = useState(null);

  const list = useQuery({
    queryKey: ["deployments"],
    queryFn: async () => (await api.get("/deployments")).data,
    refetchInterval: 3000,
  });

  const createDep = useMutation({
    mutationFn: async (payload) =>
      (await api.post("/deployments", payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["deployments"] }),
  });

  const destroyDep = useMutation({
    mutationFn: async (id) => (await api.delete(`/deployments/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["deployments"] }),
  });

  const fetchLog = async (id) => {
    // simple helper to fetch latest record and return last_log
    const r = await api.get("/deployments");
    const item = r.data.find((d) => String(d.id) === String(id));
    return item?.last_log || "";
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Deployments</h1>

      <div className="flex gap-3 items-end">
        <div className="flex flex-col">
          <label className="text-sm text-gray-600">Provider</label>
          <select
            className="border p-2 rounded"
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
          >
            <option value="aws">AWS</option>
            <option value="azure">Azure</option>
          </select>
        </div>
        <button
          onClick={() => createDep.mutate({ provider })}
          className="bg-gray-900 text-white rounded px-4 py-2"
        >
          Deploy
        </button>
      </div>

      <div className="bg-white rounded-md shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">ID</th>
              <th className="p-2">Provider</th>
              <th className="p-2">Status</th>
              <th className="p-2">Created</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(list.data || []).map((d) => (
              <tr key={d.id} className="border-t">
                <td className="p-2">{d.id}</td>
                <td className="p-2">{d.provider}</td>
                <td className="p-2">{d.status}</td>
                <td className="p-2">
                  {new Date(d.created_at).toLocaleString()}
                </td>
                <td className="p-2 space-x-3">
                  <button
                    className="text-blue-600 underline"
                    onClick={() => setSelected(d.id)}
                  >
                    Logs
                  </button>
                  <button
                    className="text-red-600 underline"
                    onClick={() => destroyDep.mutate(d.id)}
                  >
                    Destroy
                  </button>
                </td>
              </tr>
            ))}
            {!list.data?.length && (
              <tr>
                <td className="p-2">No deployments yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Logs for #{selected}</h2>
            <button
              className="text-gray-600 underline"
              onClick={() => setSelected(null)}
            >
              Close
            </button>
          </div>
          <LogViewer depId={selected} fetchLog={fetchLog} />
        </div>
      )}
    </div>
  );
}
