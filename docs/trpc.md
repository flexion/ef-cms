## Caveats
- Need to compare CORS in express mono lambda vs TRPC monolambda. In express app we would only allow credentials to be passed on routes authenticateUserProxy, deleteAuthCookieProxy, and refreshTokenProxy. Not sure how this will work with trpc having a local adapter and a lambda adapter.
- Swagger should probably not exist anymore as we do not adhere to REST.