import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is missing");
}

// ============================================================
// READ-ONLY SCHEMA
// ============================================================

const readOnlySchema = new mongoose.Schema(
    {},
    {
        strict: false,
    }
);

const Order: mongoose.Model<any> =
    (mongoose.models.LiveOrder as mongoose.Model<any>) ||
    mongoose.model<any>(
        "LiveOrder",
        readOnlySchema,
        "orders"
    );

// ============================================================
// ORDER TO RECOVER
// ============================================================

const ORDER_ID = "ORD-6272818";

const failedOrder = {
    orderId: "ORD-6272818",

    userName: "MV SIVAKUMAR",

    userEmail: "EMAIL-UNKNOWN",

    userPhone: "6364848488",

    userAddress:
        "Mandakal Basavaraj Cotton Ginners, Plot No 14, Shop No 143, Rajendra Gunj",

    userPincode: "584101",

    userCity: "Raichur",

    userState: "Karnataka",

    userLandmark: "",

    paymentMethod: "upi",

    paymentStatus: "paid",

    orderStatus: "Confirmed",

    items: [
        {
            productId: new mongoose.Types.ObjectId(
                "6a816dc895e5758d11fde0d7"
            ),

            productCode: "NEC-7776501",

            productName: "Geometric Sparkle Rose Set",

            productPrice: 2249,

            quantity: 1,

            imageUrl:
                "https://res.cloudinary.com/dbrinf8mv/image/upload/v1786867144/vysh_products/NEC-7776501.webp",

            weight: 0,

            metalType: "Silver",

            purity: "925",

            total: 2249,
        },
    ],

    quantity: 1,

    // Preserve the actual amount paid.
    total: 2348,

    razorpayOrderId: "order_TQt7wMWy8K3P6X",

    razorpayPaymentId: "pay_TQt81TB6EhzitN",

    razorpaySignature: null,
};

// ============================================================
// LIVE DATABASE UPDATE
// ============================================================

async function recoverFailedOrder() {
    try {
        await mongoose.connect(MONGODB_URI);

        console.log("\n");
        console.log("============================================================");
        console.log("             VYSH FAILED ORDER LIVE RECOVERY");
        console.log("============================================================");

        console.log("MongoDB connected successfully.");
        console.log("Order ID:", ORDER_ID);
        console.log("Mode: LIVE UPDATE");

        console.log("============================================================\n");

        // ========================================================
        // SAFETY CHECK 1
        // ========================================================

        console.log("Checking whether order already exists...");

        const existingOrder = await Order
            .findOne({
                orderId: ORDER_ID,
            })
            .lean()
            .exec();

        if (existingOrder) {
            console.error("\n");
            console.error("❌ ORDER ALREADY EXISTS");
            console.error("----------------------------------------------");

            console.error(
                "Order ID:",
                existingOrder.orderId
            );

            console.error(
                "Payment ID:",
                existingOrder.razorpayPaymentId
            );

            console.error(
                "Payment Status:",
                existingOrder.paymentStatus
            );

            console.error(
                "Order Status:",
                existingOrder.orderStatus
            );

            console.error("----------------------------------------------");

            console.error(
                "\nNo update was performed."
            );

            return;
        }

        console.log("✓ Order does not exist.");
        console.log("Safe to create recovery order.\n");

        // ========================================================
        // DISPLAY ORDER BEFORE INSERT
        // ========================================================

        console.log("============================================================");
        console.log("              ORDER TO BE INSERTED");
        console.log("============================================================");

        console.dir(
            failedOrder,
            {
                depth: null,
                colors: false,
            }
        );

        console.log("\n============================================================");
        console.log("                    PAYMENT CHECK");
        console.log("============================================================");

        console.log(
            "Razorpay Order ID:",
            failedOrder.razorpayOrderId
        );

        console.log(
            "Razorpay Payment ID:",
            failedOrder.razorpayPaymentId
        );

        console.log(
            "Payment Method:",
            failedOrder.paymentMethod
        );

        console.log(
            "Payment Status:",
            failedOrder.paymentStatus
        );

        console.log(
            "Order Status:",
            failedOrder.orderStatus
        );

        console.log(
            "Product Price:",
            `₹${failedOrder.items[0].productPrice}`
        );

        console.log(
            "Quantity:",
            failedOrder.quantity
        );

        console.log(
            "Product Total:",
            `₹${failedOrder.items[0].total}`
        );

        console.log(
            "Actual Paid Total:",
            `₹${failedOrder.total}`
        );

        console.log(
            "Difference:",
            `₹${failedOrder.total - failedOrder.items[0].total}`
        );

        console.log("============================================================");

        // ========================================================
        // CREATE ORDER
        // ========================================================

        console.log("\nCreating order in live database...");

        const createdOrder = await Order.create(
            failedOrder
        );

        // ========================================================
        // VERIFY INSERT
        // ========================================================

        console.log("\n✓ ORDER CREATED SUCCESSFULLY");

        console.log("============================================================");

        const verifiedOrder = await Order
            .findOne({
                orderId: ORDER_ID,
            })
            .lean()
            .exec();

        if (!verifiedOrder) {
            throw new Error(
                "Order creation returned successfully, but verification failed."
            );
        }

        console.log("\nVERIFIED DATABASE ORDER:");

        console.dir(
            verifiedOrder,
            {
                depth: null,
                colors: false,
            }
        );

        console.log("\n============================================================");
        console.log("                    RECOVERY SUMMARY");
        console.log("============================================================");

        console.log("✓ Order ID:", verifiedOrder.orderId);

        console.log(
            "✓ Payment ID:",
            verifiedOrder.razorpayPaymentId
        );

        console.log(
            "✓ Payment Status:",
            verifiedOrder.paymentStatus
        );

        console.log(
            "✓ Order Status:",
            verifiedOrder.orderStatus
        );

        console.log(
            "✓ Product:",
            verifiedOrder.items?.[0]?.productName
        );

        console.log(
            "✓ Product Code:",
            verifiedOrder.items?.[0]?.productCode
        );

        console.log(
            "✓ Quantity:",
            verifiedOrder.quantity
        );

        console.log(
            "✓ Total:",
            `₹${verifiedOrder.total}`
        );

        console.log("============================================================");

        console.log(
            "\n🎉 Failed order successfully recovered in live database."
        );

    } catch (error) {

        console.error("\n");
        console.error("❌ FAILED ORDER RECOVERY FAILED");
        console.error(error);

    } finally {

        await mongoose.disconnect();

        console.log("\nMongoDB disconnected.");
    }
}

recoverFailedOrder();