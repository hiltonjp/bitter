// Express setup
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static('public'));

//knex setup
const env = process.env.NODE_ENV || 'development';
const config = require('./knexfile')[env];
const knex = require('knex')(config);

//bcrypt
const bcrypt = require('bcrypt');
const saltRounds = 10;

// user defaults
const default_role = 'user';
const default_favcolor = '#fefefe';

// jwt setup
const jwt = require('jsonwebtoken');
let jwtSecret = process.env.jwtSecret;
if (jwtSecret === undefined) {
  console.log("You need to define a jwtSecret environment variable to continue.");
  knex.destroy();
  process.exit();
}

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    console.log("oh butterbeans, no auth token");
    return res.status(403).send({ error: 'No token provided.' });
  }
  jwt.verify(token, jwtSecret, function(err, decoded) {
    if (err)
      return res.status(500).send({ error: 'Failed to authenticate token.' });
    // if everything good, save to request for use in other routes
    req.userID = decoded.id;
    next();
  });
}


// Get my account
app.get('/api/me', verifyToken, (req,res) => {
  knex('users').where('id',req.userID).first().select('username','fname', 'lname','id', 'favcolor').then(user => {
    res.status(200).json({user:user});
  }).catch(error => {
    res.status(500).json({ error });
  });
});

// log in a user
app.post('/api/login', (req, res) => {
  if (!req.body.email || !req.body.password)
    return res.status(400).send();
  knex('users').where('email',req.body.email).first().then(user => {
    if (user === undefined) {
      res.status(403).send("Invalid credentials");
      throw new Error('abort');
    }
    return [bcrypt.compare(req.body.password, user.hash),user];
  }).spread((result,user) => {
    if (result) {
      console.log(user);
      let token = jwt.sign({ id: user.id }, jwtSecret, {
        expiresIn: 86400 // expires in 24 hours
      });
      res.status(200).json({user:user,token:token});
    }
    else
      res.status(403).send("Invalid credentials");
    return;
  }).catch(error => {
    if (error.message !== 'abort') {
      console.log(error);
      res.status(500).json({ error });
    }
  });
});

// register a new user
app.post('/api/users', (req, res) => {
  console.log("register");
  if (!req.body.email ||
      !req.body.password ||
      !req.body.username ||
      !req.body.fname ||
      !req.body.lname)
    return res.status(400).send();
  knex('users').where('email',req.body.email).first().then(user => {
    if (user !== undefined) {
      res.status(403).send("Email address already exists");
      throw new Error('abort');
    }
    return knex('users').where('username',req.body.username).first();
  }).then(user => {
    if (user !== undefined) {
      res.status(409).send("User name already exists");
      throw new Error('abort');
    }
    return bcrypt.hash(req.body.password, saltRounds);
  }).then(hash => {
    var favcolor = "";
    if (!req.body.favcolor)
      favcolor = default_favcolor;
    else
      favcolor = req.body.favcolor;

    return knex('users').insert({
      email:    req.body.email,
      hash:     hash,
      username: req.body.username,
			fname:     req.body.fname,
      lname:     req.body.lname,
      favcolor: favcolor,
      role: default_role
    });

  }).then(ids => {
    return knex('users').where('id',ids[0]).first().select('username','fname', 'lname','id', 'favcolor');
  }).then(user => {
    let token = jwt.sign({ id: user.id }, jwtSecret, {
      expiresIn: 86400 // expires in 24 hours
    });
    res.status(200).json({user:user, token:token});
    return;
  }).catch(error => {
    if (error.message !== 'abort') {
      console.log(error);
      res.status(500).json({ error });
    }
  });
});

// get creations for a user
app.get('/api/users/:id/creations', (req, res) => {
  let id = parseInt(req.params.id);
  knex('users').join('images','users.id','images.creator_id')
    .where('users.id',id)
    .orderBy('created', 'desc')
    .select('images.id','title','pixels','username','fname','lname','created').then(creations => {
      res.status(200).json({creations:creations});
    }).catch(error => {
      console.log(error);
      res.status(500).json({ error });
    });
});

// create a new image
app.post('/api/users/:id/creations', verifyToken,(req, res) => {
  console.log("creating new image");
  let id = parseInt(req.params.id);
  if (id !== req.userID) {
    res.status(403).send();
    return;
  }
  knex('users').where('id',id).first().then(user => {
    console.log("found user");
    let resolution = req.body.resolution;
    var data = [];
    for (let i = 0; i < resolution; i++) data.push("#FFFFFF");
    var json = JSON.stringify(data);
    console.log(json);
    return knex('images').insert({
      title: "untitled creation",
      pixels: json,
      creator_id: id,
      univ_edit: false,
      created: new Date(),
    });
  }).then(ids => {
    console.log("created image");
    console.log(ids);
    return knex('images').where('id',ids[0]);
  }).then(images => {
    //console.log(images[0].pixels);
    res.status(200).json({image: images[0]});
    return;
  }).catch(error => {
    console.log(error);
    res.status(500).json({error});
  });
});

// save an edited image
app.patch('/api/creations/:id', verifyToken, (req,res) =>{
  let imageId = parseInt(req.params.id);
  knex('images')
    .where('id', imageId)
    .select('creator_id').first().then(id => {
      if (id.creator_id !== req.userID) {
        console.log("id: ",id.creator_id);
        console.log("req.userID", req.userID);
        console.log("Oh noes, this isn't korrect");
        res.status(403).send();
      } else {
        knex('images').where('id',imageId).update({
          title: req.body.title,
          pixels: req.body.data,
          univ_edit: req.body.univ_edit
        }).then(count =>{
          res.status(200).send();
          return;
        }).catch(error =>{
          console.log("ERROR: api/creations/"+id);
          console.log(error);
          res.status(500).json({error});
        });
      }
    });
});

app.delete('/api/creations/:id', verifyToken, (req,res) =>{
  let imageId = parseInt(req.params.id);
  console.log(imageId); 
  knex('images')
    .where('id', imageId)
    .select('creator_id').first().then(id => {
      if (id.creator_id !== req.userID) {
        console.log("id: ",id.creator_id);
        console.log("req.userID", req.userID);
        console.log("Oh noes, this isn't korrect");
        res.status(403).send();
      } else {
        knex('images').where('id',imageId).del().then(count =>{
          res.status(200).send();
          return;
        }).catch(error =>{
          console.log("ERROR: delete api/creations/"+id);
          console.log(error);
          res.status(500).json({error});
        });
      }
    });
});

app.listen(3000, () => console.log("server listening on port 3000"));
