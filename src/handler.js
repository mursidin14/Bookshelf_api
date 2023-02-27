const { nanoid } = require('nanoid');
const books = require('./books');


// add book
const addBookApi = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
  
    const id = nanoid(16);
    const finished = pageCount === readPage ? true : false
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
  
    const newBook = {
      id, name, year, author, summary, publisher, pageCount, readPage, reading, finished, insertedAt, updatedAt
    }

    if (name === undefined) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku'
      })
      response.code(400)
      return response
    }
  
    if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
      })
      response.code(400)
      return response
    }
  
    books.push(newBook)
  
    const isSucces = books.filter((book) => book.id === id).length > 0
  
    if (isSucces) {
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id
        }
      })
      response.code(201)
      return response
    }

    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku',
  });
  
  response.code(404)
  return response;
}


// get books
const getAllBooksHandler = (request, h) => {
    
    const response = h.response({
        status: 'success',
        data: {
            books: books.map((book) => {
              return {
                id: book.id,
                name: book.name,
                publisher: book.publisher
              }
              })
        },
    })

    response.code(200);
    return response;
}


// detail book
const getBookByIdHandler = (request, h) => {
    const { bookId  } = request.params;

    const book = books.filter((n) => n.id === bookId)[0];

    if(book !== undefined){
        const response = h.response({
          status: 'success',
            data: {
                book,
            },
        })
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });
    
    response.code(404)
    return response;
}


// edit book
const editBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const updatedAt = new Date().toISOString();

    if (name === undefined) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku'
      })
      response.code(400)
      return response
    }

    if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
      })
      response.code(400)
      return response
    }

    const index = books.findIndex((idx) => idx.id === bookId);
    if(index !== -1){
        books[index] = {
            ...books[index],
            name, 
            year, 
            author, 
            summary, 
            publisher, 
            pageCount, 
            readPage, 
            reading,
            updatedAt,
        };

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui'
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    
    response.code(404)
    return response;

};


// delete book
const deleteBookHandler = (request, h) => {
    const { bookId } = request.params;

    const index = books.findIndex((idx) => idx.id === bookId);
    if(index !== -1){
        books.splice(index, 1);

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
}



module.exports = { addBookApi, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookHandler };