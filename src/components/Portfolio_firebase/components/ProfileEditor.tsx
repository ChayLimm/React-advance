// components/ProfileEditor.tsx
import { useState, useEffect } from "react";
import { Button, Form, Input, InputNumber, Tag, Space, Modal } from "antd";
import type { UserProp } from "../types/Portfolio";

interface ProfileEditorProps {
  user: UserProp;
  visible: boolean;
  onSave: (updatedUser: UserProp) => Promise<void>;
  onCancel: () => void;
}

export default function ProfileEditor({ user, visible, onSave, onCancel }: ProfileEditorProps) {
  const [form] = Form.useForm();
  const [skills, setSkills] = useState<string[]>(user.skills || []);
  const [currentSkill, setCurrentSkill] = useState("");

  useEffect(() => {
    form.setFieldsValue({
      username: user.username,
      email: user.email,
      age: user.age,
      bio: user.bio,
    });
    setSkills(user.skills || []);
  }, [user, form]);

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

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const updatedUser: UserProp = {
        ...user,
        ...values,
        skills,
      };
      await onSave(updatedUser);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  return (
    <Modal
      title="Edit Profile"
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      width={600}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Save Changes
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="username"
          label="Username"
          rules={[{ required: true, message: "Please enter your username" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please enter your email" },
            { type: "email", message: "Please enter a valid email" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="age" label="Age">
          <InputNumber min={0} max={150} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="bio" label="Bio">
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item label="Skills">
          <Space direction="vertical" style={{ width: "100%" }}>
            <Space.Compact style={{ width: "100%" }}>
              <Input
                value={currentSkill}
                onChange={(e) => setCurrentSkill(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a skill and press Enter"
              />
              <Button type="primary" onClick={handleAddSkill}>
                Add
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