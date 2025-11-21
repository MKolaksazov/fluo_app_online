const express = require('express');
const app = express();
app.get('/', (req,res)=>res.send('ok'));
app.listen(3030, '0.0.0.0', ()=>console.log('running'));
