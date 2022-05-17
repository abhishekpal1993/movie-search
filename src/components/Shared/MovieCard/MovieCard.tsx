import React from "react";
import styles from "../styles/movie.module.scss";

export const MovieCard: React.FC<{
  title: string;
  year: string;
  type: string;
  poster: string;
  favourite: boolean;
  id: string;
}> = (props) => {
  const iconStyle = `material-symbols-outlined ${styles.like} ${
    props.favourite ? styles.favorite : ""
  }`.trim();

  return (
    <div className={`col ${styles.movieCard}`}>
      <div className={styles.movieCardHeader}>
        <img className={styles.poster} alt="movie-card-poster" src={props.poster} />
        <div className={styles.content}>
          <h4>{props.title}</h4>
          <p>{`${props.year}, ${props.type}`}</p>
        </div>
      </div>
      <span className={iconStyle} data-testid={props.id} data-imdbid={props.id}>
        favorite
      </span>
    </div>
  );
};
