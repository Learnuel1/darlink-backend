const buildUser =(userObj)=>{
    const {userId,password,...data}=userObj;
    return data
}

const commonReponse =(msg,data,field='data',others={}, op=true)=>{
    const response ={
        success:op,
        msg,
        [field]:data,
        ...others,
    }
    return response;
}
const buildProfile =(profileObj)=>{
    const {id,userId,...data}=profileObj;
    return data;
}
const buildPlan =(planObj)=>{
    const {id,userId,...data}=planObj;
return data;
}
const buildHistory =(planObj)=>{
    const {userId,...data}=planObj;
return data;
}
module.exports ={
    buildUser,
    commonReponse,
    buildProfile,
    buildPlan,
    buildHistory,
}