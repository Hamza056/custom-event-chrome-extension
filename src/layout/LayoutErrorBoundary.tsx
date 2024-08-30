import type { FC, VFC } from "react";
import type { FallbackProps } from "react-error-boundary";
import { ErrorBoundary } from "react-error-boundary";
import { Footer } from "src/components/Footer";
import { Header } from "src/components/Header";

const ErrorFallback: VFC<FallbackProps> = (props) => {
  return (
    <div>
      <pre>{props.error.message}</pre>
    </div>
  );
};

export const LayoutErrorBoundary: FC = (props) => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <>
        <Header />
        {props.children}
        <Footer />
      </>
    </ErrorBoundary>
  );
};
