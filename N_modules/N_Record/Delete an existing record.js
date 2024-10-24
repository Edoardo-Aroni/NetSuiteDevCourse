require(['N/record'], (record) => {

	let deleteContact = record.delete({
		type: record.Type.CONTACT,
		id: 1693  //use ID from record created in previous section
	});

	log.debug({
		title: 'Record deleted',
		details: deleteContact
	});
	
});