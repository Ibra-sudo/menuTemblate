const express = require('express')
// const dateFormat = require('dateformat')
const sendData = require('./modules/mysqlDataModal')
const adminRouter = require('./routes/adminRoutes')
const session = require('express-session')
const cookie = require('cookie-parser')


const app = express()

const sessionOptions = {
    secret: 'high-class',
    cookie: {}
}

app.use(session(sessionOptions))
app.use(cookie())

app.use(express.urlencoded({extended: false}));
app.use(express.json())

app.use(express.static('./public'));
app.set('view engine', 'ejs');
app.set('views',__dirname + '/views');

app.use('/dashboard', adminRouter ) 

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/index1', (req, res) => {
    res.render('index1');
});

// app.get('/admin', (req, res) => {
//     res.render('admin');
// });

app.get('/admin', (req, res) => {
    if (req.session.user){
        console.log(req.session.user);
        res.redirect('/admin')
    } else {
        res.render('admin')
    }

});

app.get('/dashboard', (req, res) => {
    sendData.getData().then((result) => {
        res.render('dashboard', {result});
        console.log(result);
    }).catch(error => {
        res.send('404');
    })
    
});
 app.post('/submit', (req, res) => {
     console.log(req.body);
     const tablenumber = req.body.tablenumber
     const fname = req.body.fname
     const lname = req.body.lname
     const email = req.body.email.trim()
     const telephone = req.body.telephone.trim()
     const address = req.body.address
     const city = req.body.city
     const zip = req.body.zip
     //const now = (new Date()).toJSON().replace(/\..*$/g,'')
    //  const now = new Date(1270544790922)
    //  now.toLocaleString('en-US', { timeZone: 'Europe/Helsinki' });
     const date = new Date(Date.UTC(2012, 11, 20, 3, 0, 0)); 
     //const now = date.toGMTString()
     const now = date.toLocaleString('en-GB', { timeZone: 'UTC' })

     
     //console.log(now);


     
     if(tablenumber && fname && lname && email || telephone && address && city && zip && now) {
        sendData.dataSender(tablenumber, fname, lname, email, telephone, address, city, zip, now ).then(()=>{
          
                res.json(1);
            
        }).catch(error =>{
            console.log(error);
            if (error == "exist") {
                res.json(3)
            } else {
                res.json(4)
            }

        })
         
     } else {
         res.json(2);
     }
 });

 app.post('/admin', (req, res) => {
    console.log(req.body);
    const username = req.body.username
    const password = req.body.password

    if(username && password ) {
       sendData.checkUser(username, password ).then((user) => {
        req.session.user = user
        res.json(1);
           
       }).catch(error =>{
           console.log(error);
           if (error == 3) {
               res.json(3)
           } else {
               res.json(4)
           }
       })       
    } else {
        res.json(2);
    }
});



app.listen(3000, () => {
    console.log('App listening on port 3000!');
});