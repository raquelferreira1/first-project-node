const express = require('express')
const uuid = require('uuid')
const port = 3001
const app = express()
app.use(express.json())

const orders = []

//Crie um middleware que será utilizado em todas rotas que recebem o parâmetro ID, então ele deve verificar se o ID passado existe. Se não existir retorne um erro, caso contrário permita a requisição continuar normalmente;
const checkUserId = (request, response, next) => {
    const { id } = request.params

    const index = orders.findIndex(user => user.id === id)

    if (index < 0) { response.status(404).json({ error: "User not found" }) }

    request.userIndex = index
    request.userId = id
    next()
}

//Crie um middleware que é chamado em todas requisições que tenha um console.log que mostra o método da requisiçao(GET,POST,PUT,DELETE, etc) e também a url da requisição.
const checkMetUrl = (request, response, next) => {
    console.log(request.method)
    console.log(request.url)
    next()
}

//Rota que lista todos os pedidos já feitos.
app.get('/orders', checkMetUrl, (request, response) => {
    return response.json(orders)
})

//Essa rota recebe o id nos parâmetros e deve retornar um pedido específico.
app.get('/orders/:id', checkMetUrl, (request, response) => {
    const { id } = request.params
    const index = orders.find(user => user.id === id)

    return response.json(index)
})

//A rota deve receber o pedido do cliente, o nome do cliente e o valor do pedido, essas informações devem ser passadas dentro do corpo(body) da requisição, e com essas informações você deve registrar o novo pedido.
app.post('/orders', checkMetUrl, (request, response) => {
    const { order, clientName, price } = request.body
    const status = "Em preparação"
    const user = { id: uuid.v4(), order, clientName, price, status }
    orders.push(user)
    return response.status(201).json(user)
})

//Essa rota deve alterar um pedido já feito. Pode alterar um ou todos os dados do pedido. O id do pedido deve ser enviado nos parâmetros da rota.
app.put('/orders/:id', checkMetUrl, checkUserId, (request, response) => {
    const { order, clientName, price } = request.body
    const status = "Pedido alterado"
    const index = request.userIndex
    const id = request.userId

    const updateUser = { id, order, clientName, price, status }

    orders[index] = updateUser

    return response.json(updateUser)
})

//Essa rota deve deletar um pedido já feito com o id enviado nos parâmetros da rota.
app.delete('/orders/:id', checkMetUrl, checkUserId, (request, response) => {
    const index = request.userIndex
    orders.splice(index, 1)

    return response.status(204).json()
})

//Essa rota recebe o id nos parâmetros e assim que ela for chamada, deve alterar o status do pedido recebido pelo id para "Pronto".
app.patch('/orders/:id', checkMetUrl, checkUserId, (request, response) => {
    const { order, clientName, price } = request.body
    const status = "Pronto"
    const index = request.userIndex
    const id = request.userId

    const updateUser = { id, order, clientName, price, status }

    orders[index] = updateUser

    return response.json(updateUser)
})

app.listen(port, () => { console.log(`🚀 Server started on port ${port}`) })
