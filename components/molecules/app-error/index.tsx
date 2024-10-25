import React from "react";
import { PageLoadFailure } from "../page-load-failure";

export interface AppErrorProps {
  readonly error: any;
}

export default function AppError(props: AppErrorProps) {
  const { error } = props;
  return <PageLoadFailure message={error.message} />;
}
