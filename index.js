const { request, response } = require('express')
const express = require('express')
var morgan = require('morgan')
const cors = require('cors')



const app = express()
app.use(express.json())


app.use(morgan("tiny"))
app.use(cors())
let persons =[
     { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

  
app.get('/api/persons', (request, response) => {   
    console.log(request);
    response.json(persons)
  })

app.delete('/api/persons/:id', (request, response) => { 
    const id = Number(request.params.id) 
    persons = persons.filter(person=> person.id !== id)
    console.log(persons)
    response.status(204).end()   
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
    
    let min = Math.ceil(0);
    let max = Math.floor(99999999999999);
    const personId =  Math.floor(Math.random() * (max - min + 1)) + min
    
    const newPerson = {
        id: personId,
        name: body.name,
        number:body.number
    }
    persons = persons.concat(newPerson)
    console.log(newPerson)
    return response.json(newPerson)

})


app.put('/api/persons/:id', (request, response) => { 
  console.log(request.body)
  let body = request.body
  return response.json(body)
})

app.get('/api/persons/:id', (request, response)=>{
    const id = Number(request.params.id)
    const person = persons.find(person=>person.id === id)
    if(!person){
        return response.status(404).json({
            Error: "Person not found"
        })
    }
    response.json(person)
})



app.get('/info',(request, response)=>{
    const peopleNumber = persons.length
    const date = new Date()
    response.send(`<h3>Phonebook has info for ${peopleNumber} people</h3>
                    <h3>${date}</h3>
                `)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(unknownEndpoint)

  const PORT = process.env.PORT || 3001
  app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
  })

