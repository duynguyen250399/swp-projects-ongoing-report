import { Key, Setting } from "@icon-park/react";
import { Button, Dropdown, Row, Spin, message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import ClassApi from "../../../apis/class";
import { ALL_PERMISSIONS, roles } from "../../../constants/app";
import { usePermissions } from "../../../hooks/permission";
import { BasePageContent } from "../../../layouts/containers/BasePageContent";
import { ClassProvider } from "../../../providers/class";
import { ClassBasicInfo } from "./components/ClassBasicInfo";
import { ClassStudentList } from "./components/ClassStudentList";
import { ClassTeamList } from "./components/ClassTeamList";
import { EnrollClassModal } from "./components/EnrollClassModal";
import { UpdateEnrollKeyModal } from "./components/UpdateEnrollKeyModal";
import { ClassProjectList } from "./components/ClassProjectList";
import { ProjectDescriptionModal } from "../../project/components/ProjectDescriptionModal";
import { useRole } from "../../../hooks/role";
import ProjectApi from "../../../apis/project";
import { ProjectDetailModal } from "../../project/components/ProjectDetailModal";

const ClassDetailPage = () => {
	const { id } = useParams();

	const role = useRole();
	const permissions = usePermissions();
	const canEnroll = permissions?.includes(ALL_PERMISSIONS.class.enroll);
	const canSettings = permissions?.includes(ALL_PERMISSIONS.class.settings);

	const [data, setData] = useState({});
	const [loading, setLoading] = useState({});
	const [projectUpdating, setProjectUpdating] = useState(false);

	const [showUpdateProjectModal, setShowUpdateProjectModal] = useState(false);

	const [showUpdateEnrollKeyModal, setShowUpdateEnrollKeyModal] =
		useState(false);
	const [showEnrollClassModal, setShowEnrollClassModal] = useState(false);
	const [showProjectDescModal, setShowProjectDescModal] = useState(false);

	const projectRef = useRef();

	const settingItems = [
		{
			key: "ENROLL_KEY",
			label: "Cập nhật mã tham gia",
			icon: <Key />,
			onClick: () => setShowUpdateEnrollKeyModal(true),
		},
	];

	const getClass = async () => {
		setLoading(true);
		const response = await ClassApi.getClassById(id);
		if (response) {
			setData(response);
		}
		setLoading(false);
	};

	const checkProjectStatus = async (classId) => {
		const result = await ProjectApi.checkClassProjectStatus(classId);
		console.log(result);
	};

	const handleUpdateProject = async (values) => {
		if (!id) return;

		setProjectUpdating(true);
		const { projectId, projectName, description } = values;
		const data = {
			projectId,
			projectName,
			description,
		};
		const success = await ProjectApi.updateProject(data);
		if (success) {
			message.success("Cập nhật dự án thành công");
			getClass();
		} else {
			message.error("Cập nhật dự án thất bại");
		}
		setProjectUpdating(false);
		setShowUpdateProjectModal(false);
	};

	useEffect(() => {
		if (id) {
			getClass();
			checkProjectStatus(id);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	const handleViewProjectDescription = (item) => {
		projectRef.current = item;
		if (role === roles.TEACHER) {
			setShowUpdateProjectModal(true);
		} else {
			setShowProjectDescModal(true);
		}
	};

	return (
		<ClassProvider data={data}>
			<BasePageContent
				title={<span>{`Lớp ${data.className}`} </span>}
				action={
					<Row>
						{canEnroll && (
							<Button
								type="primary"
								disabled={data?.enrolled}
								onClick={() => setShowEnrollClassModal(true)}
							>
								{data?.enrolled ? "Đã tham gia" : "Tham gia lớp học"}
							</Button>
						)}
						{canSettings && (
							<Dropdown menu={{ items: settingItems }}>
								<Button className="flex-center ml-2" icon={<Setting />} />
							</Dropdown>
						)}
					</Row>
				}
			>
				<Spin spinning={loading}>
					<ClassBasicInfo />
					<ClassProjectList onViewDescription={handleViewProjectDescription} />
					{role === roles.TEACHER && <ClassTeamList />}
					{role === roles.TEACHER && <ClassStudentList />}
				</Spin>

				<UpdateEnrollKeyModal
					open={showUpdateEnrollKeyModal}
					onCancel={() => setShowUpdateEnrollKeyModal(false)}
					classId={data?.classId}
				/>
				<EnrollClassModal
					classId={data?.classId}
					open={showEnrollClassModal}
					onCancel={() => setShowEnrollClassModal(false)}
					onSuccess={() => getClass()}
				/>
				<ProjectDescriptionModal
					open={showProjectDescModal}
					project={projectRef.current}
					onCancel={() => setShowProjectDescModal(false)}
				/>
				<ProjectDetailModal
					title="Cập nhật dự án"
					open={showUpdateProjectModal}
					onCancel={() => setShowUpdateProjectModal(false)}
					onSubmit={handleUpdateProject}
					submitting={projectUpdating}
					edit={true}
					project={projectRef.current}
				/>
			</BasePageContent>
		</ClassProvider>
	);
};

export default ClassDetailPage;
