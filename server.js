const express = require("express")
const fileUpload = require("express-fileupload")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")

// Routes
const authRoute = require("./src/routes/authRouter")
const userRoute = require("./src/routes/userRoter")
const chatCtrl = require("./src/routes/chatRouter")
const messageRoute = require("./src/routes/messageRouter")
const postRoute = require("./src/routes/postRouter")
const uploadRoute = require("./src/routes/uploadRouter")

const app = express()

dotenv.config()

const PORT = process.env.PORT || 4000;

// to save files for public
app.use(express.static('src/public'))

// Middleware
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())
app.use(fileUpload())

// usage of routes
app.use("/auth", authRoute)
app.use("/user", userRoute)
app.use("/chat", chatCtrl)
app.use("/message", messageRoute)
app.use("/post", postRoute)
app.use("/upload", uploadRoute)

app.get('/', (req, res)=> {
  res.send('Chat app')
})

app.use((req, res, next) => {
  res.set({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, access_token",
      "Access-Control-Allow-Methods": "GET, POST, DELETE, PUT"
  })

  next()
})

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(()=> {
  app.listen(PORT, ()=> console.log(`Server started on port: ${PORT}`))
}).catch((error) => console.log(error))