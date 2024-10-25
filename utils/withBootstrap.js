"use client";

import React, { useEffect, useState } from "react";
import { bootstrap } from "@/utils/bootstrap";
import AppError from "@/components/molecules/app-error";

export const withBootstrap = (Component) => {
  return function WrappedComponent(props) {
    const [isInitialized, setIsInitialized] = useState(false);
    // const [error, setError] = (useState < Error) | (null > null);
    const [error, setError] = useState(null);

    useEffect(() => {
      bootstrap(
        () => {
          console.log("App initialized");
          setIsInitialized(true);
        },
        (err) => {
          setError(err);
        }
      );
    }, [setError]);
    if (error) {
      return <AppError error={error} />;
    }

    if (!isInitialized) {
      return <div>Loading...</div>;
    }

    return <Component {...props} />;
  };
};
