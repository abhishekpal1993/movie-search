/* eslint-disable testing-library/no-unnecessary-act */
import { act, render, screen } from "@testing-library/react";
import { FavMovieCard } from "./FavMovieCard";

describe("FavMovieCard.tsx", () => {
  it("renders favourite movie card", async () => {
    await act(async () => {
      render(
        <FavMovieCard
          poster={"no-image.jpg"}
          title={"Movie Title"}
          year={"2022"}
          director={"Movie Director"}
          duration={"90 mins"}
          plot={"Lorem ipsum 100"}
          genre={"Action"}
          id={"1"}
        />
      );
    });
    // queries
    const image = screen.getByRole<HTMLImageElement>("img", {
      name: "fav-movie-card-poster",
    });
    const favourite = screen.getByText("favorite");
    // assertions
    expect(image).toBeInTheDocument();
    expect(favourite).toBeInTheDocument();
  });

  it("test favourite movie card details", async () => {
    await act(async () => {
      render(
        <FavMovieCard
          poster={"no-image.jpg"}
          title={"Movie Title"}
          year={"2022"}
          director={"Movie Director"}
          duration={"90 mins"}
          plot={"Lorem ipsum 100"}
          genre={"Action"}
          id={"1"}
        />
      );
    });
    // queries
    const image = screen.getByRole<HTMLImageElement>("img", {
      name: "fav-movie-card-poster",
    });
    const movieTitle = screen.getByRole<HTMLHeadingElement>("heading", {
      name: "Movie Title",
    });
    const subText = screen.getByText<HTMLParagraphElement>(
      "2022, Movie Director"
    );
    const movieDuration = screen.getByText<HTMLParagraphElement>("90 mins");
    const movieGenre = screen.getByText<HTMLParagraphElement>("Action");
    const moviePlot = screen.getByText<HTMLParagraphElement>("Lorem ipsum 100");
    const favourite = screen.getByText<HTMLSpanElement>("favorite");
    // assertions
    expect(image.src).toBe("http://localhost/no-image.jpg");
    expect(movieTitle).toBeInTheDocument();
    expect(subText).toBeInTheDocument();
    expect(movieDuration).toBeInTheDocument();
    expect(movieGenre).toBeInTheDocument();
    expect(moviePlot).toBeInTheDocument();
    expect(Object.values(favourite.classList)).toContain("like");
    expect(favourite.getAttribute("data-imdbid")).toBe("1");
  });
});
