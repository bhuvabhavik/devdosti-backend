
# 📌 API Routes Overview

---

## 🔐 Auth Routes (`authRouter`)
| Method | Endpoint         | Description              |
|--------|------------------|-----------------         |
| POST   | `/signUp`        | Register a new user      |
| POST   | `/login`         | Authenticate a user      |
| POST   | `/logout`        | Log out the current user |

---

## 👤 Profile Routes (`profileRouter`)
| Method | Endpoint              | Description                   |
|--------|------------------------|------------------------------|
| GET    | `/profile/view`        | View your profile            |
| PATCH  | `/profile/edit`        | Edit profile details         |
| PATCH  | `/profile/password`    | Change profile password      |

---

## 🔗 Connection Request Routes (`connectionRequestRouter`)
| Method | Endpoint                                                | Description                             |  
|--------|---------------------------------------------------------|-----------------------------------------|
| POST   | `/request/send/interested/:userId`                      | Send an *interested* connection request |
| POST   | `/request/send/ignored/:userId`                         | Send an *ignored* (left-swipe) request  |
| POST   | `/request/review/accepted/:requestId`                   | Accept a received request               |
| POST   | `/request/review/rejected/:requestId`                   | Reject a received request               |

---

## 👥 User Routes (`userRouter`)
| Method | Endpoint                | Description                                      |
|--------|-------------------------|--------------------------------------------------|
| GET    | `/user/connections`     | Get list of all accepted connections             |
| GET    | `/user/requests`        | View incoming/outgoing connection requests       |
| GET    | `/user/feed`            | Browse other profiles (like/dislike mechanism)   |

---

## 🔄 Connection Status Types
- `interested` ✅ – You liked the profile.
- `ignored` ❌ – You skipped or swiped left.
- `accepted` 🤝 – The other person accepted your request.
- `rejected` 🚫 – The other person rejected your request.

