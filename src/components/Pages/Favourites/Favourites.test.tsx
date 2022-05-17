/* eslint-disable testing-library/no-debugging-utils */
/* eslint-disable testing-library/no-unnecessary-act */
import { act, fireEvent, screen } from "@testing-library/react";
import { IFetchByID } from "interfaces/IFetchByID";
import favouriteSlice from "redux/slices/favouriteSlice";
import testData from "tests/mocks/fetchByTitle.json";
import { renderWithRedux } from "tests/utils/renderWithRedux";
import Favourites from "./Favourites";

describe("Favourites.tsx", () => {
  it("renders favourites page: empty state", async () => {
    const preloadedFavourites: IFetchByID[] = [];

    await act(async () => {
      renderWithRedux(<Favourites />, {
        preloadedState: {
          favourite: preloadedFavourites,
        },
        reducer: favouriteSlice,
      });
    });
    // queries
    const error = screen.getByText("No items in favourites!");
    // assertions
    expect(error).toBeInTheDocument();
  });

  it("renders favourites page: preloaded state", async () => {
    const preloadedFavourites: IFetchByID[] = [testData];

    await act(async () => {
      renderWithRedux(<Favourites />, {
        preloadedState: {
          favourite: preloadedFavourites,
        },
        reducer: favouriteSlice,
      });
    });
    // queries
    const movieTitle = screen.getByText(testData.Title);
    const movieSubText = screen.getByText(
      `${testData.Year}, ${testData.Director}`
    );
    // assertions
    expect(movieTitle).toBeInTheDocument();
    expect(movieSubText).toBeInTheDocument();
  });

  it("favourites page: remove favourite", async () => {
    const preloadedFavourites: IFetchByID[] = [testData];

    await act(async () => {
      renderWithRedux(<Favourites />, {
        preloadedState: {
          favourite: preloadedFavourites,
        },
        reducer: favouriteSlice,
      });
    });
    // queries
    const movieTitle = screen.getByText(testData.Title);
    const movieSubText = screen.getByText(
      `${testData.Year}, ${testData.Director}`
    );
    // assertions
    expect(movieTitle).toBeInTheDocument();
    expect(movieSubText).toBeInTheDocument();

    // click operation
    await act(async () => {
      fireEvent.click(screen.getByText("favorite"));
    });

    // queries
    const error = screen.getByText("No items in favourites!");
    // assertions
    expect(error).toBeInTheDocument();
  });
});
