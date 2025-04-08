import { createContext, PropsWithChildren, useState } from "react";
import { Database } from "tiki-db";

type DBContextType = Database | null;

const DBContext = createContext<DBContextType>(null);

const DBProvider = ({ children }: PropsWithChildren) => {
  

  return <DBContext value={{  }}>{children}</DBContext>;
};

export { DBContext, DBProvider };
