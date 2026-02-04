import { useEffect, useMemo, useRef, useState } from 'react';
import { checkIn } from '../services/attendanceService';
import { useAuth } from '../hooks/useAuth';

const STATUS_CONFIG = {
  success: {
    title: 'BIENVENIDO',
    wrapper: 'border-green-300 bg-green-50 text-green-800',
    badge: 'bg-green-600 text-white',
  },
  denied: {
    title: 'STOP / CUOTA VENCIDA',
    wrapper: 'border-red-300 bg-red-50 text-red-800',
    badge: 'bg-red-600 text-white',
  },
  notFound: {
    title: 'SOCIO NO ENCONTRADO',
    wrapper: 'border-yellow-300 bg-yellow-50 text-yellow-800',
    badge: 'bg-yellow-500 text-white',
  },
  offline: {
    title: 'SIN CONEXION',
    wrapper: 'border-orange-300 bg-orange-50 text-orange-800',
    badge: 'bg-orange-500 text-white',
  },
};

const extractDateFromMessage = (message) => {
  if (!message) return null;
  const parts = message.split(':');
  if (parts.length < 2) return null;
  return parts.slice(1).join(':').trim();
};

const AccessControlPage = () => {
  const { token, user } = useAuth();
  const [dni, setDni] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState('');
  const timeoutRef = useRef(null);

  const isReception = user?.role === 'recepcion' || user?.role === 'entrenador' || user?.role === 'admin';
  const canView = useMemo(() => Boolean(token && isReception), [token, isReception]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const resetInput = () => {
    setDni('');
    setLoading(false);
    timeoutRef.current = null;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!dni.trim() || loading) return;
    setLoading(true);
    setStatus(null);
    setMessage('');

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    try {
      const response = await checkIn(dni.trim(), token);
      setStatus('success');
      setMessage(response.data?.message || 'Bienvenido');
    } catch (error) {
      const statusCode = error.response?.status;
      const apiMessage = error.response?.data?.message || error.response?.data?.error || '';
      if (!error.response) {
        setStatus('offline');
        setMessage('SIN CONEXION. Revisa tu red o el servidor.');
      } else if (statusCode === 403) {
        setStatus('denied');
        setMessage(apiMessage || 'ACCESO DENEGADO');
      } else if (statusCode === 404) {
        setStatus('notFound');
        setMessage(apiMessage || 'Socio no encontrado');
      } else {
        setStatus('notFound');
        setMessage(apiMessage || 'Error inesperado');
      }
    } finally {
      timeoutRef.current = setTimeout(resetInput, 3000);
    }
  };

  if (!canView) {
    return (
      <div className="min-h-screen bg-gray-950 p-6 md:p-10">
        <div className="max-w-4xl mx-auto rounded-2xl border border-yellow-300/60 bg-yellow-500/10 p-6 text-yellow-100">
          No tienes permisos para controlar el acceso.
        </div>
      </div>
    );
  }

  const visualConfig = status ? STATUS_CONFIG[status] : null;
  const expirationText = extractDateFromMessage(message);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-10 md:py-16 space-y-10">
        <div className="text-center space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Control de Acceso</h1>
          <p className="text-gray-300">Escanea o escribe el DNI para registrar la asistencia.</p>
        </div>

        <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 md:p-10 shadow-xl">
          <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6">
            <div className="w-full max-w-xl">
              <label className="block text-sm uppercase tracking-widest text-gray-400 mb-2" htmlFor="dni-input">
                DNI del socio
              </label>
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  id="dni-input"
                  name="dni"
                  type="text"
                  value={dni}
                  onChange={(event) => setDni(event.target.value)}
                  placeholder="Ingresa DNI"
                  className="flex-1 rounded-xl border border-gray-700 bg-gray-950 px-4 py-4 text-2xl md:text-3xl font-semibold tracking-wide focus:border-indigo-500 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-indigo-600 px-6 py-4 text-lg font-semibold shadow-lg hover:bg-indigo-500 transition disabled:opacity-60"
                >
                  {loading ? 'Validando...' : 'Ingresar'}
                </button>
              </div>
            </div>
          </form>

          <div className="mt-10">
            {status ? (
              <div
                className={`rounded-2xl border px-6 py-8 md:px-10 md:py-12 text-center space-y-4 ${visualConfig.wrapper}`}
              >
                <span className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-semibold ${visualConfig.badge}`}>
                  {visualConfig.title}
                </span>
                <h2 className="text-2xl md:text-3xl font-bold">{message || visualConfig.title}</h2>
                {expirationText && (
                  <p className="text-sm md:text-base font-medium opacity-90">Vencimiento: {expirationText}</p>
                )}
                <p className="text-xs md:text-sm opacity-80">El sistema se reiniciará automáticamente en 3 segundos.</p>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-700 bg-gray-900/50 px-6 py-10 text-center text-gray-400">
                Ingresa un DNI para ver el resultado.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessControlPage;

