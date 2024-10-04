const express = require('express');
const fs = require('fs');
const path = require('path'); 
const app = express();
const port = 3000;


app.use(express.json());

// directorio absoluto
const animeFilePath = path.join(__dirname, 'anime.json');


const readAnimeData = () => {
    const data = fs.readFileSync(animeFilePath);
    return JSON.parse(data);
};


const writeAnimeData = (data) => {
    fs.writeFileSync(animeFilePath, JSON.stringify(data, null, 2));
};

// Operaciones CRUD

// Obtener todos datos
app.get('/anime', (req, res) => {
    const animeData = readAnimeData();
    res.json(animeData);
});

// Obtener datos por ID
app.get('/anime/:id', (req, res) => {
    const animeData = readAnimeData();
    const { id } = req.params;
    const anime = animeData[id];

    if (anime) {
        res.json(anime);
    } else {
        res.status(404).json({ message: 'Anime no encontrado' });
    }
});

// Añadir un nuevo anime
app.post('/anime', (req, res) => {
    const animeData = readAnimeData();
    const nuevoAnime = req.body;
    const nuevoId = Object.keys(animeData).length + 1;

    animeData[nuevoId] = nuevoAnime;
    writeAnimeData(animeData);

    res.status(201).json({ message: 'Anime agregado', anime: nuevoAnime });
});

// Actualizar un anime existente por ID
app.put('/anime/:id', (req, res) => {
    const animeData = readAnimeData();
    const { id } = req.params;

    if (animeData[id]) {
        animeData[id] = req.body;
        writeAnimeData(animeData);
        res.json({ message: 'Anime actualizado', anime: animeData[id] });
    } else {
        res.status(404).json({ message: 'Anime no encontrado' });
    }
});

// Eliminar un anime por ID
app.delete('/anime/:id', (req, res) => {
    const animeData = readAnimeData();
    const { id } = req.params;

    if (animeData[id]) {
        delete animeData[id];
        writeAnimeData(animeData);
        res.json({ message: 'Anime eliminado' });
    } else {
        res.status(404).json({ message: 'Anime no encontrado' });
    }
});


app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
