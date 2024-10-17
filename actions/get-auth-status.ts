"use server";

import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

const getAuthStatus = async () => {
    const user = await currentUser();

    if (!user?.id || !user?.phoneNumbers) {
        return { error: "User not found" };
    }

    let userId = user.id; // Change clerkId to userId to match your schema

    // Ensure primaryEmailAddress is present
    const emailAddress = user.primaryEmailAddressId || "";

    if (!emailAddress) {
        return { error: "Email not found" };
    }

    const existingUser = await db.profile.findFirst({
        where: {
            user_id: userId, // Match user_id field with your schema
        },
    });

    if (!existingUser) {
        await db.profile.create({
            data: {
                user_id: userId, // Match user_id field with your schema
                email: emailAddress, // Ensure email is safe to access
                name: user.firstName || user.firstName || "Unknown", // Fallback for name
                imageUrl: user.imageUrl,
            },
        });
    }

    return { success: true };
};

export default getAuthStatus;
