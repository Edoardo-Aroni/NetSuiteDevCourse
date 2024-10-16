/**
 *@NApiVersion 2.1
 *@NScriptType MapReduceScript
 */
 define([
    "N/record",
    "N/search",
    "N/query",
    "N/runtime",
    "N/currency",
    "N/error",
], function(record, search, query, runtime, currency, error) { 


    function getInputData() {
        var searchQuery = `
            select id
            from customrecord_eii_consolidated_exchangera
            where 
                (custrecord_eii_cer_failed is empty OR custrecord_eii_cer_failed != 'T') AND 
                (custrecord_eii_cer_done is empty OR custrecord_eii_cer_done != 'T') 
        `;

        return query.runSuiteQL({ query: searchQuery}).asMappedResults();

    }

    function searchForCurrency(echangeRates, toCurrency, fromCurrency){

        var listOfEchangeRates = []
        
        echangeRates.forEach(function (rates){
            if (rates.getValue('tocurrency') == toCurrency && rates.getValue('fromcurrency') == fromCurrency)
                listOfEchangeRates.push(rates.id)
        })

        return listOfEchangeRates
    }

    /**
     * 
     * @param {*} periodId 
     * @returns 
     */
    function searchConsolidateExchangeRates(periodIds, toCurrency, fromCurrency){
        //log.debug('search', search.load('2797529'))
        var consExchRatesSearch = search.create({
            type: 'consolidatedexchangerate',
            filters: [
                search.createFilter({name: 'period', operator: search.Operator.ANYOF, values: periodIds}), // periodId
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
            ]
        }); 
        
        var result = consExchRatesSearch.run().getRange(0, 1000);
        log.debug('result number', result.length)
        var rates = searchForCurrency(result, toCurrency, fromCurrency)
        return rates;

    }

    function getRate(fromCurrency, toCurrency, date){
        return currency.exchangeRate({
            source: fromCurrency,
            target: toCurrency,
            date: date
        });
    }

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

    function searchAccountingPeriod(date){
        var dateValues = formatDate(date);
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
			    closed != 'T'
		    ORDER BY enddate DESC
        `;

        return query.runSuiteQL({query : searchQuery, params : [dateSTR]}).asMappedResults()[0];
    }

    function calculateAverageRate(fromCurrencyId, toCurrencyId, startdate, enddate){

        var startdateValues = formatDate(startdate);
        var enddateValues = formatDate(enddate);
        // Construct date YYYY-MM-DD
        var startddateSTR = startdateValues.year + "-" + startdateValues.month + "-" + startdateValues.day;
        var enddateSTR = enddateValues.year + "-" + enddateValues.month + "-" + enddateValues.day;

        /*let searchQuery = `
            select 
                effectivedate ,
                transactioncurrency AS fromcurrency,
                basecurrency AS tocurrency,
                exchangerate
            from currencyrate
            where 
                effectivedate >= TO_DATE( ?, 'YYYY-MM-DD') AND 
                effectivedate =< TO_DATE( ?, 'YYYY-MM-DD') AND
                basecurrency = ? AND 
                transactioncurrency = ?
            order by effectivedate  ASC
        `;*/

        let searchQuery = `
            SELECT
                BaseSymbol,
                TransactionSymbol,
                ExchangeRate,
                EffectiveDate,
                LastModifiedDate
            FROM
                (SELECT
                    BaseCurrency.Symbol AS BaseSymbol,
                    TransactionCurrency.Symbol AS TransactionSymbol,
                    CurrencyRate.ExchangeRate,
                    TO_CHAR( CurrencyRate.EffectiveDate, 'YYYY-MM-DD HH:MI:SS' ) AS EffectiveDate,
                    TO_CHAR( CurrencyRate.LastModifiedDate, 'YYYY-MM-DD HH:MI:SS' ) AS LastModifiedDate,
                    ROW_NUMBER() OVER (PARTITION BY BaseCurrency.Symbol, TransactionCurrency.Symbol, TO_CHAR( CurrencyRate.EffectiveDate, 'YYYY-MM-DD HH:MI:SS' ) ORDER BY CurrencyRate.LastModifiedDate DESC) AS rn
                FROM
                    CurrencyRate
                    INNER JOIN Currency AS BaseCurrency ON
                        ( BaseCurrency.ID = CurrencyRate.BaseCurrency )
                    INNER JOIN Currency AS TransactionCurrency ON
                        ( TransactionCurrency.ID = CurrencyRate.TransactionCurrency )        
                WHERE
                    ( 
                        EXTRACT(MONTH FROM CurrencyRate.EffectiveDate) = ?
                        AND EXTRACT(YEAR FROM CurrencyRate.EffectiveDate) = ?
                        AND BaseCurrency.id= ?
                        AND TransactionCurrency.id= ?
                    )
                ) sub
            WHERE rn = 1
            ORDER BY
                BaseSymbol,
                TransactionSymbol,
                LastModifiedDate DESC
        `;
 
        var rates = query.runSuiteQL({query : searchQuery, params : [startdateValues.month, startdateValues.year, toCurrencyId, fromCurrencyId]}).asMappedResults();
        log.debug('rates', rates)
        var numberOfRates = rates.length;
        var totalRates = 0
        rates.forEach(function (rate){
            totalRates += rate.exchangerate
        });

        return totalRates / numberOfRates;

    }

    function map(context) {
        log.debug('map', context);

        try{

            var value = JSON.parse(context.value);
            var recordId = value.id;
            log.debug('Record Id', recordId)
            var customEchangeRatesRecord = record.load({
                type: 'customrecord_eii_consolidated_exchangera',
                id: recordId,
                isDynamic: true
            })

            var toCurrency = customEchangeRatesRecord.getText('custrecord_eii_cer_tocurrency');
            var toCurrencyId = customEchangeRatesRecord.getValue('custrecord_eii_cer_tocurrency');
            var fromCurrency = customEchangeRatesRecord.getText('custrecord_eii_cer_fromcurrency');
            var fromCurrencyId = customEchangeRatesRecord.getValue('custrecord_eii_cer_fromcurrency');
            var periodId = customEchangeRatesRecord.getValue('custrecord_eii_cer_accountingperiod');
            // Should find the next period 
            log.debug('toCurrency', toCurrency)
            log.debug('fromCurrency', fromCurrency)
            log.debug('periodId', periodId)

            // The load allow to retrieve field as date
            var periodRecord = record.load({
                type: record.Type.ACCOUNTING_PERIOD,
                id: periodId,
                isDynamic: true
            })
            var periodEndDate = periodRecord.getValue('enddate');
            var nextPeriodEndDate = periodRecord.getValue('enddate');
            var periodStartDate = periodRecord.getValue('startdate');

            var nextPeriodEndDate = nextPeriodEndDate.setMonth(periodEndDate.getMonth() + 1);
            var nextPeriodEndDate = new Date(nextPeriodEndDate);

            log.debug('nextPeriodEndDate 2', nextPeriodEndDate)

            var nextPeriod = searchAccountingPeriod(nextPeriodEndDate)
            log.debug('nextPeriod', nextPeriod)

            var exchangeRates = searchConsolidateExchangeRates([periodId, nextPeriod.id], toCurrency, fromCurrency)
            log.debug('exchangeRates', exchangeRates)

            var averagerate = calculateAverageRate(fromCurrencyId, toCurrencyId, periodStartDate, periodEndDate)
            log.debug('averagerate', averagerate)
            var currentrate = getRate(fromCurrencyId, toCurrencyId, periodEndDate)
            log.debug('currentrate', currentrate)

            var historicalrate = currentrate

            customEchangeRatesRecord.setValue('custrecord_eii_cer_averagerate', roundRate(averagerate))
            customEchangeRatesRecord.setValue('custrecord_eii_cer_currentrate', roundRate(currentrate))
            customEchangeRatesRecord.setValue('custrecord_eii_cer_historicalrate', roundRate(historicalrate))
            customEchangeRatesRecord.save();

            context.write({
                key: customEchangeRatesRecord.id,
                value: {
                    rates: exchangeRates,
                    averagerate: averagerate,
                    currentrate: currentrate,
                    historicalrate: historicalrate,
                }
            })

        } catch (e){
            log.error('Error', e)
            // Should write the error
            updatecustomRecordExchangeRates(recordId, {
                custrecord_eii_cer_failed: true,
                custrecord_eii_cer_executionlog: e.message
            })
        }
    }

    /**
     * 
     * @param {*} values 
     */
    function updatecustomRecordExchangeRates(recordId, values){
        record.submitFields({
            type: 'customrecord_eii_consolidated_exchangera',
            id: recordId,
            values: values
        });
    }

    function roundRate(rate){
        return Math.round(rate * 100000000) / 100000000;
    }

    function reduce(context){
        log.debug('reduce', context)
        var customRateId = context.key
        var values = JSON.parse(context.values[0])
        
        var rates = values.rates;
        var averagerate = values.averagerate;
        var currentrate = values.currentrate;
        var historicalrate = values.historicalrate;

        var hasFailed = false;
        var failedMessage = '<h2>Failed consolidation: </h2>  <ul>'
        var successMessage = '<h2>Successful consolidation: </h2>  <ul>'

        rates.forEach(function (rateId){

            try{
                var consolidateExchangeRec = record.load({
                    type: 'consolidatedexchangerate',
                    id: rateId,
                    isDynamic: true
                });
                log.debug('rateId', rateId)
                var fromsubsidiary = consolidateExchangeRec.getText('fromsubsidiary')
                var tosubsidiary = consolidateExchangeRec.getText('tosubsidiary')
                var tocurrency = consolidateExchangeRec.getText('tocurrency')
                var fromcurrency = consolidateExchangeRec.getText('fromcurrency')

                consolidateExchangeRec.setValue('currentrate', currentrate);
                consolidateExchangeRec.setValue('averagerate', averagerate);
                consolidateExchangeRec.setValue('historicalrate', historicalrate);
                consolidateExchangeRec.save({ignoreMandatoryFields: true})

                successMessage += `<li>Consolidated rate id <b>${rateId}</b> from subsidiary <b>${fromsubsidiary}</b> to subsidiary <b>${tosubsidiary}</b>, from currency ${fromcurrency} to currency ${tocurrency} </li> ` 
        
            } catch (e){
                log.error('Reduce Error', e)
                hasFailed = true;
                failedMessage += `<li>Consolidated rate id <b>${rateId}</b> from subsidiary  <b>${fromsubsidiary}</b> to subsidiary <b>${tosubsidiary}</b>, from currency ${fromcurrency} to currency ${tocurrency} </li>`
            }
        });

        failedMessage+='</ul>'
        successMessage+='</ul></br>'

        if (hasFailed){
            // done
            var message = successMessage + + failedMessage
            updatecustomRecordExchangeRates(customRateId, {
                custrecord_eii_cer_failed: true,
                custrecord_eii_cer_executionlog: message
            })
        } else { // failed
            updatecustomRecordExchangeRates(customRateId, {
                custrecord_eii_cer_done: true,
                custrecord_eii_cer_executionlog: successMessage
            })
        }

    }

    /**
     * 
     * @param {*} summary 
     */
    function summarize(summary) {
		log.audit('Entering summarize()');

		var nbErrors=0;
		summary.reduceSummary.errors.iterator().each(function (key, anError, executionNo) {
			nbErrors++;
			log.error({
				title: "Processing key: " + key,
				details: anError
			});
			return true;
		});
		if(nbErrors)
			throw error.create({
				name: nbErrors + " errors raised.",
				message: "Please check logs"
			});
    }

    return {
        getInputData: getInputData,
        map: map,
        reduce: reduce,
        summarize: summarize
    }
});