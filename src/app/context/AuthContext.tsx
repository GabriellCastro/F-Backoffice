/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { createContext, FC, ReactNode, useEffect, useState } from "react";
import { api } from "../api/index";
import { TypeUser } from "../utils/types/TypeUser";
import { destroyCookie, parseCookies } from "nookies";
import { usePathname, useRouter } from "next/navigation";
import Loading from "../(pages)/dashboard/loading";
import { Flex } from "@chakra-ui/react";
import { publicRoutes } from "../utils/constants/routes";
import { IUserVerifyData } from "../utils/types/rest";

interface IAuthContext {
  customer: TypeUser;
  setCustomer: (customer: TypeUser) => void;
  signOut: () => void;
}

interface IAuthProvider {
  children: ReactNode;
}

export const AuthContext = createContext({} as IAuthContext);

export const AuthProvider: FC<IAuthProvider> = ({ children }) => {
  const [customer, setCustomer] = useState<TypeUser>({} as TypeUser);
  const [onLoadingAuth, setOnLoadingAuth] = useState<boolean>(true);
  const router = useRouter();
  const pathname = usePathname();
  const { token } = parseCookies();

  useEffect(() => {
    if (publicRoutes.includes(pathname) && !token) {
      setOnLoadingAuth(false);
      return;
    }

    if (!token) {
      router.push("/login");
      setOnLoadingAuth(false);
      return;
    }
  }, [pathname]);

  useEffect(() => {
    if (!token) return;

    api
      .get<IUserVerifyData>("/user/verify", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        setCustomer(data.data);
        api.defaults.headers["Authorization"] = `Bearer ${token}`;
        if (pathname === "/dashboard") return;
        if (pathname === "/") router.push("/dashboard");
        if (!publicRoutes.includes(pathname)) return;
        router.push("/dashboard");
      })
      .catch(() => {
        destroyCookie(null, "token");
        router.push("/login");
      })
      .finally(() => setOnLoadingAuth(false));
  }, []);

  const signOut = () => {
    destroyCookie(null, "token");
    setCustomer({} as TypeUser);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        customer,
        setCustomer,
        signOut,
      }}
    >
      {onLoadingAuth || (!token && !publicRoutes.includes(pathname)) ? (
        <Flex w={"100%"} h={"100vh"}>
          <Loading />
        </Flex>
      ) : (
        <div>{children}</div>
      )}
    </AuthContext.Provider>
  );
};
