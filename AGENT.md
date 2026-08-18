IMPORTANT NOTE
1. Use shadcn UI components to build the UI.
2. Always use tailwind CSS to style the components.
3. Never use inline styles.


Features to add
1. Add feature to order products through Razorpay (UPI).
2. Verify payments through webhooks (Razorpay).
3. Refactor code for CheckoutClient.tsx form using react-hook-form and zod validations, refer Order.ts from model folder to understand the structure.
4. Remove Cash On Delivary (COD) payment method.
5. Use server actions to update client order to mongodb, also add server action to fetch the order details from mongodb and display it in the OrderClient.tsx page.
6. Give edit access to admin to edit the order details (order status) and update it in the mongodb.