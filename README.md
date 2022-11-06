Sample API for DYCI Workshop

Sign up
https://dyci-test-api.herokuapp.com/api/users/signup
Method: Post
Payload: 
  email: string, required: true
  password: string, required: true
  firstName: string, required:true
  middleName: string, required: false
  lastName: string, required: true
  contactNo: string, required: true
  
Sign In
https://dyci-test-api.herokuapp.com/api/user/login
Method: Post
Payload: 
  email: string, required: true
  password: string, required: true
  
Create New Post
https://dyci-test-api.herokuapp.com/api/posts/[id]
Method: Post
Headers: Authorization
Payload: 
  userId: string, required: true
  title: string, required: true
  content: string: required: true
  image: File, required: true
  
Get All Post
https://dyci-test-api.herokuapp.com/api/posts
Method: Get

Get Post by ID
https://dyci-test-api.herokuapp.com/api/posts/[id]
Method: Get

Update Post
https://dyci-test-api.herokuapp.com/api/posts/[id]
Headers: Authorization
Method: Put
Payload: 
  userId: string, required: true
  title: string, required: true
  content: string: required: true
  image: File, required: false
  
Delete Post by ID
https://dyci-test-api.herokuapp.com/api/posts/[id]
Headers: Authorization
Method: Delete
