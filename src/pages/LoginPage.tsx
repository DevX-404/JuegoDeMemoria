import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, User, Lock, Mail } from 'lucide-react';

const LoginPage: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true); // Switch entre Login y Registro
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        const endpoint = isLogin ? '/api/login' : '/api/register';
        const url = `http://localhost:3000${endpoint}`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                if (isLogin) {
                    login(data.user);
                    navigate('/'); // Ir al Hub
                } else {
                    // Si se registró, ahora que inicie sesión
                    alert('Registro exitoso. Ahora inicia sesión.');
                    setIsLogin(true);
                }
            } else {
                setError(data.message);
            }
        } catch {
            setError('Error de conexión con el servidor');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
             <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 text-gray-400 hover:text-white">
                <ArrowLeft size={20} /> Volver
            </Link>

            <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
                <h2 className="text-3xl font-bold text-center mb-2 text-white">
                    {isLogin ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}
                </h2>
                <p className="text-gray-400 text-center mb-8">
                    {isLogin ? 'Ingresa para guardar tus puntuaciones' : 'Únete al Arcade Hub'}
                </p>

                {error && <div className="bg-red-500/20 text-red-200 p-3 rounded-lg mb-4 text-center text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div className="relative">
                            <User className="absolute left-3 top-3.5 text-gray-400" size={20} />
                            <input 
                                type="text" placeholder="Usuario" 
                                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 text-white focus:outline-none focus:border-purple-500"
                                onChange={e => setFormData({...formData, username: e.target.value})}
                                required
                            />
                        </div>
                    )}
                    <div className="relative">
                        <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
                        <input 
                            type="email" placeholder="Email" 
                            className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 text-white focus:outline-none focus:border-purple-500"
                            onChange={e => setFormData({...formData, email: e.target.value})}
                            required
                        />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
                        <input 
                            type="password" placeholder="Contraseña" 
                            className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 text-white focus:outline-none focus:border-purple-500"
                            onChange={e => setFormData({...formData, password: e.target.value})}
                            required
                        />
                    </div>

                    <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-3 rounded-xl font-bold text-white shadow-lg hover:shadow-purple-500/30 transition-all">
                        {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button 
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-gray-400 hover:text-white text-sm"
                    >
                        {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;