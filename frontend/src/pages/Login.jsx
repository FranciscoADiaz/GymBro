import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const { login } = useAuth();

  const handleLogin = () => {
    login({ email: 'user@example.com', token: 'demo-token' });
  };

  return (
    <div>
      <h1>Login</h1>
      <button type="button" onClick={handleLogin}>
        Simulated Login
      </button>
    </div>
  );
};

export default Login;
