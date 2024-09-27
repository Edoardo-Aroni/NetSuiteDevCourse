/**
 *@NApiVersion 2.1
 *@NScriptType Suitelet
 */
 define([
    "N/query", 
    "N/record", 
    "N/task",
    "N/redirect",
    "N/search",
    "N/currency",
    "N/ui/serverWidget",
], function(query, record, task, redirect, search, currency, ui) {

    function formatDate(dateToFormat) {
        var values = {};

        if (dateToFormat) {
            var day = String(dateToFormat.getDate());
            if (day.length < 2) day = "0" + day;

            var month = String(dateToFormat.getMonth() + 1);
            if (month.length < 2) month = "0" + month;

            var year = String(dateToFormat.getFullYear());

            values = {
                day: day,
                month: month,
                year: year,
            };
        }

        return values;
    }
    
    function searchAccountingPeriod(){
        var dateValues = formatDate(new Date());
        // Construct date YYYY-MM-DD
        var dateSTR = dateValues.year + "-" + dateValues.month + "-" + dateValues.day;

        let searchQuery = `
            SELECT 
                id AS id,
                closedondate,
                isposting,
                enddate,
                startdate,
                closed,
                periodname AS name
            FROM accountingperiod
            WHERE 
                enddate =< TO_DATE( ?, 'YYYY-MM-DD') AND
			    isposting = 'T' AND
			    closed != 'T' AND
                alllocked != 'T'
		    ORDER BY enddate DESC
        `;

        return query.runSuiteQL({query : searchQuery, params : [dateSTR]}).asMappedResults();
    }

    /**
     * 
     * @param {*} accountingField 
     * @param {*} periodId 
     */
    function setAccountingPeriod(accountingField, periodId = false, periodName){

        var periods = searchAccountingPeriod()

        if (periodId && periodName)
            accountingField.addSelectOption({
                value: periodId,
                text: periodName
            });

        periods.forEach(function (value){
            if (value.id != periodId){
                accountingField.addSelectOption({
                    value: value.id,
                    text: value.name
                });
            }
        })
    }

    /**
     * 
     * @param {*} periodId 
     * @returns 
     */
    function searchExistingCustomExchangeForPeriod(periodId){
        let searchQuery = `
            SELECT 
                externalid,
                custrecord_eii_cer_accountingperiod,
                custrecord_eii_cer_fromcurrency,
                custrecord_eii_cer_averagerate,
                custrecord_eii_cer_currentrate,
                custrecord_eii_cer_historicalrate
            FROM customrecord_eii_consolidated_exchangera
            WHERE custrecord_eii_cer_accountingperiod = ?
        `;

        return query.runSuiteQL({query : searchQuery, params : [periodId]}).asMappedResults();

    }

    /**
     * 
     * @param {*} periodId 
     * @returns 
     */
    function searchConsolidateExchangeRates(periodId){

        //log.debug('test search', search.load('2797528'))

        var consExchRatesSearch = search.create({
            type: 'consolidatedexchangerate',
            filters: [
                search.createFilter({name: 'period', operator: search.Operator.ANYOF, values: [periodId]}), // 336 for august
                search.createFilter({name: 'formulatext', operator: 'isnotempty', values: [], formula: "{autocalc}"}),
                search.createFilter({name: 'isderivedrate', operator: 'is', values: ["F"]}),
            ],
            columns: [
                search.createColumn({name: 'internalid', label: "id"}),
                search.createColumn({name: 'periodname', label: "periodname"}),
                search.createColumn({name: 'closed', label: "closed"}),
                search.createColumn({name: 'tocurrency', label: "tocurrency"}),
                search.createColumn({name: 'fromcurrency', label: "fromcurrency"}),
                search.createColumn({name: 'currentrate', label: "currentrate"}),
                search.createColumn({name: 'averagerate', label: "average"}),
                search.createColumn({name: 'historicalrate', label: "historicalrate"}),
                search.createColumn({name: "formulatext", formula: "{autocalc}", label: "calculate"}),
            ]
        }); 
        
        var result = consExchRatesSearch.run().getRange(0, 1000);
        log.debug('result', result)
        log.debug('result number', result.length)

        return result;

    }
    
    function generateMappingFromQuery(result){
        return result.reduce((obj, cur) => ({ ...obj, [cur.name]: cur.id }), {})
    }

    function getAllCurrencies(){
        let result = query.runSuiteQL({query : `SELECT id, name FROM currency`}).asMappedResults();
        return generateMappingFromQuery(result)
    }

    function getAllPeriod(){
        let result = query.runSuiteQL({query : `SELECT id, periodname AS name FROM accountingperiod WHERE isposting = 'T' AND closed != 'T'`}).asMappedResults();
        return generateMappingFromQuery(result)
    }

    /**
     * 
     * @param {*} exchangeRates 
     * @param {*} currencies 
     * @param {*} periods 
     * @returns 
     */
    function groupByCurrencies(exchangeRates, currencies, periods){

        var pairedExchangeRates = {}

        exchangeRates.forEach(function (rate){

            var periodId = periods[rate.getValue('periodname')]
            var toCurrency = currencies[rate.getValue('tocurrency')];
            var fromCurrency = currencies[rate.getValue('fromcurrency')];
            
            // To make pairing uniq
            var uniqKey = `${periodId}_${toCurrency}_${fromCurrency}`

            if (!pairedExchangeRates.hasOwnProperty(uniqKey))
                pairedExchangeRates[uniqKey] = {
                    period: periods[rate.getValue('periodname')],
                    tocurrency: currencies[rate.getValue('tocurrency')],
                    fromcurrency: currencies[rate.getValue('fromcurrency')],
                    /*averagerate: rate.getValue('averagerate'),
                    currentrate: rate.getValue('currentrate'),
                    historicalrate: rate.getValue('historicalrate'),*/
                }
        });

        return pairedExchangeRates
    }

    /**
     * 
     * @param {*} pairedExchangeRates 
     */
    function createCustomExchangeRates(pairedExchangeRates){

        var listOfErrors = "";

        for (var key in pairedExchangeRates){

            try{
                var myRate = pairedExchangeRates[key]

                var customExchangeRecord = record.create({
                    type: 'customrecord_eii_consolidated_exchangera',
                    isDynamic: true
                });
                customExchangeRecord.setValue('externalid', key)
                customExchangeRecord.setValue('custrecord_eii_cer_accountingperiod', myRate.period)
                customExchangeRecord.setValue('custrecord_eii_cer_tocurrency', myRate.tocurrency)
                customExchangeRecord.setValue('custrecord_eii_cer_fromcurrency', myRate.fromcurrency)
                customExchangeRecord.save();
            } catch (e){
                listOfErrors += `* Period (id): ${myRate.period}, To currency (id):  ${myRate.tocurrency}, from currency (id):  ${myRate.fromcurrency} /`
            }
        }
        return listOfErrors
    }

    function processConsolidation(context){
        log.debug('processConsolidation', context)
        log.debug('processConsolidation - params', context.request.parameters)
        var periodId = context.request.parameters.custpage_cer_account_period;

        var currencies = getAllCurrencies();
        var periods = getAllPeriod();
        var exchangeRates = searchConsolidateExchangeRates(periodId);
        var pairedExchangeRates = groupByCurrencies(exchangeRates, currencies, periods)
        log.debug('pairedExchangeRates', pairedExchangeRates)

        // Get the average rate for the currency
        var errors = createCustomExchangeRates(pairedExchangeRates)
        log.debug('current errors', errors)
        try {
            var mapReduceTask = task.create({
                taskType: task.TaskType.MAP_REDUCE,
                scriptId: "customscript_mr_calculateconsolidatedexc",
            });
            var taskId = mapReduceTask.submit();

            log.audit("Start MR Consolidation Exchange Rates", taskId);
        } catch (e) {
            log.error("Error MR Consolidation Exchange Rates", e.message);
            errors += 'Error when launching the consolidation script: ' + e.message;
        }

        return redirect.toSuitelet({
            scriptId: 'customscript_sl_calculateconsolidatedexc',
            deploymentId: 'customdeploy_sl_calculateconsolidatedexc',
            parameters: {
                inpt_custpage_cer_account_period: context.request.parameters.inpt_custpage_cer_account_period,
                custpage_cer_account_period: context.request.parameters.custpage_cer_account_period,
                message: '',
                errors: errors,
                number: Object.keys(pairedExchangeRates).length
            }
        });
    }

    function createForm(context){
        var params = context.request.parameters
        var periodId = params.custpage_cer_account_period
        var periodName = params.inpt_custpage_cer_account_period
        var errors = params.errors;
        var number = params.number;
        var form = ui.createForm({title: 'Calculate Consolidated Exchange Rates'});

        if (errors){
            log.debug('errors founded', errors)
            var message = "Records already exist with pairing values: <br>"
            var listOfErrors = errors.split('/')
            
            listOfErrors.forEach(function(err){
                message += err + '<br>'
            })

            form.addField({
                id: 'custpage_cer_status_error',
                type: ui.FieldType.INLINEHTML,
                label: " ", container: 'html'
            }).defaultValue = "<br/><h1 style=\'font-size:20px; color: red\'>" + message + "</h1>"
        } else {

            if (number){
                form.addField({
                    id: 'custpage_cer_status_error',
                    type: ui.FieldType.INLINEHTML,
                    label: " ", container: 'html'
                }).defaultValue = "<br/><h3 style=\'font-size:20px; color: black\'>" + number + " of unique currency pairs for relevant currency exchange rate pairs will be processed in the table EII | Consolidated Exchange Rates and used to update the native consolidated exchange rate table. </br> You can close this window now. </h3>"            
                context.response.writePage(form);
                return
            }
    
            var accountingField = form.addField({id: 'custpage_cer_account_period',type: ui.FieldType.SELECT, label: 'Accounting Period'});
            accountingField.isMandatory = true;
            setAccountingPeriod(accountingField, periodId, periodName);
    
            form.addSubmitButton({label: 'Process'});

        }



        context.response.writePage(form);
    }

    function onRequest(context) {
        var params = context.request.parameters
    
        if (context.request.method === 'GET')
            createForm(context)
        else
            processConsolidation(context)
    }

    return {
        onRequest: onRequest
    }
});

