import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        
        body: JSON.stringify({ name, email, password }), 
      });

      const data = await response.json();

      if (response.ok) {
        alert('Account created successfully! Please log in.');
        navigate('/login');
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch (err) {
      setError('Server connection error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-black tracking-tight text-gray-900">
          Create a new account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or <Link to="/login" className="font-medium text-orange-500 hover:text-orange-400">log in to your existing account</Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm rounded-xl border border-gray-100 sm:px-10">
          <form className="space-y-6" onSubmit={handleSignup}>
            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-700">Full Name</label>
              <div className="mt-1">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700">Email address</label>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700">Password</label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 focus:outline-none transition"
              >
                Sign up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;