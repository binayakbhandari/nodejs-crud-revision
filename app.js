const express = require('express')
const app = express()
const connectToDatabase = require('./database')
const Book = require('./model/bookModel')
require('dotenv').config()
// multerConfig imports
const { multer, storage } = require('./middleware/multerConfig')
const upload = multer({storage: storage})




app.use(express.json())
connectToDatabase()

app.get('/', (req, res) => {
    res.status(200).json({
        message : "Success"
    })
})
// post api
app.post('/book', upload.single('image'), async (req, res) => {
    const {bookName, bookPrice, isbnNumber, authorName, publishedAt} = req.body
    console.log(req.body)
    await Book.create({
        bookName,
        bookPrice,
        isbnNumber,
        authorName,
        publishedAt
    })
    res.status(200).json({
        message : "Book created successfully"
    })
})
// get api
app.get('/book', async (req, res) =>{
    const books = await Book.find()
    res.status(200).json({
        message : "Books fetched successfully",
        data : books
    })
})

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

app.delete('/book/:id', async (req, res) => {
    const {id} = req.params
    await Book.findByIdAndDelete(id)
    try {
        res.status(200).json({
        message : 'Book deleted successfully'
    })
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong"
        })
    }
})

app.patch('/book/:id', async (req, res) => {
    const {id} = req.params
    const {bookName, bookPrice, isbnNumber, authorName, publishedAt} = req.body
    await Book.findByIdAndUpdate(id, {
        bookName,
        bookPrice,
        isbnNumber,
        authorName,
        publishedAt
    })
    res.status(200).json({
        message : "Book updated successfully"
    })
    
})








app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running on port 3000')
})




