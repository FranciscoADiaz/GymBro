import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard">
      <div className="dashboard-card">
        <h1>Bienvenido al Panel de Control</h1>
        {user && (
          <p className="dashboard-subtitle">
            Sesión iniciada como {user.name || user.email} ({user.role})
          </p>
        )}
        <button type="button" onClick={logout}>
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
