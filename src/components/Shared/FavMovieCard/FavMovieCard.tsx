import React from "react";
import styles from "../styles/movie.module.scss";

export const FavMovieCard: React.FC<{
  title: string;
  year: string;
  director: string;
  duration: string;
  genre: string;
  plot: string;
  poster: string;
  id: string;
}> = (props) => {
  return (
    <div className={styles.movieCard}>
      <div className={styles.movieCardHeader}>
        <img className={styles.poster} alt="fav-movie-card-poster" src={props.poster} />
        <div className={styles.content}>
          <h4>{props.title}</h4>
          <p>{`${props.year}, ${props.director}`}</p>
          <span className={styles.duration}>{props.duration}</span>
          <p className={styles.genre}>{props.genre}</p>
        </div>
      </div>
      <div className={styles.movieCardDescription}>{props.plot}</div>
      <span
        className={`material-symbols-outlined ${styles.like} ${styles.favorite}`}
        data-imdbid={props.id}
      >
        favorite
      </span>
    </div>
  );
};
