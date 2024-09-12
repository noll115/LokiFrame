import { FC } from "react";
import AddPhotosProvider from "./components/AddPhotosProvider";

const Layout: FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="size-full p-8 overflow-hidden">
      <AddPhotosProvider>{children}</AddPhotosProvider>
    </div>
  );
};

export default Layout;
