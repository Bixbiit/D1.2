import express from 'express';

const app = express();
const PORT = 3000;

const humans = [{name: 'nik', age: 29,}]

app.get('/', (req, res) => {
  res.send('Ку, всем нашим, остальным соболезную(');
});

app.get('/humans', (req, res) => {
res.json(humans)
})

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});