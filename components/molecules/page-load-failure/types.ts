export interface PageLoadFailureProps {
  readonly message?: string;

  readonly reload?: () => void;
}
