"use client";
import { Box } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export const Header: React.VFC = () => {
  type ResponseType = {
    favIconUrl?: string; // Make favIconUrl optional since it might be undefined
    title?: string;
    url?: string;
  };

  const [externalTab, setExternalTab] = useState<ResponseType>();

  useEffect(() => {
    // eslint-disable-next-line
    //@ts-ignore
    // eslint-disable-next-line
    chrome?.tabs?.query({ active: true, currentWindow: true }, function (tabs) {
      setExternalTab(tabs && tabs[0]);
      // eslint-disable-next-line
      //@ts-ignore
      // eslint-disable-next-line
      console.log(tabs[0]);
    });
  }, []);

  // Fallback image or an empty string to avoid TypeScript error
  const imageSrc = externalTab?.favIconUrl || "/path/to/default/favicon.png";
  const hreff = externalTab?.url || "/path/to/default";
  return (
    <Box display={"flex"} justifyContent={"space-between"} gap={2} alignItems={"center"}>
      <Image src={imageSrc} alt="Favicon" width={32} height={32} />
      <Link href={hreff} target="_blank">
        <a className="text-blue-900 underline">{externalTab?.title}</a>
      </Link>
    </Box>
  );
};
