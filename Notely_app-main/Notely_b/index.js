const connectToMongoose = require('./db');
require('dotenv').config();

const express = require('express');
const cors = require('cors')
connectToMongoose();
const app = express();
const port = process.env.PORT || 5000;
app.use(cors())
app.use(express.json());

//Available Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/remainders', require('./routes/remainders'));

app.listen(port, () => {
  console.log(`Notely listening on port ${port}`)
})




































/* 
const connectToMongoose = require('./db');
const express = require('express);
const cors = require('cors);

connectToMongoose()

const app = express();
const port = 5000;
app.use(cors());
app.use(express.json());
app.listen(port,()=>
{
  console.log(`Notely listening on port ${port}`);

})
*/