const hasPermission= (accessedBy) => {


  return (req, res, next) => {
    try {
      const user = req.authUser || null;
        console.log('User Role:', user.role);
console.log('Allowed Roles:', accessedBy);

      if (!user) {
        throw {
          statusCode: 401,
          message: 'Please login first',
          detail: null
        }
      }


      //checking role
      if (( typeof accessedBy === 'string' && accessedBy == user.role)||(Array.isArray(accessedBy)&& accessedBy.includes(user.role))){
        next();
      }else{
        throw{
          statusCode: 403,
          message: 'You do not have permission to access this route',
          detail: null
        
        }
      }
    } catch (exception) {
      next(exception);
    }
  }
}



module.exports = {
  hasPermission 
}