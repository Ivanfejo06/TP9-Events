import React, { useState, createContext, useContext, ReactNode} from "react";

// Crea un contexto con un valor predeterminado
const UserContext = createContext();

// Crea un componente proveedor
export const UserProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [usuario, setUsuario]= useState(null);

  return (
    <UserContext.Provider value={{ token, setToken, usuario, setUsuario}}>
      {children}
    </UserContext.Provider>
  );
};

// Crea un hook personalizado para usar el contexto
export const useUserContext = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
      throw new Error('useUserContext must be used within a UserProvider');
    }
    return context;
};