const db = require('../lib/db');
const bcrypt = require('bcryptjs');

const salt = 10;

function createUser(req, res, next) {
  console.log(req.body)
  if (req.body.password === req.body.confirmPassword) {
    db.none('INSERT INTO users (username, password) VALUES ($1, $2);',
      [req.body.username, bcrypt.hashSync(req.body.password, salt)])
      .then( () => {
        console.log('user created!')
        next()
      })
    .catch(error => console.log(error))
  } else {
    next();
    return;
  }
}

function authenticate(req, res, next) {
  console.log(req.body.password)
  db.one('SELECT * FROM users WHERE username = $/username/;', req.body)
    .then((data) => {
      console.log(data.password)
      const match = bcrypt.compareSync(req.body.password, data.password);
      if (match) {
        res.status(200)
        next();
      } else {
        res.status(500).send('fuck u fite me irl');
      }
    })
  .catch(error => console.log(error))
}

module.exports = {
  createUser,
  authenticate,
}
