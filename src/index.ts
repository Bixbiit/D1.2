import express, { Request, Response } from "express";

const app = express();
app.use(express.json());

const port = 8080;

// Объявим enum и типы
enum Resolution {
    P144='P144', P240='P240', P360='P360', P480='P480', P720='P720', P1080='P1080', P1440='P1440', P2160='P2160'
}

type Video = {
    id: number,
    title: string,
    author: string,
    canBeDownloaded: boolean,
    minAgeRestriction: number | null,
    createdAt: string,
    publicationDate: string,
    availableResolutions: Resolution[]
}

// Начальный массив данных
let videos: Video[] = [
    { id: 1, title: 'Test1', author: 'Author1', canBeDownloaded: false, minAgeRestriction: null, createdAt: new Date().toISOString(), publicationDate: new Date().toISOString(), availableResolutions: [Resolution.P144] },
    { id: 2, title: 'Test2', author: 'Author2', canBeDownloaded: false, minAgeRestriction: null, createdAt: new Date().toISOString(), publicationDate: new Date().toISOString(), availableResolutions: [Resolution.P480] }
];

// Помощники
const findVideoById = (id: number) => videos.find(v => v.id === id);
const generateId = () => Date.now();

// Стандартизованный ответ об ошибках
const errorResponse = (msg: string) => ({ errorsMessages: [{ message: msg, field: 'unknown' }] });

// Получение всех видео
app.get('/videos', (req, res) => res.json(videos));

// Получение по ID
app.get('/videos/:id', (req, res) => {
    const id = Number(req.params.id);
    const v = findVideoById(id);
    if (!v) return res.sendStatus(404);
    res.json(v);
});

// Удаление всех данных
app.delete('/testing/all-data', (req, res) => {
    videos = [];
    res.sendStatus(204);
});

// Создать видео
app.post('/videos', (req, res) => {
    const { title, author, availableResolutions } = req.body;

    if (!title || title.length > 40) return res.status(400).json(errorResponse('Incorrect title'));
    if (!author || author.length > 20) return res.status(400).json(errorResponse('Incorrect author'));
    if (!Array.isArray(availableResolutions) || availableResolutions.length === 0) return res.status(400).json(errorResponse('Incorrect availableResolutions'));

    const newVideo: Video = {
        id: generateId(),
        title,
        author,
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: new Date().toISOString(),
        publicationDate: new Date(Date.now() + 86400000).toISOString(), // +1 день
        availableResolutions
    };
    videos.push(newVideo);
    res.status(201).json(newVideo);
});

// Обновить видео
app.put('/videos/:id', (req, res) => {
    const id = Number(req.params.id);
    const video = findVideoById(id);
    if (!video) return res.sendStatus(404);

    const { title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate } = req.body;

    // Простая проверка
    if (typeof title !== 'string' || title.length > 40) return res.status(400).json(errorResponse('Incorrect title'));
    if (typeof author !== 'string' || author.length > 20) return res.status(400).json(errorResponse('Incorrect author'));
    if (!Array.isArray(availableResolutions) || availableResolutions.length === 0) return res.status(400).json(errorResponse('Incorrect availableResolutions'));
    if (typeof canBeDownloaded !== 'boolean') return res.status(400).json(errorResponse('Incorrect canBeDownloaded'));
    if (typeof minAgeRestriction !== 'number' && minAgeRestriction !== null) return res.status(400).json(errorResponse('Incorrect minAgeRestriction'));
    if (isNaN(Date.parse(publicationDate))) return res.status(400).json(errorResponse('Incorrect publicationDate'));

    // Обновление
    Object.assign(video, {
        title,
        author,
        availableResolutions,
        canBeDownloaded,
        minAgeRestriction,
        publicationDate
    });
    res.sendStatus(204);
});

// Удаление видео
app.delete('/videos/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = videos.findIndex(v => v.id === id);
    if (index === -1) return res.sendStatus(404);
    videos.splice(index, 1);
    res.sendStatus(204);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});