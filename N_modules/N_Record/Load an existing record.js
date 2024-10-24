require(['N/record'], (record) => {

	let oldContact = record.load({
		type: record.Type.CONTACT,
		id: 1693  //use ID from record created in previous section
	});

	let name = oldContact.getValue('entityid');
	let email = oldContact.getValue('email');
	let phone = oldContact.getValue('phone');
	let company = oldContact.getText('company');

	log.debug({
		title: 'Contact Record Details',
		details: `${name} works for ${company} and can be reached at ${email} or ${phone}.`
	});
	
});