"use server"

import { connectDB } from "@/lib/db/connectDB";
import Order from "@/models/orders";
import Product from "@/models/products";


export async function getDashboardStatsAction() {
    try {
        await connectDB();
        const [totalRevenue, totalOrders, totalProducts] = await Promise.all([
            Order.aggregate([
                { $match: { orderStatus: "Delivered" } },
                { $group: { _id: null, total: { $sum: "$total" } } }
            ]),
            Order.countDocuments(),
            Product.countDocuments()
        ]);

        return {
            success: true,
            stats: {
            totalRevenue: totalRevenue[0]?.total || 0,
            totalOrders,
            totalProducts
            }
        };
    } catch (error) {
        console.error("Error getting dashboard stats:", error);
        return {
            success: false,
            message: "Error getting dashboard stats",
            stats: {
            totalRevenue: 0,
            totalOrders: 0,
            totalProducts: 0
            }
        };
    }
}