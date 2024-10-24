require(['N/record'], (record) => {
	
	try{
        let updateContact = record.submitFields({
            type: record.Type.CONTACT,
            id: 1693,  //use ID from record created in previous section
            values: {
                title: 'CEO',
                isprivate: true,
                phone: '555-222-3333'
            }
        });

		log.debug({
			title: 'Record updated',
			details: updateContact
		});
	}
	
	catch(error){
		log.error({
			title: error.name,
			details: error.message
		});
	}

});