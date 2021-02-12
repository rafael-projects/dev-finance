const Modal = {

    open(){
        //open button NovaTransação
        document
        .querySelector('.modal-overlay')
        .classList
        .add('active')
    },
    close(){
        document
        .querySelector('.modal-overlay')
        .classList
        .remove('active')
    }
}

const Storage = {
    get () {
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || [];
    },
    set(transactions) {
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions));
    }
}

//apartir daqui
//somar entradas e saidas
//remover das entradas o valor das saidas
//dai terei o total


    
//pegar transações 
//e realizar calculo;

const Transaction = {
    all: Storage.get(),

    add(transaction){

        Transaction.all.push(transaction)

        App.reload();
    },
    remove(index){
        Transaction.all.splice(index, 1);
        App.reload();
    },
    incomes(){
        let income = 0;
        //pegar todas as transações
        Transaction.all.forEach(transaction => {
                //verificar se cada transaction é > 0
                if(transaction.amount > 0){
                //somar a uma variável e retornar a mesma
                income += transaction.amount;
                }
        });
        return income;
    },
    expense(){
        let expense = 0;
            Transaction.all.forEach(transaction => { 
                if(transaction.amount < 0){
            expense += transaction.amount;
                }
        });
        return expense;
    },
    total(){
        return Transaction.incomes() + Transaction.expense()

    }
}

//substituir dados do html por js

const DOM = {

    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
        const tr= document.createElement('tr');
            tr.innerHTML = DOM.innerHTMLTransaction(transaction, index);
            tr.dataset.index = index;
            DOM.transactionsContainer.appendChild(tr);

    },
    innerHTMLTransaction(transaction, index) { 
        /*testa se true  || false */const CSSclass = transaction.amount > 0 ? "income" : "expense";
        /*testa se true  || false */const amount = Utils.formatCurrency(transaction.amount);
        const html = `
            <tr>
                <td class="description">${transaction.description}</td>
                <td class="${CSSclass}">${amount}</td>
                <td class="date">${transaction.date}</td>
                <td>
                    <img onClick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover Transação"}>
                </td>
            </tr>
            
        `;

        return html;
            /* testar cada função usando => console.log();*/
    },
    upDateBalance(){
        document
            .getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.incomes());
        document
            .getElementById('expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.expense());
        document
            .getElementById('totalDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.total());
    },
    clearTransactions(){
        DOM.transactionsContainer.innerHTML = "";
    }
}

const Utils = {
    formatAmount(value){
        
        value = Number(value) * 100;
        return value;
    },
    formatDate(date){
        const splittedDate = date.split("-");
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },
    formatCurrency (value){
        const signal = Number(value) < 0 ? "-" : "";

            value = String(value).replace(/\D/g, "");

            value = Number(value) / 100;

            value = value.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
        });

        return (signal + value);
    }
}

const Form = {
        description: document.querySelector('input#description'),
        amount: document.querySelector('input#amount'),
        date: document.querySelector('input#date'),

        getValues() {
            return {
                description: Form.description.value,
                amount: Form.amount.value,
                date: Form.date.value
            }
        },
        
    
    validateFields(){
        const {description, amount, date} = Form.getValues();
        
            if(description.trim() === "" ||
                amount.trim() === "" ||
                date.trim() === "") {
                    throw new Error("Por favor, preencha todos os campos")
                }
    },

    formatValues() {
        let {description, amount, date} = Form.getValues();
            amount = Utils.formatAmount(amount);
            date = Utils.formatDate(date);
            return {
                description,
                amount,
                date
            }
    },
    clearFields(){
        Form.description.value = "";
        Form.amount.value = "";
        Form.date.value = "";
    },
    
    submit(event) {
        event.preventDefault();
        try{
            //verificar se todas as informações foram preenchidas
            Form.validateFields();
            //formatar os dados para Salvar;
            const transaction  = Form.formatValues();
            //salvar
            Transaction.add(transaction)
            //apagar os dados do formulário
            Form.clearFields();
            //modal close
            //atualizar app
            Modal.close();
                        
            } catch (error) {
                alert(error.message);
            }
        }
}


const App = {
    init(){
        Transaction.all.forEach( DOM.addTransaction );
        DOM.upDateBalance(); 
        Storage.set(Transaction.all);       
    },
    reload (){
        DOM.clearTransactions();
        App.init();
    },    
}


//retornando  dados 
App.init();




