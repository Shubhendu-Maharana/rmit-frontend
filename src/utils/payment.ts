import { toast } from "react-toastify";

/**
 * Loads the Razorpay Checkout script dynamically into the document body
 */
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

interface InitiatePaymentArgs {
  keyId: string;
  orderId: string;
  amount: number;
  currency: string;
  feeTitle: string;
  studentName: string;
  studentEmail: string;
  onSuccess: (response: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => void;
  onDismiss?: () => void;
}

/**
 * Loads SDK and launches the Checkout Modal
 */
export const initiateRazorpayCheckout = async (
  args: InitiatePaymentArgs,
): Promise<void> => {
  const scriptLoaded = await loadRazorpayScript();
  if (!scriptLoaded) {
    toast.error(
      "Failed to load Razorpay SDK. Please check your internet connection.",
    );
    throw new Error("SDK_LOAD_FAILED");
  }

  const options = {
    key: args.keyId,
    amount: args.amount,
    currency: args.currency,
    name: "RMIT College Management",
    description: args.feeTitle,
    order_id: args.orderId,
    prefill: {
      name: args.studentName,
      email: args.studentEmail || "student@rmit.edu",
    },
    theme: {
      color: "#0f172a", // Premium Dark Theme Color
    },
    handler: (response: any) => {
      args.onSuccess(response);
    },
    modal: {
      ondismiss: () => {
        if (args.onDismiss) {
          args.onDismiss();
        }
      },
    },
  };

  const rzpay = new (window as any).Razorpay(options);
  rzpay.open();
};
