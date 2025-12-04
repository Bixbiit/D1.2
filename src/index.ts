/* import express, { Request, Response } from "express";

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
*/

import express, { Request, Response } from "express";

// Типы и константы
type dbVideo = {
    id: number,
    title: string,
    author: string,
    canBeDownloaded: boolean,
    minAgeRestriction: number | null,
    createdAt: string,
    publicationDate: string,
    availableResolutions: Resolution[];
}

enum Resolution {
    P144 = 'P144',
    P240 = 'P240',
    P360 = 'P360',
    P480 = 'P480',
    P720 = 'P720',
    P1080 = 'P1080',
    P1440 = 'P1440',
    P2160 = 'P2160'
}

type inputVideoData = {
    title: string,
    author: string,
    availableResolutions: Resolution[]
}

type updateVideoData = {
    title: string,
    author: string,
    availableResolutions: Resolution[],
    canBeDownloaded: boolean,
    minAgeRestriction: number | null,
    publicationDate: string
}

// Начальный массив db
const db: dbVideo[] = [
    {
        id: 1,
        title: '2342351',
        author: '235r23tfdssfa',
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: new Date().toISOString(),
        publicationDate: new Date().toISOString(),
        availableResolutions: [Resolution.P144]
    },
    {
        id: 2,
        title: '2342351',
        author: '235r23tfdssfa',
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: new Date().toISOString(),
        publicationDate: new Date().toISOString(),
        availableResolutions: [Resolution.P480]
    }
]

// Создаем сервер
const app = express();
app.use(express.json());

enum HttpStatus {
    OK = 200,
    Created = 201,
    NoContent = 204,
    BadRequest = 400,
    NotFound = 404,
    ServerError = 500
}

const myURL = {
    VIDEOS: '/videos',
    TEST: '/testing/all-data'
} as const;

// Маршруты
app.get(myURL.VIDEOS, (req: Request, res: Response) => {
    res.status(HttpStatus.OK).json(db);
});

app.get(`${myURL.VIDEOS}/:id`, (req: Request, res: Response) => {
    const idURL = Number(req.params.id);
    const video = db.find(v => v.id === idURL);
    if (!video) {
        return res.sendStatus(HttpStatus.NotFound);
    }
    res.status(HttpStatus.OK).json(video);
});

app.post(myURL.VIDEOS, (req: Request, res: Response) => {
    const errors = validatePost(req.body);
    if (errors.length > 0) {
        return res.status(HttpStatus.BadRequest).json({ errorsMessages: errors });
    }
    const createdAt = new Date();
    const publicationDate = new Date(createdAt.getTime() + 1000 * 60 * 60 * 24); // +1 день
    const newVideo: dbVideo = {
        id: new Date().getTime(),
        title: req.body.title,
        author: req.body.author,
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: createdAt.toISOString(),
        publicationDate: publicationDate.toISOString(),
        availableResolutions: req.body.availableResolutions
    }
    db.push(newVideo);
    res.status(HttpStatus.Created).json(newVideo);
});

app.put(`${myURL.VIDEOS}/:id`, (req: Request, res: Response) => {
    const idURL = Number(req.params.id);
    const index = db.findIndex(el => el.id === idURL);
    if (index === -1) {
        return res.sendStatus(HttpStatus.NotFound);
    }
    const errors = validateUpdateVideo(req.body);
    if (errors.length > 0) {
        return res.status(HttpStatus.BadRequest).json({ errorsMessages: errors });
    }
    db[index] = {
        ...db[index],
        ...req.body
    };
    res.sendStatus(HttpStatus.NoContent);
});

app.delete(`${myURL.VIDEOS}/:id`, (req: Request, res: Response) => {
    const idURL = Number(req.params.id);
    const index = db.findIndex(el => el.id === idURL);
    if (index === -1) {
        return res.sendStatus(HttpStatus.NotFound);
    }
    db.splice(index, 1);
    res.sendStatus(HttpStatus.NoContent);
});

app.delete(myURL.TEST, (req: Request, res: Response) => {
    db.length = 0;
    res.sendStatus(HttpStatus.NoContent);
});

// Валидация
function validatePost(body: any): { message: string, field: string }[] {
    const errors: { message: string, field: string }[] = [];
    if (!body.title || body.title.length > 40) {
        errors.push({ message: 'Incorrect title', field: 'title' });
    }
    if (!body.author || body.author.length > 20) {
        errors.push({ message: 'Incorrect author', field: 'author' });
    }
    if (!Array.isArray(body.availableResolutions) || body.availableResolutions.length < 1) {
        errors.push({ message: `Incorrect availableResolutions: it's not array or empty`, field: 'availableResolutions' });
    } else {
        const allowed = Object.values(Resolution);
        const invalid = body.availableResolutions.filter((el: any) => !allowed.includes(el));
        if (invalid.length > 0) {
            errors.push({ message: `Incorrect availableResolutions: ${invalid.join(', ')}`, field: 'availableResolutions' });
        }
    }
    return errors;
}

function validateUpdateVideo(body: any): { message: string, field: string }[] {
    const errors = validatePost(body);
    if (typeof body.canBeDownloaded !== "boolean") {
        errors.push({ message: 'incorrect type data in canBeDownloaded', field: 'canBeDownloaded' });
    }
    if (body.minAgeRestriction !== null && (body.minAgeRestriction < 1 || body.minAgeRestriction > 18)) {
        errors.push({ message: 'incorrect minAgeRestriction', field: 'minAgeRestriction' });
    }
    if (typeof body.publicationDate !== "string" || isNaN(Date.parse(body.publicationDate))) {
        errors.push({ message: "Incorrect publicationDate", field: "publicationDate" });
    }
    return errors;
}

// Запуск сервера
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порте: ${PORT}`);
});