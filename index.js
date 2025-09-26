import express from "express";
import cors from "cors";
import db from "./config/db.js";

/***
 * Rutas  
 */
import userRoutes from './auth/routes/userRoutes.js';
import authRoutes from './auth/routes/authRoutes.js';
// import rolRoutes from './auth/routes/rolRoutes.js';


/* Rutas del módulo Comercial */
import lotteryParticipationsRoutes from './modules/maestras/LotteryParticipation/lotteryParticipationsRoutes.js';

/*** Crear app   */
const app = express();

app.use('/api_comercial', express.static('public'));

/*** Habilitar CORS para todas las rutas   */
app.use(cors());


// Habilitar express.json para parsear JSON
/*** Conexión a la base de datos y eliminación de índices duplicados  */
app.use(express.json());



/*** Conexión a las bases de datos */
//Conexion a la base de datos Manzanares
try {
    await db.authenticate();
    db.sync();
    console.info('✅ Conexión exitosa a la base de datos Comercial')
} catch (error) {
    console.error('❌ Error conexión Manzanares:', error)
}



/*** Rutas Autenticacion */
app.use('/api_comercial/users', userRoutes);
app.use('/api_comercial/auth', authRoutes);



/***  Rutas del sistema */
app.use('/api_comercial/lottery-participations', lotteryParticipationsRoutes);

// hola
/***
 * Configurar puerto y levantar servidor
 */
const port = process.env.PORT || 3010;
app.listen(port, () => {
    console.log(`Escuchando en el puerto ${port}`);
});

/***
 * Rutas principales
 */
app.get('/api_comercial', (req, res) => {
    res.send("Hola api_comercial te encuentras ON");
});
