"use client";
import { Loader as LucideLoader } from "lucide-react";
import React from "react";
import { LoaderProps } from "./types";

export const Loader: React.FC<LoaderProps> = ({
  size = 32,
  color = "#000",
}) => {
  return (
    <div className="flex justify-center items-center h-full">
      <LucideLoader className="animate-spin" size={size} color={color} />
    </div>
  );
};
