# nl-signin-read-only

<!-- Auto Generated Below -->


## Events

| Event             | Description | Type                  |
| ----------------- | ----------- | --------------------- |
| `nlCheckLogin`    |             | `CustomEvent<string>` |
| `nlLoginReadOnly` |             | `CustomEvent<string>` |


## Dependencies

### Used by

 - [nl-auth](../nl-auth)

### Depends on

- [button-base](../button-base)

### Graph
```mermaid
graph TD;
  nl-signin-read-only --> button-base
  nl-auth --> nl-signin-read-only
  style nl-signin-read-only fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
