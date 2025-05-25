# 📌 API Routes Overview

---

## 🔐 Auth Routes (`authRouter`)

| Method | Endpoint  | Description              |
| ------ | --------- | ------------------------ |
| POST   | `/signUp` | Register a new user      |
| POST   | `/login`  | Authenticate a user      |
| POST   | `/logout` | Log out the current user |

---

## 👤 Profile Routes (`profileRouter`)

| Method | Endpoint                  | Description             |
| ------ | ------------------------- | ----------------------- | --- |
| GET    | `/profile/view`           | View your profile       |
| PATCH  | `/profile/edit`           | Edit profile details    |
| PATCH  | `/profile/changePassword` | Change profile password | hw  |

---

## 🔗 Connection Request Routes (`connectionRequestRouter`)

| Method | Endpoint                        | Description                                        |
| ------ | ------------------------------- | -------------------------------------------------- |
| POST   | `/request/send/:status/:userId` | Send an _interested or ignored_ connection request |
| POST   | `/request/review/:status/:requestId` | Accept or reject a received request |

---

## 👥 User Routes (`userRouter`)

| Method | Endpoint            | Description                                    |
| ------ | ------------------- | ---------------------------------------------- |
| GET    | `/user/connections` | Get list of all accepted connections           |
| GET    | `/user/requests`    | View incoming/outgoing connection requests     |
| GET    | `/user/feed`        | Browse other profiles (like/dislike mechanism) |

---

## 🔄 Connection Status Types

- `interested` ✅ – You liked the profile.
- `ignored` ❌ – You skipped or swiped left.
- `accepted` 🤝 – The other person accepted your request.
- `rejected` 🚫 – The other person rejected your request.
