import Hapi from "@hapi/hapi";
import { nanoid } from "nanoid";
import { buildResponse } from "./utils";
import books from "./books";
import { Book } from "./types";
import { upsertBookSchema } from "./schema";

type HapiHandler = Hapi.ServerRoute["handler"];

export const getAllBooks: HapiHandler = (req, h) => {
  const { finished, reading, name } = req.query;
  const isFinished = finished ? Boolean(Number(finished)) : undefined;
  const isReading = reading ? Boolean(Number(reading)) : undefined;

  const transformedBooks = books
    .filter((book) =>
      name === undefined || typeof name !== "string"
        ? true
        : book.name.toLowerCase().includes(name.toLowerCase())
    )
    .filter((book) =>
      isFinished === undefined ? true : book.finished === isFinished
    )
    .filter((book) =>
      isReading === undefined ? true : book.reading === isReading
    )
    .map((book) => ({
      id: book.id,
      publisher: book.publisher,
      name: book.name,
    }));
  return h
    .response(buildResponse("success", undefined, { books: transformedBooks }))
    .code(200);
};

export const getBookById: HapiHandler = (req, h) => {
  const { bookId } = req.params;
  const book = books.find((b) => b.id === bookId);
  if (!book)
    return h.response(buildResponse("fail", "Buku tidak ditemukan")).code(404);
  return h.response(buildResponse("success", undefined, { book }));
};

export const deleteBook: HapiHandler = (req, h) => {
  const { bookId } = req.params;
  const bookIdx = books.findIndex((b) => b.id === bookId);
  if (bookIdx === -1)
    return h
      .response(buildResponse("fail", "Buku gagal dihapus. Id tidak ditemukan"))
      .code(404);

  books.splice(bookIdx, 1);

  return h
    .response(buildResponse("success", "Buku berhasil dihapus"))
    .code(200);
};

export const addBook: HapiHandler = (req, h) => {
  const payload = req.payload;
  const currTime = new Date().toISOString();

  const data = upsertBookSchema.safeParse(payload);

  if (!data.success) {
    if (data.error.flatten().fieldErrors.name) {
      return h
        .response(
          buildResponse("fail", "Gagal menambahkan buku. Mohon isi nama buku")
        )
        .code(400);
    }
    return h.response(buildResponse("fail", "Bad Request")).code(400);
  }

  const { data: bookData } = data;
  if (bookData.readPage > bookData.pageCount) {
    return h
      .response(
        buildResponse(
          "fail",
          "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"
        )
      )
      .code(400);
  }

  const id = nanoid(16);
  const newBook: Book = {
    ...bookData,
    id,
    finished: bookData.pageCount === bookData.readPage,
    insertedAt: currTime,
    updatedAt: currTime,
  };

  books.push(newBook);

  const isSuccess = Boolean(books.find((book) => book.id === newBook.id));

  if (!isSuccess)
    h.response(buildResponse("error", "Buku gagal ditambahkan")).code(500);

  return h
    .response(
      buildResponse("success", "Buku berhasil ditambahkan", { bookId: id })
    )
    .code(201);
};

export const updateBook: HapiHandler = (req, h) => {
  const { bookId } = req.params;
  const payload = req.payload;
  const bookIdx = books.findIndex((b) => b.id === bookId);

  if (bookIdx === -1)
    return h
      .response(
        buildResponse("fail", "Gagal memperbarui buku. Id tidak ditemukan")
      )
      .code(404);

  const data = upsertBookSchema.safeParse(payload);

  if (!data.success) {
    if (data.error.flatten().fieldErrors.name) {
      return h
        .response(
          buildResponse("fail", "Gagal memperbarui buku. Mohon isi nama buku")
        )
        .code(400);
    }
    return h.response(buildResponse("fail", "Bad Request")).code(400);
  }

  const { data: bookData } = data;
  if (bookData.readPage > bookData.pageCount) {
    return h
      .response(
        buildResponse(
          "fail",
          "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount"
        )
      )
      .code(400);
  }

  books[bookIdx] = {
    ...books[bookIdx],
    ...bookData,
    updatedAt: new Date().toISOString(),
  };

  return h.response(buildResponse("success", "Buku berhasil diperbarui"));
};
