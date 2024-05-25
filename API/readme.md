# Architecture
## MVC Pattern
-model 
  -data mapping
  -data store
  -data definition
-View
  -Presentation
-Controller
  -9.8 m/s2 => Acc due to g => 98m/s2


  # Architecture
# MVC Pattern
- Model
  -- data mapping
  -- data store
  -- definition of data
- View
  -presentation / "frontend haru"
- Controller
  -9.8 db entry

  Client ==> Sever
  Request Generator ==> Responder

  Request
  URL
  Protocol http https
  domain.tld
  port number 0-2^16-1 where 10 well known port
  //http https ftp sftp smtp telet

  path    /path
  query   /path?query string
  method  POST,GET,PUT,PATCH,DELETE
          CRUD operation => Create, Read , Update , Delete

# a. Authentication and Authorization
 -login 
 -signup
 -activation
 -forgot password
 -logout
 -dashboard

# b. Product
  -CRUD Operation
  -Product List
      -Search
      -Category
      -Brand
  -Add to cart
  -Wishlist
  -Order

# c.Category
  -CRUD Operation
  -Category List
  -Category Detail (Product List -Category)

# d. Brand
  -CRUD Operation
  -Brand List
  -Brand Detail (Product List - Brand)

# e. Payment Gateway
  -COD

# f. Review and Rating
# g. Offers and coupons
# h. Logistic