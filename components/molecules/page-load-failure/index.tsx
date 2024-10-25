import { AlertTriangle } from "lucide-react"; // Importing Lucide icon
import React from "react";
import { PageLoadFailureProps } from "./types";

export function PageLoadFailure(props: PageLoadFailureProps) {
  const defaultMessage = "Failed to load the page.";
  const message = props.message || defaultMessage;

  return (
    <div className="flex flex-col justify-center items-center h-full bg-gray-100 p-4">
      <div className="text-center">
        <AlertTriangle className="text-red-600" size={40} />
        <p className="mt-4 text-lg text-gray-800">
          {message}
          {props.reload && (
            <button
              className="ml-4 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={props.reload}
            >
              {"Reload"}
            </button>
          )}
        </p>
      </div>
    </div>
  );
}
