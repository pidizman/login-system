const express = require('express')
const app = express()
const port = 3001
const bodyParser = require('body-parser'); // Middleware
const db = require('quick.db')
const crypto = require('crypto')
const stringEdit = require('string-edit')

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/html/login.html")
})

app.get('/register', (req, res) => {
  res.sendFile(__dirname + "/html/register.html")
})

app.get('*', function(req, res){
  res.status(404)
  res.send("404!");
});

app.listen(port, () => {
  console.log(`server ready on ${port}`)
})

app.post('/', (request, response) => {
  const name = request.body.name;
  const pass = request.body.password;
  const salt = db.get(`${name}_salt`)

  const hash_pass = crypto.createHash('sha256').update(pass).digest('hex')

const all = hash_pass + salt
const hash_all = crypto.createHash('sha256').update(all).digest('hex')

  if(!db.get(`${name}_name`)||!db.get(`${name}_pass`)){
    response.send("Takový účet neznám")
  }

  if(hash_all === db.get(`${name}_pass`)){
    response.send("Byl jsi úspěšně přihlášen")
  } else if(hash_all !== db.get(`${name}_pass`)){
    response.send("Takoý účet neznám")
  }
})

app.post('/register', (request, response) => {
  const name = request.body.name;
  const password1 = request.body.password1;

  if(db.get(`${name}_name`) === name){
    response.send("Někdo už toto jméno používá!")
    return;
  }else{
    //salt()

    const saltS = crypto.randomBytes(15).toString('hex')
    const date = Date.now();
    const saltAll = saltS + date
    var saltSt = stringEdit.shuffle(saltAll)
    if(saltSt.length > 20) saltSt =   saltSt.substring(0,20)
  
    //password + salt
    const pass = password1
    const hash_pass = crypto.createHash('sha256').update(pass).digest('hex')
    
    const all = hash_pass + saltSt
  
    const hash_all = crypto.createHash('sha256').update(all).digest('hex')
    
    db.set(`${name}_name`, name)
    db.set(`${name}_salt`, saltSt)
    db.set(`${name}_pass`, hash_all)
    response.send('Byl jsi zaregistrován')
  }
  
  /*function salt(){
    const saltS = crypto.randomBytes(15).toString('hex')
    const date = Date.now();
    const saltAll = saltS + date
    var saltSt = stringEdit.shuffle(saltAll)
    if(saltSt.length > 20) saltSt =   saltSt.substring(0,20)
  
    //password + salt
    const pass = password1
    const hash_pass = crypto.createHash('sha256').update(pass).digest('hex')
    
    const all = hash_pass + saltSt
  
    const hash_all = crypto.createHash('sha256').update(all).digest('hex')
  }*/
})