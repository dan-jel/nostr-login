# nl-signin-otp

<!-- Auto Generated Below -->

## Events

| Event            | Description | Type                  |
| ---------------- | ----------- | --------------------- |
| `nlCheckLogin`   |             | `CustomEvent<string>` |
| `nlLoginOTPCode` |             | `CustomEvent<string>` |
| `nlLoginOTPUser` |             | `CustomEvent<string>` |

## Dependencies

### Used by

- [nl-auth](../nl-auth)

### Depends on

- [button-base](../button-base)

### Graph

```mermaid
graph TD;
  nl-signin-otp --> button-base
  nl-auth --> nl-signin-otp
  style nl-signin-otp fill:#f9f,stroke:#333,stroke-width:4px
```

---

_Built with [StencilJS](https://stenciljs.com/)_
