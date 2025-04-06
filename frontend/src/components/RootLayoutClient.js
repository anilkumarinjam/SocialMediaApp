"use client";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { useState, Suspense, lazy } from "react";
import { Header } from ".";
import LoadingProvider from "./LoadingProvider";
import ModalPortal from "./common/ModalPortal";

// Lazy load components that aren't needed immediately
const Rightbar = lazy(() => import("./layout/Rightbar"));
const Sidebar = lazy(() => import("./layout/Sidebar"));

export default function RootLayoutClient({ children }) {
  return (
    <Provider store={store}>
      <LoadingProvider>
        <LayoutWrapper>{children}</LayoutWrapper>
        <ModalPortal />
      </LoadingProvider>
    </Provider>
  );
}

function LayoutWrapper({ children }) {
  const [isSidebar, setisSidebar] = useState(false);
  const toggleSidebar = () => {
    setisSidebar(!isSidebar);
  }
  return (
    <>
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex w-full h-full">
        <Suspense fallback={<div className="w-64 bg-white shadow-lg animate-pulse" />}>
          <Sidebar isSidebar={isSidebar} />
        </Suspense>
        <div className="flex flex-col flex-1 max-w-full overflow-hidden">
          {children}
        </div>
        <Suspense fallback={<div className="w-80 bg-white shadow-lg animate-pulse" />}>
          <Rightbar />
        </Suspense>
      </div>
    </>
  )
}