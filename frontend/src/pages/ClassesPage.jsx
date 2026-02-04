import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { createClass, deleteClass, getClasses } from '../services/classService';

const initialForm = {
  name: '',
  schedule: '',
  trainer: '',
};

const ClassesPage = () => {
  const { token, user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const canView = useMemo(() => Boolean(token && isAdmin), [token, isAdmin]);

  const loadClasses = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getClasses(token);
      setClasses(data);
    } catch (err) {
      const msg = err.response?.data?.error || 'No se pudieron cargar las clases';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (canView) {
      loadClasses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canView]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        name: form.name.trim(),
        schedule: form.schedule.trim(),
        trainer: form.trainer.trim(),
      };
      const created = await createClass(payload, token);
      setClasses((prev) => [created, ...prev]);
      setForm(initialForm);
      toast.success('Clase creada con éxito');
    } catch (err) {
      const msg = err.response?.data?.error || 'No se pudo crear la clase';
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (classItem) => {
    setError(null);
    try {
      await deleteClass(classItem._id, token);
      setClasses((prev) => prev.filter((item) => item._id !== classItem._id));
      toast.success('Clase eliminada');
    } catch (err) {
      const msg = err.response?.data?.error || 'No se pudo eliminar la clase';
      setError(msg);
      toast.error(msg);
    }
  };

  if (!canView) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto rounded-lg border border-yellow-200 bg-yellow-50 p-6 text-yellow-800">
          No tienes permisos para gestionar clases.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Clases</h1>
          <p className="text-gray-600">Crea clases y controla la oferta semanal.</p>
        </div>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow border border-gray-100 space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Nueva clase</h2>
              <p className="text-sm text-gray-500">Nombre, horario y entrenador.</p>
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
                placeholder="Zumba"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="schedule">
                Horario
              </label>
              <input
                id="schedule"
                name="schedule"
                type="text"
                value={form.schedule}
                onChange={handleChange}
                placeholder="Martes y Jueves 18hs"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="trainer">
                Entrenador
              </label>
              <input
                id="trainer"
                name="trainer"
                type="text"
                value={form.trainer}
                onChange={handleChange}
                placeholder="Nombre del entrenador"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full inline-flex justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700 disabled:opacity-60 transition-colors duration-200"
            >
              {saving ? 'Guardando...' : 'Crear clase'}
            </button>
          </form>

          <div className="bg-white p-6 rounded-lg shadow border border-gray-100 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Clases creadas</h2>
                <p className="text-sm text-gray-500">Listado actual de clases.</p>
              </div>
            </div>

            {loading ? (
              <div className="text-sm text-gray-500">Cargando clases...</div>
            ) : classes.length === 0 ? (
              <div className="text-sm text-gray-500">Aún no hay clases registradas.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Nombre
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Horario
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Entrenador
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {classes.map((classItem) => (
                      <tr key={classItem._id}>
                        <td className="px-4 py-3 text-sm text-gray-800">{classItem.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{classItem.schedule || '-'}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{classItem.trainer || '-'}</td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleDelete(classItem)}
                            className="text-sm font-semibold text-red-600 hover:text-red-700 transition"
                          >
                            Eliminar
                          </button>
                        </td>
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

export default ClassesPage;

