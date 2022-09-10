const mongoose = require('mongoose')
console.log(process.argv.length)
if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://zero:${password}@cluster0.isxl44w.mongodb.net/phonebookApp?retryWrites=true&w=majority`

const noteSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', noteSchema)

mongoose
  .connect(url)
  .then((result) => {
    console.log('connected')
    if(process.argv.length === 3 ){
        Person.find({}).then(result => {
            result.forEach(person => {
              console.log(person)
            })
            mongoose.connection.close()
            return
          })
    }



    const person = new Person({
      name: `${process.argv[3]}`,
      number: process.argv[4]
    })

    return person.save()
  })
  .then(() => {
    console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook !`)
    return mongoose.connection.close()
  })
  .catch((err) => console.log(err))
