const express = require('express');
const router = express.Router();
const csv = require('csv-parser');
const { Readable } = require('stream'); // Трябва ни за да създадем виртуален стрим от стринга
const db = require('../db');

// Уверете се, че използвате това във Вашия главен app.js файл!
// app.use(express.json());

// Маршрутът вече очаква JSON в тялото на заявката
router.post('/upload-csv', async (req, res) => {
    // 1. Взимаме CSV стринга от тялото на заявката
    const csvText = req.body.csvText; 
    const fileName = req.body.csvName || 'uploaded_data.csv';
    
    if (!csvText) {
        return res.status(400).json({ status: 'error', message: 'CSV text is missing from the request body.' });
    }

    const jsonResults = [];
    
    // 2. Създаване на Readable Stream от CSV стринга
    // Това е ключовата стъпка: csv-parser работи със стриймове, 
    // затова превръщаме стринга във виртуален стрим за четене.
    const stream = Readable.from(csvText);

    try {
        // 3. Парсване на стрийма с csv-parser
        await new Promise((resolve, reject) => {
            stream
                .pipe(csv({ 
                    separator: '\t', // Указваме табулацията като разделител
                    quote: ''        // Изключваме кавичките, ако са проблем
                }))
                .on('data', (data) => jsonResults.push(data))
                .on('end', () => {
                    resolve();
                })
                .on('error', (err) => {
                    reject(err);
                });
        });

        // 4. Логика за запазване на данните в базата (както при Multer)
        const jsonString = JSON.stringify(jsonResults);
        
        // *Примерна* логика за DB запис
        const [result] = await db.query('INSERT INTO data_storage (json_data, filename, created_at) VALUES (?, ?, NOW())', 
            [jsonString, fileName]);
        
        const dummyResult = { insertId: 101 };

        res.json({ 
            status: 'ok', 
            //id: dummyResult.insertId, 
            rows: jsonResults.length 
        });

    } catch (err) {
        console.error('CSV Parsing/DB Error:', err);
        res.status(500).json({ status: 'error', message: 'Error processing data.' });
    }
});

// Пример в router.js
router.delete('/data/:id/csv', async (req, res) => {
    try {
        const recordId = req.params.id; // Взимаме ID-то от URL-а

        // ⭐ SQL Заявка за изтриване
        await db.query('DELETE FROM data_storage WHERE id = ?', [recordId]);

        // Пример:
        const affectedRows = 1; 

        if (affectedRows === 0) {
            return res.status(404).json({ message: 'Record not found.' });
        }
        
        // Връщаме 204 No Content или 200 OK
        res.status(200).json({ status: 'ok', message: `Record ${recordId} deleted successfully.` });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

module.exports = router;
