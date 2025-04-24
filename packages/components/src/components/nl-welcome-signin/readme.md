# nl-welcome-signin

<!-- Auto Generated Below -->

## Properties

| Property       | Attribute       | Description | Type           | Default |
| -------------- | --------------- | ----------- | -------------- | ------- |
| `authMethods`  | --              |             | `AuthMethod[]` | `[]`    |
| `hasExtension` | `has-extension` |             | `boolean`      | `false` |
| `hasOTP`       | `has-o-t-p`     |             | `boolean`      | `false` |

## Events

| Event              | Description | Type                |
| ------------------ | ----------- | ------------------- |
| `nlLoginExtension` |             | `CustomEvent<void>` |

## Dependencies

### Used by

- [nl-auth](../nl-auth)

### Depends on

- [button-base](../button-base)

### Graph

```mermaid
graph TD;
  nl-welcome-signin --> button-base
  nl-auth --> nl-welcome-signin
  style nl-welcome-signin fill:#f9f,stroke:#333,stroke-width:4px
```

---

_Built with [StencilJS](https://stenciljs.com/)_
