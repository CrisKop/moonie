import React, { useEffect, useRef, useState } from "react"
import {Link, useNavigate} from 'react-router-dom'
import { gsap } from 'gsap';

function HomePage() {
  const logoRef = useRef(null);
  const mainRef = useRef(null);
  const mockupRef = useRef(null);
  const appButtonRef = useRef(null);
  const scrollDown = useRef(null);
  const zonesRef = useRef(null);
  const secondPart = useRef(null);

  const navigate = useNavigate();

  const [desplegatePlan, setDesplegatePlan] = useState(false)

 /* 
 useEffect(() => {
    navigate('/chat')
  })
  */


  const scrollToRef = () => {
    if (secondPart.current) {
      secondPart.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

 useEffect(() => {

  if(desplegatePlan === true){
    zonesRef.current.style.height = "auto"
  } else {
    zonesRef.current.style.height = "320px"
  }

 }, [desplegatePlan])

  useEffect(() => {
    const body = document.getElementById('body');

    body.style.overflowX = 'hidden';
    body.style.overflowY = 'auto';
  }, [])

  useEffect(() => {
    const animateElements = () => {
      const tl = gsap.timeline();
      const tl2 = gsap.timeline();
      const tl3 = gsap.timeline();
      const tl4 = gsap.timeline();

      if (window.innerWidth < 700) {
        // Animaciones para logoRef
      tl.to(logoRef.current, { y: 800, duration: 0, ease: 'power2.inOut' })
      .to(logoRef.current, { y: -150, opacity: 1, duration: 1, ease: 'power2.inOut' })
      .to(logoRef.current, { y: -210, x: 5, scale: 0.2, duration: 1, ease: 'power2.inOut' });

    // Animaciones para appButtonRef
    tl2.to(appButtonRef.current, { y: 800, duration: 0, ease: 'power2.inOut' }, "-=2")
      .to(appButtonRef.current, { y: 400, duration: 1, ease: 'power2.inOut' })
      .to(appButtonRef.current, { y: -80, opacity: 1, duration: 1, ease: 'power2.inOut' });

    // Animaciones para mainRef
    tl3.to(mainRef.current, { y: 800,scale: 0, duration: 0, ease: 'power2.inOut' }, "-=2")
      .to(mainRef.current, { y: 120,scale: 1, opacity: 1, duration: 1, ease: 'power2.inOut' })
      .to(mainRef.current, { y: -200, duration: 1, ease: 'power2.inOut' })
      .to(scrollDown.current, { y: window.innerHeight / 1.2, scale: 0.5, rotate: 180, opacity: 0, duration: 0, ease: 'power2.inOut' })
      .to(scrollDown.current, { opacity: 1, duration: 1, ease: 'power2.inOut' })

    // Animaciones para mockupRef
    tl4.to(mockupRef.current, { x: 3000, duration: 0, ease: 'power2.inOut' }, "-=2")
      .to(mockupRef.current, { y: 100, x: 0, opacity: 1, scale: 0.9, duration: 2.5, ease: 'power2.inOut' })
      .to(mockupRef.current, { duration: 1, ease: 'power2.inOut' });

        return;
      }

      if (window.innerWidth < 1200) {
        // Animaciones para logoRef
      tl.to(logoRef.current, { y: 800, duration: 0, ease: 'power2.inOut' })
      .to(logoRef.current, { y: -200, opacity: 1, duration: 1, ease: 'power2.inOut' })
      .to(logoRef.current, { y: -270, x: 10, scale: 0.35, duration: 1, ease: 'power2.inOut' });

    // Animaciones para appButtonRef
    tl2.to(appButtonRef.current, { y: 800, duration: 0, ease: 'power2.inOut' }, "-=2")
      .to(appButtonRef.current, { y: 400, duration: 1, ease: 'power2.inOut' })
      .to(appButtonRef.current, { y: -50, opacity: 1, duration: 1, ease: 'power2.inOut' });

    // Animaciones para mainRef
    tl3.to(mainRef.current, { y: 800, scale: 0,duration: 0, ease: 'power2.inOut' }, "-=2")
      .to(mainRef.current, { y: 200, scale: 1.5, opacity: 1, duration: 1, ease: 'power2.inOut' })
      .to(mainRef.current, { y: -250, duration: 1, ease: 'power2.inOut' })
      .to(scrollDown.current, { y: window.innerHeight / 1.2, opacity: 0, duration: 0, ease: 'power2.inOut' })
      .to(scrollDown.current, { opacity: 1, duration: 1, ease: 'power2.inOut' })

    // Animaciones para mockupRef
    tl4.to(mockupRef.current, { x: 3000, duration: 0, ease: 'power2.inOut' }, "-=2")
      .to(mockupRef.current, { y: 150, x: 0, opacity: 1, scale: 0.9, duration: 2.5, ease: 'power2.inOut' })
      .to(mockupRef.current, { duration: 1, ease: 'power2.inOut' });

        return;
      }

      if(window.innerWidth < 1601){
         // Animaciones para logoRef
      tl.to(logoRef.current, { y: 800, duration: 0, ease: 'power2.inOut' })
      .to(logoRef.current, { y: -100, opacity: 1, duration: 1, ease: 'power2.inOut' })
      .to(logoRef.current, { y: -100, x: -290, scale: 0.35, duration: 1, ease: 'power2.inOut' });

    // Animaciones para appButtonRef
    tl2.to(appButtonRef.current, { y: 800, duration: 0, ease: 'power2.inOut' }, "-=2")
      .to(appButtonRef.current, { y: 400, duration: 1, ease: 'power2.inOut' })
      .to(appButtonRef.current, { y: 90, x: -300, opacity: 1, duration: 1, ease: 'power2.inOut' });

    // Animaciones para mainRef
    tl3.to(mainRef.current, { y: 800,scale: 0, duration: 0, ease: 'power2.inOut' }, "-=2")
      .to(mainRef.current, { y: 200,scale: 1, opacity: 1, duration: 1, ease: 'power2.inOut' })
      .to(mainRef.current, { y: -80, x: -300, duration: 1, ease: 'power2.inOut' })
      .to(scrollDown.current, { y:  window.innerHeight / 1.2, opacity: 0, duration: 0, ease: 'power2.inOut' })
      .to(scrollDown.current, { opacity: 1, duration: 1, ease: 'power2.inOut' })

    // Animaciones para mockupRef
    tl4.to(mockupRef.current, { x: 3000, duration: 0, ease: 'power2.inOut' }, "-=2")
      .to(mockupRef.current, { y: -25, x: 300, opacity: 1, duration: 2.5, ease: 'power2.inOut' })
      .to(mockupRef.current, { scale: 1, duration: 1, ease: 'power2.inOut' });

      return;
  
      }


      if(window.innerWidth < 2281){
      // Animaciones para logoRef
      tl.to(logoRef.current, { y: 800, duration: 0, ease: 'power2.inOut' })
        .to(logoRef.current, { y: -150, opacity: 1, duration: 1, ease: 'power2.inOut' })
        .to(logoRef.current, { y: -145, x: -390, scale: 0.35, duration: 1, ease: 'power2.inOut' });

      // Animaciones para appButtonRef
      tl2.to(appButtonRef.current, { y: 800, duration: 0, ease: 'power2.inOut' }, "-=2")
        .to(appButtonRef.current, { y: 400, duration: 1, ease: 'power2.inOut' })
        .to(appButtonRef.current, { y: 80, x: -400, opacity: 1, duration: 1, ease: 'power2.inOut' });

      // Animaciones para mainRef
      tl3.to(mainRef.current, { y: 800, scale: 0, duration: 0, ease: 'power2.inOut' }, "-=2")
        .to(mainRef.current, { y: 120, scale: 1, opacity: 1, duration: 1, ease: 'power2.inOut' })
        .to(mainRef.current, { y: -120, x: -400, duration: 1, ease: 'power2.inOut' })
        .to(scrollDown.current, { y:  window.innerHeight / 1.2, opacity: 0, duration: 0, ease: 'power2.inOut' })
        .to(scrollDown.current, { opacity: 1, duration: 1, ease: 'power2.inOut' })

      // Animaciones para mockupRef
      tl4.to(mockupRef.current, { x: 3000, duration: 0, ease: 'power2.inOut' }, "-=2")
        .to(mockupRef.current, { y: -50, x: 400, opacity: 1, duration: 2.5, ease: 'power2.inOut' })
        .to(mockupRef.current, { scale: 1.5, duration: 1, ease: 'power2.inOut' });

        return;
      }


            // Animaciones para logoRef
            tl.to(logoRef.current, { y: 800, duration: 0, scale: 2, ease: 'power2.inOut' })
            .to(logoRef.current, { y: -400, opacity: 1, duration: 1, ease: 'power2.inOut' })
            .to(logoRef.current, { y: -160, x: -585, scale: 0.5, duration: 1, ease: 'power2.inOut' });
    
          // Animaciones para appButtonRef
          tl2.to(appButtonRef.current, { y: 800, duration: 0, ease: 'power2.inOut' }, "-=2")
            .to(appButtonRef.current, { y: 400, duration: 1, ease: 'power2.inOut' })
            .to(appButtonRef.current, { y: 200, x: -600, scale: 1.5, opacity: 1, duration: 1, ease: 'power2.inOut' });
    
          // Animaciones para mainRef
          tl3.to(mainRef.current, { y: 800, scale: 0, duration: 0, ease: 'power2.inOut' }, "-=2")
            .to(mainRef.current, { y: 200, scale: 1, opacity: 1, duration: 1, ease: 'power2.inOut' })
            .to(mainRef.current, { y: -120, x: -600, duration: 1, ease: 'power2.inOut' })
            .to(scrollDown.current, { y:  window.innerHeight / 1.2, opacity: 0, duration: 0, ease: 'power2.inOut' })
            .to(scrollDown.current, { opacity: 1, duration: 1, ease: 'power2.inOut' })
    
          // Animaciones para mockupRef
          tl4.to(mockupRef.current, { x: 3000, duration: 0, ease: 'power2.inOut' }, "-=2")
            .to(mockupRef.current, { y: -50, x: 550, opacity: 1, duration: 2.5, ease: 'power2.inOut' })
            .to(mockupRef.current, { scale: 2, duration: 1, ease: 'power2.inOut' });
    
            return;
    };

    animateElements();
  }, []);

  return (
    <div className="landing">

      <nav>
        <img src="/img/coronafull.png" alt="" srcSet="" />
      </nav>


      <section className="pagecontainer">


      <section className="firstPart">
        
      <img className="logo" ref={logoRef} src="/img/moonie.png" alt="" srcSet="" />
        <main ref={mainRef}>
          <h1>MOONIE</h1>
          <h2>Aplicación web de mensajería</h2>
          <p>Proyecto Personal de <Link className="text-blue-200" target="_blank" to="https://instagram.com/gold_cris__">CrisKop</Link></p>
        </main>


        <section ref={appButtonRef} className="appButton">
        <button  className="flex align-center justify-center text-center bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-md text-black"><Link to="/login">Ir a la aplicación</Link></button>
        <button onClick={scrollToRef} className="flex align-center justify-center text-center bg-white hover:bg-gray-600 px-4 py-2 rounded-md text-black">Saber Más</button>
        </section>

        <section ref={mockupRef} className="mockup">


        <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[8px] rounded-t-xl h-[172px] max-w-[301px] md:h-[294px] md:max-w-[512px]">
    <div className="rounded-lg overflow-hidden h-[156px] md:h-[278px] bg-white dark:bg-gray-800">
        <img src="/img/screenshot.png" className="dark:hidden h-[156px] md:h-[278px] w-full rounded-xl" alt=""/>
        <img src="/img/screenshot.png" className="hidden dark:block h-[156px] md:h-[278px] w-full rounded-lg" alt=""/>
    </div>
</div>
<div className="relative mx-auto bg-gray-900 dark:bg-gray-700 rounded-b-xl rounded-t-sm h-[17px] max-w-[351px] md:h-[21px] md:max-w-[597px]">
    <div className="absolute left-1/2 top-0 -translate-x-1/2 rounded-b-xl w-[56px] h-[5px] md:w-[96px] md:h-[8px] bg-gray-800"></div>
</div>


        </section>

        <div ref={scrollDown} className="mouse"></div>
        
      </section>





      <section className="secondPart" ref={secondPart}>
        <main>

        <h1>Tecnologías utilizadas</h1>
        
        <section className="techs">
            <div className="card">
              <h2>Frontend</h2>
              <img src="https://skillicons.dev/icons?i=vite,react,javascript,tailwind,scss" />
              <h3>Otras tecnologías:</h3>
              <p>headlessui, axios, gsap, socket.io-client</p>
            </div>

            <div className="card">
              <h2>Backend</h2>
              <img src="https://skillicons.dev/icons?i=nodejs,javascript,express,mongodb" />
              <h3>Otras tecnologías:</h3>
              <p>zod, multer, cloudinary, jsonwebtoken, socket.io</p>
            </div>
        </section>

        </main>
      </section>



      <section className="thirdPart">

        <h1 className="title">Plan de desarrollo</h1>

<section ref={zonesRef} className="zones">

<button  onClick={() => {setDesplegatePlan(!desplegatePlan)}} className="flex align-center justify-center text-center bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-md text-black">
  {desplegatePlan === true ? (
    <>
    Ocultar
    </>
  ) : (
    <>
    Ver todo
    </>
  )}
</button>

<div className="backend">

      <h1>Backend</h1>
    <ul>
        <li className="checked">Setup</li>
        <li className="checked">MongoDB</li>
        <li className="checked">Usuarios
            <ul className="indent-1">
                <li className="checked">Registro</li>
                <li className="checked">Creación de token</li>
                <li className="checked">Login</li>
                <li className="checked">Validación de token</li>
                <li className="checked">Validación de datos con zod</li>
            </ul>
        </li>
        <li className="checked">Chats
            <ul className="indent-1">
                <li className="checked">Crear chat nuevo</li>
                <li className="checked">Obtener lista de chats del usuario</li>
                <li className="checked">Obtener chat en específico</li>
                <li className="checked">Paginación de sugerencias de nuevos chats
                    <ul className="indent-2">
                        <li className="checked">Filtrar chats ya existentes</li>
                    </ul>
                </li>
                <li className="checked">Eliminar chat</li>
                <li className="checked">Grupos
                    <ul className="indent-2">
                        <li className="checked">Añadir miembros</li>
                        <li className="checked">Remover miembros</li>
                    </ul>
                </li>
            </ul>
        </li>
        <li className="checked">Mensajes
            <ul className="indent-1">
                <li className="checked">Crear nuevo mensaje</li>
                <li className="checked">Obtener mensajes de un chat</li>
                <li className="checked">Editar mensajes</li>
                <li className="checked">Eliminar mensajes</li>
                <li className="checked">Buscar Mensajes</li>
            </ul>
        </li>
        <li className="checked">Información de usuario
            <ul className="indent-1">
                <li className="checked">Editar información
                    <ul className="indent-2">
                        <li className="checked">Estado</li>
                        <li className="checked">Avatar</li>
                    </ul>
                </li>
            </ul>
        </li>
        <li className="checked">Dar información
            <ul className="indent-1">
                <li className="checked">Chat</li>
                <li className="checked">Grupo</li>
                <li className="checked">Estados</li>
            </ul>
        </li>
        <li className="checked">Cambios en tiempo real
            <ul className="indent-1">
                <li className="checked">Chats dm
                    <ul className="indent-2">
                        <li className="checked">Mensajes</li>
                        <li className="checked">Cambio de información de usuarios</li>
                    </ul>
                </li>
                <li className="checked">Grupos
                    <ul className="indent-2">
                        <li className="checked">Mensajes</li>
                        <li className="checked">Cambio de información de grupo</li>
                        <li className="checked">Expulsión o adición de miembros</li>
                        <li className="checked">Cambio de administradores</li>
                    </ul>
                </li>
                <li className="checked">Notificaciones en tiempo real
                    <ul className="indent-2">
                        <li className="checked">Mensajes
                            <ul className="indent-3">
                                <li className="checked">Hora de llegada</li>
                                <li className="checked">Contenido</li>
                                <li className="checked">Mensaje editado</li>
                                <li className="checked">Mensaje eliminado</li>
                                <li className="checked">Cantidad de mensajes nuevos</li>
                            </ul>
                        </li>
                    </ul>
                </li>
            </ul>
        </li>
    </ul>
</div>


<div className="frontend">

    <h1>Frontend</h1>
    <ul>
        <li className="checked">Configuración inicial</li>
        <li className="checked">Registro</li>
        <li className="checked">Uso de context</li>
        <li className="checked">Login</li>
        <li className="checked">Protected Routes</li>
        <li className="checked">Obtener datos del usuario y mostrarlos en diferentes nav</li>
        <li className="checked">ChatPage
            <ul className="indent-1">
                <li className="checked">Diseño de lista de chats</li>
                <li className="checked">Diseño de chat activo</li>
                <li className="checked">Diseño de barra de información de chat</li>
                <li className="checked">Dinamismo para abrir y cerrar secciones de chatpage</li>
                <li className="checked">Adaptación a celular</li>
                <li className="checked">Cambio de chat</li>
                <li className="checked">Cargar información de chat
                    <ul className="indent-2">
                        <li className="checked">Mensajes
                            <ul className="indent-3">
                                <li className="checked">Enviar mensajes</li>
                                <li className="checked">Cargar mensajes</li>
                                <li className="checked">Buscar Mensajes</li>
                                <li className="checked">Separar mensajes por dias</li>
                            </ul>
                        </li>
                    </ul>
                </li>
            </ul>
        </li>
        <li className="checked">Obtener la lista de chats</li>
        <li className="checked">Buscar chat</li>
        <li className="checked">Cuadro emergente para encontrar nuevos usuarios
            <ul className="indent-1">
                <li className="checked">Paginación</li>
            </ul>
        </li>
        <li className="checked">Carga de información del usuario del chat para la barra de información</li>
        <li className="checked">Información de usuario
            <ul className="indent-1">
                <li className="checked">Editar información
                    <ul className="indent-2">
                        <li className="checked">Estado</li>
                        <li className="checked">Foto de perfil</li>
                    </ul>
                </li>
            </ul>
        </li>
        <li className="checked">Chat
            <ul className="indent-1">
                <li className="checked">Crear chat</li>
                <li className="checked">Grupos
                    <ul className="indent-2">
                        <li className="checked">Crear grupo</li>
                        <li className="checked">Lista de miembros</li>
                        <li className="checked">Añadir miembros</li>
                        <li className="checked">Remover miembros</li>
                        <li className="checked">Editar grupo
                            <ul className="indent-3">
                                <li className="checked">Nombre</li>
                                <li className="checked">Descripción</li>
                                <li className="checked">Foto</li>
                                <li className="checked">Administradores</li>
                            </ul>
                        </li>
                    </ul>
                </li>
                <li className="checked">Eliminar chat</li>
                <li className="checked">Eliminar mensaje</li>
                <li className="checked">Editar mensaje</li>
            </ul>
        </li>
        <li className="checked">Presentación</li>
        <li className="checked">Loading states
            <ul className="indent-1">
                <li className="checked">Carga de lista de chats</li>
                <li className="checked">Carga de chat seleccionado</li>
                <li className="checked">Mensajes
                    <ul className="indent-2">
                        <li className="checked">Estado enviado de mensaje</li>
                        <li className="checked">Editar mensaje</li>
                        <li className="checked">Eliminar mensaje</li>
                        <li className="checked">Busqueda de mensajes</li>
                    </ul>
                </li>
                <li className="checked">Crear chat o grupo</li>
                <li className="checked">Cargar nuevos potenciales contactos</li>
            </ul>
        </li>
        <li className="checked">NOTIFICACIONES</li>
    </ul>


    <ul>
    <li className="checked">Chat global</li>
        <li className="checked">Cambios en tiempo real</li>
        <ul className="indent-1">
            <li className="checked">Lista de chats</li>
            <ul className="indent-2">
                <li className="checked">Prioridad al chat con mensaje reciente</li>
                <li className="checked">Información básica de mensaje</li>
            </ul>
            <li className="checked">Chats dm</li>
            <ul className="indent-2">
                <li className="checked">Mensajes</li>
                <li className="checked">Cambio de información de usuarios</li>
            </ul>
            <li className="checked">Grupos</li>
            <ul className="indent-2">
                <li className="checked">Mensajes</li>
                <li className="checked">Cambio de información de grupo</li>
                <li className="checked">Expulsión o adición de miembros</li>
                <li className="checked">Cambio de administradores</li>
            </ul>
        </ul>
        <li className="checked">Notificaciones en tiempo real</li>
        <ul className="indent-1">
            <li className="checked">Mensajes</li>
            <ul className="indent-2">
                <li className="checked">Hora de llegada</li>
                <li className="checked">Contenido</li>
                <li className="checked">Mensaje editado</li>
                <li className="checked">Mensaje eliminado</li>
                <li className="checked">Cantidad de mensajes nuevos</li>
            </ul>
        </ul>
        <li className="checked">Mejorar diseño</li>
        <ul className="indent-1">
            <li className="checked">Login</li>
            <li className="checked">Register</li>
        </ul>
        <li className="checked">Crear landing page</li>
    </ul>
</div>
</section>


    <Link className="hover:text-gray-500" to="https://criskop.com/#experience" target="_blank">Ver otros proyectos</Link>


      </section>


      <footer className="finalfooter">
        CrisKop ©
    </footer>


      </section>

    </div>
  )
}

export default HomePage