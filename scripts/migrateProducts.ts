import { loadEnvConfig } from "@next/env";

import mongoose from 'mongoose';
import Product from '../src/models/products'
import { generateCode } from '../src/utils/generateCode'

loadEnvConfig(process.cwd());

const mongodb_uri = process.env.MONGODB_URI || '';

if (!mongodb_uri) {
    throw new Error("Please provide env with MONGO_URI");
}

const PREFIX_MAP: Record<string, string> = {
    Rakhis: "RAK",
    Rings: "RNG",
    Necklaces: "NEC",
    Earrings: "EAR",
    Pendants: "PEN",
    Bangles: "BAN",
    Bracelets: "BRA",
    Anklets: "ANK",
}   

async function migrateProducts() {
    try {
        await mongoose.connect(mongodb_uri);
        const products = (await Product.find({}))
            .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

        console.log(`Found ${products.length} products`);


        for (const product of products) {
            const prefix = PREFIX_MAP[product.category];

            if (!prefix) {
                console.warn(
                    `Skipping ${product._id}: unknown category "${product.category}"`
                );
                continue;
            }

            const productCode = generateCode(prefix);

            await Product.updateOne(
                { _id: product._id },
                {
                    productCode: productCode,
                    imageVersion: 1,
                }   
            );

            console.log(
                `${product._id} → ${productCode}`
            );
        }

        console.log("Migration completed");


    } catch (error) {
        console.log("Migration Failed : ", error)
    } finally {
        await mongoose.disconnect()
        console.log("DB Disconnected")
    }
}

migrateProducts();