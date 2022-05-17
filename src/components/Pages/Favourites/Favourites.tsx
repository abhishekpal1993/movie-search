import noImage from "assets/no-image.jpg";
import { FavMovieCard } from "components/Shared/FavMovieCard/FavMovieCard";
import { useFavourite } from "hooks/useFavourite";
import React from "react";

const Favourites: React.FC<{}> = () => {
  const {
    favourites,
    removeImdbIdFromFavorites,
  } = useFavourite();

  return (
    <div className="container mx-auto">
      {favourites.length > 0 && (
        <h4 className="m-3 p-3 rounded bg-light text-center">
          Total items in favourites: {favourites.length}
        </h4>
      )}
      {favourites.length === 0 && (
        <h4 className="m-3 p-3 rounded bg-warning text-center">
          No items in favourites!
        </h4>
      )}
      <div
        className="row row-cols-1 row-cols-md-2 g-3"
        onClick={(e) => {
          e.preventDefault();
          const imdbID = (e.target as HTMLSpanElement).getAttribute(
            "data-imdbid"
          ) as string;
          if(!!imdbID) {
            removeImdbIdFromFavorites(imdbID);
          }
        }}
      >
        {favourites?.map((data) => (
          <FavMovieCard
            poster={data.Poster.replace("N/A", "") || noImage}
            title={data.Title}
            year={data.Year}
            director={data.Director}
            duration={data.Runtime}
            plot={data.Plot}
            genre={data.Type}
            id={data.imdbID}
            key={data.imdbID}
          />
        ))}
      </div>
    </div>
  );
};

export default Favourites;
