import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import Home from "@m/app/page";
import companies from "@m/app/api/companies/companies.json";

// Mock the global fetch function
beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(companies),
    })
  ) as jest.Mock;
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("Home Component", () => {
  beforeEach(() => {
    render(<Home />);
  });

  it("renders the dashboard title", async () => {
    await waitFor(() => expect(screen.getByText("Company Dashboard")).toBeInTheDocument());
    // Wait for the companies to be rendered after fetch completes
    await waitFor(() => expect(screen.getByText("Company A")).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText("Company B")).toBeInTheDocument());
  });

  test("renders delete button and handles click", async () => {
    await waitFor(() => expect(screen.getByText("Company A")).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText("Company B")).toBeInTheDocument());

    // Loop through company divs and simulate clicks
    for (let i = 1; i <= 5; i++) {
      const companyDiv = await screen.findByTestId(`company-${i}`);
      await act(async () => fireEvent.click(companyDiv));
      expect(companyDiv).toHaveClass("selected"); // Check if the div gets selected after click
    }

    expect(
      screen.getByText(
        (content) => content.startsWith("Delete Selected") && content.includes("(5)")
      )
    ).toBeInTheDocument();
  });
});
