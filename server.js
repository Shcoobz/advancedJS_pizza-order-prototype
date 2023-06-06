const express = require ('express')
const app = express()
//nesaprotu:
const fs = require(`fs`)

app.get('/', (req, res)=> {
  const jsonData = fs.readFileSync('pizzas.json','utf8')
	const data = JSON.parse(jsonData)
  
  res.send(data)
  res.render(index)
})

app.listen(3000)
