import noImage from "assets/no-image.jpg";
import { MovieCard } from "components/Shared/MovieCard/MovieCard";
import { useFavourite } from "hooks/useFavourite";
import { useSearch } from "hooks/useSearch";
import React from "react";

const Search: React.FC<{}> = () => {
  const {
    loading,
    error,
    searchText,
    searchData,
    totalResults,
    setLoadingRef,
    searchMovie,
    onChangeSearchText,
    onChangeSearchType,
  } = useSearch();

  const {
    favourites,
    isFavourite,
    removeImdbIdFromFavorites,
    addImdbIdToFavorites,
  } = useFavourite();

  return (
    <div className="container mx-auto">
      <div className="input-group">
        <input
          type="text"
          className="form-control mt-3 mb-3 ms-3"
          placeholder="Search by title..."
          value={searchText}
          onChange={onChangeSearchText}
        />
        <select
          className="form-select mt-3 mb-3"
          defaultValue=""
          onChange={onChangeSearchType}
        >
          <option value="">All</option>
          <option value="movie">Movies</option>
          <option value="series">Series</option>
          <option value="episode">Episodes</option>
        </select>
        <button
          disabled={searchText === ""}
          type="button"
          className="btn btn-primary mt-3 mb-3 me-3"
          onClick={searchMovie}
        >
          Search
        </button>
      </div>
      {totalResults > 0 && (
        <h4 className="m-3 p-3 rounded bg-light text-center">
          Total Results: {totalResults}
        </h4>
      )}
      {!!error && (
        <h4 className="m-3 p-3 rounded bg-danger text-white text-center">
          {error}
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
            if (!isFavourite(imdbID)) {
              addImdbIdToFavorites(imdbID);
            } else {
              removeImdbIdFromFavorites(imdbID);
            }
          }
        }}
      >
        {searchData?.map((data) => (
          <MovieCard
            poster={data.Poster.replace("N/A", "") || noImage}
            title={data.Title}
            year={data.Year}
            type={data.Type}
            favourite={favourites.some((item) => item.imdbID === data.imdbID)}
            id={data.imdbID}
            key={data.imdbID}
          />
        ))}
      </div>
      {totalResults > 0 && (
        <div className="bottom-of-page" ref={(el) => setLoadingRef(el)} />
      )}
      {!!loading && (
        <div className="m-3 p-3 rounded bg-light text-center">Loading...</div>
      )}
    </div>
  );
};

export default Search;
