const express = require('express')
const app = express()
const connectToDatabase = require('./database')
const Book = require('./model/bookModel')
require('dotenv').config()
// multerConfig imports
const { multer, storage } = require('./middleware/multerConfig')
const upload = multer({storage: storage})
const fs = require('fs')




app.use(express.json())
connectToDatabase()

app.get('/', (req, res) => {
    res.status(200).json({
        message : "Success"
    })
})

// Post API
app.post('/book', upload.single('image'), async (req, res) => {
    if(!req.file){
        fileName = 'https://cdn.mos.cms.futurecdn.net/i26qpaxZhVC28XRTJWafQS-800-80.jpeg'
    } else {
        fileName = `http://localhost:3000/${req.file.filename}`
    }
    const {bookName, bookPrice, isbnNumber, authorName, publishedAt} = req.body
    await Book.create({
        bookName,
        bookPrice,
        isbnNumber,
        authorName,
        publishedAt,
        imageUrl : fileName
    })
    res.status(200).json({
        message : "Book created successfully"
    })
})

// All get API
app.get('/book', async (req, res) =>{
    const books = await Book.find()
    res.status(200).json({
        message : "Books fetched successfully",
        data : books
    })
})

// Single get API
app.get('/book/:id', async (req, res) => {
    const { id } = req.params
    const book = await Book.findById(id)
    try {
        if (!book) {
            res.status(404).json({
                message: "Book Not Found"
            })
        } else {
            res.status(200).json({
                message: "Single book fetched successfully",
                data: book
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong"
        })
    }
})

// Delete API
app.delete('/book/:id', async (req, res) => {
    try {
        const {id} = req.params
        const book = await Book.findById(id)
        if(!book.imageUrl.includes('https:')){
            fs.unlink(`./storage/${book.imageUrl.slice('http://localhost:3000/'.length)}`, (err)=>{
                if(err){
                    console.log("Failed to delete book image")
                } else {
                    console.log("Book image deleted successfully")
                }
            })
        }
        await Book.findByIdAndDelete(id)
        res.status(200).json({
            message : 'Book deleted successfully'
        })
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong"
        })
    }
})

// Update API
app.patch('/book/:id', upload.single('image'), async (req, res) => {
    const {id} = req.params
    const oldBook = await Book.findById(id)
    let filename = oldBook.imageUrl
    if(req.file){
        filename = `http://localhost:3000/${req.file.filename}`
        if(!oldBook.imageUrl.includes('https:')){
            fs.unlink(`./storage/${oldBook.imageUrl.slice('http://localhost:3000/'.length)}`, (err) => {
                if(err){
                    console.log("Failed to delete the file")
                } else {
                    console.log("File deleted successfully")
                }
            })
        }
    }
    const {bookName, bookPrice, isbnNumber, authorName, publishedAt} = req.body
    await Book.findByIdAndUpdate(id, {
        bookName,
        bookPrice,
        isbnNumber,
        authorName,
        publishedAt,
        imageUrl : filename
    })
    res.status(200).json({
        message : "Book updated successfully"
    })
})




// To access the images of storage folder from the browser
app.use(express.static('./storage'))



app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running on port 3000')
})




