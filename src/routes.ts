import Hapi from "@hapi/hapi";
import {
  addBook,
  deleteBook,
  getAllBooks,
  getBookById,
  updateBook,
} from "./handlers";

const routes: Hapi.ServerRoute[] = [
  {
    path: "/books",
    method: "GET",
    handler: getAllBooks,
  },
  {
    path: "/books",
    method: "POST",
    handler: addBook,
  },
  {
    path: "/books/{bookId}",
    method: "GET",
    handler: getBookById,
  },
  {
    path: "/books/{bookId}",
    method: "PUT",
    handler: updateBook,
  },
  {
    path: "/books/{bookId}",
    method: "DELETE",
    handler: deleteBook,
  },
];

export default routes;
