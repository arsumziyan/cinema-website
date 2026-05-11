# 🎬 Cinema Website

A full-stack cinema web application built with **Node.js**, **Express**, **MongoDB**, and **Vanilla JavaScript**. This project was developed during my backend internship and allows users to browse movies, search by title or genre, and upload new movies with poster images.

---

## 🚀 Features

- Browse all movies with poster images, genres, and descriptions
- Search movies in real-time by **title** or **genre**
- Upload new movies with:
  - Movie name and description
  - Image file upload or poster URL
  - Genre selection via checkboxes
- Movies are displayed in **alphabetical order**
- Responsive black-and-gold themed UI

---

## 🛠️ Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | HTML, CSS, Vanilla JavaScript     |
| Backend    | Node.js, Express.js               |
| Database   | MongoDB (via Mongoose)            |
| File Upload| Multer                            |
| Other      | CORS, jQuery                      |

---

## 📁 Project Structure

```
├── index.html       # Main frontend page
├── style.css        # Styling (dark cinema theme)
├── script.js        # Frontend logic (fetch, search, upload)
├── server.js        # Express server & API routes
└── movies/          # Uploaded movie poster images
```

---

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) installed
- [MongoDB](https://www.mongodb.com/) running locally on port `27017`

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/cinema-website.git
   cd cinema-website
   ```

2. **Install dependencies**
   ```bash
   npm install express mongoose cors multer
   ```

3. **Create the movies folder** (for image uploads)
   ```bash
   mkdir movies
   ```

4. **Start the server**
   ```bash
   node server.js
   ```

5. **Open the app**

   Open `index.html` in your browser, or serve it statically.

---

## 🔌 API Endpoints

| Method | Endpoint    | Description                        |
|--------|-------------|------------------------------------|
| GET    | `/movies`   | Fetch all movies with images & genres |
| GET    | `/genres`   | Fetch all available genres         |
| POST   | `/upload`   | Upload a new movie (multipart form)|

---

## 🗄️ Database Collections

- **movies** — Stores movie title and description
- **images** — Stores image URLs linked to a movie
- **genres_collection** — Stores available genre types
- **genre_movie_associations** — Links movies to their genres (many-to-many)

---

## 📸 Screenshots

> Add screenshots of your UI here after deploying or running locally.

---

## 🧑‍💻 About

This project was built as part of a **backend internship**. It covers core backend concepts including:
- RESTful API design with Express
- MongoDB schema design and Mongoose ORM
- File handling with Multer
- Connecting a frontend to a live backend via Fetch API

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
