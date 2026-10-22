
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Bell,
  ChevronDown,
  Play,
  Info,
  Plus,
  ThumbsUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import "./App.css";

const image = (id, width = 500) =>
  `https://image.tmdb.org/t/p/w${width}${id}`;

const movies = {
  trending: [
    { id: "/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg", title: "Oppenheimer", year: "2023", rating: "8.1" },
    { id: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg", title: "The Dark Knight", year: "2008", rating: "9.0" },
    { id: "/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg", title: "Interstellar", year: "2014", rating: "8.7" },
    { id: "/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg", title: "Spider-Man", year: "2023", rating: "8.4" },
    { id: "/d5NXSklXo0qyIYkgV94XAgMIckC.jpg", title: "Dune", year: "2021", rating: "8.0" },
    { id: "/q719jXXEzOoYaps6babgKnONONX.jpg", title: "Avatar", year: "2009", rating: "7.9" },
  ],
  action: [
    { id: "/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg", title: "Avatar: The Way of Water", year: "2022", rating: "7.5" },
    { id: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg", title: "Inception", year: "2010", rating: "8.8" },
    { id: "/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg", title: "Wonder Woman 1984", year: "2020", rating: "5.4" },
    { id: "/z8onk7LV9Mmw6zKz4hT6pzzvmvl.jpg", title: "The Batman", year: "2022", rating: "7.8" },
    { id: "/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg", title: "The Shawshank Redemption", year: "1994", rating: "9.3" },
  ],
};

function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="nav-left">
        <a className="brand" href="#home">NETFLIX</a>
        <nav className="nav-links">
          <a href="#home" className="active">Home</a>
          <a href="#series">TV Shows</a>
          <a href="#movies">Movies</a>
          <a href="#trending">New & Popular</a>
          <a href="#my-list">My List</a>
        </nav>
      </div>

      <div className="nav-right">
        {searchOpen && (
          <input
            autoFocus
            className="nav-search"
            placeholder="Titles, people, genres"
          />
        )}
        <button
          className="icon-button"
          aria-label="Search"
          onClick={() => setSearchOpen(!searchOpen)}
        >
          <Search size={21} />
        </button>
        <button className="kids-link">Children</button>
        <button className="icon-button" aria-label="Notifications">
          <Bell size={21} />
        </button>
        <button className="profile-button">
          <span className="avatar">Y</span>
          <ChevronDown size={16} />
        </button>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-image" />
      <div className="hero-content">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="hero-kicker"
        >
          <span className="n-mark">N</span> SERIES
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          STRANGER<br />THINGS
        </motion.h1>

        <p className="hero-description">
          When a young boy vanishes, a small town uncovers a mystery
          involving secret experiments, supernatural forces and one
          extraordinary girl.
        </p>

        <div className="hero-actions">
          <button className="play-button">
            <Play size={22} fill="currentColor" /> Play
          </button>
          <button className="more-button">
            <Info size={22} /> More Info
          </button>
        </div>
      </div>

      <div className="hero-rating">
        <span>16+</span>
        <span>HD</span>
      </div>
    </section>
  );
}

function MovieCard({ movie, onSelect, isSaved, onToggleSave }) {
  return (
    <motion.article
      className="movie-card"
      whileHover={{ scale: 1.07, y: -5 }}
      transition={{ duration: 0.22 }}
      onClick={() => onSelect(movie)}
    >
      <img src={image(movie.id)} alt={movie.title} loading="lazy" />
      <div className="card-details">
        <div className="card-actions">
          <button aria-label="Play" className="round-action">
            <Play size={15} fill="currentColor" />
          </button>
          <button
            aria-label={isSaved ? "Remove from My List" : "Add to My List"}
            className="round-action"
            onClick={(event) => {
              event.stopPropagation();
              onToggleSave(movie);
            }}
          >
            {isSaved ? <span>✓</span> : <Plus size={17} />}
          </button>
          <button aria-label="Like" className="round-action">
            <ThumbsUp size={15} />
          </button>
          <button
            aria-label="More information"
            className="round-action last-action"
          >
            <ChevronDown size={17} />
          </button>
        </div>
        <p className="card-title">{movie.title}</p>
        <div className="card-meta">
          <span className="match">{movie.rating * 10}% Match</span>
          <span>{movie.year}</span>
          <span className="quality">HD</span>
        </div>
      </div>
    </motion.article>
  );
}

function MovieRow({ title, items, onSelect, watchlist, onToggleSave }) {
  const [offset, setOffset] = useState(0);

  return (
    <section className="movie-row" id={title.toLowerCase().replaceAll(" ", "-")}>
      <h2>{title}</h2>
      <div className="row-viewport">
        <button
          className="row-arrow left"
          aria-label="Previous movies"
          onClick={() => setOffset(Math.max(0, offset - 1))}
        >
          <ChevronLeft size={32} />
        </button>

        <div
          className="movie-track"
          style={{ transform: `translateX(-${offset * 17}%)` }}
        >
          {items.map((movie) => (
            <MovieCard
              key={movie.title}
              movie={movie}
              onSelect={onSelect}
              isSaved={watchlist.some((saved) => saved.title === movie.title)}
              onToggleSave={onToggleSave}
            />
          ))}
        </div>

        <button
          className="row-arrow right"
          aria-label="Next movies"
          onClick={() => setOffset(Math.min(items.length - 1, offset + 1))}
        >
          <ChevronRight size={32} />
        </button>
      </div>
    </section>
  );
}

function MovieModal({ movie, onClose, isSaved, onToggleSave }) {
  if (!movie) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <motion.div
        className="movie-modal"
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={(event) => event.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <img src={image(movie.id, 780)} alt={movie.title} />
        <div className="modal-content">
          <h2>{movie.title}</h2>
          <p className="match">{movie.rating * 10}% Match</p>
          <p>{movie.year} · HD · Movie</p>
          <button className="play-button">
            <Play size={20} fill="currentColor" /> Play
          </button>
          <button className="more-button" onClick={() => onToggleSave(movie)}>
            {isSaved ? "✓ Added to My List" : "+ Add to My List"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function App() {
  const [watchlist, setWatchlist] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);

  function toggleSave(movie) {
    setWatchlist((current) =>
      current.some((item) => item.title === movie.title)
        ? current.filter((item) => item.title !== movie.title)
        : [...current, movie]
    );
  }

  const allMovies = [...movies.trending, ...movies.action];
  const savedMovies = allMovies.filter((movie) =>
    watchlist.some((saved) => saved.title === movie.title)
  );

  return (
    <div className="app-shell">
      <Navbar />
      <Hero />

      <main className="catalog">
        <MovieRow
          title="Trending Now"
          items={movies.trending}
          onSelect={setSelectedMovie}
          watchlist={watchlist}
          onToggleSave={toggleSave}
        />
        <MovieRow
          title="Action & Adventure"
          items={movies.action}
          onSelect={setSelectedMovie}
          watchlist={watchlist}
          onToggleSave={toggleSave}
        />
        {savedMovies.length > 0 && (
          <MovieRow
            title="My List"
            items={savedMovies}
            onSelect={setSelectedMovie}
            watchlist={watchlist}
            onToggleSave={toggleSave}
          />
        )}
      </main>

      <MovieModal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
        isSaved={watchlist.some(
          (saved) => saved.title === selectedMovie?.title
        )}
        onToggleSave={toggleSave}
      />
    </div>
  );
}
