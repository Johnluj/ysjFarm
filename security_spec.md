# Security Specification - YSJ Poultry Farm

## Data Invariants
1. A user profile MUST have a valid role (ADMIN, MANAGER, MD, or STAFF).
2. Only ADMINs can create or update BirdBatch and Sale records.
3. MD, Manager, and Staff can only read these records and create Comments.
4. Comments must be linked to a valid entity (Batch or Sale).
5. User roles cannot be self-assigned; they must be set by an existing ADMIN or through a secure bootstrap process.

## The Dirty Dozen Payloads (Target: DENY)
1. **Role Escalation**: STAFF attempting to update their own role to ADMIN.
2. **Anonymous Write**: Unauthenticated user trying to create a BirdBatch.
3. **Invalid Status**: ADMIN trying to set BirdBatch status to "Flying" (not in enum).
4. **MD Data Input**: MD trying to create a Sale record.
5. **PII Leak**: STAFF trying to read another user's private info (if any).
6. **Orphaned Comment**: User creating a comment for a non-existent batchId.
7. **Negative Stats**: ADMIN setting bird count to -500.
8. **Spoofed Author**: STAFF creating a comment with someone else's userId.
9. **Bulk Scrape**: Unauthenticated user trying to list all users.
10. **Immutable Field Change**: ADMIN trying to change the `createdAt` timestamp of a Sale.
11. **Huge Data Attack**: User sending a 2MB string as a comment text.
12. **Malicious ID**: User trying to create a document with ID `../../secrets`.

## Test Runner (Logic Outline)
We will verify that:
- `get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'ADMIN'` for writes to batches and sales.
- `request.auth.token.email_verified == true` for any secure action.
- `request.resource.data.text.size() <= 1000` for comments.
