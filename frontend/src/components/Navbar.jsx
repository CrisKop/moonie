import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function Navbar() {

   const {isAuthenticated, logout, user} = useAuth();

  return (
    <nav className="bgcolorcard flex justify-between py-5 px-10">
        <Link to="/levels"><h1 className="text-2xl font-bold hover:text-zinc-400">TheDasher</h1></Link>
        <ul className="flex gap-x-2">
            {isAuthenticated ? (
                <>
                <Link to="/profile" className="hover:text-zinc-400">{user.username}</Link>
                <li><Link to="/profile" className="px-4 py-1 bg-yellow-500 text-black rounded-md">Profile</Link></li>
                <li><Link to="/upload" className="px-4 py-1 bg-yellow-500 text-black rounded-md">Upload Level</Link></li>
                <li><Link className="px-4 py-1 bg-yellow-500 text-black rounded-md" onClick={() => {logout();}}>Logout</Link></li>
                </>
            ) : (
                <>
                <li><Link to="/login" className="px-4 py-1 bg-yellow-500 text-black rounded-md">Login</Link></li>
                <li><Link to="/register" className="px-4 py-1 bg-yellow-500 text-black rounded-md">Register</Link></li>
                </>
            )}
        </ul>
    </nav>
  )
}

export default Navbar