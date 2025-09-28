import {useState} from 'react';

export function Login() {
     
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [signup, setSignup] = useState(false);

    const togglePage = (e) => {
        e.preventDefault();
        setSignup(!signup);
    }

    const loginPage = (e) => {
         e.preventDefault();
        window.location.href = '/index.html';
    };

    const signupPage = (e) => {
        e.preventDefault();
        setSignup(false);
    }

    return (
            <div style={{background: 'rgba(0, 0, 0, 0.7', padding: '2rem', borderRadius: '1rem', 
            width: '350px', textAlign: 'center', boxShadow: '0, 0 20px gold', alignItems: 'center', 
            justifyContent: 'center', margin: '0'}}>
            <h1 style={{color: 'gold', marginBottom: '1rem'}}>🎰 SpinStorm 🎰</h1>
            {!signup ? (
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
            ) : (
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
                </form>
            )} 
            <div>
                {!signup ? (
                   <span>
                    Don't have an account {' '}
                    <a href='#' onClick={togglePage}>
                        Sign up
                        </a>
                   </span> 
                ) : (
                       <span>
                    Already have an account {' '}
                    <a href='#' onClick={togglePage}>
                       Login
                        </a>
                   </span> 
                )
                } 
            </div>
        </div>
        ) //for return
}// for login

export default Login; 