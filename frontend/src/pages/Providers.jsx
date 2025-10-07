import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";
import { useState } from "react";

export default function Providers() {
  const qc = useQueryClient();
  const [form, setForm] = useState({
    name: "aws",
    display_name: "",
    credentials: {},
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["providers"],
    queryFn: async () => (await api.get("/providers")).data,
  });

  const addProvider = useMutation({
    mutationFn: async (payload) => (await api.post("/providers", payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["providers"] }),
  });

  const check = async (id) => {
    const res = await api.get(`/providers/${id}/check`);
    alert(JSON.stringify(res.data, null, 2));
  };

  const submit = (e) => {
    e.preventDefault();
    addProvider.mutate(form);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Providers</h1>

      <form
        onSubmit={submit}
        className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-white rounded-md shadow"
      >
        <select
          className="border p-2 rounded"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        >
          <option value="aws">AWS</option>
          <option value="azure">Azure</option>
        </select>
        <input
          className="border p-2 rounded"
          placeholder="Display Name"
          value={form.display_name}
          onChange={(e) =>
            setForm((f) => ({ ...f, display_name: e.target.value }))
          }
        />
        <textarea
          className="border p-2 rounded md:col-span-3"
          rows={4}
          placeholder={`Credentials JSON, e.g.\n{"AWS_ACCESS_KEY_ID":"...","AWS_SECRET_ACCESS_KEY":"..."}`}
          onChange={(e) => {
            try {
              setForm((f) => ({
                ...f,
                credentials: JSON.parse(e.target.value || "{}"),
              }));
            } catch {
              /* ignore preview parse errors */
            }
          }}
        />
        <button className="bg-gray-900 text-white rounded px-4 py-2 md:w-max">
          Add Provider
        </button>
      </form>

      <div className="bg-white rounded-md shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">ID</th>
              <th className="p-2">Name</th>
              <th className="p-2">Display</th>
              <th className="p-2">Created</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td className="p-2">Loading...</td>
              </tr>
            )}
            {error && (
              <tr>
                <td className="p-2 text-red-600">Error</td>
              </tr>
            )}
            {(data || []).map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-2">{p.id}</td>
                <td className="p-2">{p.name}</td>
                <td className="p-2">{p.display_name}</td>
                <td className="p-2">
                  {new Date(p.created_at).toLocaleString()}
                </td>
                <td className="p-2">
                  <button
                    onClick={() => check(p.id)}
                    className="text-blue-600 underline"
                  >
                    Check
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
