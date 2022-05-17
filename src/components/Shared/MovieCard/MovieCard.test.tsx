/* eslint-disable testing-library/no-unnecessary-act */
import { act, render, screen } from "@testing-library/react";
import { MovieCard } from "./MovieCard";

describe("MovieCard.tsx", () => {
  it("renders movie card", async () => {
    await act(async () => {
      render(
        <MovieCard
          poster={"no-image.jpg"}
          title={"Movie Title"}
          year={"2022"}
          type={"Action"}
          favourite={true}
          id={"1"}
        />
      );
    });
    // queries
    const image = screen.getByRole<HTMLImageElement>("img", {
      name: "movie-card-poster",
    });
    const favourite = screen.getByText("favorite");
    // assertions
    expect(image).toBeInTheDocument();
    expect(favourite).toBeInTheDocument();
  });

  it("test movie card details", async () => {
    await act(async () => {
      render(
        <MovieCard
          poster={"no-image.jpg"}
          title={"Movie Title"}
          year={"2022"}
          type={"Movie"}
          favourite={true}
          id={"1"}
        />
      );
    });
    // queries
    const image = screen.getByRole<HTMLImageElement>("img", {
      name: "movie-card-poster",
    });
    const movieTitle = screen.getByRole<HTMLHeadingElement>("heading", {
      name: "Movie Title",
    });
    const subText = screen.getByText<HTMLParagraphElement>("2022, Movie")
    const favourite = screen.getByText<HTMLSpanElement>("favorite");
    // assertions
    expect(image.src).toBe("http://localhost/no-image.jpg");
    expect(movieTitle).toBeInTheDocument();
    expect(subText).toBeInTheDocument();
    expect(Object.values(favourite.classList)).toContain("like");
    expect(favourite.getAttribute("data-imdbid")).toBe("1");
  });
});
