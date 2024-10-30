import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  useNavigate,
} from '@tanstack/react-router';
// import { applicationContext } from '@web-client/applicationContext';
import { createRoot } from 'react-dom/client';
// import { get, getCurrentUserToken } from '@shared/proxies/requests';
import React from 'react';

const rootRoute = createRootRoute({
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

const newComponent = () => {
  const navigate = useNavigate();
  return (
    <div>
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
          void navigate({ to: '/trial-sessions' });
        }}
      >
        Navigate to trial-sessions old!
      </button>
    </div>
  );
};
const newRoute = createRoute({
  component: newComponent,
  getParentRoute: () => rootRoute,
  path: '/new',
});

const dogComponent = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div>Dog</div>
      <button
        onClick={() => {
          void navigate({ to: '/new' });
        }}
      >
        Navigate now!
      </button>
    </div>
  );
};
const dogRoute = createRoute({
  component: dogComponent,
  getParentRoute: () => rootRoute,
  path: '/dog',
});

const routeTree = rootRoute.addChildren([
  // cerebralRoute,
  newRoute,
  dogRoute,
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
