/* eslint-disable testing-library/no-debugging-utils */
/* eslint-disable testing-library/no-unnecessary-act */
import { act, fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MockAdapter from "axios-mock-adapter";
import { SEARCH_BY_ID_PARAM, SEARCH_BY_TEXT_PARAM } from "constants/omdbApi";
import { IFetchByID } from "interfaces/IFetchByID";
import favouriteSlice from "redux/slices/favouriteSlice";
import { omdbAxios } from "services/omdbAxios";
import fetchByTitle from "tests/mocks/fetchByTitle.json";
import searchByText from "tests/mocks/searchByText.json";
import { renderWithRedux } from "tests/utils/renderWithRedux";
import Search from "./Search";

describe("Search.tsx", () => {
  let mock: MockAdapter;

  it("renders search panel", async () => {
    const preloadedFavourites: IFetchByID[] = [];

    await act(async () => {
      renderWithRedux(<Search />, {
        preloadedState: {
          favourite: preloadedFavourites,
        },
        reducer: favouriteSlice,
      });
    });
    // queries
    const button = screen.getByRole<HTMLButtonElement>("button");
    const dropdownOptions = screen.getAllByRole<HTMLOptionElement>("option");
    const dropdownOptionDefault = screen.getByRole<HTMLOptionElement>(
      "option",
      { name: "All" }
    );
    const input =
      screen.getByPlaceholderText<HTMLInputElement>("Search by title...");
    const favorites = screen.queryAllByText<HTMLSpanElement>("favorite");
    // assertions
    expect(button).toBeInTheDocument();
    expect(dropdownOptionDefault).toBeInTheDocument();
    expect(dropdownOptionDefault.selected).toBe(true);
    expect(dropdownOptions.length).toBe(4);
    expect(input).toBeInTheDocument();
    expect(favorites.length).toBe(0);
  });

  it("renders search result", async () => {
    const preloadedFavourites: IFetchByID[] = [fetchByTitle];

    mock.onGet("/").reply((config) => {
      if (!!config.params[SEARCH_BY_TEXT_PARAM]) {
        return [200, searchByText];
      }
      if (!!config.params[SEARCH_BY_ID_PARAM]) {
        return [200, fetchByTitle];
      }
      return [500, { Response: "False" }];
    });

    await act(async () => {
      renderWithRedux(<Search />, {
        preloadedState: {
          favourite: preloadedFavourites,
        },
        reducer: favouriteSlice,
      });
    });
    // queries
    const button = screen.getByText<HTMLButtonElement>("Search");
    const input =
      screen.getByPlaceholderText<HTMLInputElement>("Search by title...");

    // search action
    await act(async () => {
      userEvent.type(input, "Lorem ipsum");
      fireEvent.click(button);
    });

    // assertions
    for (let i = 0; i < searchByText.Search.length; i += 1) {
      expect(
        screen.getByTestId(searchByText.Search[i].imdbID)
      ).toBeInTheDocument();
    }
  });

  it("renders no search result", async () => {
    const preloadedFavourites: IFetchByID[] = [fetchByTitle];

    mock.onGet("/").reply(200, {
      Response: "False",
      Error: "Incorrect IMDb ID.",
    });

    await act(async () => {
      renderWithRedux(<Search />, {
        preloadedState: {
          favourite: preloadedFavourites,
        },
        reducer: favouriteSlice,
      });
    });
    // queries
    const button = screen.getByText<HTMLButtonElement>("Search");
    const input =
      screen.getByPlaceholderText<HTMLInputElement>("Search by title...");

    // search action
    await act(async () => {
      userEvent.type(input, "Lorem ipsum");
      fireEvent.click(button);
    });

    // assertions
    expect(screen.queryAllByText<HTMLSpanElement>("favorite").length).toBe(0);
    expect(screen.getByText<HTMLSpanElement>("No content found!")).toBeInTheDocument();
  });

  it("add/remove from favorite", async () => {
    const preloadedFavourites: IFetchByID[] = [];
    const imdbID = searchByText.Search[0].imdbID;
    mock.onGet("/").reply((config) => {
      if (!!config.params[SEARCH_BY_TEXT_PARAM]) {
        return [200, searchByText];
      }
      if (!!config.params[SEARCH_BY_ID_PARAM]) {
        return [200, fetchByTitle];
      }
      return [500, { Response: "False" }];
    });

    await act(async () => {
      renderWithRedux(<Search />, {
        preloadedState: {
          favourite: preloadedFavourites,
        },
        reducer: favouriteSlice,
      });
    });
    // queries
    const button = screen.getByText<HTMLButtonElement>("Search");
    const input =
      screen.getByPlaceholderText<HTMLInputElement>("Search by title...");

    // search action
    await act(async () => {
      userEvent.type(input, "Lorem ipsum");
      fireEvent.click(button);
    });

    // assertions
    expect(Object.values(screen.getByTestId(imdbID).classList)).not.toContain(
      "favorite"
    );

    // like action
    await act(async () => {
      fireEvent.click(screen.getByTestId(imdbID));
    });

    // assertions
    expect(Object.values(screen.getByTestId(imdbID).classList)).toContain(
      "favorite"
    );

    // like action
    await act(async () => {
      fireEvent.click(screen.getByTestId(imdbID));
    });

    // assertions
    expect(Object.values(screen.getByTestId(imdbID).classList)).not.toContain(
      "favorite"
    );
  });

  beforeAll(() => {
    // mocking axios instance
    mock = new MockAdapter(omdbAxios);
    // mocking IntersectionObserver
    global.IntersectionObserver = class IntersectionObserver {
      readonly root: Element | Document | null;
      readonly rootMargin: string;
      readonly thresholds: ReadonlyArray<number>;

      constructor(
        _fn: IntersectionObserverCallback,
        options?: IntersectionObserverInit
      ) {
        this.root = options?.root ?? null;
        this.rootMargin = options?.rootMargin ?? "0px";
        this.thresholds = Array.isArray(options?.threshold)
          ? (options?.threshold as number[])
          : [options?.threshold ?? 1.0];
      }

      disconnect() {
        return null;
      }

      observe(_target: Element) {
        return null;
      }

      takeRecords() {
        return [] as IntersectionObserverEntry[];
      }

      unobserve(_target: Element) {
        return null;
      }
    };
  });

  afterEach(() => {
    mock.reset();
  });
});
