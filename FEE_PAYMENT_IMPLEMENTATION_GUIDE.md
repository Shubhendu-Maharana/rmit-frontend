# Frontend Fee Payment UI Implementation Guide

This guide describes how to build the frontend interfaces and Razorpay checkout flow matching the backend fee management design. Provide this document to your frontend AI coding assistant to implement the user interfaces.

---

## 1. System Requirements & Logic Rules

1. **Super Admin Dashboard (CRUD on Fee Structures)**:
   - Only Super Admins can create, view, update, or delete global **Fee Structures**.
2. **Admin & Super Admin Dashboard (Fee Assignment)**:
   - Admins and Super Admins can allocate/assign a fee structure to students.
   - **Important**: Fees must **never** be shown to a student unless they have been explicitly assigned to them by an Admin or Super Admin.
   - Two assignment scopes must be supported:
     - **Bulk Assignment**: Allocates the fee structure to all students matching a specific Course + Semester.
     - **Individual Assignment**: Allocates the fee structure to a single student profile.
3. **Student Portal (Fee Payments Tab)**:
   - Students see a dedicated **Fee Payments** dashboard showing a list of fees assigned to them.
   - Pending allocations show a **"Pay Now"** button.
   - Paid allocations show transaction details (Payment ID, Method, Date, and Amount).

---

## 2. API Endpoint Schemas

### A. Fee Structures (Super Admin only)
* **Create Fee Structure**: `POST /api/fees`
  - Body: `{ title: string, amount: number, courseId: string, semester: number, academicYear: string, dueDate: string }`
* **Update Fee Structure**: `PATCH /api/fees/:id`
  - Body: `{ title?, amount?, dueDate? }`
* **Delete Fee Structure**: `DELETE /api/fees/:id`

### B. Fee Allocations (Admin & Super Admin)
* **Assign Fee**: `POST /api/fees/assign`
  - Body:
    ```json
    {
      "feeStructureId": "uuid-string",
      "assignType": "ALL" | "INDIVIDUAL",
      "studentId": "uuid-string (required if INDIVIDUAL)",
      "courseId": "uuid-string (required if ALL)",
      "semester": 1 // (required if ALL)
    }
    ```

### C. Student Fee Status (Student only)
* **Get My Assigned Fees**: `GET /api/fees/my-status` (Returns array of assigned fees containing status: `PENDING`, `PAID`, or `FAILED`).

---

## 3. Frontend Component Blueprints (UI Mockups)

### UI Screen 1: Fee Structure Admin Dashboard (Super Admin)
1. **Forms**:
   - Inputs: Title, Amount (INR), Course Selector, Semester Input, Academic Year (e.g. "2026"), Due Date.
   - Action Button: `Create Fee Structure`.
2. **Fee Structures Table**:
   - Columns: Fee Title | Course | Semester | Year | Amount | Due Date | Actions (Edit, Delete).

### UI Screen 2: Fee Assignment Panel (Admin & Super Admin)
1. **Panel Elements**:
   - Fee Structure dropdown selector.
   - Assignment toggle: `[ Bulk Semester Assignment ]` / `[ Assign to Individual Student ]`.
   - **For Bulk**: Course selector and Semester index input field.
   - **For Individual**: Student search lookup (by roll number/name).
   - Action Button: `Confirm Assignment` $\rightarrow$ Triggers `POST /api/fees/assign`.

### UI Screen 3: Fee Payments Dashboard (Student)
1. **Payments Table**:
   - Columns: Fee Description | Semester | Year | Due Date | Amount | Status | Action.
   - **Status Badges**:
     - `PENDING` (yellow) $\rightarrow$ Shows **[ Pay Now ]** button.
     - `PAID` (green) $\rightarrow$ Shows **[ View Receipt ]** (reveals Modal containing transaction ID, payment method, and timestamp).
     - `FAILED` (red) $\rightarrow$ Shows **[ Try Again ]** button.

---

## 4. Razorpay Online Payment Flow (Step-by-Step)

When a student clicks the **[ Pay Now ]** button:

### Step 1: Create Backend Order
Call the backend endpoint:
- **Route**: `POST /api/payments/create-order`
- **Payload**: `{ "feeStructureId": "fee-structure-uuid" }`
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "orderId": "order_xxxxxx",
      "amount": 250000, // in paise (e.g. 2500.00 INR)
      "currency": "INR",
      "feeTitle": "BCA 1st Sem Exam Fee",
      "studentDetails": {
        "name": "John Doe Student",
        "rollNumber": "RMIT2026001",
        "email": null
      }
    }
  }
  ```

### Step 2: Load Razorpay Checkout SDK
Include the Razorpay SDK script dynamically in the frontend page:
```javascript
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};
```

### Step 3: Open Razorpay Checkout Form
Trigger the modal window using the order data returned by the backend:
```javascript
const handlePayment = async (orderData) => {
  const isScriptLoaded = await loadRazorpayScript();
  if (!isScriptLoaded) {
    alert("Failed to load Razorpay SDK. Check your internet connection.");
    return;
  }

  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Frontend Razorpay Key ID
    amount: orderData.amount, // Amount in paise
    currency: orderData.currency,
    name: "RMIT College Management System",
    description: orderData.feeTitle,
    order_id: orderData.orderId, // Generated order ID from Step 1
    prefill: {
      name: orderData.studentDetails.name,
      email: orderData.studentDetails.email || "student@rmit.edu",
      contact: "",
    },
    theme: {
      color: "#0f172a", // Premium Dark Theme Color
    },
    handler: async function (response) {
      // Step 4: Callback on successful checkout
      await verifyPaymentOnBackend({
        razorpayOrderId: response.razorpay_order_id,
        razorpayPaymentId: response.razorpay_payment_id,
        razorpaySignature: response.razorpay_signature,
      });
    },
  };

  const razorpayInstance = new window.Razorpay(options);
  razorpayInstance.open();
};
```

### Step 4: Verify Payment on Backend
Send the token signature received in the payment callback to the verification API:
- **Route**: `POST /api/payments/verify`
- **Payload**:
  ```json
  {
    "razorpayOrderId": "order_xxxxxx",
    "razorpayPaymentId": "pay_xxxxxx",
    "razorpaySignature": "signature_hash"
  }
  ```
- **Response Handling**:
  - On **Success (`200 OK`)**: Display a green toast notification "Payment successful!" and refresh the Fee Payments status table.
  - On **Error**: Display "Payment verification failed. Please contact admin."

---

---

## 5. Webhook Configurations (Database Fail-Safe)
The backend implements a webhook listener under `/api/payments/webhook`. 
If configuring Razorpay Dashboards, set up the Webhook URL pointing to:
`https://<your-backend-domain>/api/payments/webhook`
- Enabled Events: `payment.captured`
- Webhook Secret: Match the value set as `RAZORPAY_WEBHOOK_SECRET` in the backend `.env`.

---

## 6. Cashier/Admin Payment Management Dashboard (Admin & Super Admin only)

Admins and Super Admins can search, filter, and view the payment status of all student allocations. They can also manually mark payments as `PAID` (e.g., if a student pays via Cash or Bank Transfer).

### A. API Endpoints

1. **List/Search Payments**: `GET /api/fees/payments`
   - **Query Parameters**:
     - `status`: `PENDING` | `PAID` | `FAILED`
     - `studentId`: Filter by a specific student profile.
     - `feeStructureId`: Filter by a specific fee type.
     - `institute`: Filter by RMIT, RMITC, or HIT (Super Admin only; Admins are automatically locked to their own institute).
     - `search`: Search string (filters students by name or roll number).
   - **Access Control**: Super Admin sees all records globally. Admin is locked to students in their own institute.

2. **Mark Payment Manually**: `PATCH /api/fees/payments/:receiptId/manual-pay`
   - **Body**:
     ```json
     {
       "paymentMethod": "CASH" | "BANK_TRANSFER" | "CHEQUE",
       "transactionId": "manual_receipt_reference_123" // (Optional)
     }
     ```
   - **Access Control**: Super Admin can update any receipt. Admin can only update receipts of students in their own institute.

### B. UI Screen: Cashier Management Panel
1. **Search & Filters Layout**:
   - Text Search Input (Placeholder: "Search by Student Name or Roll Number...") $\rightarrow$ fires request on input/change with `?search=keyword`.
   - Status Filter Dropdown: `[ All Statuses ]`, `[ Pending ]`, `[ Paid ]`, `[ Failed ]`.
   - Fee Structure Filter Dropdown: dynamically populated from list of structures.
2. **Payments List Table**:
   - Columns: Student Name | Roll Number | Institute | Fee Description | Amount | Status Badge | Actions.
   - **Actions Column**:
     - If status is `PENDING`: Shows a green **[ Mark as Paid ]** button.
     - Clicking **[ Mark as Paid ]** opens a Dialog/Modal:
       - Dropdown input: Payment Method (`CASH`, `BANK_TRANSFER`, `CHEQUE`).
       - Optional Text input: Reference/Transaction Number.
       - Button: **[ Confirm Cash/Manual Pay ]** $\rightarrow$ triggers `PATCH /api/fees/payments/:receiptId/manual-pay`, triggers success notification, and refreshes table.
     - If status is `PAID`: Shows details label (e.g., "Paid via CASH on 2026-07-24 (Ref: CASH_REF_101)").

