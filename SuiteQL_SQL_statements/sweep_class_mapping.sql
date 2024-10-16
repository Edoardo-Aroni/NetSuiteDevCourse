SELECT 
    SUBL.tranprefix AS source_doc_num, 
    SUBL.ID AS source_sub_id, 
    BUILTIN.DF(SUBL.ID) AS source_sub, 
    SUB.tranprefix AS dest_doc_num, 
    BUILTIN.DF(SUB.ID) AS dest_sub, 
    SUB.ID AS dest_sub_id, 
    SCM.custrecord_eii_class AS class_id, 
    CLS.externalid AS class, 
    SCM.custrecord_eii_intercompany_account AS intercom_accnt_id, 
    A.externalid AS intercom_accnt, 
    SCM.custrecord_eii_intercom_line_class AS intercom_line_class_id,
    CLSL.externalid AS intercom_line_class 
FROM 
    CUSTOMRECORD_EII_SWEEP_CLASS_MAPPING AS SCM
    LEFT JOIN classification AS CLS
    ON SCM.custrecord_eii_class = CLS.ID
    LEFT JOIN Subsidiary AS SUB
    ON SCM.custrecord_eii_destination_subsidiary = SUB.ID
    LEFT JOIN classification CLSL 
    ON SCM.custrecord_eii_intercom_line_class = CLSL.ID
    LEFT JOIN ACCOUNT AS A
    ON SCM.custrecord_eii_intercompany_account = A.ID
    LEFT JOIN Subsidiary AS SUBL 
    ON SCM.custrecord_eii_source_subsidiary = SUBL.ID;