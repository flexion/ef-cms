import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';
import { applicationContext } from '@web-client/applicationContext';
import { cerebralAppWrapper } from '@web-client/app';
import { createRoot } from 'react-dom/client';
import React from 'react';

const rootRoute = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      {/* <div className="p-2 flex gap-2 text-lg border-b">
        <Link
          activeOptions={{ exact: true }}
          activeProps={{
            className: 'font-bold',
          }}
          to="/old"
        >
          Old
        </Link>{' '}
        <Link
          activeProps={{
            className: 'font-bold',
          }}
          to="/new"
        >
          New
        </Link>{' '}
      </div> */}
      <Outlet />
    </>
  );
}

const oldRoute = createRoute({
  beforeLoad: () => {
    console.log('beforee load');
  },
  getParentRoute: () => rootRoute,
  onEnter: async () => {
    console.log('On Enter');
    await cerebralAppWrapper.initialize(applicationContext);
  },
  path: '/old',
});

const newComponent = () => {
  return <div>Welcome to the new App</div>;
};
const newRoute = createRoute({
  component: newComponent,
  getParentRoute: () => rootRoute,
  path: '/new',
});

const routeTree = rootRoute.addChildren([oldRoute, newRoute]);

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
