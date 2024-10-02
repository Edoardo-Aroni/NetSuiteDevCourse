/**
 * @NApiVersion 2.1
 * @NScriptType Portlet
 */
define(['N/query'],
    function(query) {     
        function render(params) {
            // Create a portlet object and set the title
            var myPortlet = params.portlet;
            myPortlet.title = 'PL Shipping Address';

            // Add columns to the portlet
            myPortlet.addColumn({
                id: 'partner_name',
                type: 'url',
                label: 'Partner',
                align: 'LEFT'
            });
            myPortlet.addColumn({
                id: 'partner_mail',
                type: 'text',
                label: 'Email',
                align: 'LEFT'
            });
            myPortlet.addColumn({
                id: 'partner_addr',
                type: 'url',
                label: 'Shipping Address',
                align: 'LEFT'
            });

            // SuiteQL query to fetch partner details
            var suiteQLQuery = `
                SELECT 
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

            // Run the SuiteQL query
            var resultSet = query.runSuiteQL({
                query: suiteQLQuery
            });

            // Get the results and iterate over them
            var iterator = resultSet.iterator();
            iterator.each(function(result) {
                // Add rows to the portlet with the corresponding values
                params.portlet.addRow({
                    partner_name: result.getValue(0),
                    partner_mail: result.getValue(1),
                    partner_addr: result.getValue(2)
                });
                return true;  // Continue iterating
            });
        }

        return {
            render: render
        };
    }
);