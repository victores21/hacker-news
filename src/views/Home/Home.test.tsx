import { render, fireEvent } from "@testing-library/react";
import Home from "./Home";

describe("Home Page", () => {
  it("should change category after click it and adds className category--active", () => {
    const { getByText } = render(<Home />);

    const btnMyFavs = getByText("My Faves");
    fireEvent.click(btnMyFavs);
    expect(btnMyFavs).toHaveClass("category--active");
  });

  it("should show favorites list if My Faves is clicked", async () => {
    const { getByText, container } = render(<Home />);
    const btnMyFavs = getByText("My Faves");
    fireEvent.click(btnMyFavs);
    const divFavorites = container.querySelector(".list-favorites");

    expect(divFavorites).toBeInTheDocument();
  });
});
