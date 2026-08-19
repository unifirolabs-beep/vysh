import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is missing");
}

// ============================================================
// READ-ONLY / FLEXIBLE SCHEMA
// ============================================================

const orderSchema = new mongoose.Schema(
    {},
    {
        strict: false,
    }
);

const Order: mongoose.Model<any> =
    (mongoose.models.LiveOrder as mongoose.Model<any>) ||
    mongoose.model<any>(
        "LiveOrder",
        orderSchema,
        "orders"
    );

// ============================================================
// ORDER TO MIGRATE
// ============================================================

const ORDER_ID = "VYSH-542593-3483";

// ============================================================
// DELETED PRODUCT SNAPSHOT
// ============================================================

const PRODUCT_IMAGE_URL = "DELETED_PRODUCT";

const productItem = {
    productId: null,

    productCode:
        "LEGACY-VYSH-542593-3483",

    productName:
        "Silver Trishul Damru",

    productPrice: 499,

    quantity: 1,

    imageUrl:
        PRODUCT_IMAGE_URL,

    weight: 0,

    metalType: "Silver",

    purity: "925",

    total: 499,
};

// ============================================================
// LIVE MIGRATION
// ============================================================

async function migrateOrder() {
    try {
        await mongoose.connect(MONGODB_URI);

        console.log("\n");
        console.log("============================================================");
        console.log("             VYSH LIVE ORDER MIGRATION");
        console.log("============================================================");

        console.log("MongoDB connected successfully.");
        console.log("Order ID:", ORDER_ID);
        console.log("MODE: LIVE UPDATE");

        console.log("============================================================\n");

        // ========================================================
        // 1. FIND EXISTING ORDER
        // ========================================================

        const oldOrder = await Order
            .findOne({
                orderId: ORDER_ID,
            })
            .lean()
            .exec();

        if (!oldOrder) {
            throw new Error(
                `Order ${ORDER_ID} was not found.`
            );
        }

        console.log("✓ Existing order found.");

        // ========================================================
        // 2. SAFETY CHECK
        // ========================================================

        if (
            Array.isArray(oldOrder.items) &&
            oldOrder.items.length > 0
        ) {
            throw new Error(
                "This order already contains items[]. Migration aborted to prevent overwriting a new-schema order."
            );
        }

        if (
            !Array.isArray(oldOrder.productId) ||
            oldOrder.productId.length === 0
        ) {
            throw new Error(
                "Old productId[] is missing or empty. Migration aborted."
            );
        }

        if (oldOrder.productId.length !== 1) {
            throw new Error(
                `Expected exactly 1 product, found ${oldOrder.productId.length}. Migration aborted.`
            );
        }

        // ========================================================
        // 3. VERIFY PAYMENT DETAILS
        // ========================================================

        console.log("\nPayment verification:");

        console.log(
            "Razorpay Order ID:",
            oldOrder.razorpayOrderId
        );

        console.log(
            "Razorpay Payment ID:",
            oldOrder.razorpayPaymentId
        );

        console.log(
            "Razorpay Signature:",
            oldOrder.razorpaySignature
        );

        console.log(
            "Old Payment Status:",
            oldOrder.paymentStatus
        );

        console.log(
            "Old Order Status:",
            oldOrder.orderStatus
        );

        // ========================================================
        // 4. BUILD NEW ITEM
        // ========================================================

        const newItem = {
            productId:
                productItem.productId,

            productCode:
                productItem.productCode,

            productName:
                productItem.productName,

            productPrice:
                productItem.productPrice,

            quantity:
                productItem.quantity,

            imageUrl:
                productItem.imageUrl,

            weight:
                productItem.weight,

            metalType:
                productItem.metalType,

            purity:
                productItem.purity,

            total:
                productItem.total,
        };


        // ========================================================
        // 6. BUILD UPDATE
        // ========================================================

        const updateData = {

            paymentMethod:
                String(
                    oldOrder.paymentType || "upi"
                ).toLowerCase(),

            paymentStatus:
                String(
                    oldOrder.paymentStatus || "pending"
                ).toLowerCase(),

            // Preserve the existing status.
            orderStatus:
                oldOrder.orderStatus || "Pending",

            items: [
                newItem,
            ],

            quantity:
                Number(oldOrder.quantity),

            // Preserve original historical order total.
            total:
                Number(oldOrder.total),

            razorpayOrderId:
                oldOrder.razorpayOrderId || null,

            razorpayPaymentId:
                oldOrder.razorpayPaymentId || null,

            razorpaySignature:
                oldOrder.razorpaySignature || null,
        };

        // ========================================================
        // 7. DISPLAY FINAL UPDATE
        // ========================================================

        console.log("\n");
        console.log("============================================================");
        console.log("             DATA THAT WILL BE WRITTEN");
        console.log("============================================================");

        console.dir(
            updateData,
            {
                depth: null,
                colors: false,
            }
        );

        console.log("============================================================");

        // ========================================================
        // 8. PERFORM UPDATE
        // ========================================================

        console.log("\nUpdating live database...");

        const result = await Order.updateOne(
            {
                _id: oldOrder._id,

                // Ensure we are still updating the exact old
                // schema document we inspected.
                orderId: ORDER_ID,

                // Safety condition: don't update if another
                // process has already migrated this order.
                items: {
                    $exists: false,
                },
            },
            {
                $set: updateData,

                $unset: {
                    paymentType: "",
                    productId: "",
                },
            }
        );

        // ========================================================
        // 9. VERIFY UPDATE
        // ========================================================

        console.log("\nUpdate result:");

        console.log(
            "Matched:",
            result.matchedCount
        );

        console.log(
            "Modified:",
            result.modifiedCount
        );

        if (result.matchedCount !== 1) {
            throw new Error(
                "Safety check failed: expected exactly 1 matched order."
            );
        }

        if (result.modifiedCount !== 1) {
            throw new Error(
                "Order was matched but not modified."
            );
        }

        // ========================================================
        // 10. READ BACK FROM DATABASE
        // ========================================================

        const migratedOrder = await Order
            .findOne({
                orderId: ORDER_ID,
            })
            .lean()
            .exec();

        if (!migratedOrder) {
            throw new Error(
                "Order could not be found after migration."
            );
        }

        // ========================================================
        // 11. VERIFY NEW SCHEMA
        // ========================================================

        if (
            !Array.isArray(migratedOrder.items) ||
            migratedOrder.items.length !== 1
        ) {
            throw new Error(
                "Post-update verification failed: items[] is incorrect."
            );
        }

        if (
            migratedOrder.paymentMethod !== "upi"
        ) {
            throw new Error(
                "Post-update verification failed: paymentMethod is incorrect."
            );
        }

        if (
            migratedOrder.paymentStatus !== "paid"
        ) {
            throw new Error(
                "Post-update verification failed: paymentStatus is incorrect."
            );
        }

        if (
            migratedOrder.orderStatus !==
            oldOrder.orderStatus
        ) {
            throw new Error(
                "Post-update verification failed: orderStatus changed unexpectedly."
            );
        }

        if (
            migratedOrder.total !==
            Number(oldOrder.total)
        ) {
            throw new Error(
                "Post-update verification failed: order total changed."
            );
        }

        // ========================================================
        // 12. FINAL OUTPUT
        // ========================================================

        console.log("\n");
        console.log("############################################################");
        console.log("#                                                          #");
        console.log("#             ✓ MIGRATION SUCCESSFUL                       #");
        console.log("#                                                          #");
        console.log("############################################################");

        console.dir(
            migratedOrder,
            {
                depth: null,
                colors: false,
            }
        );

        console.log("\n");
        console.log("============================================================");
        console.log("                    VERIFICATION");
        console.log("============================================================");

        console.log(
            "✓ Order ID:",
            migratedOrder.orderId
        );

        console.log(
            "✓ Payment Method:",
            migratedOrder.paymentMethod
        );

        console.log(
            "✓ Payment Status:",
            migratedOrder.paymentStatus
        );

        console.log(
            "✓ Order Status:",
            migratedOrder.orderStatus
        );

        console.log(
            "✓ Items:",
            migratedOrder.items.length
        );

        console.log(
            "✓ Product:",
            migratedOrder.items[0].productName
        );

        console.log(
            "✓ Product Code:",
            migratedOrder.items[0].productCode
        );

        console.log(
            "✓ Product Total:",
            `₹${migratedOrder.items[0].total}`
        );

        console.log(
            "✓ Order Total:",
            `₹${migratedOrder.total}`
        );

        console.log(
            "✓ Razorpay Payment ID:",
            migratedOrder.razorpayPaymentId
        );

        console.log(
            "✓ Razorpay Signature preserved:",
            Boolean(
                migratedOrder.razorpaySignature
            )
        );

        console.log("============================================================");

        console.log(
            "\n🎉 Old order successfully migrated to the new schema."
        );

    } catch (error) {

        console.error("\n");
        console.error("❌ LIVE MIGRATION FAILED");
        console.error(error);

    } finally {

        await mongoose.disconnect();

        console.log("\nMongoDB disconnected.");
    }
}

migrateOrder();