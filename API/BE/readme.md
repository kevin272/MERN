# Architecture
## MVC Pattern
- model 
  - data mapping
  - data store
  - data definition
- View
  - Presentation
- Controller
  - 9.8 m/s2 => Acc due to g => 98m/s2


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
 - login 
 - signup
 - activation
 - forgot password
 - logout
 - dashboard
 - RBAC

# b. Product
  - CRUD Operation
  - Product List
      - Search
      - Category
      - Brand
  - Add to cart
  - Wishlist
  - Order

# c.Category
  - CRUD Operation
  - Category List
  - Category Detail (Product List -Category)

# d. Brand
  - CRUD Operation
  - Brand List
  - Brand Detail (Product List - Brand)

# e. Payment Gateway
  - COD

# f. Review and Rating
# g. Offers and coupons
# h. Logistic

## CRUD OPERATION
-> Methods
C = CREATE => post method
R = Read => get method
U = Update => put/patch method
D = Delete => delete method

## Auth and Authorization
=> Register
   => Data entry => FORM (React view)
     => Submit
       => BE/API caller
 
=> Login
 => Login View(FORM login, react)
    => Data entry (FORM action, react)
      => API call (BE call)
        => post method

## RES = Output REQ = INPUT


## MONGODB
 Dvlkvn
 
fBP9yiTHDSQu9giE

## Content
db.users.insertOne / insertMany()
db.users.deleteOne / deleteMany()
db.users.find / findOne()

- Core development
- ORM/ODM implementation


MVC
M = Model
Collection/table
    table name plural
    Model name singular
    for e.g
        users => table name
        User => User model

{key: value}
collection keys or table column
===> the properties of a model

User model => userObj() => keys

Every object of a model class is a row/document of a table/collection

### ER DIAGRAM
 use https://dbdiagram.io/d/666afd7ea179551be6cfebc4

### Creating Models 

For details about mongoose 
use mongoosejs.com