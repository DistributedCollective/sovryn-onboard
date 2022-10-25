import { render, waitFor } from "@testing-library/react";
import { useReducer } from "react";
import userEvent from "@testing-library/user-event";
import WalletDialog from "./components/WalletDialog/WalletDialog";

const Component = () => {
  const [isOpen, toggle] = useReducer((p) => !p, false);
  return (
    <>
      <button onClick={toggle}>Engage</button>
      <WalletDialog isOpen={isOpen} />
    </>
  );
};

describe("WalletDialog", () => {
  it("should start with hidden modal", () => {
    const { getByText } = render(<WalletDialog isOpen={false} />);
    expect(() => getByText("test")).toThrowError();
  });

  it("should be able to open wallet connection flow modal", async () => {
    const { getByText } = render(<Component />);

    userEvent.click(getByText("Engage"));

    await waitFor(() => getByText("Connect Wallet"));

    expect(getByText("Connect Wallet")).toBeInTheDocument();
  });
});
