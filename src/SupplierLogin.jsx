import {useState , useContext} from 'react';
import {AuthContext} from './AuthContext';
import {useNavigate } from 'react-router-dom';

const SupplierLogin =() =>{
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();



const handleLogin =async(e) =>{
    e.preventDefault();
    setError('');

    try{
        const response = await fetch('http://localhost:5000/api/auth/login',{
            method: 'POST' ,
            headers:{'Content-Type': 'application/json'},
            body:JSON.stringify({email,password}),

        });

        const data = await response.json();

        if (response.ok) {

        if (data.user.role !== 'admin') {
          setError('Access Denied: Supplier credentials required.');
          return;
        }

        login(data.user, data.token);
        navigate('/orders'); 
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Server connection error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-black tracking-tight text-white">
          Supplier Portal Access
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Authorized restaurant partners only
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-800 py-8 px-6 shadow-xl rounded-xl border border-gray-700 sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-900/50 text-red-400 p-3 rounded-lg text-sm font-medium border border-red-800">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-bold text-gray-300">Supplier Email</label>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-300">Password</label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50 transition"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-orange-600 hover:bg-orange-500 focus:outline-none transition"
              >
                Access Dashboard
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SupplierLogin;



    













