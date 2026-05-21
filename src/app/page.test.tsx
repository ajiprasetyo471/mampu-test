import { render, screen } from "@testing-library/react";
import Home from "./page";

describe("Home page", () => {
  it("renders the main heading to edit page.tsx", () => {
    render(<Home />);
    expect(screen.getByText(/To get started, edit the page.tsx file/i)).toBeInTheDocument();
  });

  it("renders the Deploy Now button", () => {
    render(<Home />);
    expect(screen.getByText(/Deploy Now/i)).toBeInTheDocument();
  });
});
