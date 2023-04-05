import express, { Request, Response } from "express";

const router = express.Router();

function isValidUUID (uuid: any) {
    let s =  uuid;

    s = s.match('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');
    if (s === null) {
      return false;
    }
    return true;
}

router.get("/ping", (req: Request, res: Response) => {
  res.send("pong")
})


router.post("/transactions", (req: Request, res: Response) => {
  const {account_id, amount} = req.body
  const isValidUUIDResult = isValidUUID(account_id)
  const head = req.get('Content-Type')

    if(head !== 'application/json'){
      return res.status(415).send('Wrong headers')
    }

  try{

    fetch('https://infra.devskills.app/api/transaction-management/transactions', {
      method: 'POST',
      body: JSON.stringify({
        account_id: account_id,
        amount: amount,
      }),
      headers: { 'Content-Type': 'application/json' }
    })
    .then((response) => {
      if(!account_id || !amount || !isValidUUIDResult){
        return res.status(400).send('Bad request. Make sure you have specified a valid account id and amount.')
      }
      if (response.ok){
        response.json()
        .then((data) =>  {
          
          res.status(201).send(data)
        })
      }
    })
  }
    catch(err) {
    res.status(404).send('Something went wrong')
  }
})


router.get("/transactions/:id", (req: Request, res: Response) => {
  const {id} = req.params
  try {

    fetch("https://infra.devskills.app/api/transaction-management/transactions/" + id )
    .then((response) =>{
      if (response.ok){
        response.json()
        .then((data) => {
          res.status(200).send(data)
        })
      } else {
        res.status(404).send('Something went wrong')
      }
    })
  }catch(err) {
    res.status(404).send('Something went wrong')
  }
})

router.get("/accounts/:id", (req: Request, res: Response) => {
  const {id} = req.params

    fetch("https://infra.devskills.app/api/transaction-management/accounts/" + id)
    .then((response) => {
      if (response.ok) {
        response.json()
        .then((data) => {
          res.status(200).send(data)
        })
      } else {
        res.status(404).send('Something went wrong')
      }
    })
})

router.get("/transactions", (req, res) => {
  try{

    fetch("https://infra.devskills.app/api/transaction-management/transactions")
    .then((res) => res.json())
    .then((data) => res.status(200).send(data))
  }catch(err){
    res.status(404).send('Something went wrong')
  }
})

export default router;
