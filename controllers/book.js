const Book = require('../models/Book');
const fs = require('fs');
const API_URL = process.env.NODE_ENV === 'prod' ? process.env.URL_PROD_API : 'http://locahost:4000'

exports.getAllBook = (req, res, next) => {
  Book.find()
    .then(books => {
      console.log('process.env.NODE_ENV:', process.env.NODE_ENV)
      if (process.env.NODE_ENV === 'prod') {
        books.forEach(item => {
          const fileName = item.imageUrl.split('http://localhost:4000/images/')[1]
          item.imageUrl = `${API_URL}/images/${fileName}`
        });
      }

      res.status(200).json(books)
    })
    .catch(error => res.status(400).json({ error }));
};

exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);

  console.log("${req.protocol}:", req.protocol)
  console.log("req.get('host'):", req.get('host'))
  console.log("${req.file.filename}:", req.file.filename)

  const book = new Book({
    ...bookObject,
    imageUrl: `http://localhost:4000/images/${req.file.filename}`
  });

  book.save()
    .then(() => { res.status(201).json({ message: 'Objet enregistré !' }) })
    .catch(error => { res.status(400).json({ error }) })
};

exports.getOneBook = (req, res, next) => {
  Book.findById(req.params.id)
    .then(book => {
      if (!book) {
        return res.status(404).json({ error: 'Book not found' });
      }

      console.log('process.env.NODE_ENV:', process.env.NODE_ENV)
      if (process.env.NODE_ENV === 'prod') {
        const fileName = book.imageUrl.split('http://localhost:4000/images/')[1]
        book.imageUrl = `${API_URL}/images/${fileName}`
      }

      res.status(200).json(book);
    })
    .catch(error => res.status(500).json({ error }));
};

exports.getTopBook = (req, res, next) => {
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then((books) => {
      res.status(200).json(books);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.updateBook = (req, res, next) => {
  const book = req.file
    ? {
      ...JSON.parse(req.body.book),
      imageUrl: `http://localhost:4000/images/${req.file.filename
        }`,
    }
    : { ...req.body };

  Book.updateOne({ _id: req.params.id }, { ...book, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Livre mis à jour !' }))
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.imageUrl) {
        const filename = book.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Livre supprimé !' }))
            .catch((error) => res.status(400).json({ error }));
        });
      } else {
        Book.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Livre supprimé !' }))
          .catch((error) => res.status(400).json({ error }));
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.rateBook = (req, res, next) => {
  const userId = req.body.userId;
  const rating = parseInt(req.body.rating);

  if (isNaN(rating) || rating < 0 || rating > 5) {
    return res.status(400).json({ message: 'La note doit être comprise entre 0 et 5.' });
  }

  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        return res.status(404).json({ message: 'Livre non trouvé.' });
      }

      const existingRating = book.ratings.find((rating) => rating.userId === userId);

      if (existingRating) {
        return res.status(400).json({ message: "L'utilisateur a déjà noté ce livre." });
      }

      book.ratings.push({ userId, grade: rating });
      book.averageRating = parseFloat((book.ratings.reduce((sum, rating) => sum + rating.grade, 0) / book.ratings.length).toFixed(2));

      book.save()
        .then(() => {
          console.log('process.env.NODE_ENV:', process.env.NODE_ENV)
          if (process.env.NODE_ENV === 'prod') {
            const fileName = book.imageUrl.split('http://localhost:4000/images/')[1]
            book.imageUrl = `${API_URL}/images/${fileName}`
          }

          res.status(200).json(book)
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

