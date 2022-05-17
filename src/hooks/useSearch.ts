import {
  SEARCH_BY_TEXT_PARAM,
  SEARCH_BY_TYPE_PARAM,
  SEARCH_PAGE_PARAM
} from "constants/omdbApi";
import { ISeachByText, ISearch } from "interfaces/ISearchByText";
import React from "react";
import { omdbAxios } from "services/omdbAxios";

export const useSearch = () => {
  // basic search initialization
  const [searchText, setSearchText] = React.useState<string>("");
  const [searchType, setSearchType] = React.useState<string>();
  const [error, setError] = React.useState<string>();
  const [searchData, setSearchData] = React.useState<ISearch[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  // infinite scroll initialization
  const [pageState, setPageState] = React.useState({
    totalResults: 0,
    currentPage: 1,
  });
  const [loadingRef, setLoadingRef] = React.useState<HTMLDivElement | null>(
    null
  );
  // derived values
  const totalResults = React.useMemo(
    () => pageState.totalResults,
    [pageState.totalResults]
  );
  const totalPages = React.useMemo(
    () => Math.ceil(pageState.totalResults / 10),
    [pageState.totalResults]
  );
  const shouldCallAPI = React.useMemo(
    () =>
      pageState.currentPage > 1 &&
      pageState.currentPage < pageState.totalResults &&
      searchText !== "",
    [pageState, searchText]
  );

  // basic search functionality
  const searchByText = React.useCallback(
    async (str: string, page: number, type?: string) => {
      try {
        setLoading(true);
        const response = await omdbAxios.get<ISeachByText>("/", {
          params: {
            [SEARCH_BY_TEXT_PARAM]: str,
            [SEARCH_PAGE_PARAM]: page,
            [SEARCH_BY_TYPE_PARAM]: type || undefined,
          },
        });

        if (response.data.Response === "True") {
          setSearchData((prevState) =>
            page === 1
              ? response.data.Search
              : [...prevState, ...response.data.Search]
          );
          //   setTotalResults(parseInt(response.data.totalResults));
          setPageState((prev) => ({
            ...prev,
            totalResults: parseInt(response.data.totalResults),
          }));
        } else {
          setError("No content found!");
        }
      } catch (err) {
        console.error("searchByText:error", err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const searchMovie = React.useCallback(() => {
    if (searchText !== "") {
      searchByText(searchText, 1, searchType);
    }
    setError(undefined);
    setSearchData([]);
    setPageState({
      totalResults: 0,
      currentPage: 1,
    });
  }, [searchText, searchByText, searchType]);

  const onChangeSearchText = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchText(e.target.value ?? "");
    },
    []
  );

  const onChangeSearchType = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSearchType(e.target.value ?? "");
    },
    []
  );

  // intersectionObserver instance
  const intersectionObserver = React.useRef<IntersectionObserver>(
    new IntersectionObserver(
      function (entities) {
        const { intersectionRatio, isIntersecting } = entities[0];
        console.log("intersectionObserver", {
          isIntersecting,
          intersectionRatio,
        });
        if (intersectionRatio > 0 && isIntersecting && !loading) {
          console.log("scroll further");
          setPageState((prev) => ({
            ...prev,
            currentPage:
              Math.ceil(prev.totalResults / 10) > prev.currentPage
                ? prev.currentPage + 1
                : prev.currentPage,
          }));
        }
      },
      {
        root: null,
        rootMargin: "10px",
        threshold: 1.0,
      }
    )
  );

  // infinite scroll functionality
  React.useEffect(
    () => {
      const refIntersectionObserver = intersectionObserver;

      if (loadingRef != null) {
        console.log("start observing");
        refIntersectionObserver.current.observe(loadingRef);
      }

      return () => {
        if (loadingRef != null) {
          console.log("stop observing");
          refIntersectionObserver.current.unobserve(loadingRef);
        }
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loadingRef]
  );

  React.useEffect(
    () => {
      console.log("page", {
        page: pageState.currentPage,
        totalPages,
        totalResults,
        shouldCallAPI,
      });

      if (shouldCallAPI) {
        searchByText(searchText, pageState.currentPage, searchType);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pageState.currentPage]
  );

  return {
    loading,
    error,
    searchText,
    searchData,
    totalResults,
    setLoadingRef,
    searchMovie,
    onChangeSearchText,
    onChangeSearchType,
  };
};
