const User = require('../../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.signup = (req, res) => {
  User.findOne({ email: req.body.email})
  .exec(async (error, user)=>{
    if(user) return res.status(400).json({
      message: 'Admin already registered'
    });
    const { 
      firstName,
      lastName,
      email,
      password,
    } = req.body;

    const hash_password = await bcrypt.hashSync(password, 10);

    const _user = new User ({
      firstName,
      lastName,
      email,
      hash_password,
      username: Math.random().toString(),
      role: 'admin'
    });
    _user.save((error, data)=>{
      if(error){
        console.log(error);
        return res.status(400).json({message: 'Something went wrong'});
      }
      return res.status(201).json({
        message: 'Account created successfully.',
        user: data
      })
    })
  })
}

exports.signin = (req, res) => {
  User.findOne({email: req.body.email})
  .exec((error, user)=>{
    if(error) return res.status(400).json({error});
    if(user){
      if(user.authenticate(req.body.password) && user.role === 'admin'){
        const token = jwt.sign({_id: user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn: '7d'});
        const {_id, firstName, lastName, email, role, fullName} = user;
        res.cookie('token', token, {expiresIn: '1h'});
        res.status(200).json({
          token,
          user: {
            _id, firstName, lastName, email, role, fullName
          }
        })
      }
      else{
        return res.status(400).json({message: 'INCORRECT PASSWORD'});
      }
    }
    else{
      return res.status(400).json({message: 'ADMIN ACCOUNT NOT FOUND'});
    }
  })
}

exports.signout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({message: 'Signed out successfully'});
}