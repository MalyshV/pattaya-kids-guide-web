import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin/auth";
import { loginAction } from "@/app/admin/actions";

type LoginPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminLoginPage({
  searchParams,
}: LoginPageProps): Promise<React.ReactElement> {
  if (await isAdmin()) {
    redirect("/admin/places");
  }

  const params = (await searchParams) ?? {};
  const hasError = params.error !== undefined;

  return (
    <section className="admin-card admin-login">
      <h1>Вход в админку</h1>
      <p className="admin-muted">
        Пароль лежит в переменной <code>ADMIN_PASSWORD</code> (локально — в{" "}
        <code>.env</code>).
      </p>

      {params.error === "locked" ? (
        <p className="admin-error">
          Слишком много неудачных попыток — вход закрыт на 15 минут.
        </p>
      ) : hasError ? (
        <p className="admin-error">Неверный пароль — попробуйте ещё раз.</p>
      ) : null}

      <form action={loginAction} className="admin-form">
        <label className="admin-field">
          <span>Пароль</span>
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            autoFocus
            required
          />
        </label>
        <button type="submit" className="admin-button">
          Войти
        </button>
      </form>
    </section>
  );
}
