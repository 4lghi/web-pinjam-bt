import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Simulasi login
    navigate('/sidebarAdmin');
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="p-6 border rounded shadow-md">
        <h1 className="text-2xl mb-4">Login Page</h1>
        <button onClick={handleLogin} className="bg-blue-600 text-white px-4 py-2 rounded">
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
