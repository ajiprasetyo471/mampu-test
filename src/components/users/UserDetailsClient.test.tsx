import { render, screen, fireEvent } from "@testing-library/react";
import UserDetailsClient from "./UserDetailsClient";
import { useUser } from "@/hooks/useUser";
import { useUserActivity } from "@/hooks/useUserActivity";

// Mock hooks
jest.mock("@/hooks/useUser");
jest.mock("@/hooks/useUserActivity");

const mockUser = {
  id: 1,
  name: "Leanne Graham",
  username: "Bret",
  email: "Sincere@april.biz",
  phone: "1-770-736-8031 x56442",
  website: "hildegard.org",
  company: {
    name: "Romaguera-Crona",
    catchPhrase: "Multi-layered client-server neural-net",
    bs: "harness real-time e-markets",
  },
  address: {
    street: "Kulas Light",
    suite: "Apt. 556",
    city: "Gwenborough",
    zipcode: "92998-3874",
  },
};

const mockActivity = {
  posts: [
    {
      id: 101,
      userId: 1,
      title: "First Post Title",
      body: "First post body text goes here.",
    },
  ],
  todos: [
    {
      id: 201,
      userId: 1,
      title: "First Todo Title",
      completed: true,
    },
    {
      id: 202,
      userId: 1,
      title: "Second Todo Title",
      completed: false,
    },
  ],
};

describe("UserDetailsClient", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useUser as jest.Mock).mockReturnValue({
      data: mockUser,
      isLoading: false,
      isError: false,
      error: null,
      refetch: jest.fn(),
    });
    (useUserActivity as jest.Mock).mockReturnValue({
      data: mockActivity,
      isLoading: false,
      isError: false,
      error: null,
      refetch: jest.fn(),
    });
  });

  it("renders user details loader skeleton initially", () => {
    (useUser as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
      refetch: jest.fn(),
    });

    const { container } = render(<UserDetailsClient id="1" />);
    expect(container.getElementsByClassName("animate-pulse").length).toBeGreaterThan(0);
  });

  it("renders user details error state with retry button", () => {
    const mockRefetch = jest.fn();
    (useUser as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error("Network Error"),
      refetch: mockRefetch,
    });

    render(<UserDetailsClient id="1" />);
    expect(screen.getByText("Failed to load user details")).toBeInTheDocument();
    expect(screen.getByText("Network Error")).toBeInTheDocument();

    const retryButton = screen.getByRole("button", { name: /try again/i });
    fireEvent.click(retryButton);
    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it("renders user profile info correctly", () => {
    render(<UserDetailsClient id="1" />);

    // Name & Username
    expect(screen.getByRole("heading", { level: 1, name: "Leanne Graham" })).toBeInTheDocument();
    expect(screen.getByText("@Bret")).toBeInTheDocument();

    // Contact
    expect(screen.getByText("Sincere@april.biz")).toBeInTheDocument();
    expect(screen.getByText("1-770-736-8031 x56442")).toBeInTheDocument();
    expect(screen.getByText("hildegard.org")).toBeInTheDocument();

    // Company
    expect(screen.getByText("Romaguera-Crona")).toBeInTheDocument();
  });

  it("renders activity logs section with tabs", () => {
    render(<UserDetailsClient id="1" />);

    // Check workspace tabs exist
    expect(screen.getByRole("tab", { name: /Recent Posts/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Todos Tasks/i })).toBeInTheDocument();
  });

  it("renders recent posts by default", () => {
    render(<UserDetailsClient id="1" />);

    // Recent Posts should be default tab
    expect(screen.getByText("First Post Title")).toBeInTheDocument();
    expect(screen.getByText("First post body text goes here.")).toBeInTheDocument();
  });

  it("toggles to todos tab and displays todo items with status filters", () => {
    render(<UserDetailsClient id="1" />);

    // Switch tab to Todos
    const todosTab = screen.getByRole("tab", { name: /Todos Tasks/i });
    fireEvent.click(todosTab);

    // Verify todo items render
    expect(screen.getByText("First Todo Title")).toBeInTheDocument();
    expect(screen.getByText("Second Todo Title")).toBeInTheDocument();

    // Verify sub-filters render
    expect(screen.getByRole("button", { name: /All \(2\)/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Completed \(1\)/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Pending \(1\)/i })).toBeInTheDocument();
  });

  it("renders activity log inline error gracefully if workspace fetch fails", () => {
    (useUserActivity as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error("Fetch Activity Error"),
      refetch: jest.fn(),
    });

    render(<UserDetailsClient id="1" />);
    // Main user card should still be displayed
    expect(screen.getByRole("heading", { level: 1, name: "Leanne Graham" })).toBeInTheDocument();
    // But activity section displays inline error
    expect(screen.getByText("Failed to load activity logs")).toBeInTheDocument();
    expect(screen.getByText("Fetch Activity Error")).toBeInTheDocument();
  });
});
