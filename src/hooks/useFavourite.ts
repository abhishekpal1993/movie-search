import {
    SEARCH_BY_ID_PARAM,
    SEARCH_PLOT_LENGTH_PARAM
} from "constants/omdbApi";
import { IFetchByID } from "interfaces/IFetchByID";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    addToFavourties,
    deleteFromFavourties
} from "redux/slices/favouriteSlice";
import { AppDispatch, RootState } from "redux/store";
import { omdbAxios } from "services/omdbAxios";

export const useFavourite = () => {
  const dispatch = useDispatch<AppDispatch>();
  const favourites = useSelector<RootState, IFetchByID[]>(
    (state) => state.favourite
  );

  const addImdbIdToFavorites = React.useCallback(
    async (imdbID: string) => {
      const response = await omdbAxios.get<IFetchByID>("/", {
        params: {
          [SEARCH_BY_ID_PARAM]: imdbID,
          [SEARCH_PLOT_LENGTH_PARAM]: "short",
        },
      });
      if (response.data.Response === "True") {
        dispatch(addToFavourties({ data: response.data }));
      }
    },
    [dispatch]
  );

  const removeImdbIdFromFavorites = React.useCallback(
    (imdbID: string) => {
      dispatch(deleteFromFavourties({ imdbID }));
    },
    [dispatch]
  );

  const isFavourite = React.useCallback(
    (imdbID: string) => {
      return favourites.some((item) => item.imdbID === imdbID);
    },
    [favourites]
  );

  return {
    isFavourite,
    removeImdbIdFromFavorites,
    addImdbIdToFavorites,
    favourites,
  };
};
