import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { useReducer } from 'react';

import WalletDialog from './components/WalletDialog/WalletDialog';

const Component = () => {
  const [isOpen, toggle] = useReducer(p => !p, false);
  return (
    <>
      <button onClick={toggle}>Engage</button>
      <WalletDialog isOpen={isOpen} />
    </>
  );
};

describe('WalletDialog', () => {
  it('should start with hidden modal', () => {
    const { getByText } = render(<Component />);
    expect(() => getByText('Browser Wallet')).toThrowError();
  });

  it('should be able to open wallet connection flow modal', async () => {
    const { getByText } = render(<Component />);

    userEvent.click(getByText('Engage'));

    await waitFor(() => getByText('Browser Wallet'));

    expect(getByText('Browser Wallet')).toBeInTheDocument();
  });
});
