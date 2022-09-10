const { request, response } = require('express')
require('dotenv').config()
const express = require('express')
var morgan = require('morgan')
const cors = require('cors')

const isnum = require('./models/person')
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





app.post('/api/persons', (request, response, next) => { 
    console.log(request.body)
    let body = request.body 
    
    Person.find({name:body.name})
    .then(person=>{ 
      console.log(person[0])
      if (person[0]){
        return response.json({Error: "Name already exist"})
      } else{

        const note = new Person({
          name: body.name,
          number: body.number
        })
      
        note.save().then(savedNote => {
          response.json(savedNote)
        }) .catch(error=> next(error))
    
      }



        
})
 
    
})


app.put('/api/persons/:id', (request, response, next) => { 
  const body = request.body
  if(body.name === '' || body.number === ''){
    return response.status(400).json({
      error:"Invalid Number"
    })
  }
  array = body.number.split('-')
    if(array.length !== 2){
      return false
    } else if (array[0].length <2 || array[0].length > 3){
      return false
    }
    let isnum = /^\d+$/.test(array.join(''));
    
    if(!isnum){
      return response.status(400).json({
        error:"Invalid Number"
      })
    }

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
    } else if (error.name === 'ValidationError') {
      console.log("test")
      console.log(error)
      return response.status(400).json({ error: error.message })
    }
  
    next(error)
  }
  app.use(errorHandler)







  const PORT = process.env.PORT || 3001
  app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
  })

