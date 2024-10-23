# nl-import-flow

<!-- Auto Generated Below -->


## Properties

| Property      | Attribute      | Description | Type                 | Default                                                                                                  |
| ------------- | -------------- | ----------- | -------------------- | -------------------------------------------------------------------------------------------------------- |
| `services`    | --             |             | `ConnectionString[]` | `[]`                                                                                                     |
| `textImport`  | `text-import`  |             | `string`             | `'Your Nostr keys will be imported into this provider, and you will manage your keys on their website.'` |
| `titleImport` | `title-import` |             | `string`             | `'Choose a service'`                                                                                     |
| `titleInfo`   | `title-info`   |             | `string`             | `'Back up your keys'`                                                                                    |


## Events

| Event             | Description | Type                            |
| ----------------- | ----------- | ------------------------------- |
| `nlExportKeys`    |             | `CustomEvent<void>`             |
| `nlImportAccount` |             | `CustomEvent<ConnectionString>` |


## Dependencies

### Used by

 - [nl-auth](../nl-auth)

### Depends on

- [button-base](../button-base)
- [nl-select](../nl-select)

### Graph
```mermaid
graph TD;
  nl-import-flow --> button-base
  nl-import-flow --> nl-select
  nl-auth --> nl-import-flow
  style nl-import-flow fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
