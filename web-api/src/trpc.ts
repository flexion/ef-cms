// import { createHTTPServer } from '@trpc/server/adapters/standalone';
// import { initTRPC } from '@trpc/server';

// const tRpc = initTRPC.create();

// // eslint-disable-next-line prefer-destructuring
// export const tRpcRouter = tRpc.router;
// export const publicProcedure = tRpc.procedure;

// export const appRouter = tRpcRouter({
//   userCreate: publicProcedure.mutation(async opts => {
//     return {
//       hello: 'GoodBye',
//     };
//   }),
//   userList: publicProcedure.query(async () => {
//     await new Promise(resolve => setTimeout(resolve, 5000));
//     return 'Yo it is me';
//   }),
//   // ...
// });

// // Export type router type signature,
// // NOT the router itself.
// export type AppRouter = typeof appRouter;

// const server = createHTTPServer({
//   router: appRouter,
// });

// server.listen(3000);
