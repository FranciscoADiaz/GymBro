import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const { user } = useAuth();

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
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
