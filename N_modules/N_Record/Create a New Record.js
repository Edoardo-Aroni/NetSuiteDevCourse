require(['N/record'], (record) => {

	//Contact information
	let firstName = 'John';
	let lastName = 'Smith';
	let phoneNumber = '555-222-4444';

	try {
		let newContact = record.create({
			type: record.Type.CONTACT
		});
	
		newContact.setValue({
			fieldId: 'firstname',
			value: firstName
		});
	
		newContact.setValue({
			fieldId: 'lastname',
			value: lastName
		});
	
		newContact.setValue({
			fieldId: 'phone',
			value: phoneNumber
		});
	
		newContact.setValue({
			fieldId: 'email',
			value: 'j.smith@abcmarketing.com'
		});
	
		newContact.setValue({
			fieldId: 'company',
			value: 325
		});
	
		newContact.setValue({
			fieldId: 'subsidiary',
			value: 1
		});
	
		let newRecord = newContact.save();
		
		log.debug({
			title: 'Record successfully saved',
			details: newRecord
		});
	
		if(newRecord) {
			let phoneCall = record.create({
				type: record.Type.PHONE_CALL
			});
	
			phoneCall.setValue({
				fieldId: 'title',
				value: 'New contact call'
			});
	
			phoneCall.setValue({
				fieldId: 'phone',
				value: phoneNumber
			});
	
			phoneCall.setValue({
				fieldId: 'assigned',
				value: 10  //employee ID
			});
	
			phoneCall.setValue({
				fieldId: 'message',
				value: `Call ${firstName} ${lastName} to setup new account.`
			});
	
			let newPhoneCall = phoneCall.save();
	
			log.debug({
				title: 'Follow-up phone call generated',
				details: newPhoneCall
			});
		};
	}
	
	catch (error){
		log.error({
			title: error.name,
			details: error.message
		});
	}

});