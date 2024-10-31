import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';
// import { applicationContext } from '@web-client/applicationContext';
import { createRoot } from 'react-dom/client';
// import { get, getCurrentUserToken } from '@shared/proxies/requests';
import { newRoute } from '@web-client/routes/new/newComponent';
import React from 'react';

export const rootRoute = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <Outlet />
    </>
  );
}

// const cerebralRoute = createRoute({
//   component: CerebralApp,
//   getParentRoute: () => rootRoute,
//   path: '/',
// });

const catchAllRouteInFile = createRoute({
  getParentRoute: () => rootRoute,
  path: '*',
}).lazy(() => import('@web-client/app').then(app => app.catchAllRoute));

const routeTree = rootRoute.addChildren([
  // cerebralRoute,
  newRoute,
  catchAllRouteInFile,
]);

const router = createRouter({
  defaultPreload: 'intent',
  defaultStaleTime: 5000,
  routeTree,
});

// Register things for typesafety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const rootElement = window.document.getElementById('app')!;

if (!rootElement.innerHTML) {
  const root = createRoot(rootElement);

  root.render(<RouterProvider router={router} />);
}
