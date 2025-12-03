import express, { Request, Response } from "express";

// =================== ЧТО ЗДЕСЬ =================== //
// Здесь располагаются типы и данные из db.ts

// Тип для видео
export type dbVideo = {
    id: number,
    title: string,
    author: string,
    canBeDownloaded: boolean,
    minAgeRestriction: number | null,
    createdAt: string,
    publicationDate: string,
    availableResolutions: Resolution[];
}

// Enum разрешений
export enum Resolution {
    P144 = 'P144',
    P240 = 'P240',
    P360 = 'P360',
    P480 = 'P480',
    P720 = 'P720',
    P1080 = 'P1080',
    P1440 = 'P1440',
    P2160 = 'P2160'
}

// Тип для данных, которые приходят при создании видео
export type inputVideoData = {
    title: string,
    author: string,
    availableResolutions: Resolution[]
}

// Тип для данных при обновлении видео
export type updateVideoData = {
    title: string,
    author: string,
    availableResolutions: Resolution[],
    canBeDownloaded: boolean,
    minAgeRestriction: number | null,
    publicationDate: string
}

// Начальные данные
export const db: dbVideo[] = [
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
];

// =================== Основной сервер =================== //
// Здесь ваш оригинальный код app.ts

export const app = express();
app.use(express.json());

export enum HttpStatus {
    OK = 200,
    Created = 201,
    NoContent = 204,
    BadRequest = 400,
    NotFound = 404,
    ServerError = 500
}

export enum myURL {
    VIDEOS = '/videos',
    TEST = '/testing/all-data'
}

// Маршрут получение списка видео
app.get(myURL.VIDEOS, (req: Request, res: Response) => {
    res.status(HttpStatus.OK).json(db);
});

// Маршрут получения видео по ID
app.get(`${myURL.VIDEOS}/:id`, (req: Request, res: Response) => {
    const idURL = Number(req.params.id);
    const video = db.find(v => v.id === idURL);

    if (!video) {
        return res.sendStatus(HttpStatus.NotFound);
    }

    res.status(HttpStatus.OK).json(video);
});

// Валидация данных для POST
function defaultValidatePost(body: inputVideoData) {
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
        const invalid = body.availableResolutions.filter(el => !allowed.includes(el));
        if (invalid.length > 0) {
            errors.push({ message: `Incorrect availableResolutions: ${invalid.join(', ')}`, field: 'availableResolutions' });
        }
    }

    return errors;
}

// Валидация данных для PUT
function validateUpdateVideo(body: updateVideoData) {
    const errors = defaultValidatePost(body);

    if (typeof body.canBeDownloaded !== "boolean") {
        errors.push({ message: 'incorrect type data in canBeDownloaded ', field: 'canBeDownloaded' });
    }

    if (body.minAgeRestriction !== null && (body.minAgeRestriction < 1 || body.minAgeRestriction > 18)) {
        errors.push({ message: 'incorrect minAgeRestriction ', field: 'minAgeRestriction' });
    }

    if (typeof body.publicationDate !== "string" || isNaN(Date.parse(body.publicationDate))) {
        errors.push({ message: "Incorrect publicationDate", field: "publicationDate" });
    }

    return errors;
}

// Маршрут добавления нового видео
app.post(myURL.VIDEOS, (req: Request, res: Response) => {
    const errors = defaultValidatePost(req.body);

    if (errors.length > 0) {
        return res.status(HttpStatus.BadRequest).json({ errorsMessages: errors });
    }

    const createdAt = new Date();
    const publicationDate = new Date(createdAt.getTime() + 1000 * 60 * 60 * 24); // +1 день

    const createVideo: dbVideo = {
        id: new Date().getTime(),
        title: req.body.title,
        author: req.body.author,
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: createdAt.toISOString(),
        publicationDate: publicationDate.toISOString(),
        availableResolutions: req.body.availableResolutions
    }

    db.push(createVideo);
    res.status(HttpStatus.Created).json(createVideo);
});

// Обновление видео по ID
app.put(`${myURL.VIDEOS}/:id`, (req: Request, res: Response) => {
    const idURL = Number(req.params.id);
    const index = db.findIndex(el => el.id === idURL);

    if (index === -1) {
        return res.sendStatus(HttpStatus.NotFound);
    }

    const data: updateVideoData = req.body;
    const errors = validateUpdateVideo(data);
    if (errors.length > 0) {
        return res.status(HttpStatus.BadRequest).json({ errorsMessages: errors })
    }

    db[index] = {
        ...db[index],
        ...req.body
    };

    res.sendStatus(HttpStatus.NoContent);
});

// Удаление видео по ID
app.delete(`${myURL.VIDEOS}/:id`, (req: Request, res: Response) => {
    const idURL = Number(req.params.id);
    const index = db.findIndex(el => el.id === idURL);

    if (index === -1) {
        return res.sendStatus(HttpStatus.NotFound);
    }

    db.splice(index, 1);
    res.sendStatus(HttpStatus.NoContent);
});

// Очистка всех данных
app.delete(myURL.TEST, (req: Request, res: Response) => {
    db.length = 0;
    res.sendStatus(HttpStatus.NoContent);
});

// =================== Запуск сервера =================== //

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порте: ${PORT}`);
});