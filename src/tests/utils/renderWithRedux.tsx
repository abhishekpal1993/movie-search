import { configureStore } from "@reduxjs/toolkit";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";

export function renderWithRedux(
  ui: React.ReactElement,
  {
    preloadedState,
    reducer,
    ...renderOptions
  }: {
    preloadedState: any;
    reducer: any;
    [x: string]: any;
  }
) {
  const store = configureStore({
    reducer,
    preloadedState,
  });

  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}
