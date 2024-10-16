SELECT 
  BUILTIN_RESULT.TYPE_STRING(Subsidiary_0.tranprefix) AS tranprefix, 
  BUILTIN_RESULT.TYPE_INTEGER(Subsidiary_0.ID) AS ID, 
  BUILTIN_RESULT.TYPE_INTEGER(CUSTOMRECORD_EII_SWEEP_CLASS_MAPPING.custrecord_eii_source_subsidiary) AS custrecord_eii_source_subsidiary, 
  BUILTIN_RESULT.TYPE_STRING(Subsidiary.tranprefix) AS tranprefix_1, 
  BUILTIN_RESULT.TYPE_INTEGER(CUSTOMRECORD_EII_SWEEP_CLASS_MAPPING.custrecord_eii_destination_subsidiary) AS custrecord_eii_destination_subsidiary, 
  BUILTIN_RESULT.TYPE_INTEGER(Subsidiary.ID) AS id_1, 
  BUILTIN_RESULT.TYPE_INTEGER(CUSTOMRECORD_EII_SWEEP_CLASS_MAPPING.custrecord_eii_class) AS custrecord_eii_class, 
  BUILTIN_RESULT.TYPE_STRING(classification.externalid) AS externalid, 
  BUILTIN_RESULT.TYPE_INTEGER(CUSTOMRECORD_EII_SWEEP_CLASS_MAPPING.custrecord_eii_intercompany_account) AS custrecord_eii_intercompany_account, 
  BUILTIN_RESULT.TYPE_STRING(ACCOUNT.externalid) AS externalid_1, 
  BUILTIN_RESULT.TYPE_STRING(classification_0.externalid) AS externalid_2, 
  BUILTIN_RESULT.TYPE_INTEGER(CUSTOMRECORD_EII_SWEEP_CLASS_MAPPING.custrecord_eii_intercom_line_class) AS custrecord_eii_intercom_line_class
FROM 
  CUSTOMRECORD_EII_SWEEP_CLASS_MAPPING
LEFT JOIN classification ON CUSTOMRECORD_EII_SWEEP_CLASS_MAPPING.custrecord_eii_class = classification.ID
LEFT JOIN Subsidiary ON CUSTOMRECORD_EII_SWEEP_CLASS_MAPPING.custrecord_eii_destination_subsidiary = Subsidiary.ID
LEFT JOIN classification classification_0 ON CUSTOMRECORD_EII_SWEEP_CLASS_MAPPING.custrecord_eii_intercom_line_class = classification_0.ID
LEFT JOIN ACCOUNT ON CUSTOMRECORD_EII_SWEEP_CLASS_MAPPING.custrecord_eii_intercompany_account = ACCOUNT.ID
LEFT JOIN Subsidiary Subsidiary_0 ON CUSTOMRECORD_EII_SWEEP_CLASS_MAPPING.custrecord_eii_source_subsidiary = Subsidiary_0.ID;