padhukku-assignment

Task Description: Create a User Sign-Up and Post Management API
Task Objective: Create an API that allows users to sign up using their name and email, create posts with
content and user field, delete posts by providing a postID, and fetch all posts made by a specific user.

Task Requirements:

1. User Sign-Up API
Endpoint: POST /api/signup
Request Body:
name (string): The user's name.
email (string): The user's email address.
Response:
200: Successful user sign-up.

2. Create Post API

Endpoint: POST /api/posts
Request Body:
userId (string): The ID of the user creating the post.
content (string): The content of the post.
Response:
200 OK: Successfully created.

3. Delete Post API
Endpoint: DELETE /api/deletepost/:postId
Request Params:
postId (string): The ID of the post to be deleted.
Response:
200: Successful post deletion.

4. Fetch User's Posts API
Endpoint: GET /API/posts/:userId
Request Params:
userId (string): The ID of the user whose posts are to be fetched.
Response:
200: all the posts from the user
