import { PageLoadFailure } from "../page-load-failure";

export interface AppErrorProps {
  readonly error: Error
}

export default function AppError(props: AppErrorProps) {
  const { error } = props;
  return <PageLoadFailure message={error.message} />;
}
