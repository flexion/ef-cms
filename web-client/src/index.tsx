import { CerebralApp } from '@web-client/app';
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  useNavigate,
} from '@tanstack/react-router';
import { createRoot } from 'react-dom/client';
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

const cerebralRoute = createRoute({
  component: CerebralApp,
  getParentRoute: () => rootRoute,
  path: '/',
});

const catchAllRoute = createRoute({
  component: CerebralApp,
  getParentRoute: () => rootRoute,
  path: '*',
});

const newComponent = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div>New</div>
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
  cerebralRoute,
  newRoute,
  dogRoute,
  catchAllRoute,
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
