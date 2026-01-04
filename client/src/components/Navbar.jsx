import React from "react";
import { Home, MessageSquareIcon } from "lucide-react";
export default function Navbar() {
  return (
    <>
      <div className="">
        <div>
          <Home></Home>
        </div>
        <div>product</div>
        <div>
          {" "}
          <MessageSquareIcon></MessageSquareIcon>
        </div>
        <div></div>
      </div>
    </>
  );
}
