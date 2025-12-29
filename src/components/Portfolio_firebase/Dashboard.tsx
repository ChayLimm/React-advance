// Dashboard.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Spin, Table, Tag, Button, Card, Avatar, Tabs, 
  Input, Modal, Form, Switch, DatePicker, Space, 
  Select, message 
} from "antd";
import type { TableColumnsType } from "antd";
import { 
  EditOutlined, PlusOutlined, UserOutlined, 
  DeleteOutlined, GithubOutlined, LinkOutlined,
  CalendarOutlined, EnvironmentOutlined, 
  BuildOutlined, MailOutlined 
} from "@ant-design/icons";
import type { UserProp, ProjectProp, ExperienceProp } from "./types/Portfolio";
import { setDocument, getDocuments } from "./firebaseService/crud";
import dayjs from "dayjs";

const { TabPane } = Tabs;
const { TextArea } = Input;

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProp | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("projects");
  
  // Modals state
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [projectModalVisible, setProjectModalVisible] = useState(false);
  const [experienceModalVisible, setExperienceModalVisible] = useState(false);
  
  // Editing state
  const [editingProject, setEditingProject] = useState<ProjectProp | null>(null);
  const [editingExperience, setEditingExperience] = useState<ExperienceProp | null>(null);
  
  // Mode state
  const [projectMode, setProjectMode] = useState<"add" | "edit">("add");
  const [experienceMode, setExperienceMode] = useState<"add" | "edit">("add");
  
  // Forms
  const [profileForm] = Form.useForm();
  const [projectForm] = Form.useForm();
  const [experienceForm] = Form.useForm();

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getDocuments();
      if (data) {
        const userData: UserProp = {
          ...data,
          projects: data.projects || [],
          skills: data.skills || [],
          experiences: data.experiences || [],
        };
        setUser(userData);
      } else {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const { uid, email } = JSON.parse(storedUser);
          const newUser: UserProp = {
            uid,
            username: "Your Name",
            email: email || "",
            bio: "",
            skills: [],
            projects: [],
            experiences: [],
          };
          setUser(newUser);
          await setDocument(newUser);
        }
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const currentUser = localStorage.getItem("user");
    if (!currentUser) {
      navigate("/login");
      return;
    }
    loadData();
  }, [navigate]);

  // Profile Handlers
  const handleProfileSave = async () => {
    try {
      const values = await profileForm.validateFields();
      const updatedUser = {
        ...user,
        ...values,
      };
      await setDocument(updatedUser as UserProp);
      setUser(updatedUser as UserProp);
      setProfileModalVisible(false);
      message.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      message.error("Failed to save profile");
    }
  };

  const openProfileModal = () => {
    profileForm.setFieldsValue({
      username: user?.username,
      email: user?.email,
      age: user?.age,
      bio: user?.bio,
      skills: user?.skills || [],
    });
    setProfileModalVisible(true);
  };

  // Project Handlers
  const handleProjectSave = async () => {
    try {
      const values = await projectForm.validateFields();
      const projectData: ProjectProp = {
        ...values,
        id: editingProject?.id || `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        technologies: values.technologies || [],
      };

      let updatedProjects: ProjectProp[] = [];
      if (editingProject) {
        updatedProjects = (user?.projects || []).map(p => 
          p.id === editingProject.id ? projectData : p
        );
      } else {
        updatedProjects = [...(user?.projects || []), projectData];
      }

      const updatedUser = {
        ...user,
        projects: updatedProjects,
      };

      await setDocument(updatedUser as UserProp);
      setUser(updatedUser as UserProp);
      setProjectModalVisible(false);
      setEditingProject(null);
      projectForm.resetFields();
      message.success("Project saved successfully!");
    } catch (error) {
      console.error("Error saving project:", error);
      message.error("Failed to save project");
    }
  };

  const openProjectModal = (project?: ProjectProp) => {
    if (project) {
      setEditingProject(project);
      setProjectMode("edit");
      projectForm.setFieldsValue({
        ...project,
        technologies: project.technologies || [],
      });
    } else {
      setEditingProject(null);
      setProjectMode("add");
      projectForm.resetFields();
    }
    setProjectModalVisible(true);
  };

  const handleDeleteProject = async (id: string) => {
    if (!user) return;

    const updatedProjects = user.projects.filter(p => p.id !== id);
    const updatedUser = {
      ...user,
      projects: updatedProjects,
    };

    await setDocument(updatedUser);
    setUser(updatedUser);
    message.success("Project deleted successfully!");
  };

  // Experience Handlers
  const handleExperienceSave = async () => {
    try {
      const values = await experienceForm.validateFields();
      
      // Format dates properly
      const startDate = values.startDate ? dayjs(values.startDate).format('YYYY-MM-DD') : '';
      const endDate = values.endDate ? dayjs(values.endDate).format('YYYY-MM-DD') : undefined;
      
      const experienceData: ExperienceProp = {
        id: editingExperience?.id || `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: values.title,
        company: values.company,
        location: values.location,
        startDate: startDate,
        endDate: endDate,
        currentlyWorking: values.currentlyWorking || false,
        description: values.description,
        skills: values.skills || [],
      };

      let updatedExperiences: ExperienceProp[] = [];
      if (editingExperience) {
        updatedExperiences = (user?.experiences || []).map(e => 
          e.id === editingExperience.id ? experienceData : e
        );
      } else {
        updatedExperiences = [...(user?.experiences || []), experienceData];
      }

      const updatedUser = {
        ...user,
        experiences: updatedExperiences,
      };

      console.log("Saving experience:", experienceData);
      console.log("Updated user:", updatedUser);

      await setDocument(updatedUser as UserProp);
      setUser(updatedUser as UserProp);
      setExperienceModalVisible(false);
      setEditingExperience(null);
      experienceForm.resetFields();
      message.success("Experience saved successfully!");
    } catch (error) {
      console.error("Error saving experience:", error);
      message.error("Failed to save experience");
    }
  };

  const openExperienceModal = (experience?: ExperienceProp) => {
    if (experience) {
      setEditingExperience(experience);
      setExperienceMode("edit");
      experienceForm.setFieldsValue({
        ...experience,
        startDate: experience.startDate ? dayjs(experience.startDate) : null,
        endDate: experience.endDate ? dayjs(experience.endDate) : null,
        skills: experience.skills || [],
      });
    } else {
      setEditingExperience(null);
      setExperienceMode("add");
      experienceForm.resetFields();
    }
    setExperienceModalVisible(true);
  };

  const handleDeleteExperience = async (id: string) => {
    if (!user) return;

    const updatedExperiences = (user.experiences || []).filter(e => e.id !== id);
    const updatedUser = {
      ...user,
      experiences: updatedExperiences,
    };

    await setDocument(updatedUser);
    setUser(updatedUser);
    message.success("Experience deleted successfully!");
  };

  // Table Columns
  const projectColumns: TableColumnsType<ProjectProp> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 200,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Technologies",
      key: "technologies",
      dataIndex: "technologies",
      render: (technologies: string[]) => (
        <div className="flex flex-wrap gap-1">
          {technologies?.slice(0, 3).map((tech) => (
            <Tag key={tech} color="blue" className="text-xs">
              {tech}
            </Tag>
          ))}
          {technologies?.length > 3 && (
            <Tag className="text-xs">+{technologies.length - 3}</Tag>
          )}
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => openProjectModal(record)}
          />
          <Button
            type="link"
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteProject(record.id)}
          />
        </div>
      ),
    },
  ];

  const experienceColumns: TableColumnsType<ExperienceProp> = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: 180,
    },
    {
      title: "Company",
      dataIndex: "company",
      key: "company",
      render: (company, record) => (
        <div>
          <div className="font-medium">{company}</div>
          {record.location && (
            <div className="text-xs text-gray-500">
              <EnvironmentOutlined className="mr-1" />
              {record.location}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Period",
      key: "period",
      width: 180,
      render: (_, record) => (
        <div className="text-sm">
          <CalendarOutlined className="mr-1" />
          {dayjs(record.startDate).format('MMM YYYY')} -{' '}
          {record.currentlyWorking 
            ? 'Present' 
            : record.endDate 
              ? dayjs(record.endDate).format('MMM YYYY')
              : 'N/A'
          }
          {record.currentlyWorking && (
            <Tag color="green" className="ml-2 text-xs">Current</Tag>
          )}
        </div>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      render: (text) => (
        <div className="truncate max-w-xs">{text}</div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => openExperienceModal(record)}
          />
          <Button
            type="link"
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteExperience(record.id)}
          />
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-gray-600 mb-4">No user data found</p>
        <Button type="primary" onClick={() => navigate("/")}>
          Go to Portfolio
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Manage your portfolio content
        </p>
      </div>

      {/* Profile Card */}
      <Card className="mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <Avatar 
              size={64} 
              icon={<UserOutlined />}
              className="mr-4 bg-blue-500"
            />
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{user.username}</h2>
              <div className="flex items-center text-gray-600">
                <MailOutlined className="mr-2" />
                {user.email}
              </div>
              {user.age && (
                <p className="text-gray-500 mt-1">Age: {user.age}</p>
              )}
            </div>
          </div>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={openProfileModal}
          >
            Edit Profile
          </Button>
        </div>
        
        {user.bio && (
          <div className="mt-6">
            <p className="text-gray-700">{user.bio}</p>
          </div>
        )}
        
        {user.skills && user.skills.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold text-gray-800 mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {user.skills.map((skill) => (
                <Tag key={skill} color="blue" className="rounded-lg">
                  {skill}
                </Tag>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Tabs Section */}
      <Card className="shadow-sm">
        <Tabs 
          activeKey={activeTab}
          onChange={setActiveTab}
          tabBarExtraContent={
            <div className="flex gap-2">
              {activeTab === "projects" && (
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => openProjectModal()}
                >
                  Add Project
                </Button>
              )}
              {activeTab === "experiences" && (
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => openExperienceModal()}
                >
                  Add Experience
                </Button>
              )}
            </div>
          }
        >
          {/* Projects Tab */}
          <TabPane 
            tab={
              <span className="flex items-center">
                <UserOutlined className="mr-2" />
                Projects ({user.projects?.length || 0})
              </span>
            }
            key="projects"
          >
            {user.projects && user.projects.length > 0 ? (
              <div className="overflow-x-auto">
                <Table
                  columns={projectColumns}
                  dataSource={user.projects.map((project, index) => ({
                    ...project,
                    key: project.id || index.toString(),
                  }))}
                  pagination={{ pageSize: 5 }}
                  size="middle"
                />
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No projects yet. Add your first project!</p>
                <Button type="primary" onClick={() => openProjectModal()}>
                  Add Your First Project
                </Button>
              </div>
            )}
          </TabPane>

          {/* Experiences Tab */}
          <TabPane 
            tab={
              <span className="flex items-center">
                <BuildOutlined className="mr-2" />
                Experiences ({user.experiences?.length || 0})
              </span>
            }
            key="experiences"
          >
            {user.experiences && user.experiences.length > 0 ? (
              <div className="overflow-x-auto">
                <Table
                  columns={experienceColumns}
                  dataSource={user.experiences.map((experience, index) => ({
                    ...experience,
                    key: experience.id || index.toString(),
                  }))}
                  pagination={{ pageSize: 5 }}
                  size="middle"
                />
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No experiences yet. Add your first experience!</p>
                <Button type="primary" onClick={() => openExperienceModal()}>
                  Add Your First Experience
                </Button>
              </div>
            )}
          </TabPane>
        </Tabs>
      </Card>

      {/* Profile Modal */}
      <Modal
        title="Edit Profile"
        open={profileModalVisible}
        onOk={handleProfileSave}
        onCancel={() => setProfileModalVisible(false)}
        width={500}
      >
        <Form form={profileForm} layout="vertical" className="mt-4">
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: 'Please enter your username' }]}
          >
            <Input placeholder="Your name" />
          </Form.Item>
          
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input placeholder="your@email.com" />
          </Form.Item>
          
          <Form.Item
            name="age"
            label="Age"
          >
            <Input type="number" placeholder="Age" min={0} max={150} />
          </Form.Item>
          
          <Form.Item
            name="bio"
            label="Bio"
          >
            <TextArea rows={4} placeholder="Tell us about yourself..." />
          </Form.Item>
          
          <Form.Item
            name="skills"
            label="Skills"
          >
            <Select
              mode="tags"
              placeholder="Add skills"
              tokenSeparators={[',']}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Project Modal */}
      <Modal
        title={editingProject ? "Edit Project" : "Add New Project"}
        open={projectModalVisible}
        onOk={handleProjectSave}
        onCancel={() => {
          setProjectModalVisible(false);
          setEditingProject(null);
          projectForm.resetFields();
        }}
        width={600}
      >
        <Form form={projectForm} layout="vertical" className="mt-4">
          <Form.Item
            name="name"
            label="Project Name"
            rules={[{ required: true, message: 'Please enter project name' }]}
          >
            <Input placeholder="E-commerce Platform" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter project description' }]}
          >
            <TextArea rows={3} placeholder="Describe your project..." />
          </Form.Item>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="githubUrl"
              label="GitHub URL"
            >
              <Input placeholder="https://github.com/username/repo" />
            </Form.Item>
            
            <Form.Item
              name="liveUrl"
              label="Live Demo URL"
            >
              <Input placeholder="https://demo.example.com" />
            </Form.Item>
          </div>
          
          <Form.Item
            name="imageUrl"
            label="Image URL"
          >
            <Input placeholder="https://images.unsplash.com/..." />
          </Form.Item>
          
          <Form.Item
            name="technologies"
            label="Technologies"
          >
            <Select
              mode="tags"
              placeholder="Add technologies used"
              tokenSeparators={[',']}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Experience Modal */}
      <Modal
        title={editingExperience ? "Edit Experience" : "Add New Experience"}
        open={experienceModalVisible}
        onOk={handleExperienceSave}
        onCancel={() => {
          setExperienceModalVisible(false);
          setEditingExperience(null);
          experienceForm.resetFields();
        }}
        width={600}
      >
        <Form form={experienceForm} layout="vertical" className="mt-4">
          <Form.Item
            name="title"
            label="Job Title"
            rules={[{ required: true, message: 'Please enter job title' }]}
          >
            <Input placeholder="Senior Frontend Developer" />
          </Form.Item>
          
          <Form.Item
            name="company"
            label="Company"
            rules={[{ required: true, message: 'Please enter company name' }]}
          >
            <Input placeholder="Google, Microsoft, etc." />
          </Form.Item>
          
          <Form.Item
            name="location"
            label="Location"
          >
            <Input placeholder="San Francisco, CA (Remote)" />
          </Form.Item>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="startDate"
              label="Start Date"
              rules={[{ required: true, message: 'Please select start date' }]}
            >
              <DatePicker 
                style={{ width: '100%' }} 
                picker="month"
                format="MMM YYYY"
              />
            </Form.Item>
            
            <Form.Item
              name="endDate"
              label="End Date"
            >
              <DatePicker 
                style={{ width: '100%' }} 
                picker="month"
                format="MMM YYYY"
              />
            </Form.Item>
          </div>
          
          <Form.Item
            name="currentlyWorking"
            label="Currently Working Here"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter experience description' }]}
          >
            <TextArea rows={4} placeholder="Describe your responsibilities and achievements..." />
          </Form.Item>
          
          <Form.Item
            name="skills"
            label="Skills Used"
          >
            <Select
              mode="tags"
              placeholder="Add skills used in this role"
              tokenSeparators={[',']}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}