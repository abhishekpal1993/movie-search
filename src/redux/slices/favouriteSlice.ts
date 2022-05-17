import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IFetchByID } from "interfaces/IFetchByID";

export const initialState = {
  favourite: [] as IFetchByID[],
};

const favouriteSlice = createSlice({
  name: "favourite",
  initialState,
  reducers: {
    addToFavourties: (state, action: PayloadAction<{ data: IFetchByID }>) => {
      const { data } = action.payload;
      state.favourite.push(data);
    },
    deleteFromFavourties: (
      state,
      action: PayloadAction<{ imdbID: string }>
    ) => {
      const { imdbID } = action.payload;
      return {
        ...state,
        favourite: state.favourite.filter((item) => item.imdbID !== imdbID),
      };
    },
  },
});

export const { addToFavourties, deleteFromFavourties } = favouriteSlice.actions;

export default favouriteSlice.reducer;
