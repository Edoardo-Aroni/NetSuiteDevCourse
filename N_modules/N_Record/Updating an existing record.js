require(['N/record'], (record) => {

	let oldContact = record.load({
		type: record.Type.CONTACT,
		id: 1693  //use ID from record created in previous section
	});
	
	try{
		oldContact.setValue({
			fieldId: 'title',
			value: 'CEO'
		});

		oldContact.setValue({
			fieldId: 'isprivate',
			value: true
		});

		oldContact.setValue({
			fieldId: 'phone',
			value: '555-222-3333'
		});

		let updateContact = oldContact.save();

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