import { useState } from "react";
import Search from "./search";
import UsersList from "./userList";

function Sidebar() {
    const [searchKey, setSearchKey] = useState("");
  return (
    <div className="app-sidebar" >
        <Search searchKey={searchKey} setSearchKey={setSearchKey} />
    {/* <!--SEARCH USER-->

    <!--USER LIST--> */}
    <UsersList searchKey={searchKey} setSearchKey={setSearchKey} />
</div>
  );
}

export default Sidebar;