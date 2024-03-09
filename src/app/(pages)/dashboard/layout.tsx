"use client";

import { ReactNode, Suspense } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { Header } from "@/app/components/Header";
import { Sidebar } from "@/app/components/Sidebar";
import Loading from "./loading";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  console.log(pathname);
  return (
    <Flex w={"100%"} h={"100%"}>
      <Sidebar />
      <Flex
        as="main"
        w={"100%"}
        h={"100vh"}
        flexDirection={"column"}
        overflowX="hidden"
        overflowY="hidden"
      >
        <Header />
        <Suspense fallback={<Loading />}>
          <Box
            as="main"
            px={{
              base: pathname === "/dashboard/mapa" ? "0" : "4",
              md: pathname === "/dashboard/mapa" ? "0" : "10",
            }}
            py={{
              base: pathname === "/dashboard/mapa" ? "0" : "4",
              md: pathname === "/dashboard/mapa" ? "0" : "10",
            }}
            w={"100%"}
            h={"100%"}
            overflowY="scroll"
          >
            {children}
          </Box>
        </Suspense>
      </Flex>
    </Flex>
  );
}
