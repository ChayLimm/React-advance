// components/ProjectEditor.tsx
import { useState, useEffect } from "react";
import { Button, Form, Input, Modal, Tag, Space } from "antd";
import type { ProjectProp } from "../types/Portfolio";

interface ProjectEditorProps {
  project?: ProjectProp;
  visible: boolean;
  onSave: (project: ProjectProp) => Promise<void>;
  onCancel: () => void;
  mode: "add" | "edit";
}

export default function ProjectEditor({
  project,
  visible,
  onSave,
  onCancel,
  mode,
}: ProjectEditorProps) {
  const [form] = Form.useForm();
  const [technologies, setTechnologies] = useState<string[]>(project?.technologies || []);
  const [currentTech, setCurrentTech] = useState("");

  useEffect(() => {
    if (project && mode === "edit") {
      form.setFieldsValue({
        name: project.name,
        description: project.description,
        githubUrl: project.githubUrl,
        liveUrl: project.liveUrl,
        imageUrl: project.imageUrl,
      });
      setTechnologies(project.technologies || []);
    } else {
      form.resetFields();
      setTechnologies([]);
    }
  }, [project, mode, form]);

  const handleAddTech = () => {
    if (currentTech.trim() && !technologies.includes(currentTech.trim())) {
      setTechnologies([...technologies, currentTech.trim()]);
      setCurrentTech("");
    }
  };

  const handleRemoveTech = (techToRemove: string) => {
    setTechnologies(technologies.filter(tech => tech !== techToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTech();
    }
  };

  const generateId = () => {
    return `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const projectData: ProjectProp = {
        ...values,
        id: project?.id || generateId(),
        technologies,
      };
      await onSave(projectData);
      form.resetFields();
      setTechnologies([]);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  return (
    <Modal
      title={mode === "add" ? "Add New Project" : "Edit Project"}
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      width={600}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          {mode === "add" ? "Add Project" : "Save Changes"}
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Project Name"
          rules={[{ required: true, message: "Please enter project name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please enter project description" }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item label="Technologies">
          <Space direction="vertical" style={{ width: "100%" }}>
            <Space.Compact style={{ width: "100%" }}>
              <Input
                value={currentTech}
                onChange={(e) => setCurrentTech(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a technology and press Enter"
              />
              <Button type="primary" onClick={handleAddTech}>
                Add
              </Button>
            </Space.Compact>
            <div style={{ marginTop: 8 }}>
              {technologies.map((tech) => (
                <Tag
                  key={tech}
                  closable
                  onClose={() => handleRemoveTech(tech)}
                  style={{ marginBottom: 4 }}
                >
                  {tech}
                </Tag>
              ))}
            </div>
          </Space>
        </Form.Item>

        <Form.Item
          name="githubUrl"
          label="GitHub URL"
          rules={[{ type: "url", message: "Please enter a valid URL" }]}
        >
          <Input placeholder="https://github.com/username/repo" />
        </Form.Item>

        <Form.Item
          name="liveUrl"
          label="Live Demo URL"
          rules={[{ type: "url", message: "Please enter a valid URL" }]}
        >
          <Input placeholder="https://demo.example.com" />
        </Form.Item>

        <Form.Item
          name="imageUrl"
          label="Image URL"
          rules={[{ type: "url", message: "Please enter a valid URL" }]}
        >
          <Input placeholder="https://images.unsplash.com/photo-..." />
        </Form.Item>
      </Form>
    </Modal>
  );
}