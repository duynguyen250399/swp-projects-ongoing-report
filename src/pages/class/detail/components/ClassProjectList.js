import React, { useContext, useEffect, useState } from "react";
import { ClassDetailArea } from "../../components/ClassDetailArea";
import { ClassContext } from "../../../../providers/class";
import { Button, Card, Empty, List, Row, Spin, Typography } from "antd";
import ProjectApi from "../../../../apis/project";

const { Text } = Typography;

export const ClassProjectList = ({ onViewDescription }) => {
	const data = useContext(ClassContext);

	const [projects, setProjects] = useState([]);
	const [loading, setLoading] = useState(false);

	const getProjectsInClass = async (classId) => {
		setLoading(true);
		const result = await ProjectApi.getProjects(classId);
		setProjects(result);
		setLoading(false);
	};

	useEffect(() => {
		const { classId } = data;
		if (!classId) return;
		getProjectsInClass(classId);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data]);

	const renderItem = (item) => {
		return (
			<List.Item>
				<Card className="w-full">
					<Row justify="space-between" align="middle">
						<Text>{item.projectName}</Text>
						<Button
							type="text"
							style={{ color: "#1677FF" }}
							onClick={() => onViewDescription(item)}
						>
							Xem mô tả
						</Button>
					</Row>
				</Card>
			</List.Item>
		);
	};

	return (
		<ClassDetailArea title="Danh sách dự án" defaultOpen>
			<Spin spinning={loading}>
				<List
					dataSource={projects}
					renderItem={renderItem}
					locale={{
						emptyText: (
							<Empty description={<Text disabled>Chưa có dự án nào</Text>} />
						),
					}}
				/>
			</Spin>
		</ClassDetailArea>
	);
};
