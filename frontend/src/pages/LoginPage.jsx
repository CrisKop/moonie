import {useForm} from 'react-hook-form'
import { useAuth } from '../context/AuthContext';
import {Link, useNavigate} from 'react-router-dom'
import { useEffect } from 'react';

function LoginPage() {

  const {register, handleSubmit, formState: {errors}} = useForm();

  const {signin, errors: loginErrors, isAuthenticated} = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if(isAuthenticated) navigate("/chat")
  }, [isAuthenticated]);

  const onSubmit = handleSubmit(data => {
    signin(data)
  })

  return (

      <section className="c-formcontainer">

    
      <form onSubmit={onSubmit} className="animate-zoom-in p-10">

      <section className="welcome animate-blurred-fade-in animate-duration-800">
      <h1 className='text-2xl font-bold'>¡Bienvenido!</h1>
      <h2>Inicia Sesión aquí</h2>
      </section>

      {
        loginErrors.map((error, i) => (
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

        <button className='animate-blurred-fade-in flex align-center justify-center text-center bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-md text-black' type="submit">Iniciar Sesión</button>

        <p className='flex gap-x-2 justify-between animate-blurred-fade-in animate-duration-800'>
      No tienes una cuenta? <Link className='text-sky-500' to='/register'>Regístrarse</Link>
    </p>
    </form>

      </section>
   
  )
}

export default LoginPage