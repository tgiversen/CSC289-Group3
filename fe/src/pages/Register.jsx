import { useState } from 'react'
import { Link } from 'react-router-dom'

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const signupPage = (e) => {
    e.preventDefault();
    }

    return (
        <div style={{background: 'rgba(0, 0, 0, 0.7', padding: '2rem', borderRadius: '1rem', 
                width: '350px', textAlign: 'center', boxShadow: '0, 0 20px gold', alignItems: 'center', 
                justifyContent: 'center', margin: '0'}}>
            <h1 style={{color: 'gold', marginBottom: '1rem'}}>🎰 SpinStorm 🎰</h1>
            <form onSubmit={signupPage}>
                    <input style={{width: '90%', padding: '10px', margin: '10px 0', borderRadius: '5px', fontSize: '1rem'}}
                        type='text'
                        placeholder='Username'
                        value={username}
                        onChange={(e) =>setUsername(e.target.value)}
                        required
                    />
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
                        Create Account
                    </button>
                             <span>
                    Already have an account {' '}
                    <Link to='/login' >
                       Login
                    </Link>
                   </span> 
                </form>
        </div>
    ) //for return
}// for register

export default Register