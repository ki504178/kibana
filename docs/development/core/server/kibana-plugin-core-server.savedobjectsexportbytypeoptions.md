<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [kibana-plugin-core-server](./kibana-plugin-core-server.md) &gt; [SavedObjectsExportByTypeOptions](./kibana-plugin-core-server.savedobjectsexportbytypeoptions.md)

## SavedObjectsExportByTypeOptions interface

Options for the [export by type API](./kibana-plugin-core-server.isavedobjectsexporter.exportbytypes.md)

<b>Signature:</b>

```typescript
export interface SavedObjectsExportByTypeOptions extends SavedObjectExportBaseOptions 
```
<b>Extends:</b> SavedObjectExportBaseOptions

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [hasReference?](./kibana-plugin-core-server.savedobjectsexportbytypeoptions.hasreference.md) | SavedObjectsFindOptionsReference\[\] | <i>(Optional)</i> optional array of references to search object for. |
|  [search?](./kibana-plugin-core-server.savedobjectsexportbytypeoptions.search.md) | string | <i>(Optional)</i> optional query string to filter exported objects. |
|  [types](./kibana-plugin-core-server.savedobjectsexportbytypeoptions.types.md) | string\[\] | array of saved object types. |

