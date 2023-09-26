import express from 'express'
import { getEmpresas, createEmpresa } from '../controllers/empresas.js'

const router = express.Router()

router.get('/', getEmpresas)
router.post('/', createEmpresa)

export default router
