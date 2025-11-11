# Test Report for Week 1 of Sprint 4 of SpinStorm

## Overview
SpinStorm is an online web game where users can play a virtual slot machine with virtual money.

## Testing Scope

Testing scope for the sprint

### In-Scope
- Account: Tested and fixed issues with login and register
- Database: Fixed database
- UI: Corrected a few typos in login.jsx and register.jsx
### Out of Scope
- Functional
- Regression
- UX
### Items not tested
Most of the frontend remains untested. Hopefully I'll get to it next week.

## Test Data

Table of test cases:
| Planned | Executed | Passed | Failed |
| ------- | --------- | ------ | ------ |
| 8 | 0 | 0 | 0 |

I wanted to do some tests for UI and the backend functions, but due to the bugs in the accounts and database, I didn't get to them.

## Test Environment & Tools

Here is the environment I used for testing:

| Application URL | Database | GitHub Branch |
| --------------- | -------- | ------ |
| http://127.0.0.1:5000/api | Flask-SQLAlchemy 3.1.1 | https://github.com/tgiversen/CSC289-Group9 |

I'm using pytest and playwright.

## Debugging

### Typos:
Within login.jsx and register.jsx:
```js
background: "rgba(0, 0, 0, 0.7", // before
background: "rgba(0, 0, 0, 0.7)", // after
```
The background should now be colored properly
```js
boxShadow: "0, 0 20px gold", // before
boxShadow: "0 0 20px gold", // after
```
Now the gold shadow around the form appears

The line number varies between the two files, but they're both around lines 30-40

### Database
Within __init__.py
```python
17 def create_app():
18    app = Flask(__name__)
      ...
48    # (NEW) Create tables
49    with app.app_context():
50        db.create_all()
```
For whatever reason, the line of code that creates the database's tables was removed, so I added it back

### Authentication
Old:
```js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../stores/authSlice";
import gameReducer from "../stores/gameSlice";
import regSlice from "../stores/regSlice";
import accountReducer from "../stores/accountSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    reg: regSlice,
    game: gameReducer,
    account: accountReducer,
  },
});
```
New:
```js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../stores/authSlice";
import gameReducer from "../stores/gameSlice";
import regReducer from "../stores/regSlice";
import accountReducer from "../stores/accountSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    reg: regReducer,
    game: gameReducer,
    account: accountReducer,
  },
});
```

Passing in reg: regSlice causes Redux to try using the entire slice object rather than the reducer, causing status to be undefined and showing this error:
```
Uncaught (in promise) TypeError: Cannot set properties of undefined (setting 'status')
at regSlice.jsx:41:19
```

## Lessons Learned

1 - Be more detailed and thourough with describing bugs

## Recommendations

Merge tk_branch into main, or review and then merge.