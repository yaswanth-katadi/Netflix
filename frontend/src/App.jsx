
import { useEffect, useState } from "react";
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
  X,
} from "lucide-react";
import {
  getTrendingMovies,
  getPopularMovies,
  getActionMovies,
  getPosterUrl,
} from "./api/tmdb";
import "./App.css";

function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="nav-left">
        <a className="brand" href="#home">NETFLIX</a>

        <nav className="nav-links">
          <a className="active" href="#home">Home</a>
          <a href="#tv-shows">TV Shows</a>
          <a href="#movies">Movies</a>
          <a href="#trending-now">New & Popular</a>
          <a href="#my-list">My List</a>
        </nav>
      </div>

      <div className="nav-right">
        {searchOpen && (
          <input
            autoFocus
            className="nav-search"
            placeholder="Titles, people, genres"
            aria-label="Search movies"
          />
        )}

        <button
          className="icon-button"
          aria-label="Toggle search"
          onClick={() => setSearchOpen(!searchOpen)}
        >
          {searchOpen ? <X size={21} /> : <Search size={21} />}
        </button>

        <button className="kids-link">Children</button>

        <button className="icon-button" aria-label="Notifications">
          <Bell size={21} />
        </button>

        <button className="profile-button" aria-label="Choose profile">
          <span className="avatar">Y</span>
          <ChevronDown size={16} />
        </button>
      </div>
    </header>
  );
}

function Hero({ movie, onSelect }) {
  const backdrop = getPosterUrl(movie?.backdrop_path, "original");

  return (
    <section className="hero" id="home">
      <div
        className="hero-image"
        style={
          backdrop
            ? {
                backgroundImage: `
                  linear-gradient(0deg, #141414 1%, transparent 55%),
                  linear-gradient(90deg, #141414 0%, #141414b3 27%, transparent 77%),
                  url("${backdrop}")
                `,
              }
            : undefined
        }
      />

      <motion.div
        className="hero-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65 }}
      >
        <p className="hero-kicker">
          <span className="n-mark">N</span> FILM
        </p>

        <h1>{movie?.title || "DISCOVER MOVIES"}</h1>

        <p className="hero-description">
          {movie?.overview ||
            "Discover popular movies and find your next favourite."}
        </p>

        <div className="hero-actions">
          <button
            className="play-button"
            onClick={() => movie && onSelect(movie)}
          >
            <Play size={22} fill="currentColor" /> Explore
          </button>

          <button
            className="more-button"
            onClick={() => movie && onSelect(movie)}
          >
            <Info size={22} /> More Info
          </button>
        </div>
      </motion.div>

      {movie && (
        <div className="hero-rating">
          <span>13+</span>
          <span>HD</span>
        </div>
      )}
    </section>
  );
}

function MovieCard({ movie, onSelect, isSaved, onToggleSave }) {
  const poster = getPosterUrl(movie.poster_path);
  const year = movie.release_date?.slice(0, 4) || "N/A";
  const rating = Number(movie.vote_average || 0).toFixed(1);

  return (
    <motion.article
      className="movie-card"
      whileHover={{ scale: 1.06, y: -5 }}
      transition={{ duration: 0.22 }}
      onClick={() => onSelect(movie)}
      tabIndex={0}
      role="button"
      aria-label={`View ${movie.title}`}
      onKeyDown={(event) => {
        if (event.key === "Enter") onSelect(movie);
      }}
    >
      {poster ? (
        <img
          src={poster}
          alt={movie.title}
          loading="lazy"
        />
      ) : (
        <div className="poster-placeholder">
          {movie.title}
        </div>
      )}

      <div className="card-details">
        <div className="card-actions">
          <button
            className="round-action"
            aria-label={`Explore ${movie.title}`}
            onClick={(event) => {
              event.stopPropagation();
              onSelect(movie);
            }}
          >
            <Play size={15} fill="currentColor" />
          </button>

          <button
            className="round-action"
            aria-label={isSaved ? "Remove from My List" : "Add to My List"}
            onClick={(event) => {
              event.stopPropagation();
              onToggleSave(movie);
            }}
          >
            {isSaved ? "✓" : <Plus size={17} />}
          </button>

          <button
            className="round-action"
            aria-label={`Like ${movie.title}`}
            onClick={(event) => event.stopPropagation()}
          >
            <ThumbsUp size={15} />
          </button>

          <button
            className="round-action last-action"
            aria-label="Movie details"
            onClick={(event) => {
              event.stopPropagation();
              onSelect(movie);
            }}
          >
            <ChevronDown size={17} />
          </button>
        </div>

        <p className="card-title">{movie.title}</p>

        <div className="card-meta">
          <span className="match">{rating}/10</span>
          <span>{year}</span>
          <span className="quality">HD</span>
        </div>
      </div>
    </motion.article>
  );
}

function MovieRow({
  title,
  items,
  onSelect,
  watchlist,
  onToggleSave,
}) {
  const [offset, setOffset] = useState(0);

  if (!items.length) return null;

  const maxOffset = Math.max(0, items.length - 4);

  return (
    <section
      className="movie-row"
      id={title.toLowerCase().replaceAll(" ", "-")}
    >
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
          style={{
            transform: `translateX(-${offset * 19}%)`,
          }}
        >
          {items.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onSelect={onSelect}
              isSaved={watchlist.some(
                (saved) => saved.id === movie.id
              )}
              onToggleSave={onToggleSave}
            />
          ))}
        </div>

        <button
          className="row-arrow right"
          aria-label="Next movies"
          onClick={() =>
            setOffset(Math.min(maxOffset, offset + 1))
          }
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
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close details"
        >
          ×
        </button>

        {movie.backdrop_path && (
          <img
            src={getPosterUrl(movie.backdrop_path, "w780")}
            alt=""
          />
        )}

        <div className="modal-content">
          <h2>{movie.title}</h2>

          <p className="match">
            {Number(movie.vote_average || 0).toFixed(1)}/10 TMDB
          </p>

          <p>
            {movie.release_date?.slice(0, 4) || "Release date unavailable"}
            {" · "}Movie
          </p>

          <p>{movie.overview || "No description available."}</p>

          <button className="play-button" onClick={onClose}>
            <Play size={20} fill="currentColor" /> Explore
          </button>

          <button
            className="more-button"
            onClick={() => onToggleSave(movie)}
          >
            {isSaved ? "✓ Added to My List" : "+ Add to My List"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function App() {
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [action, setAction] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadMovies() {
      try {
        setLoading(true);
        setError("");

        const results = await Promise.all([
          getTrendingMovies(),
          getPopularMovies(),
          getActionMovies(),
        ]);

        if (!cancelled) {
          setTrending(results[0]);
          setPopular(results[1]);
          setAction(results[2]);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to load movies.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadMovies();

    return () => {
      cancelled = true;
    };
  }, []);

  function toggleSave(movie) {
    setWatchlist((current) =>
      current.some((item) => item.id === movie.id)
        ? current.filter((item) => item.id !== movie.id)
        : [...current, movie]
    );
  }

  const featuredMovie = trending[0] || popular[0] || null;

  return (
    <div className="app-shell">
      <Navbar />

      <Hero
        movie={featuredMovie}
        onSelect={setSelectedMovie}
      />

      <main className="catalog">
        {loading && (
          <p style={{ padding: "24px 4%" }}>
            Loading movies...
          </p>
        )}

        {error && (
          <div style={{ padding: "24px 4%" }}>
            <p>We couldn't load the movie catalog.</p>
            <p>{error}</p>
            <p>Check your TMDB token and internet connection.</p>
          </div>
        )}

        {!loading && !error && (
          <>
            <MovieRow
              title="Trending Now"
              items={trending}
              onSelect={setSelectedMovie}
              watchlist={watchlist}
              onToggleSave={toggleSave}
            />

            <MovieRow
              title="Popular Movies"
              items={popular}
              onSelect={setSelectedMovie}
              watchlist={watchlist}
              onToggleSave={toggleSave}
            />

            <MovieRow
              title="Action & Adventure"
              items={action}
              onSelect={setSelectedMovie}
              watchlist={watchlist}
              onToggleSave={toggleSave}
            />

            <MovieRow
              title="My List"
              items={watchlist}
              onSelect={setSelectedMovie}
              watchlist={watchlist}
              onToggleSave={toggleSave}
            />
          </>
        )}
      </main>

      <MovieModal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
        isSaved={watchlist.some(
          (saved) => saved.id === selectedMovie?.id
        )}
        onToggleSave={toggleSave}
      />
    </div>
  );
}
