// components/ExperienceEditor.tsx
import { useState, useEffect } from "react";
import { Button, Form, Input, Modal, Tag, Space, Switch, DatePicker } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import type { ExperienceProp } from "../types/Portfolio";
import dayjs from "dayjs";

interface ExperienceEditorProps {
  experience?: ExperienceProp;
  visible: boolean;
  onSave: (experience: ExperienceProp) => Promise<void>;
  onCancel: () => void;
  mode: "add" | "edit";
}

export default function ExperienceEditor({
  experience,
  visible,
  onSave,
  onCancel,
  mode,
}: ExperienceEditorProps) {
  const [form] = Form.useForm();
  const [skills, setSkills] = useState<string[]>(experience?.skills || []);
  const [currentSkill, setCurrentSkill] = useState("");
  const [currentlyWorking, setCurrentlyWorking] = useState(experience?.currentlyWorking || false);

  useEffect(() => {
    if (experience && mode === "edit") {
      form.setFieldsValue({
        ...experience,
        startDate: experience.startDate ? dayjs(experience.startDate) : null,
        endDate: experience.endDate ? dayjs(experience.endDate) : null,
      });
      setSkills(experience.skills || []);
      setCurrentlyWorking(experience.currentlyWorking || false);
    } else {
      form.resetFields();
      setSkills([]);
      setCurrentlyWorking(false);
    }
  }, [experience, mode, form]);

  const handleAddSkill = () => {
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      setSkills([...skills, currentSkill.trim()]);
      setCurrentSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const generateId = () => {
    return `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const experienceData: ExperienceProp = {
        ...values,
        id: experience?.id || generateId(),
        startDate: values.startDate ? dayjs(values.startDate).format('YYYY-MM-DD') : '',
        endDate: values.endDate ? dayjs(values.endDate).format('YYYY-MM-DD') : undefined,
        currentlyWorking,
        skills,
      };
      await onSave(experienceData);
      form.resetFields();
      setSkills([]);
      setCurrentlyWorking(false);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  return (
    <Modal
      title={mode === "add" ? "Add New Experience" : "Edit Experience"}
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      width={600}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          {mode === "add" ? "Add Experience" : "Save Changes"}
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="title"
          label="Job Title"
          rules={[{ required: true, message: "Please enter job title" }]}
        >
          <Input placeholder="e.g., Senior Frontend Developer" />
        </Form.Item>

        <Form.Item
          name="company"
          label="Company"
          rules={[{ required: true, message: "Please enter company name" }]}
        >
          <Input placeholder="e.g., Google, Microsoft" />
        </Form.Item>

        <Form.Item
          name="location"
          label="Location"
        >
          <Input placeholder="e.g., San Francisco, CA (Remote)" />
        </Form.Item>

        <Form.Item
          name="startDate"
          label="Start Date"
          rules={[{ required: true, message: "Please select start date" }]}
        >
          <DatePicker 
            style={{ width: '100%' }} 
            picker="month"
            format="MMM YYYY"
          />
        </Form.Item>

        <Form.Item label="Currently Working Here">
          <Switch 
            checked={currentlyWorking}
            onChange={setCurrentlyWorking}
          />
        </Form.Item>

        {!currentlyWorking && (
          <Form.Item
            name="endDate"
            label="End Date"
          >
            <DatePicker 
              style={{ width: '100%' }} 
              picker="month"
              format="MMM YYYY"
              disabled={currentlyWorking}
            />
          </Form.Item>
        )}

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please enter experience description" }]}
        >
          <Input.TextArea rows={4} placeholder="Describe your responsibilities and achievements..." />
        </Form.Item>

        <Form.Item label="Skills Used">
          <Space direction="vertical" style={{ width: "100%" }}>
            <Space.Compact style={{ width: "100%" }}>
              <Input
                value={currentSkill}
                onChange={(e) => setCurrentSkill(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a skill used in this role"
              />
              <Button type="primary" onClick={handleAddSkill}>
                <PlusOutlined />
              </Button>
            </Space.Compact>
            <div style={{ marginTop: 8 }}>
              {skills.map((skill) => (
                <Tag
                  key={skill}
                  closable
                  onClose={() => handleRemoveSkill(skill)}
                  style={{ marginBottom: 4 }}
                >
                  {skill}
                </Tag>
              ))}
            </div>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}