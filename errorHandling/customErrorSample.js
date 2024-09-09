define(['N/error'],function(error){
    var ordeProcessingErr = error.create({
        name: 'OrderProcessingErro',
        message: 'There was a problem processing your order.'
    });
    return {
        onRequest: function(context){
            try{
                if(problemWithOrder){
                    throw ordeProcessingErr;
                }
            }catch(e){
                // to do: handle exception
            }
        }
    }
});