import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { getInviteCode, regenerateInviteCode } from '../services/gymService';

const Dashboard = () => {
  const { user, token } = useAuth();
  const [inviteCode, setInviteCode] = useState(null);
  const [loadingCode, setLoadingCode] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  const loadInviteCode = async () => {
    setLoadingCode(true);
    try {
      const data = await getInviteCode(token);
      setInviteCode(data.inviteCode);
    } catch (err) {
      const msg = err.response?.data?.error || 'No se pudo obtener el código';
      toast.error(msg);
    } finally {
      setLoadingCode(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin' && token) {
      loadInviteCode();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.role, token]);

  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      const data = await regenerateInviteCode(token);
      setInviteCode(data.inviteCode);
      toast.success('Código regenerado');
    } catch (err) {
      const msg = err.response?.data?.error || 'No se pudo regenerar el código';
      toast.error(msg);
    } finally {
      setRegenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
          <p className="text-sm font-semibold text-indigo-600">Panel</p>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">Bienvenido al Panel de Control</h1>
          {user && (
            <p className="text-sm text-gray-600 mt-2">
              Sesión iniciada como <span className="font-semibold">{user.name || user.email}</span> ({user.role})
            </p>
          )}
          {user?.role === 'admin' && (
            <div className="mt-6 rounded-md border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm font-semibold text-gray-700">Código de invitación</p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center rounded-md bg-white px-3 py-1 text-sm font-mono text-gray-800 border border-gray-200">
                  {loadingCode ? 'Cargando...' : inviteCode || '—'}
                </span>
                <button
                  type="button"
                  onClick={handleRegenerate}
                  disabled={regenerating}
                  className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow hover:bg-indigo-700 disabled:opacity-60 transition-colors"
                >
                  {regenerating ? 'Regenerando...' : 'Regenerar'}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Comparte este código con entrenadores para que se registren en tu gimnasio.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
