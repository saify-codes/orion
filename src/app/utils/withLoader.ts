export async function withLoader(promise:()=>Promise<any>, callback: Function){

  try{
      callback(true)
      return await promise()
  }finally{
      callback(false)
  }

}