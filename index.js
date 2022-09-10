const { request, response } = require('express')
require('dotenv').config()
const express = require('express')
var morgan = require('morgan')
const cors = require('cors')


const app = express()
app.use(express.json())


app.use(morgan("tiny"))
app.use(cors())

app.use(express.static('build'))
const Person = require('./models/person')


  
app.get('/', (request, response) => {   
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {   
    console.log(request)
    Person.find({}).then(persons => {
      response.json(persons)
    })
  })

app.delete('/api/persons/:id', (request, response, next) => { 
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
  })





app.post('/api/persons', (request, response) => { 
    console.log(request.body)
    let body = request.body 

    if(!body){
        return response.status(400).json({ 
          error: 'content missing' 
        })
      

     } else if(!body.name  || body.name === ''){
        return  response.status(400).json({
            content: ` name can not be empty`
        })
       
     } else if(body.number === '' || !body.number){
        return  response.status(400).json({
            content: ` Number can not be empty`
        })
     }


    const exist = persons.find(person=>person.name === body.name)
    if(exist){
        console.log(`${exist.name} already in the phonebook`)
        return  response.status(400).json({
            error: 'name must be unique'
        })
    }
   
    
    const note = new Person({
      name: body.name,
      number: body.number
    })
  
    note.save().then(savedNote => {
      response.json(savedNote)
    })

})


app.put('/api/persons/:id', (request, response, next) => { 
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})



app.get('/api/persons/:id', (request, response,next)=>{
   Person.findById(request.params.id).then(person => {
    console.log(person)
    response.json(person)
  })
  .catch(error => next(error))
})




app.get('/info',(request, response)=>{
  Person.find({}).then(persons => {

    const peopleNumber = persons.length
    const date = new Date()
    response.send(`<h3>Phonebook has info for ${peopleNumber} people</h3>
                    <h3>${date}</h3>
                `)
              })
})




const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)






  const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
  
    next(error)
  }
  app.use(errorHandler)







  const PORT = process.env.PORT || 3001
  app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
  })

