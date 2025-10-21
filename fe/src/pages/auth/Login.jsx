import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../stores/authSlice';

export function Login() {  
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { user, status, error } = useSelector((state) => state.auth)

      useEffect(() =>{
    if (error) {
        console.error('Please re-enter your email and/or password');
    }
    if (user) {
    useNavigate('/game')
    }
    }, [user, status, error, useDispatch, useNavigate]);
    
    const loginPage = async (e) => {
        e.preventDefault();
        useDispatch(login({ email, password }))
    };


    return (
            <div style={{background: 'rgba(0, 0, 0, 0.7', padding: '2rem', borderRadius: '1rem', 
            width: '350px', textAlign: 'center', boxShadow: '0, 0 20px gold', alignItems: 'center', 
            justifyContent: 'center', margin: '0'}}>
            <h1 style={{color: 'gold', marginBottom: '1rem'}}>🎰 SpinStorm 🎰</h1>
            <form onSubmit={loginPage}>
                <input style={{width: '90%', padding: '10px', margin: '10px 0', borderRadius: '5px', fontSize: '1rem'}}
                    type='email'
                    placeholder='email'
                    value={email}
                    onChange={(e) =>setEmail(e.target.value)}
                    required
                />
                <input style={{width: '90%', padding: '10px', margin: '10px 0', borderRadius: '5px', fontSize: '1rem'}}
                    type='password'
                    placeholder='password'
                    value={password}
                    onChange={(e) =>setPassword(e.target.value)}
                    required
                />
                <button type='submit' style={{width: '100%', padding: '10px', margin: '10px 0', border: 'none', 
                    borderRadius: '5px', background: 'gold', color: 'purple', fontWeight: 'bold', 
                    fontSize: '1rem', cursor: 'pointer', transform: '0.3s'}}>
                    Login
                </button>
            </form>             
            <div>
                <span>
                Don't have an account {' '}
                <Link to='/register'>
                    Sign up
                </Link>
                </span> 
            </div>
        </div>
        ) //for return
}// for login


export default Login; 
