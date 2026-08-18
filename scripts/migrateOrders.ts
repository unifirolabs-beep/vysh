import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is missing");
}

// Loose schemas so the preview can read both old and new orders
const orderSchema = new mongoose.Schema(
    {},
    {
        strict: false,
    }
);

const productSchema = new mongoose.Schema(
    {},
    {
        strict: false,
    }
);

const Order =
    mongoose.models.PreviewOrder ||
    mongoose.model(
        "PreviewOrder",
        orderSchema,
        "orders"
    );

const Product =
    mongoose.models.PreviewProduct ||
    mongoose.model(
        "PreviewProduct",
        productSchema,
        "products"
    );


function normalizePaymentStatus(status: any) {
    if (!status) return "pending";

    return String(status).toLowerCase();
}


function normalizePaymentMethod(paymentType: any) {
    if (!paymentType) return "upi";

    return String(paymentType).toLowerCase();
}


async function previewMigration() {

    try {

        await mongoose.connect(MONGODB_URI);

        console.log("\n========================================");
        console.log("   VYSH ORDER MIGRATION PREVIEW");
        console.log("========================================");
        console.log("MongoDB connected");
        console.log("READ-ONLY MODE");
        console.log("No database changes will be made.\n");


        const orders = await Order
            .find({})
            .sort({ createdAt: 1 })
            .lean();


        console.log(
            `Found ${orders.length} total orders.\n`
        );


        let oldOrders = 0;
        let existingItemOrders = 0;
        let skippedOrders = 0;


        for (const order of orders) {

            console.log("\n----------------------------------------");
            console.log(`ORDER: ${order.orderId}`);
            console.log("----------------------------------------");


            // =====================================================
            // Already has items[]
            // =====================================================

            if (
                Array.isArray(order.items) &&
                order.items.length > 0
            ) {

                existingItemOrders++;

                console.log("TYPE: Already has items[]");
                console.log(
                    "ACTION: Normalize existing order"
                );

                console.log(
                    "\nCurrent payment data:"
                );

                console.log(
                    "  paymentMethod:",
                    order.paymentMethod ?? "(missing)"
                );

                console.log(
                    "  paymentType:",
                    order.paymentType ?? "(missing)"
                );

                console.log(
                    "  paymentStatus:",
                    order.paymentStatus ?? "(missing)"
                );

                console.log(
                    "\nWould become:"
                );

                console.log(
                    "  orderCode:",
                    order.orderCode || order.orderId
                );

                console.log(
                    "  paymentMethod:",
                    order.paymentMethod ||
                    normalizePaymentMethod(
                        order.paymentType
                    )
                );

                console.log(
                    "  paymentStatus:",
                    normalizePaymentStatus(
                        order.paymentStatus
                    )
                );


                console.log(
                    "\nItems:"
                );

                order.items.forEach(
                    (item: any, index: any) => {

                        console.log(
                            `\n  Item ${index + 1}`
                        );

                        console.log(
                            "    productId:",
                            item.productId
                        );

                        console.log(
                            "    productCode:",
                            item.productCode
                        );

                        console.log(
                            "    productName:",
                            item.productName
                        );

                        console.log(
                            "    productPrice:",
                            item.productPrice
                        );

                        console.log(
                            "    quantity:",
                            item.quantity
                        );

                        console.log(
                            "    total:",
                            item.total
                        );
                    }
                );

                continue;
            }


            // =====================================================
            // Old schema
            // =====================================================

            if (
                Array.isArray(order.productId) &&
                order.productId.length > 0
            ) {

                oldOrders++;

                console.log("TYPE: OLD SCHEMA");
                console.log(
                    "ACTION: Convert productId[] → items[]"
                );


                // -------------------------------------------------
                // Safety check
                // -------------------------------------------------

                if (order.productId.length !== 1) {

                    skippedOrders++;

                    console.log(
                        "\n⚠️ SKIPPED"
                    );

                    console.log(
                        `This order contains ${order.productId.length} products.`
                    );

                    console.log(
                        "The old schema does not preserve individual quantities."
                    );

                    continue;
                }


                const productId =
                    order.productId[0];


                console.log(
                    "\nOld order data:"
                );

                console.log(
                    "  orderId:",
                    order.orderId
                );

                console.log(
                    "  productId:",
                    productId
                );

                console.log(
                    "  quantity:",
                    order.quantity
                );

                console.log(
                    "  total:",
                    order.total
                );

                console.log(
                    "  paymentType:",
                    order.paymentType
                );

                console.log(
                    "  paymentStatus:",
                    order.paymentStatus
                );

                console.log(
                    "  orderStatus:",
                    order.orderStatus
                );


                // -------------------------------------------------
                // Find product
                // -------------------------------------------------

                const product =
                    await Product
                        .findById(productId)
                        .lean();


                if (!product) {

                    skippedOrders++;

                    console.log(
                        "\n❌ SKIPPED"
                    );

                    console.log(
                        "Product was not found:"
                    );

                    console.log(
                        productId
                    );

                    continue;
                }


                const quantity =
                    Number(
                        order.quantity || 1
                    );


                const productPrice =
                    Number(
                        product.price || 0
                    );


                const itemTotal =
                    productPrice * quantity;


                // -------------------------------------------------
                // Build the item that migration WOULD create
                // -------------------------------------------------

                const newItem = {

                    productId:
                        product._id,

                    productCode:
                        product.productCode || "",

                    productName:
                        product.name || "",

                    productPrice,

                    quantity,

                    imageUrl:
                        product.imageUrl || "",

                    weight:
                        Number(
                            product.weight || 0
                        ),

                    metalType:
                        product.metalType || "",

                    purity:
                        product.purity || "",

                    total:
                        itemTotal
                };


                console.log(
                    "\nProduct found:"
                );

                console.log(
                    "  name:",
                    product.name
                );

                console.log(
                    "  productCode:",
                    product.productCode
                );

                console.log(
                    "  current price:",
                    product.price
                );

                console.log(
                    "  current stock:",
                    product.stock
                );


                console.log(
                    "\n--------------------------------"
                );

                console.log(
                    "WOULD CREATE:"
                );

                console.log(
                    "--------------------------------"
                );


                console.dir(
                    {
                        orderCode:
                            order.orderId,

                        paymentMethod:
                            normalizePaymentMethod(
                                order.paymentType
                            ),

                        paymentStatus:
                            normalizePaymentStatus(
                                order.paymentStatus
                            ),

                        orderStatus:
                            order.orderStatus,

                        quantity:
                            order.quantity,

                        total:
                            order.total,

                        items: [
                            newItem
                        ]
                    },
                    {
                        depth: null,
                        colors: false
                    }
                );


                // -------------------------------------------------
                // Important comparison
                // -------------------------------------------------

                console.log(
                    "\nTOTAL CHECK:"
                );

                console.log(
                    `  Existing order.total : ₹${order.total}`
                );

                console.log(
                    `  Calculated item total : ₹${itemTotal}`
                );


                if (
                    Number(order.total) ===
                    Number(itemTotal)
                ) {

                    console.log(
                        "  ✓ TOTAL MATCHES"
                    );

                } else {

                    console.log(
                        "  ⚠️ TOTAL DOES NOT MATCH"
                    );

                    console.log(
                        "  Difference:",
                        Number(order.total) -
                        Number(itemTotal)
                    );
                }

                continue;
            }


            // =====================================================
            // Unknown format
            // =====================================================

            skippedOrders++;

            console.log(
                "⚠️ UNKNOWN ORDER FORMAT"
            );

            console.log(
                "No items[] or productId[] found."
            );
        }


        // =========================================================
        // SUMMARY
        // =========================================================

        console.log("\n\n========================================");
        console.log("           PREVIEW SUMMARY");
        console.log("========================================");

        console.log(
            "Total orders:",
            orders.length
        );

        console.log(
            "Old orders to migrate:",
            oldOrders
        );

        console.log(
            "Orders already containing items[]:",
            existingItemOrders
        );

        console.log(
            "Orders that would be skipped:",
            skippedOrders
        );

        console.log(
            "========================================"
        );

        console.log(
            "\nIMPORTANT:"
        );

        console.log(
            "This script made ZERO database changes."
        );

        console.log(
            "It only performed find/findById operations."
        );

        console.log(
            "========================================\n"
        );


    } catch (error) {

        console.error(
            "\n❌ Preview failed:"
        );

        console.error(error);

    } finally {

        await mongoose.disconnect();

        console.log(
            "MongoDB disconnected."
        );
    }
}


previewMigration();