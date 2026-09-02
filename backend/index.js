require('dotenv').config()
const mongoDB = require('../backend/src/configs/mongo')
const app = require('../backend/src/app')

const PORT = process.env.PORT || 3000;
mongoDB()
app.listen(PORT, () => {
    console.log(`server running: http://localhost:${PORT}`)
})
