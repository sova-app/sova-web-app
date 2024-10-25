export function bootstrap(
  initializeApp?: () => void,
  renderError?: (err: any) => void
) {
  return Promise.resolve()
    .then(() => initializeApp && initializeApp())
    .catch((err) => {
      console.error(err);
      if (renderError) {
        renderError(err);
      }
    });
}
