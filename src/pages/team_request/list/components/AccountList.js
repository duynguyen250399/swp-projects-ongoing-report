import { Edit } from "@icon-park/react";
import { Button, Row, Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import UserApi from "../../../../apis/user";
import { ALL_PERMISSIONS, roles } from "../../../../constants/app";
import { usePermissions } from "../../../../hooks/permission";

const AccountList = ({ onEditAccount }) => {
  const permissions = usePermissions();
  const canUpdate = permissions?.includes(ALL_PERMISSIONS.account.update);

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
      case roles.ADMIN:
        return "Admin";
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
            color={
              role === roles.ADMIN
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
          <Tag color={!isBan ? "blue-inverse" : "red-inverse"}>
            {!isBan ? "Đang hoạt động" : "Khóa"}
          </Tag>
        );
      },
      sorter: (a, b) => a.isBan - b.isBan,
    },
    canUpdate && {
      title: "Thao tác",
      dataIndex: "action",
      key: "action",
      render: (_, __) => {
        return (
          <Row>
            <Button
              onClick={onEditAccount}
              className="flex-center"
              icon={<Edit />}
            />
            {/* <Button
              onClick={onEditAccount}
              className="flex-center"
              icon={<Edit />}
            /> */}
          </Row>
        );
      },
    },
  ];

  return (
    <Table loading={accountLoading} dataSource={accounts} columns={columns} />
  );
};

export default AccountList;