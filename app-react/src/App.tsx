import './App.css';
import { useState } from 'react'

type AccountData = {
  account_id: string;
  amount: number;
  [key: number]: string;
}

function isValidUUID (uuid: any) {
    let s =  uuid;

    s = s.match('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');
    if (s === null) {
      return false;
    }
    return true;
}
function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

function resetForm() {
      const formInputAccountId = (document.getElementById('account_id') as HTMLInputElement | null)
      const formInputAmount = (document.getElementById('amount') as HTMLInputElement | null)
      formInputAccountId!.value = '';
      formInputAmount!.value = '';
}

function resetAccountIdInput() {
      const formInputAccountId = (document.getElementById('account_id') as HTMLInputElement | null)
      formInputAccountId!.value = '';
}

function resetAmountInput() {
      const formInputAmount = (document.getElementById('amount') as HTMLInputElement | null)
      formInputAmount!.value = '';
}

function App() {

  let scrollToTopBtn = document.getElementById("scrollToTopBtn");

window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    scrollToTopBtn!.style.display = "block";
  } else {
    scrollToTopBtn!.style.display = "none";
  }
}

    const [data, setData] = useState({
        account_id: '',
        amount: 0,
    })

    function handle(e: any){
        const newData: AccountData = {...data}
        newData[e.target.id] = e.target.value 
        setData(newData)
    }

    function submit(e: any) {
        e.preventDefault();
 
      if (!isValidUUID(data.account_id)){
        return window.alert('Account id is invalid')
      }

      if (data.amount === 0){
        return window.alert('0 is not a valid amount')
      }

     fetch('http://localhost:5000/transactions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
     }).then((response) => response.json())
        .then((html) => {

     const existingAccount = document.querySelector(`[data-account-id="${html.account_id}"]`) as HTMLElement

     if(existingAccount){

      const trimmedAmount = html.amount.replace(/-/g, "");
       
      if(html.amount < 0){
      const div = document.createElement('div');
      div.className = 'transaction-container'
        
      const updatedBalance = Number(existingAccount.dataset.balance) - Number(trimmedAmount)

      div.dataset.type = 'transaction'
      div.dataset.accountId = existingAccount.dataset.accountId
      div.dataset.amount = html.amount
      div.dataset.balance = updatedBalance.toString()

      const transferParagraph = document.createElement('p');
      transferParagraph.textContent = `Transfered ${html.amount}$ from ${html.account_id}`

      const balanceParagraph = document.createElement('p')
      balanceParagraph.textContent = `The current account balance is ${div.dataset.balance}`

      div.appendChild(transferParagraph)
      div.appendChild(balanceParagraph)

      const transaction_list = document.getElementById('transaction-list')
      transaction_list?.prepend(div)
      } 
    
     if (html.amount > 0){

      const div = document.createElement('div');
      div.className = 'transaction-container'

      const updatedBalance = Number(existingAccount.dataset.balance) + Number(trimmedAmount)
    
      div.dataset.type = 'transaction'
      div.dataset.accountId = existingAccount.dataset.accountId
      div.dataset.amount = html.amount
      div.dataset.balance = updatedBalance.toString()

      const transferParagraph = document.createElement('p');
      transferParagraph.textContent = `Transfered ${html.amount}$ to ${html.account_id}`

      const balanceParagraph = document.createElement('p')
      balanceParagraph.textContent = `The current account balance is ${div.dataset.balance}`

      div.appendChild(transferParagraph)
      div.appendChild(balanceParagraph)

      const transaction_list = document.getElementById('transaction-list')
      transaction_list?.prepend(div)
     } 
      }
  
    else {
      let accountOperationResponse = ''
      
      if(html.amount < 0){
        accountOperationResponse = `Transfered ${html.amount}$ from ${html.account_id}`
      }

      if(html.amount > 0){
        accountOperationResponse = `Transfered ${html.amount}$ to ${html.account_id}`
      }
      
      const div = document.createElement('div');
      div.className = 'transaction-container'
      div.dataset.type= "transaction";
      div.dataset.accountId = html.account_id
      div.dataset.amount = html.amount;
      div.dataset.balance = html.amount;
      

      const transferParagraph = document.createElement('p');
      transferParagraph.textContent = accountOperationResponse 

      const balanceParagraph = document.createElement('p')
      balanceParagraph.textContent = `The current account balance is ${div.dataset.balance}`

      div.appendChild(transferParagraph)
      div.appendChild(balanceParagraph)

      let h1DataSet = document.getElementById('transaction-header')?.dataset
      h1DataSet!.isVisible = 'true'
      const transaction_list = document.getElementById('transaction-list')
      transaction_list?.prepend(div)
     }
 })
}
  return (
    <div className="App">
          <div id='trans-form-container'>
                <form onSubmit={(e) => submit(e)} id="transaction-form"> 
                    <label>AccountId:</label><br/>
                    <input onChange={(e) => handle(e)} onClick={() => resetAccountIdInput()} id="account_id" value={data.account_id} data-type="account-id" type="text" /><br/>
                    <label>Amount:</label><br/>
                    <input onChange={(e) => handle(e)} onClick={() => resetAmountInput()} id="amount" value={Number(data.amount)} data-type="amount" type="number" /><br/><br/>
                    <input data-type="transaction-submit" type="submit" value="Submit" onClick={() => resetForm()}/>
                </form> 
          </div>
          <div id='trans-list-container'> 
            <h1 id='transaction-header' data-is-visible="false">Transaction history</h1>
            <div id='transaction-list'>
            </div>

          </div>
        <button onClick={topFunction} id="scrollToTopBtn" title="Go to top">Back To Top</button>

    </div>
  );
}

export default App;
