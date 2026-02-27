import { BrowserRouter } from 'react-router-dom';
import { Query } from './query';
import { Theme } from './theme';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <Query>
      <Theme>
        <BrowserRouter>{children}</BrowserRouter>
      </Theme>
    </Query>
  );
};
