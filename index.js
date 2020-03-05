const express = require('express')
const path = require('path')
const fs = require('fs')
const bodyParser = require('body-parser')
const nodemailer = require('nodemailer')

const app = express()
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

/* Static folder */
app.use('/public', express.static(path.join(__dirname, 'public')))

/* Routes */
app.get('/', (_, res)=>{
    res.sendFile(path.join(__dirname,'public','index.html'))
})

app.post('/send', async (req, res) => {

    if(!req.body.email){
        res.send('Missing parameters')
        return
    }
    
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: 'test.isra.sender@gmail.com', // gmail user for test
          pass: 'Sender123' // test password
        }
    });
    
    // send mail with defined transport object
    await transporter.sendMail({
        from: '"Test Sender" <test.isra.sender@gmail.com>', // sender address
        to: req.body.email, // list of receivers
        subject: "Template de correo", // Subject line
        text: "", // plain text body
        html: fs.readFileSync(path.join(__dirname,'public','template.html')) // html body
    });

    res.send('Correo enviado a '+req.body.email)
})

app.listen(3000, () => {
    console.log('Servidor iniciado en el puerto 3000')
})