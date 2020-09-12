// criacao das empreas
cardapio = {
    nome: 'Cardapio Online',
    cnpj: 587954123,
    endereco: [{ rua: 'Avenida Inglaterra', bairro: 'Jardim Europa', numero: 555, cep: '998855-040', completo: 'apt 1555' }],
    descricao: 'Empresa de alimentos',
    contato: [{ email: 'cardapio@gmail.com', telefone: '3424-5599' }],
}

jopones = {
    nome: 'Japones',
    cnpj: 123465798,
    endereco: [{ rua: 'Japones', bairro: 'Jardim Europa', numero: 789, cep: '998855-040', completo: 'apt 1555' }],
    descricao: 'Empresa de alimentos japoneses',
    contato: [{ email: 'japones@gmail.com', telefone: '3424-7892' }]
}

chines = {
    nome: 'chines',
    cnpj: 987654321,
    endereco: [{ rua: '', bairro: 'Jardim Europa', numero: 456, cep: '998855-040', completo: 'apt 1555' }],
    descricao: 'Empresa de alimentos chineses',
    contato: [{ email: 'chines@gmail.com', telefone: '3424-4652' }]
}

// criacao dos pratos
picanha = {
    nome: 'Picanha',
    preco: 80,
    tipo: 'carnes',
    acompanhamentos: 'Arroz, feijão, farofa e vinagrete'
}

salada = {
    nome: 'Salada',
    preco: 30,
    tipo: 'frios',
    acompanhamentos: 'Tomate, Cebola e Alface '
}

sushi = {
    nome: 'Temaki',
    preco: 40,
    tipo: 'frios',
    acompanhamentos: 'Camarão, Arroz, Peixe e Shoyu'
}

// criacao das bebidas
coca = {
    nome: "Coca-Cola 2l",
    preco: 8,
    tipo: "refrigerante"
}

skol = {
    nome: "Skol",
    preco: 8,
    tipo: "cerveja"
}

vinho = {
    nome: "Quinta do morgado",
    preco: 10,
    tipo: "vinho"
}

// insert empresa, comando para persistir os dados da empresa
db.empresa.insert(cardapio)
db.empresa.insert(jopones)
db.empresa.insert(chines)

// insert prato, comando para persistir os dados do prato
db.prato.insert(picanha)
db.prato.insert(salada)
db.prato.insert(sushi)

// insert bebida, comando para persistir os dados da bebida
db.bebida.insert(coca)
db.bebida.insert(skol)
db.bebida.insert(vinho)

// buscar por todas as empresas, e produtos(pratos e bebidas) 
db.empresa.find()
db.prato.find()
db.bebida.find()

// depois de cadastrados, realizar a atualizacao dos dados persistidos.
db.empresa.update({ _id: ObjectId("5f5cf3d4093324d560813de2") }, { $set: { 'nome': 'Meu Cardapio Online', "descricao": 'Bom Restaurante' } })
db.prato.update({ _id: ObjectId("5f5cf3d4093324d560813de5") }, { $set: { 'acompanhamentos': 'Arroz, farofa e vinagrete', "preco": 100 } })


// remove os dados persistidos
db.bebida.remove({ _id: ObjectId("5f5cf3d4093324d560813de8") })

// count, conta a quantidade de valores persistidos em cada Coleção
db.empresa.count()
db.prato.count()
db.bebida.count()

//filtros para pratos sem projeção
db.prato.find({ 'preco': { $lt: 100 } })
db.prato.find({ 'preco': { $eq: 100 } })
db.bebida.find({ 'preco': { $gt: 8.0 } })

//filtros com projeção
db.empresa.find({}, { _id: 0, nome: 1 }).limit(2)
db.prato.find({ 'nome': { $in: ['Picanha', 'Salada'] } }, { nome: 1, _id: 0 })
db.bebida.find({ 'tipo': { $in: ['cerveja'] } }, { nome: 1, _id: 0 })

//filtros com projeção e expressão regular
db.empresa.find({ nome: /Meu/ }, { _id: 0 })

// buscar por um atributo de alguma empresa cadastrada para ficar melhor a interação
db.empresa.find({ contato: { $elemMatch: { email: 'chines@gmail.com' } } })
db.empresa.find({ contato: { $elemMatch: { telefone: '3424-7892' } } })

// Embedded
// uma empresa precisa de suas bebidas e pratos cadastrados
// pode-se fazer a buscar procurando pelo prato
italiano = {
    nome: 'Italiano',
    cnpj: 15985242,
    endereco: [{ rua: 'Italiano', bairro: 'Jardim Italia', numero: 1598, cep: '558844-050', completo: 'apt 1598' }],
    descricao: 'Empresa de alimentos Italianos',
    contato: [{ email: 'italiano@gmail.com', telefone: '3424-2587' }],
    prato: ObjectId("5f5cf3d4093324d560813de5")
}

db.empresa.insert(italiano)
db.empresa.find({ 'nome': 'Italiano' }, { prato: 1 })

// Embedded
// uma empresa precisa de suas bebidas e pratos cadastrados
// pode-se fazer a buscar procurando pela bebida
pizzaria = {
    nome: 'Pizzaria',
    cnpj: 15985242,
    endereco: [{ rua: 'Pizzaria', bairro: 'Jardim Pizzaria', numero: 741, cep: '147852-050', completo: 'apt 001' }],
    descricao: 'Empresa de alimentos Pizzaria',
    contato: [{ email: 'pizzaria@gmail.com', telefone: '3424-1485' }],
    bebida: ObjectId("5f5cf3d4093324d560813dea")
}

db.empresa.insert(pizzaria)
db.empresa.find({ 'bebida': { '$in': [ObjectId("5f5cf3d4093324d560813dea")] } })

// verificar o total dos preços de cada coleção.
db.prato.aggregate([{ $group: { _id: null, total: { $sum: '$preco' } } }])
db.bebida.aggregate([{ $group: { _id: null, media: { $avg: '$preco' } } }])


// lookup
db.empresa.aggregate([{
    $lookup: {
        from: "bebida",
        localField: "bebida",
        foreignField: "_id",
        as: "minhas_bebidas"
    }
}])

// consulta a seu critério explicando o porquê dela.
// aqui seria uma empresa com alguns dos produtos cadastrados, com finalidade de aprenseta-los de maneira mais facil.
temakeria = {
    nome: 'Sushi do Ze',
    cnpj: 15985242,
    endereco: [{ rua: 'Tambau', bairro: 'Tambau', numero: 800, cep: '58000-040', completo: 'apt 100' }],
    descricao: 'Velhar conhecer os melhores pratos do oriente',
    contato: [{ email: 'zesushi@gmail.com', telefone: '3421-4455' }],
    bebida: ObjectId("5f5cf3d4093324d560813dea"),
    prato: ObjectId("5f5cf3d4093324d560813de7")
}

db.empresa.insert(temakeria)

db.empresa.aggregate([{
        $lookup: {
            from: "prato",
            localField: "prato",
            foreignField: "_id",
            as: "meus_pratos"
        }
    },
    {
        $lookup: {
            from: "bebida",
            localField: "bebida",
            foreignField: "_id",
            as: "minhas_bebidas"
        }
    }
])

// busca pelo id da empresa e retornando todos os dados do mesmo.
db.empresa.find({ '_id': ObjectId("5f5d08cd093324d560813ded") })