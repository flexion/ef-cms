## The solution for getting off of Cerebral should be
  - iterative. Allow components to be moved over one at a time, without the whole project needing to be refactored.
  - should not force the user to login again or affect their sign in experience at all
  - should not use global state

# Tanstack Router
  - Allows progressive updates by route
  - enables lazy loading to not include the entire old application
  - Can have file based routing(magic bonus stuff if we want it.)


## To do MVP
  - Share identity tokens across apps, refresh the identity token at same interval.
  - Allow tan stack router to share context on if a user is logged in.