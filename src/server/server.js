import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const dataPath = path.join(__dirname, 'data.json');
let categories = {};

try {
    const data = fs.readFileSync(dataPath, 'utf8');
    categories = JSON.parse(data);
    console.log('Datos de categorías cargados exitosamente.');
} catch (error) {
    console.error('Error al cargar data.json. Asegúrate de que existe en el directorio de "server.js":', error.message);
}

app.get('/api/categories', (req, res) => {
    console.log('Petición recibida en /api/categories');
    if (Object.keys(categories).length === 0) {
        return res.status(503).json({ 
            success: false, 
            message: 'Error: Las categorías no se pudieron cargar desde el servidor.' 
        });
    }
    res.json({
        success: true,
        data: categories
    });
});

app.get('/', (req, res) => {
    res.send('Servidor Express para el Juego de Memoria corriendo.');
});

app.listen(PORT, () => {
    console.log(`Servidor Express corriendo en http://localhost:${PORT}`);
});