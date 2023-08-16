import { Down, Logout, User } from "@icon-park/react";
import { Dropdown } from "antd";
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import routes from "../../../constants/routes";
import { UserContext } from "../../../providers/user";

const Container = styled.div`
  color: white;
`;

export const ProfileBar = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    setUser(undefined);
    navigate(routes.login);
  };

  const items = [
    {
      key: "PROFILE",
      label: <Link to={routes.dashboard.profile}>Hồ sơ</Link>,
      icon: <User />,
    },
    {
      key: "LOGOUT",
      label: <span>Đăng xuất</span>,
      icon: <Logout />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <Container>
      <Dropdown
        menu={{
          items,
        }}
      >
        <span className="cursor-pointer">
          {user?.fullName} ({user?.role?.toUpperCase()}) <Down />
        </span>
      </Dropdown>
    </Container>
  );
};
