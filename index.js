//module externo
import inquirer from "inquirer";
import chalk from 'chalk'

//modulo interno
import fs from "fs"

Operacaos()

function Operacaos() {
    inquirer.prompt([{
        type: 'list',
        name: 'actions',
        message: "O que vc deseja fazer?",
        choices: ['Criar Conta', 'Consultar Saldo', 'Depositar', 'Sacar', 'Sair']
    }]).then((answer)=>{
        const action = answer['actions']
        if(action === 'Criar Conta'){
            CreaterAccount()
        } else if(action === 'Consultar Saldo'){
            getAccoutBalance()
        }else if(action === 'Depositar'){
            Depositar()
        }else if(action === 'Sacar'){
            Sacar()
        }else if(action === 'Sair'){
            console.log(chalk.bgBlue.black('Obrigado por usar o Accounts'))
            process.exit()
        }
    }).catch((err)=> console.log(err))
}

function CreaterAccount() {
    console.log(chalk.black.bgGreen('Obrigado por usar o nosso banco'))
    console.log(chalk.green('Defina as opçôes da sua conta a seguir: '))

    buildAccount()
}

function buildAccount() {
    inquirer.prompt([{
        name: 'accountName',
        message:'Digite o nome da sua conta: ',
    }]).then((answer)=>{
        const accountName = answer['accountName']
        console.info(accountName)

        if (!fs.existsSync('accounts')){
            fs.mkdirSync('accounts')
        }

        if(fs.existsSync(`accounts/${accountName}.json`)){
            console.log(chalk.black.bgRed('Aconta já existe')
            )
            buildAccount()
            return
        }

        fs.writeFile(`accounts/${accountName}.json`,'{"balance": 0}', function(err){
            console.log(err)
        },)
        console.log(chalk.green('Sua conta foi criada com sucesso'))
        Operacaos()
    })
    .catch((err) => console.log(err))
}

function Depositar() {
    inquirer.prompt([{
        name: 'accountName',
        message:'Digite o nome da sua conta: ',
    }]).then((answer)=>{
        const accountName = answer['accountName']
        if(!checkAccount(accountName)){
            return Depositar()
        }
        inquirer.prompt([{
            name: 'amout',
            message:'Qual é o valor  vc deseja depositar:'
        }]).then((answer)=>{
            const amout = answer['amout']

            addAmout(accountName, amout)

            Operacaos()
        }).catch((err) => console.log(err))
        

    }).catch((err) => console.log(err))

}

function checkAccount (accountName){
    if(!fs.existsSync(`accounts/${accountName}.json`)){
        console.log(chalk.bgRed.black('Esta conta não está cadastrada'))
        return false
    }

    return true

}

function addAmout(accountName, amout) {
    const accountData = getAccout(accountName)

    if(!amout){
        console.log(chalk.bgRed.black('Ocoreu um erro, tente novamente mais tarde'))
        return Depositar()
    }
    
    accountData.balance = parseFloat(amout) + parseFloat(accountData.balance)

    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        function(err){
            console.log(err)
        }
    )

    console.log(chalk.green(`Foi adicionado a sua conta o valor de R$${amout}`))
}
function getAccout(accountName) {
    const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
        encoding: 'utf8',
        flag: 'r'}
    )
    return JSON.parse(accountJSON)
}

function getAccoutBalance(){
    inquirer.prompt([{
        name: 'accountName',
        message: 'Digite o nome da sua conta: '
    }]).then((answer)=>{
        const accountName = answer['accountName']

        if(!checkAccount(accountName)){
            return getAccoutBalance()
        }

        const accountData = getAccout(accountName)

        console.log(chalk.bgBlue.black(`Olá o seu saldo é R$${accountData.balance}`))
        Operacaos()
    }).catch((err)=>console.log(err))

}

function Sacar(){
    inquirer.prompt([{
        name: 'accountName',
        message: 'Digite o nome da sua conta: '
    }]).then((answer)=>{
        const accountName = answer['accountName']


        if(!checkAccount(accountName)){
            console.log(chalk.bgRed.black('Essa conta não existe!!! Tente novamente'))
            return Sacar()
        }

        inquirer.prompt([{
            name: 'saque',
            message: 'Quanto vc deseja sacar? '
        }]).then((answer)=>{
            const saque = answer['saque']

            addSaque(accountName, saque)

        }).catch((err)=>console.log(err))
    }).catch((err) => console.log(err))
}

function addSaque(accountName, saque){
    const accountData = getAccout(accountName)

    if(!saque){
        console.log(chalk.bgRed.black('Ocoreu algum erro! Tente novamente'))
        return Sacar()
    }

    
    if(parseFloat(accountData.balance)<parseFloat(saque)){
        console.log(chalk.bgRed.black("Operação inválida!! Valor do saque acima do salto disponível"))
        return Sacar()
    }

    accountData.balance = parseFloat(accountData.balance) - parseFloat(saque)
    
    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        function(err){
            console.log(err)
        }
    )

    console.log(chalk.bgBlue.black(`Foi sacado o valor de R$${saque}`))
    console.log(chalk.green(`Seu saldo é de R$${accountData.balance}`))
    Operacaos()
}