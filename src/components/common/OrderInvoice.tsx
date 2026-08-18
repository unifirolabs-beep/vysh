import {
    Document,
    Page,
    Text,
    View,
    Image,
    StyleSheet,
    Font,
} from "@react-pdf/renderer";

Font.register({
    family: "NotoSans",
    fonts: [
        {
            src: "/fonts/NotoSans-Regular.ttf",
            fontWeight: "normal",
        },
        {
            src: "/fonts/NotoSans-Bold.ttf",
            fontWeight: "bold",
        },
    ],
});

const styles = StyleSheet.create({
    page: {
        backgroundColor: "#F7F5F3",
        padding: 28,
        fontFamily: "NotoSans",
        color: "#292322",
    },

    container: {
        backgroundColor: "#FFFFFF",
        padding: 28,
        border: "1px solid #E6DEDA",
        borderRadius: 8,
    },

    // HEADER
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        paddingBottom: 18,
        borderBottom: "1px solid #E8DFDC",
    },

    brandSection: {
        flexDirection: "column",
    },

    brand: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#5C061D",
        letterSpacing: 1,
    },

    brandSubtitle: {
        marginTop: 3,
        fontSize: 8,
        color: "#8B7771",
        letterSpacing: 1.5,
    },

    invoiceSection: {
        alignItems: "flex-end",
    },

    invoiceTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#5C061D",
    },

    invoiceLabel: {
        marginTop: 4,
        fontSize: 9,
        color: "#777",
    },

    // ORDER INFO
    orderInfo: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 18,
        marginBottom: 18,
    },

    infoBox: {
        width: "48%",
        padding: 12,
        backgroundColor: "#FAF7F5",
        borderRadius: 6,
        border: "1px solid #EEE5E1",
    },

    infoTitle: {
        fontSize: 10,
        fontWeight: "bold",
        color: "#5C061D",
        marginBottom: 7,
    },

    infoText: {
        fontSize: 9,
        color: "#444",
        lineHeight: 1.5,
    },

    // SECTION
    sectionTitle: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#5C061D",
        marginBottom: 9,
    },

    // PRODUCTS
    itemsContainer: {
        border: "1px solid #E2D9D5",
        borderRadius: 6,
        overflow: "hidden",
    },

    tableHeader: {
        flexDirection: "row",
        backgroundColor: "#5C061D",
        paddingVertical: 8,
        paddingHorizontal: 7,
        alignItems: "center",
    },

    headerText: {
        color: "#FFFFFF",
        fontSize: 8,
        fontWeight: "bold",
    },

    tableRow: {
        flexDirection: "row",
        paddingVertical: 9,
        paddingHorizontal: 7,
        borderBottom: "1px solid #EEEAE7",
        alignItems: "center",
        minHeight: 70,
    },

    lastTableRow: {
        borderBottom: "none",
    },

    // COLUMN WIDTHS
    productColumn: {
        width: "43%",
    },

    quantityColumn: {
        width: "10%",
        textAlign: "center",
    },

    priceColumn: {
        width: "17%",
        textAlign: "right",
    },

    totalColumn: {
        width: "20%",
        textAlign: "right",
    },

    // PRODUCT
    productWrapper: {
        flexDirection: "row",
        alignItems: "center",
    },

    productImage: {
        width: 52,
        height: 52,
        objectFit: "contain",
        borderRadius: 5,
        marginRight: 9,
        backgroundColor: "#F8F5F3",
    },

    productDetails: {
        flex: 1,
    },

    productName: {
        fontSize: 10,
        fontWeight: "bold",
        color: "#292322",
        marginBottom: 3,
    },

    productCode: {
        fontSize: 7.5,
        color: "#8B7771",
        marginBottom: 4,
    },

    productMeta: {
        fontSize: 7.5,
        color: "#666",
        lineHeight: 1.4,
    },

    quantityText: {
        fontSize: 9,
        textAlign: "center",
    },

    priceText: {
        fontSize: 9,
        textAlign: "right",
    },

    totalText: {
        fontSize: 9,
        fontWeight: "bold",
        color: "#5C061D",
        textAlign: "right",
    },

    // SUMMARY
    summaryWrapper: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 18,
    },

    summary: {
        width: "48%",
        padding: 13,
        backgroundColor: "#FAF7F5",
        borderRadius: 6,
        border: "1px solid #EEE5E1",
    },

    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 7,
    },

    summaryLabel: {
        fontSize: 9,
        color: "#666",
    },

    summaryValue: {
        fontSize: 9,
        color: "#333",
    },

    totalDivider: {
        borderTop: "1px solid #DDD3CF",
        marginTop: 4,
        paddingTop: 9,
    },

    grandTotalLabel: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#292322",
    },

    grandTotal: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#5C061D",
    },

    // PAYMENT
    paymentSection: {
        marginTop: 18,
        padding: 13,
        backgroundColor: "#F9F5F3",
        borderRadius: 6,
        border: "1px solid #EEE5E1",
    },

    paymentTitle: {
        fontSize: 10,
        fontWeight: "bold",
        color: "#5C061D",
        marginBottom: 7,
    },

    paymentRow: {
        flexDirection: "row",
        marginBottom: 4,
    },

    paymentLabel: {
        width: 120,
        fontSize: 8,
        color: "#777",
    },

    paymentValue: {
        flex: 1,
        fontSize: 8,
        color: "#333",
    },

    paid: {
        color: "#16723A",
        fontWeight: "bold",
    },

    // FOOTER
    footer: {
        marginTop: 28,
        paddingTop: 15,
        borderTop: "1px solid #E8DFDC",
        alignItems: "center",
    },

    footerMain: {
        fontSize: 10,
        fontWeight: "bold",
        color: "#5C061D",
        marginBottom: 4,
    },

    footerText: {
        fontSize: 8,
        color: "#888",
        textAlign: "center",
    },
});

const formatAmount = (amount: number) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
};

export const OrderInvoice = ({ order }: { order: any }) => {
    const safeOrder = order || {};

    const rawItems = Array.isArray(safeOrder.items) && safeOrder.items.length > 0
        ? safeOrder.items
        : Array.isArray(safeOrder.products) && safeOrder.products.length > 0
        ? safeOrder.products
        : Array.isArray(safeOrder.productId) && safeOrder.productId.length > 0
        ? safeOrder.productId
        : [];

    const items = rawItems.map((item: any) => {
        const productName = item.productName || item.name || "Silver Jewellery Product";
        const productCode = item.productCode || item.code || item.sku || "N/A";
        const productPrice = Number(item.productPrice || item.price || 0);
        const quantity = Number(item.quantity || item.qty || 1);
        const total = Number(item.total || (productPrice * quantity));
        const imageUrl = item.imageUrl || item.image || "";
        const weight = item.weight || 0;
        const metalType = item.metalType || "925 Silver";
        const purity = item.purity || "925 Hallmark";

        return {
            ...item,
            productName,
            productCode,
            productPrice,
            quantity,
            total,
            imageUrl,
            weight,
            metalType,
            purity,
        };
    });

    const subtotal = items.reduce(
        (sum: number, item: any) => sum + Number(item.total || 0),
        0
    );

    const totalAmount = Number(safeOrder.total ?? safeOrder.amount ?? subtotal);
    const shippingCharges = Math.max(totalAmount - subtotal, 0);

    const orderId = safeOrder.orderId || safeOrder.id || safeOrder._id || "N/A";
    const userName = safeOrder.userName || safeOrder.customerName || safeOrder.customer || "Customer";
    const userEmail = safeOrder.userEmail || safeOrder.customerEmail || safeOrder.email || "N/A";
    const userPhone = safeOrder.userPhone || safeOrder.customerPhone || safeOrder.phone || "N/A";
    const userAddress = safeOrder.userAddress || "N/A";
    const userCity = safeOrder.userCity || "";
    const userState = safeOrder.userState || "";
    const userPincode = safeOrder.userPincode || "";
    const userLandmark = safeOrder.userLandmark || "";
    const paymentMethod = String(safeOrder.paymentMethod || safeOrder.payment || "N/A").toUpperCase();
    const paymentStatus = String(safeOrder.paymentStatus || "pending");
    const orderStatus = safeOrder.orderStatus || safeOrder.status || "Pending";

    const formattedDate = (() => {
        try {
            const raw = safeOrder.createdAt || safeOrder.date;
            if (!raw) return new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
            const d = new Date(raw);
            if (isNaN(d.getTime())) return String(raw);
            return d.toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            });
        } catch {
            return new Date().toLocaleDateString("en-IN");
        }
    })();

    return (
        <Document
            title={`Invoice - ${orderId}`}
            author="Vysh"
            subject={`Order Invoice ${orderId}`}
        >
            <Page size="A4" style={styles.page}>
                <View style={styles.container}>

                    {/* HEADER */}
                    <View style={styles.header}>
                        <View style={styles.brandSection}>
                            <Text style={styles.brand}>Vysh</Text>
                            <Text style={styles.brandSubtitle}>
                                SILVER • ELEGANCE • CRAFT
                            </Text>
                        </View>

                        <View style={styles.invoiceSection}>
                            <Text style={styles.invoiceTitle}>
                                INVOICE
                            </Text>

                            <Text style={styles.invoiceLabel}>
                                Order #{orderId}
                            </Text>

                            <Text style={styles.invoiceLabel}>
                                {formattedDate}
                            </Text>
                        </View>
                    </View>

                    {/* CUSTOMER + SHIPPING */}
                    <View style={styles.orderInfo}>

                        <View style={styles.infoBox}>
                            <Text style={styles.infoTitle}>
                                CUSTOMER DETAILS
                            </Text>

                            <Text style={styles.infoText}>
                                {userName}
                            </Text>

                            <Text style={styles.infoText}>
                                {userEmail}
                            </Text>

                            <Text style={styles.infoText}>
                                {userPhone ? (userPhone.startsWith("+") ? userPhone : `+91 ${userPhone}`) : "N/A"}
                            </Text>
                        </View>

                        <View style={styles.infoBox}>
                            <Text style={styles.infoTitle}>
                                SHIPPING ADDRESS
                            </Text>

                            <Text style={styles.infoText}>
                                {userName}
                            </Text>

                            <Text style={styles.infoText}>
                                {userAddress}
                            </Text>

                            {(userCity || userState) && (
                                <Text style={styles.infoText}>
                                    {userCity}{userCity && userState ? ", " : ""}{userState}
                                </Text>
                            )}

                            {userPincode && (
                                <Text style={styles.infoText}>
                                    PIN: {userPincode}
                                </Text>
                            )}

                            {userLandmark && (
                                <Text style={styles.infoText}>
                                    Landmark: {userLandmark}
                                </Text>
                            )}
                        </View>

                    </View>

                    {/* PRODUCTS */}
                    <Text style={styles.sectionTitle}>
                        ORDER DETAILS
                    </Text>

                    <View style={styles.itemsContainer}>

                        {/* TABLE HEADER */}
                        <View style={styles.tableHeader}>

                            <Text
                                style={[
                                    styles.headerText,
                                    styles.productColumn,
                                ]}
                            >
                                PRODUCT
                            </Text>

                            <Text
                                style={[
                                    styles.headerText,
                                    styles.quantityColumn,
                                ]}
                            >
                                QTY
                            </Text>

                            <Text
                                style={[
                                    styles.headerText,
                                    styles.priceColumn,
                                ]}
                            >
                                PRICE
                            </Text>

                            <Text
                                style={[
                                    styles.headerText,
                                    styles.totalColumn,
                                ]}
                            >
                                TOTAL
                            </Text>

                        </View>

                        {/* PRODUCTS */}
                        {items.length > 0 ? (
                            items.map((item: any, index: number) => (
                                <View
                                    style={[
                                        styles.tableRow,
                                        index === items.length - 1
                                            ? styles.lastTableRow
                                            : {},
                                    ]}
                                    key={item._id?.toString() || item.productCode || index}
                                >

                                    {/* PRODUCT */}
                                    <View
                                        style={[
                                            styles.productWrapper,
                                            styles.productColumn,
                                        ]}
                                    >
                                        {item.imageUrl ? (
                                            <Image
                                                src={item.imageUrl}
                                                style={styles.productImage}
                                            />
                                        ) : null}

                                        <View style={styles.productDetails}>

                                            <Text style={styles.productName}>
                                                {item.productName}
                                            </Text>

                                            <Text style={styles.productCode}>
                                                Code: {item.productCode}
                                            </Text>

                                            <Text style={styles.productMeta}>
                                                {item.metalType} • {item.purity}
                                            </Text>

                                            {item.weight > 0 && (
                                                <Text style={styles.productMeta}>
                                                    Weight: {item.weight} g
                                                </Text>
                                            )}

                                        </View>
                                    </View>

                                    {/* QUANTITY */}
                                    <Text
                                        style={[
                                            styles.quantityText,
                                            styles.quantityColumn,
                                        ]}
                                    >
                                        {item.quantity}
                                    </Text>

                                    {/* PRICE */}
                                    <Text
                                        style={[
                                            styles.priceText,
                                            styles.priceColumn,
                                        ]}
                                    >
                                        {formatAmount(item.productPrice)}
                                    </Text>

                                    {/* TOTAL */}
                                    <Text
                                        style={[
                                            styles.totalText,
                                            styles.totalColumn,
                                        ]}
                                    >
                                        {formatAmount(item.total)}
                                    </Text>

                                </View>
                            ))
                        ) : (
                            <View style={styles.tableRow}>
                                <View style={[styles.productWrapper, styles.productColumn]}>
                                    <View style={styles.productDetails}>
                                        <Text style={styles.productName}>
                                            Vysh Silver Product
                                        </Text>
                                    </View>
                                </View>
                                <Text style={[styles.quantityText, styles.quantityColumn]}>
                                    1
                                </Text>
                                <Text style={[styles.priceText, styles.priceColumn]}>
                                    {formatAmount(totalAmount)}
                                </Text>
                                <Text style={[styles.totalText, styles.totalColumn]}>
                                    {formatAmount(totalAmount)}
                                </Text>
                            </View>
                        )}

                    </View>

                    {/* TOTAL SUMMARY */}
                    <View style={styles.summaryWrapper}>
                        <View style={styles.summary}>

                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>
                                    Subtotal
                                </Text>

                                <Text style={styles.summaryValue}>
                                    {formatAmount(subtotal || totalAmount)}
                                </Text>
                            </View>

                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>
                                    Shipping
                                </Text>

                                <Text style={styles.summaryValue}>
                                    {shippingCharges > 0
                                        ? formatAmount(shippingCharges)
                                        : "FREE"}
                                </Text>
                            </View>

                            <View
                                style={[
                                    styles.summaryRow,
                                    styles.totalDivider,
                                ]}
                            >
                                <Text style={styles.grandTotalLabel}>
                                    Total Amount
                                </Text>

                                <Text style={styles.grandTotal}>
                                    {formatAmount(totalAmount)}
                                </Text>
                            </View>

                        </View>
                    </View>

                    {/* PAYMENT DETAILS */}
                    <View style={styles.paymentSection}>

                        <Text style={styles.paymentTitle}>
                            PAYMENT INFORMATION
                        </Text>

                        <View style={styles.paymentRow}>
                            <Text style={styles.paymentLabel}>
                                Payment Method
                            </Text>

                            <Text style={styles.paymentValue}>
                                {paymentMethod}
                            </Text>
                        </View>

                        <View style={styles.paymentRow}>
                            <Text style={styles.paymentLabel}>
                                Payment Status
                            </Text>

                            <Text
                                style={[
                                    styles.paymentValue,
                                    paymentStatus.toLowerCase() === "paid"
                                        ? styles.paid
                                        : {},
                                ]}
                            >
                                {paymentStatus.toUpperCase()}
                            </Text>
                        </View>

                        <View style={styles.paymentRow}>
                            <Text style={styles.paymentLabel}>
                                Order Status
                            </Text>

                            <Text style={styles.paymentValue}>
                                {orderStatus}
                            </Text>
                        </View>

                        <View style={styles.paymentRow}>
                            <Text style={styles.paymentLabel}>
                                Razorpay Payment ID
                            </Text>

                            <Text style={styles.paymentValue}>
                                {safeOrder.razorpayPaymentId || "N/A"}
                            </Text>
                        </View>

                        <View style={styles.paymentRow}>
                            <Text style={styles.paymentLabel}>
                                Razorpay Order ID
                            </Text>

                            <Text style={styles.paymentValue}>
                                {safeOrder.razorpayOrderId || "N/A"}
                            </Text>
                        </View>

                    </View>

                    {/* FOOTER */}
                    <View style={styles.footer}>
                        <Text style={styles.footerMain}>
                            Thank you for shopping with Vysh!
                        </Text>

                        <Text style={styles.footerText}>
                            We appreciate your purchase and hope you love
                            your product.
                        </Text>

                        <Text style={styles.footerText}>
                            This is a computer-generated invoice and does not
                            require a signature.
                        </Text>
                    </View>

                </View>
            </Page>
        </Document>
    );
};