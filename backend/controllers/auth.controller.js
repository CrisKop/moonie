import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { createAccessToken } from '../libs/jwt.js';
import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { io } from '../app.js';

export const register = async (req, res) => {
    const {password, username} = req.body
    console.log(req.body)

  try {

    const userFound = await User.findOne({username})
    if(userFound) return res.status(400).json(["The username already in use"])

    const passwordHash = await bcrypt.hash(password, 10)
    const newUser = new User({
        username,
        password: passwordHash,
        rank: "User"
    })
    
    const userSaved = await newUser.save();
    const token = await createAccessToken({id: userSaved._id});

    res.cookie('token', token, {
      sameSite: 'Lax',  // Establece SameSite en None
      secure: true,      // Asegura que la cookie solo se envíe sobre conexiones HTTPS
      // Otras opciones de configuración de la cookie, como expires o maxAge, si es necesario
    });

   // return res.sendStatus(200);

    return res.status(200).json({
    id: userSaved._id,
    username: userSaved.username,
    avatarURL: userSaved.avatarURL,
    status: userSaved.status,
    deletedchats: userSaved.deletedchats,
    token
  });
  } catch (error) {
    console.log(error)
   res.status(500).json([error.message]);
  }


}

export const login = async (req, res) => {
  const {username, password} = req.body

try {

  const userFound = await User.findOne({username})

  if(!userFound) return res.status(400).json(["User not found"])

  const isMatch = await bcrypt.compare(password, userFound.password)

  if(!isMatch) return res.status(400).json(["Incorrect Password"])

  const token = await createAccessToken({id: userFound._id});

  res.cookie('token', token, {
    sameSite: 'Lax',  // Establece SameSite en None
    secure: true,      // Asegura que la cookie solo se envíe sobre conexiones HTTPS
    // Otras opciones de configuración de la cookie, como expires o maxAge, si es necesario
  });

 // return res.sendStatus(200);

  res.status(200).json({
    id: userFound._id,
    username: userFound.username,
    avatarURL: userFound.avatarURL,
    status: userFound.status,
    deletedchats: userFound.deletedchats,
    token
  });
} catch (error) {
 res.status(500).json([error.message]);
}


}

export const logout = (req, res) => {

  res.cookie('token', "", {
    sameSite: 'Lax',  // Establece SameSite en None
    secure: true,      // Asegura que la cookie solo se envíe sobre conexiones HTTPS
    expires: new Date(0)
    // Otras opciones de configuración de la cookie, como expires o maxAge, si es necesario
  });
  return res.sendStatus(200);
}

export const editUserInfo = async (req, res) => {
  const { socketID } = req.body;

  let {userstosendSocket, status} = req.body;

  userstosendSocket = userstosendSocket && userstosendSocket.length > 0 && JSON.parse(userstosendSocket);

  if(status && status === "No hay un estado actualmente."){
    status = null
  }
  // Verificar si se proporcionó un archivo
  let imageUrl = '';
  if (req.file) {
    // Si se proporcionó un archivo, obtener la URL de Cloudinary
    imageUrl = req.file.path; // En CloudinaryStorage, el campo 'path' contiene la URL del archivo en Cloudinary
  } else {
    // Si no se proporcionó un archivo, puedes manejarlo según tus necesidades. Por ejemplo, puedes asignar una imagen predeterminada.
    imageUrl = ""
  }

  // Actualizar la información del usuario en la base de datos
  try {

    if(imageUrl.length < 1){
      const updatedUserStatus = await User.updateOne({ _id: req.user.id }, { $set: { status: status } });

      if(userstosendSocket && userstosendSocket.length > 0){
        userstosendSocket.forEach((user) => {
          io.to(user.toString()).emit("userDataChange", { socketID: socketID, userid: req.user.id, status: status, avatarURL: "No change" })
        })
      }

      return res.status(200).json({ status: status, avatarURL: null });
    }

    const updatedUserStatus = await User.updateOne({ _id: req.user.id }, { $set: { status: status, avatarURL: imageUrl } });

    if(userstosendSocket && userstosendSocket.length > 0){
      userstosendSocket.forEach((user) => {
        io.to(user.toString()).emit("userDataChange", {  socketID: socketID, userid: req.user.id, status: status, avatarURL: imageUrl })
      })
    }
    return res.status(200).json({ status: status, avatarURL: imageUrl });
   
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error updating user information.' });
  }
};


export const getUserData = async (id) => {
  const userFound = await User.findById(id)

  if(!userFound) return ["User not found"]

  return {
    id: userFound._id,
    username: userFound.username,
    avatarURL: userFound.avatarURL,
    createdAt: userFound.createdAt,
    updatedAt: userFound.updatedAt,
    status: userFound.status
  }
  res.send('profile')
}


export const get10Users = async (page, search, user) => {
  let userFound;
  page = parseInt(page)
  console.log(page)
  let usersskip = page === 1 ? 0 : (page * 10) - 10;

  if(search){
    userFound = await User.find({ 
      username: { $regex: search, $options: "i" },
      _id: { $ne: user } // Filtra los usuarios cuyo _id no sea igual al de req.user.id
  })
  .skip(usersskip)
  .limit(10)
  .select('_id username avatarURL status');
  }

  if(!search){
    userFound = await User.find({ 
      _id: { $ne: user } // Filtra los usuarios cuyo _id no sea igual al de req.user.id
  })
  .skip(usersskip)
  .limit(10)
  .select('_id username avatarURL status');
  }

  if(!userFound){
    return null;
  }

  console.log(userFound)


  

  return userFound;
}

export const getUsername = async (userid) => {
  const data = await User.findById(userid).select('username')

  return data.username
}


export const deletechat = async (userid, chatid, date) => {
  const lastDeletionDeleteMessages = date === true ? Date.now() : null;
  console.log(date,lastDeletionDeleteMessages)
   date = Date.now();

   

  

  // Busca el usuario
const userFound = await User.findById(userid);

// Verifica si el usuario existe
if (!userFound) {
  return null;
}

// Busca el índice del elemento con el mismo chatid en el array deletedchats
const existingIndex = userFound.deletedchats.findIndex(entry => entry[0] === chatid);

// Verifica si ya existe un elemento con el mismo chatid
if (existingIndex !== -1) {
  // Si existe, actualiza el segundo elemento del array
  userFound.deletedchats[existingIndex][1] = date;
  if(lastDeletionDeleteMessages !== null){
    userFound.deletedchats[existingIndex][2] = lastDeletionDeleteMessages;
  }
 
} else {
  // Si no existe, agrega el nuevo array completo
 userFound.deletedchats.push([chatid, date, lastDeletionDeleteMessages]);
}

// Guarda los cambios en la base de datos
const updatedUser = await User.updateOne(
  // Filtra el usuario por su _id
  { _id: userid },

  // Actualiza el valor de deletedchats
  { $set: { deletedchats: userFound.deletedchats } }
);


  return userFound.deletedchats;
}

export const verifyToken = async (req, res) => {
  const {token} = req.cookies

  if(!token) return res.status(401).json(["Unauthorized"])

  jwt.verify(token, TOKEN_SECRET, async (err, user) => {
    if(err) return res.status(401).json(["Unauthorized"]);

    const userFound = await User.findById(user.id)
    if(!userFound) return res.status(401).json(["Unauthorized"]);

    return res.json({
      id: userFound._id,
      username: userFound.username,
      avatarURL: userFound.avatarURL,
      status: userFound.status,
      deletedchats: userFound.deletedchats
    });
  });
};