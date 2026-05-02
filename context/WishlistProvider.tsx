import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

type WishlistContextType = {
  wishlist: any[];
  toggleWishlist: (product: any) => void;
  isInWishlist: (id: string) => boolean;
};

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined,
);

export const WishlistProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [wishlist, setWishlist] = useState<any[]>([]);

  useEffect(() => {
    const loadWishlist = async () => {
      const stored = await AsyncStorage.getItem("user_wishlist");
      if (stored) setWishlist(JSON.parse(stored));
    };
    loadWishlist();
  }, []);

  const toggleWishlist = async (product: any) => {
    let updatedWishlist;
    if (wishlist.some((item) => item.id === product.id)) {
      updatedWishlist = wishlist.filter((item) => item.id !== product.id);
    } else {
      updatedWishlist = [...wishlist, product];
    }
    setWishlist(updatedWishlist);
    await AsyncStorage.setItem(
      "user_wishlist",
      JSON.stringify(updatedWishlist),
    );
  };

  const isInWishlist = (id: string) => wishlist.some((item) => item.id === id);

  return (
    <WishlistContext.Provider
      value={{ wishlist, toggleWishlist, isInWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context)
    throw new Error("useWishlist must be used within WishlistProvider");
  return context;
};
