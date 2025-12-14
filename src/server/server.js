import express from 'express';
import cors from 'cors';
import pool from './db.js'; // Importamos la conexión
import bcrypt from 'bcryptjs';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// --- AUTENTICACIÓN ---

// Registro
app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // Encriptar contraseña
        const hash = await bcrypt.hash(password, 10);
        
        const [result] = await pool.query(
            'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
            [username, email, hash]
        );
        res.json({ success: true, message: 'Usuario creado', userId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al registrar. El usuario o email ya existe.' });
    }
});

// Login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        
        if (users.length === 0) {
            return res.status(401).json({ success: false, message: 'Usuario no encontrado' });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
        }

        // Devolvemos datos básicos del usuario (sin el password)
        res.json({ 
            success: true, 
            user: { id: user.id, username: user.username, email: user.email } 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
});

// --- PUNTUACIONES ---

// Guardar Puntuación
app.post('/api/score', async (req, res) => {
    const { userId, game, score } = req.body;
    try {
        await pool.query(
            'INSERT INTO scores (user_id, game_type, score) VALUES (?, ?, ?)',
            [userId, game, score]
        );
        res.json({ success: true, message: 'Puntuación guardada' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al guardar puntuación' });
    }
});

// Top Global (Ranking)
app.get('/api/leaderboard/:game', async (req, res) => {
    const { game } = req.params;
    try {
        // Obtenemos los 5 mejores (menor puntaje es mejor en puzzle/memoria, ajusta DESC/ASC según el juego)
        // Asumimos que para Puzzle 'score' son movimientos (menor es mejor) -> ASC
        const order = (game === 'puzzle' || game === 'memory') ? 'ASC' : 'DESC';
        
        const [rows] = await pool.query(
            `SELECT u.username, s.score, s.created_at 
             FROM scores s 
             JOIN users u ON s.user_id = u.id 
             WHERE s.game_type = ? 
             ORDER BY s.score ${order} LIMIT 10`,
            [game]
        );
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al obtener ranking' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});