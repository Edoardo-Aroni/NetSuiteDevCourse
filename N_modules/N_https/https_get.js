require(['N/https'], (https) => {
    let response = https.get({url: 'https://65579d0abd4bcef8b612f41e.mockapi.io/api/v1/thirdpartyvendors/9'})

    if(response.code != '200') //how to handle response status depends on the endpoint.
        return false

    let thirdPartyVendor = JSON.parse(response.body); // how to handle the response body also depends on the format of the endpoint's response.

    // The endpoint responds with a string and should be parsed first
    let {companyName, contractExpiration, location, id} = thirdPartyVendor; // ESNext object destructuring is used to unpack the object. 

    log.debug({title: 'API Response', details: `\nCompany name: ${companyName} (id: ${id})
    Contract expires on ${contractExpiration}
    Vendor is located at ${location}`});
    
})