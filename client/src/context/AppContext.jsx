import { createContext, useContext, useEffect, useState } from "react";
import API from "../services/api";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // FETCH NOTIFICATIONS (Pending requests)
  const fetchNotifications = async () => {
    try {
      const res = await API.get("/bg");

      const pending =
        res?.data?.data?.filter((item) => item.status === "Pending") || [];

      setNotifications(pending);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <AppContext.Provider
      value={{
        notifications,
        setNotifications,
        searchTerm,
        setSearchTerm,
        refreshNotifications: fetchNotifications,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);