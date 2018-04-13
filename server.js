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
      res.status(200).json({user:user});
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
    res.status(200).json({user:user});
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
app.post('/api/users/:id/creations', (req, res) => {
  console.log("creating new image");
  let id = parseInt(req.params.id);
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
    console.log(images[0].pixels);
    res.status(200).json({image: images[0]});
    return;
  }).catch(error => {
    console.log(error);
    res.status(500).json({error});
  });
});

// save an edited image
app.patch('/api/creations/:id', (req,res) =>{
  let id = parseInt(req.params.id);
  knex('images').where('id', id).first().update({
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
});

app.delete('/api/creations/:id', (req,res) =>{
  let id = parseInt(req.params.id);
  knex('images').where('id',id).first().del().then(() =>{
    res.status(200).send();
    return;
  }).catch(error => console.log(error));
});


app.listen(3000, () => console.log("server listening on port 3000"));
