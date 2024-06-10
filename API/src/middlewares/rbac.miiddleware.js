const hasPermission= (req,res,next) => {
  console.log('has permission middleware');
  next();
}



module.exports = {
  hasPermission 
}