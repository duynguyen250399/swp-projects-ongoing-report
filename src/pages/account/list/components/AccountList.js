import { Edit } from "@icon-park/react";
import { Button, Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import UserApi from "../../../../apis/user";
import { roles } from "../../../../constants/app";

const AccountList = ({ onEditAccount }) => {
  const [accountLoading, setAccountLoading] = useState(false);
  const [accounts, setAccounts] = useState([]);

  const getUsers = async (keyword) => {
    setAccountLoading(true);
    const data = await UserApi.searchUsers(keyword);
    setAccounts(data);
    setAccountLoading(false);
  };

  useEffect(() => {
    getUsers();
  }, []);

  const getRoleName = (role) => {
    switch (role) {
      case roles.UNIVERSITY:
        return "Nhà trường";
      case roles.STUDENT:
        return "Sinh viên";
      case roles.TEACHER:
        return "Giáo viên";
      default:
        return undefined;
    }
  };

  const columns = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Họ tên",
      dataIndex: "fullName",
      key: "fullName",
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (_, { role }) => {
        return (
          <Tag
            STYLE="font-size: 15px"
            color={
              role === roles.UNIVERSITY
                ? "blue"
                : role === roles.STUDENT
                ? "cyan"
                : "purple"
            }
          >
            {getRoleName(role)}
          </Tag>
        );
      },
      sorter: (a, b) => a.role.localeCompare(b.role),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (_, { isBan }) => {
        return (
          <Tag
            STYLE="font-size: 15px"
            color={!isBan ? "blue-inverse" : "red-inverse"}
          >
            {!isBan ? "Đang hoạt động" : "Khóa"}
          </Tag>
        );
      },
      sorter: (a, b) => a.isBan - b.isBan,
    },
    {
      title: "Thao tác",
      dataIndex: "action",
      key: "action",
      render: (_, record) => {
        return (
          <Button
            onClick={onEditAccount}
            className="flex-center"
            icon={<Edit />}
          />
        );
      },
    },
  ];

  return (
    <Table loading={accountLoading} dataSource={accounts} columns={columns} />
  );
};

export default AccountList;
