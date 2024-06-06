import {useForm} from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { useNavigate} from 'react-router-dom'
import { Link } from 'react-router-dom';

function RegisterPage() {

    const {register, handleSubmit, formState: {errors}} = useForm();
    const {signup, isAuthenticated, errors: registerErrors} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
      if(isAuthenticated) navigate("/chat")
    }, [isAuthenticated]);

    const onSubmit = handleSubmit(async values => {
      signup(values)
      console.log(values)
    })

    console.log(registerErrors);

  return (
 
    <section className="c-formcontainer">


    <form onSubmit={onSubmit} className="animate-zoom-in p-10">

    <section className="animate-blurred-fade-in animate-duration-800 welcome">
    <h1 className='text-2xl font-bold'>¡Un nuevo usuario! 👋</h1>
    <h2>Regístrate aquí</h2>
    </section>
    {
      registerErrors.map((error, i) => (
          <div className='bg-red-500 p-2 text-white my-2' key={i}>
            {error}
          </div>
        ))
      }
         <main className='animate-blurred-fade-in animate-duration-800'>
        <div className="inputcontainer">
        <label htmlFor="username">NOMBRE DE USUARIO</label>
        <input className='bg-zinc-700 text-white px-4 py-2 rounded-md my-2' placeholder='' type="text" {...register('username', {required: true})} />
        { errors.username && ( <p className='error text-red-500'>Requerido</p> )}
        </div>

        <div className="inputcontainer">
        <label htmlFor="password">CONTRASEÑA</label>
        <input className='bg-zinc-700 text-white px-4 py-2 rounded-md my-2' placeholder='' type="password" {...register('password', {required: true})} />
        { errors.password && ( <p className='error text-red-500'>Requerido</p> )}
        </div>
        </main>

        <button className='animate-blurred-fade-in animate-duration-800 flex align-center justify-center text-center bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-md text-black' type="submit">Registrarse</button>

        <p className='animate-blurred-fade-in animate-duration-800 flex gap-x-2 justify-between'>
      Ya tienes una cuenta? <Link className='text-sky-500' to='/login'>Iniciar Sesión</Link>
    </p>
    </form>

      </section>


  )
};

export default RegisterPage