import { AppRouter } from '@web-api/app';
import { applicationContext } from '@web-client/applicationContext';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
// import type { AppRouter } from './server';
//     👆 **type-only** import

// Pass AppRouter as generic here. 👇 This lets the `trpc` object know
// what procedures are available on the server and their input/output types.
export const trpcClient = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: 'include',
          headers: {
            ...options?.headers,
            authorization: `Bearer ${applicationContext.getCurrentUserToken()}`,
          },
        });
      },
      url: 'http://localhost:3040',
    }),
  ],
});
