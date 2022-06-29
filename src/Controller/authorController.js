const authorModel=require("../Model/authorModel")
const {validate}=require("email-validator")
const passwordValidator=require("password-validator")
const jwt=require("jsonwebtoken")
// const namevalidator=require("validate-npm-package-name")

let schema = new passwordValidator();
    schema.is().min(8).is().max(100).has().uppercase().has().lowercase().has().digits(2).has().not().spaces().is().not().oneOf(['Passw0rd', 'Password123', 'mypassword']);

const createAuthor=async function(req,res){
    try{
        let data=req.body
       let {fname,lname,password,email,title}=data
    //let data=req.body
    if(Object.keys(data).length==0){
        return res.status(400).send({status:false,msg:"please give keys properly" })
    }
  if(!fname|| !lname || !title || !email || !password){
    return res.status(400).send({status:false,msg:"please give required fields " })
}
if(!fname.trim()|| !lname.trim() || !title.trim() || !email.trim() || !password.trim()){
    return res.status(400).send({status:false,msg:"please dont give space " })
}

if(["Mr", "Mrs", "Miss"].indexOf(data.title)==-1)
return res.status(400).send({status:false,msg:"Enter a valid title Mr or Mrs or Miss " })

if(!validate(email)){
    return res.status(400).send({status:false,msg:"Enter a valid email " })
}
    let checkPassword = schema.validate(password)
    if(!checkPassword) {
        return res.status(400).send({status:false,msg:"Enter a valid password " })
    }

    let saveData=await authorModel.create(data)
    res.status(201).send({status:true,data:saveData})

      }catch(err){

        res.status(500).send({err:err.message})
    }
}

const loginAuthor=async function (req,res){
    try{

   let{email,password}=req.body

if(!email || !password){
    return res.status(400).send({status:false,msg:"plz Enter email and password " })
}
email=email.trim()

 if(!validate(email)){

return res.status(400).send({status:false,msg:"Enter a valid email " })
    }
// email=email.toLowerCase()

    let checkPassword = schema.validate(password)
    if(!checkPassword) {
        return res.status(400).send({status:false,msg:"Enter a valid password " })
    }
   const authorData=await authorModel.findOne({
    email,password
   })
   if(!authorData){
    return res.status(400).send({status:false,msg:"no data found for this email & password"})
}

const token=jwt.sign({
    authorId:authorData._id
    },"this-is-a-srcret-key")

    res.status(200).send({staus:true,token})


    }catch(err){
        res.status(500).send({err:err.message})

    }
}



//module.exports.authorCreate=createAuthor
module.exports={createAuthor,loginAuthor}