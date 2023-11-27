import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import { token } from '@web-client/userToken';
import type { AppRouter } from '@web-api/app';

// Pass AppRouter as generic here. 👇 This lets the `trpc` object know
// what procedures are available on the server and their input/output types.
export const trpcClient = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      headers() {
        return {
          authorization: `Bearer ${token}`,
        };
      },
      url: 'http://localhost:3040',
    }),
  ],
});
