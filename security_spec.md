# Security Specification: MandiMind AI

## 1. Data Invariants

1. **User Profile Ownership & Access Invariant**:
   - Every document in `/users/{userId}` represents a farmer or agricultural official.
   - The document ID `{userId}` must match `request.auth.uid`.
   - Users cannot arbitrarily elevate their own role to `admin` or `supervisor`.
   - Admin access is restricted to verified administrators (`arshadraza20055@gmail.com` or documents in `/admins/{adminId}`).
   - All string inputs (names, state, district) must conform to strict length limits (<= 120 chars) and regex patterns.

2. **PII Strict Isolation Invariant**:
   - Personally Identifiable Information (phone number, land holding, village) resides in `/users/{userId}/private/info`.
   - Only the owning authenticated user (`request.auth.uid == userId`) may read or write this subcollection. No non-owner or anonymous user can read PII.

3. **Farmer Saved Recommendation Invariant**:
   - Saved calculations in `/users/{userId}/savedRecommendations/{recId}` belong strictly to `{userId}`.
   - `recId` must conform to alphanumeric formatting (`isValidId`).
   - `userId` field inside the document must strictly match `request.auth.uid`.
   - Crop name, quantities, and net profit must adhere to positive numeric bounds and non-empty string constraints.
   - Farmers cannot tamper with other farmers' saved calculations.

4. **AGMARKNET Mandi Price Records Invariant**:
   - Mandi price records in `/mandiPriceRecords/{recordId}` are publicly readable by all farmers.
   - Writing, modifying, or deleting records is strictly restricted to verified Mandi Supervisors and Admins.
   - Commodity names, mandi yards, modal prices, and arrivals must be positive valid data types.

5. **Price Alert Subscription Invariant**:
   - Subscriptions in `/alerts/{alertId}` must have `userId == request.auth.uid`.
   - Valid phone numbers (<= 20 chars) and crop names (<= 80 chars) are enforced.
   - Users can only query and list their own alert subscriptions.

---

## 2. The "Dirty Dozen" Adversarial Payloads

1. **Payload 1: Privileged Role Self-Escalation**
   - *Target*: `POST /users/attacker-uid`
   - *Payload*: `{ "userId": "attacker-uid", "displayName": "Attacker", "role": "admin", "preferredLanguage": "hi", "district": "Raipur", "state": "Chhattisgarh" }`
   - *Expected*: `PERMISSION_DENIED` (Farmer cannot self-assign `admin` role).

2. **Payload 2: PII Harvest Snooping**
   - *Target*: `GET /users/victim-uid/private/info` by `attacker-uid`
   - *Expected*: `PERMISSION_DENIED` (Non-owner read denied).

3. **Payload 3: ID Path Poisoning**
   - *Target*: `POST /users/attacker-uid/savedRecommendations/../../../etc/passwd`
   - *Expected*: `PERMISSION_DENIED` (Non-alphanumeric ID rejected by `isValidId`).

4. **Payload 4: Shadow Field Injection**
   - *Target*: `UPDATE /users/farmer-uid`
   - *Payload*: `{ "displayName": "Ramesh", "isSuperUser": true, "backdoorToken": "xyz" }`
   - *Expected*: `PERMISSION_DENIED` (`affectedKeys().hasOnly` rejects ghost fields).

5. **Payload 5: Price Record Tampering by Unprivileged Farmer**
   - *Target*: `POST /mandiPriceRecords/record-1` by unverified user
   - *Payload*: `{ "commodity": "Tomato", "modalPrice": 10 }`
   - *Expected*: `PERMISSION_DENIED` (Only supervisors/admins can write price records).

6. **Payload 6: Unbounded Array / Wallet-Drain Attack**
   - *Target*: `POST /alerts/alert-1`
   - *Payload*: `{ "id": "alert-1", "userId": "farmer-uid", "phone": "9876543210", "crop": "A".repeat(5000), "mandiName": "Raipur" }`
   - *Expected*: `PERMISSION_DENIED` (String size constraint violation).

7. **Payload 7: Cross-User Recommendation Forgery**
   - *Target*: `POST /users/farmer-a/savedRecommendations/rec-1` by `farmer-b`
   - *Expected*: `PERMISSION_DENIED` (`request.auth.uid != farmer-a`).

8. **Payload 8: Unverified Email Admin Claim Spoof**
   - *Target*: `DELETE /mandiPriceRecords/rec-1` with `email: arshadraza20055@gmail.com` but `email_verified: false`
   - *Expected*: `PERMISSION_DENIED` (Requires `email_verified == true`).

9. **Payload 9: Negative Quantity or Price Injection**
   - *Target*: `POST /mandiPriceRecords/rec-test`
   - *Payload*: `{ "commodity": "Potato", "modalPrice": -500 }`
   - *Expected*: `PERMISSION_DENIED` (Numeric bounds validation failure).

10. **Payload 10: Blanket Alert Listing Scraping**
    - *Target*: `LIST /alerts` without `userId == request.auth.uid` filter
    - *Expected*: `PERMISSION_DENIED` (Query Enforcer mandates scoped reads).

11. **Payload 11: Immutable Field Mutation**
    - *Target*: `UPDATE /users/farmer-uid`
    - *Payload*: `{ "userId": "hijacked-uid" }`
    - *Expected*: `PERMISSION_DENIED` (`userId` immutable after creation).

12. **Payload 12: Anonymous Write Bypass**
    - *Target*: `POST /alerts/alert-anon` by unauthenticated visitor
    - *Expected*: `PERMISSION_DENIED` (`request.auth != null` required).

---

## 3. Test Runner Definition

Automated test specifications verifying all 12 payloads are tested and enforced in `firestore.rules.test.ts`.
