/* eslint-disable testing-library/no-unnecessary-act */
import { act, render, screen } from "@testing-library/react";
import App from "./App";

describe("App.tsx", () => {
  it("suspense fallback check", () => {
    render(<App />);
    // queries
    const loading = screen.getByText<HTMLDivElement>("Loading...");
    // assertions
    expect(loading).toBeInTheDocument()
  });

  it("renders navigation panel", async () => {
    await act(async () => {
      render(<App />);
    });
    // queries
    const homeLink = screen.getByRole<HTMLOptionElement>("link", { name: "Home" });
    const favouritesLink = screen.getByRole<HTMLOptionElement>("link", { name: "Favourites" });
    // assertions
    expect(homeLink).toBeInTheDocument()
    expect(favouritesLink).toBeInTheDocument()
  });

  it("renders search panel", async () => {
    await act(async () => {
      render(<App />);
    });
    // queries
    const button = screen.getByRole<HTMLButtonElement>("button");
    const dropdownOptionDefault = screen.getByRole<HTMLOptionElement>("option", { name: "All" });
    const input = screen.getByPlaceholderText<HTMLInputElement>("Search by title...");
    // assertions
    expect(button).toBeInTheDocument()
    expect(dropdownOptionDefault).toBeInTheDocument()
    expect(input).toBeInTheDocument()
  });

  beforeAll(() => {
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
});
