import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { createMembership, getMemberships } from '../services/membershipService';

const initialForm = {
  name: '',
  price: '',
  durationInDays: '',
};

const MembershipsPage = () => {
  const { token } = useAuth();
  const [memberships, setMemberships] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const loadMemberships = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMemberships(token);
      setMemberships(data);
    } catch (err) {
      const msg = err.response?.data?.error || 'No se pudieron cargar las membresías';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadMemberships();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        name: form.name.trim(),
        price: Number(form.price),
        durationInDays: Number(form.durationInDays),
      };
      const created = await createMembership(payload, token);
      setMemberships((prev) => [created, ...prev]);
      setForm(initialForm);
      toast.success('Membresía creada con éxito');
    } catch (err) {
      const msg = err.response?.data?.error || 'No se pudo crear la membresía';
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Mis Planes</h1>
          <p className="text-gray-600">Crea y administra las membresías de tu gimnasio.</p>
        </div>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow border border-gray-100 space-y-4 lg:col-span-1"
          >
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Nueva membresía</h2>
              <p className="text-sm text-gray-500">Nombre, precio y duración en días.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
                Nombre
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Pase Libre"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="price">
                Precio
              </label>
              <input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                required
                placeholder="10000"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="durationInDays">
                Duración (días)
              </label>
              <input
                id="durationInDays"
                name="durationInDays"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={form.durationInDays}
                onChange={handleChange}
                required
                placeholder="30"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full inline-flex justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700 disabled:opacity-60 transition-colors duration-200"
            >
              {saving ? 'Guardando...' : 'Crear membresía'}
            </button>
          </form>

          <div className="bg-white p-6 rounded-lg shadow border border-gray-100 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Membresías</h2>
                <p className="text-sm text-gray-500">Listado de planes disponibles.</p>
              </div>
            </div>

            {loading ? (
              <div className="text-sm text-gray-500">Cargando membresías...</div>
            ) : memberships.length === 0 ? (
              <div className="text-sm text-gray-500">Aún no hay membresías registradas.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Nombre
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Precio
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Duración
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {memberships.map((plan) => (
                      <tr key={plan._id}>
                        <td className="px-4 py-3 text-sm text-gray-800">{plan.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">${plan.price}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{plan.durationInDays} días</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipsPage;

