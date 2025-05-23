# PsyCare - API

API oficial de PsyCare.

## Credenciales conocidas.

**Para Soe**.

Te dejo unas credenciales con las que puedes iniciar sesión para obtener un token, autenticarte y probar todas los endpoint que tienen candadito.

```
{
  "email": "pinki@pai.mlp",
  "password": "mynameispinkiepie"
}
```

## Limitaciones del servidor de la API.

Nuestro servidor es gratuito, por lo que entra en estado de hibernación cada 14 minutos si no detecta actividad en la API. Si en algún momento notas que no responde o te da errores '500', simplemente espera unos cuantos segundos (máximo 10) a que se 'despierte' otra vez y solita va a empezar a funcionar.

## Sync sheets: API Coverage
<!-- START_TABLE -->
| Endpoint          | GET   | POST   | PUT   | DELETE   | IMPLEMENTED   |   PASSING |
|:------------------|:------|:-------|:------|:---------|:--------------|----------:|
| Articles          | 0     | 0      | 0     | 0        | FALSE         |         0 |
| Alerts            | 11    | 10     | 0     | 0        | TRUE          |        21 |
| Emotional records | 0     | 0      | 0     | 0        | FALSE         |         0 |
| Habits            | 0     | 0      | 0     | 0        | FALSE         |         0 |
| Index             | NNTI  | NNTI   | NNTI  | NNTI     | TRUE          |         0 |
| Login             | NNTI  | 8      | NNTI  | NNTI     | TRUE          |         8 |
| Notifications     | 0     | 0      | 0     | 0        | FALSE         |         0 |
| Questionnaries    | 0     | 0      | 0     | 0        | FALSE         |         0 |
| Sesions           | 6     | NNTI   | NNTI  | NNTI     | FALSE         |         6 |
| Signup            | NNTI  | 6      | NNTI  | NNTI     | TRUE          |         6 |
| User settings     | 0     | 0      | 0     | 0        | FALSE         |         0 |
| User              | 11    | 11     | 0     | 0        | TRUE          |        22 |
| Reports           | 1     | 0      | 0     | 0        | TRUE          |       nan |
| *                 | *     | *      | *     | Total    | 5             |        63 |

**Total Coverage: 42.86%**
![](https://geps.dev/progress/42)<!-- END_TABLE -->
