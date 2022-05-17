export interface ISeachByText {
  Search: ISearch[];
  totalResults: string;
  Response: string;
  Error?:string;
}

export interface ISearch {
  Title: string;
  Year: string;
  imdbID: string;
  Type: IMovieType;
  Poster: string;
}

export enum IMovieType {
  Episode = "episode",
  Movie = "movie",
  Series = "series",
}
