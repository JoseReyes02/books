const helpers = {}

helpers.isAuthenticated = (req,res,next) => { 
    if(req.isAuthenticated()) {
        return next();
    }
    console.log('no Autenticado');
    res.redirect('/users/signin');
}

module.exports = helpers;