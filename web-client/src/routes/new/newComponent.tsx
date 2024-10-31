import { Header } from '@web-client/views/Header/HeaderGeneric';
import { createRoute, useNavigate } from '@tanstack/react-router';
import { rootRoute } from '@web-client/index';
import React from 'react';

const newComponent = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Header
        headerHelper={{
          isLoggedIn: true,
          showAccountMenu: true,
          showMobileAccountMenu: false,
          showSearchInHeader: true,
          showVerifyEmailWarningNotification: false,
          ustcSealLink: '/',
        }}
        menuHelper={{
          isAccountMenuOpen: false,
          isDocumentQCMenuOpen: false,
          isMessagesMenuOpen: false,
          isReportsMenuOpen: false,
        }}
        showMobileMenu={false}
        templateHelper={{ showBetaBar: true }}
        onResetHeaderAccordions={() => {}}
        onSignOutUserInitiated={() => {}}
        onToggleBetaBar={() => {}}
        onToggleMobileMenu={() => {}}
      />
      <div>New</div>
      <button
        onClick={async () => {
          // console.log('token: ', getCurrentUserToken());
          // const response = await get({
          //   applicationContext,
          //   endpoint: '/trial-sessions',
          // });
          // console.log('response', response);
        }}
      >
        Fetch trial sessions
      </button>
      <button
        onClick={() => {
          void navigate({ to: '/trial-sessions' as any });
        }}
      >
        Navigate to trial-sessions old!
      </button>
    </div>
  );
};

export const newRoute = createRoute({
  component: newComponent,
  getParentRoute: () => rootRoute,
  path: '/new',
});
