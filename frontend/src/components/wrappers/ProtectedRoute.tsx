"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useVerifyUserQuery, useRefreshTokenMutation } from "@/store/services/auth/authApi";

type ProtectedRouteProps = {
    children: React.ReactNode;
};

const ProtectedRoute = ({
    children
}: ProtectedRouteProps) => {

    const router = useRouter();

    const { isLoading, isError, refetch } = useVerifyUserQuery(undefined);

    const [refreshToken] = useRefreshTokenMutation();

    useEffect(() => {

        const verifyAuth = async () => {

            // if verify-user fails
            if (!isLoading && isError) {

                try {

                    // generate new access token using refresh token
                    await refreshToken(undefined).unwrap();

                    // retry verify-user API
                    await refetch();

                } catch (error) {

                    // refresh token also expired
                    router.push("/auth/login");

                }
            }
        };

        verifyAuth();

    }, [
        isLoading,
        isError,
        refreshToken,
        refetch,
        router
    ]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return <>{children}</>;
};

export default ProtectedRoute;