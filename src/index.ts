import 'dotenv/config';
import { connectDatabase } from './config/database.js';
import app from './app.js';

const port = Number(process.env.PORT) || 3000;

const startServer = async (): Promise<void> => {
    await connectDatabase();
    app.listen(port, ()=> {
        console.log('Servidor escuchando en el puerto ' + port); 
    });
};

startServer().catch((error: unknown) => {
    console.error('❌ No se pudo iniciar el servidor:', error);
    process.exit(1);
});