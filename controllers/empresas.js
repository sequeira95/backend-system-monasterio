import { clienDb } from '../index.js'
import crypto from 'node:crypto'
import { encryptPassword } from '../utils/hashPassword.js'
import { senEmail } from '../utils/nodemailsConfing.js'

export const getEmpresas = async (req, res) => {
  try {
    const empresasCollection = await clienDb.collection('empresas')
    const empresas = await empresasCollection.find().toArray()
    return res.status(200).json(empresas)
  } catch (e) {
    console.log(e)
    return res.status(500).json({ error: 'Error de servidor' })
  }
}

export const createEmpresa = async (req, res) => {
  try {
    const { subDominio, nombreEmpresa, rif, email } = req.body
    const subDominiosCollection = await clienDb.collection('sub-dominios')
    // buscamos si el sub-dominio ya existe
    const verifySubDominio = await subDominiosCollection.findOne({ subDominio })
    // en caso de que exista, retornamos un error
    if (verifySubDominio) return res.status(400).json({ error: 'El sub-dominio ya existe' })
    // buscamos si el email ya existe
    const verifyEmail = await subDominiosCollection.findOne({ email })
    // en caso de que exista, retornamos un error
    if (verifyEmail) return res.status(400).json({ error: 'El email ya existe' })
    // en caso de que no exista, insertamos el sub-dominio
    const empresa = await subDominiosCollection.insertOne({ subDominio, nombreEmpresa, rif, email })
    const usuariosCollection = await clienDb.collection('usuarios')
    // generamos un password aleatorio
    const randomPassword = crypto.randomBytes(10).toString('hex')
    // encriptamos el password
    const password = await encryptPassword(randomPassword)
    // insertamos un usuario por defecto para la empresa
    const usuario = await usuariosCollection.insertOne({
      email,
      password,
      empresaId: empresa.insertedId,
      subDominio,
      nombre: nombreEmpresa
    })
    console.log(usuario)
    // enviamos el email con el password
    const emailConfing = {
      from: '"prueba 👻" <pruebaenviocorreonode@gmail.com>',
      to: email,
      subject: 'verifique cuenta de email',
      html: `
      <p>email: ${email}</p>
      <p>Contraseña: ${randomPassword}</p>
      `
    }
    await senEmail(emailConfing)
    return res.status(200).json({ empresa, usuario })
  } catch (e) {
    console.log(e)
    return res.status(500).json({ error: 'Error de servidor' })
  }
}
