"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

interface NotificationContextType {
  pendingOrdersCount: number;
  refreshPendingOrders: () => Promise<void>;
  isLoading: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [pendingOrdersCount] = useState(0);
  const [isLoading] = useState(false);

  const refreshPendingOrders = useCallback(async () => {
    // Feature removed
  }, []);

  return (
    <NotificationContext.Provider
      value={{ pendingOrdersCount, refreshPendingOrders, isLoading }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};
