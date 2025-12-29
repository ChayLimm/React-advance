import type { FormProps } from "antd";
import { Button, Checkbox, Form, Input, Card, Typography, message } from "antd";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate, Link } from "react-router-dom";
import { MailOutlined, LockOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function LoginPage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values: { email: string; password: string; remember?: boolean }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      
      if (values.remember) {
        localStorage.setItem("user", JSON.stringify(auth.currentUser));
      } else {
        sessionStorage.setItem("user", JSON.stringify(auth.currentUser));
      }
      
      message.success("Login successful!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login failed", error);
      message.error(error?.message || "Login failed. Please check your credentials.");
    }
  };

  const onFinishFailed: FormProps["onFinishFailed"] = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <div className="text-center mb-6">
          <Title level={2}>Welcome Back</Title>
          <Text type="secondary">Sign in to your account</Text>
        </div>

        <Form
          form={form}
          name="login"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="your.email@example.com"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: "Please input your password!" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter your password"
              size="large"
            />
          </Form.Item>

          <div className="flex justify-between items-center mb-4">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            
            <Link to="/forgot-password" className="text-blue-500 hover:underline">
              Forgot password?
            </Link>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              className="mb-4"
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center mt-4">
          <Text>
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-500 hover:underline font-medium">
              Sign up now
            </Link>
          </Text>
        </div>

      </Card>
    </div>
  );
}