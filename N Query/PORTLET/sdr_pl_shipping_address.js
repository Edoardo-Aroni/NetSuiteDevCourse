/**
 * @NApiVersion 2.1
 * @NScriptType Portlet
 */
define(['N/query'],
    function(query){     
        function render(params){
            //create a portlet object and set the params.portlet method to render the portlet
            var myPorlet = params.portlet;
            // use the Portlet.title property to determine the portlet title
            myPorlet.title ='PL Shipping Address';
            //add columns using the Portlet.addColumn(options) method
            myPorlet.addColumn({
                id: 'partner_name',
                type: 'url',
                label: 'Partner',
                align: 'LEFT'
            });
            myPorlet.addColumn({
                id: 'partner_mail',
                type: 'text',
                label: 'Email',
                align: 'LEFT'
            });
            myPorlet.addColumn({
                id: 'partner_addr',
                type: 'url',
                label: 'Shipping Address',
                align: 'LEFT'
            });

            var mysuiteQLquery = 
            `SELECT 
                ('<a href="/app/common/entity/partner.nl?id=' || p.id || '">' ||
                p.entitytitle || '</a>') AS partner,
                ('<a href="mailto:' || p.email || '" target="_blank">' || p.email || 
                '</a>') AS email,
                ('<a href="https://www.google.com/maps/search/' || 
                COALESCE(paddrbookent.addr1, '') || '+' ||
                COALESCE(paddrbookent.city, '') || '+' || 
                COALESCE(paddrbookent.state, '') || '+' || 
                COALESCE(paddrbookent.country, '') || '+' || 
                COALESCE(paddrbookent.zip, '') || '">' ||
                COALESCE(paddrbookent.city, '') || ' ' || 
                COALESCE(paddrbookent.country, '') || '</a>') AS googlemap
            FROM 
                partner AS p
            JOIN 
                partneraddressbook AS paddrbook
                ON p.id = paddrbook.entity
            JOIN 
                partneraddressbookentityaddress AS paddrbookent
                ON paddrbook.addressbookaddress = paddrbookent.nkey
            WHERE
                paddrbook.defaultShipping IS NOT NULL
                AND paddrbookent.city IS NOT NULL
                AND paddrbookent.country IS NOT NULL
            ORDER BY
                p.entityid ASC`;

            var resultsSet = query.runSuiteQL({
                query: mysuiteQLquery
            });

            var results = resultSet.results;

            var iterator = resultSet.iterator();
               iterator.each(function(result){
                var currentResult = result.value;
                params.portlet.addRow({
                    partner_name: currentResult.getValue(0),
                    parner_email: currentResult.getValue(1),
                    partner_addr: currentResult.getValue(2)
                });
                return true;
               });
    }
    return{
        render:render
    };
});