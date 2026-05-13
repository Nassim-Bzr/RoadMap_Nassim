import LoginForm from "@/components/layout/login-form";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#111217",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "16px",
    }}>
      <LoginForm />
    </div>
  );
}
