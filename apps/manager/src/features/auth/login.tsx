import type { ComponentProps } from 'react';

interface Props {
  handleSubmit: ComponentProps<'form'>['onSubmit'];
}

export const Login = ({ handleSubmit }: Props) => {
  return (
    <form className="px-6 space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label htmlFor="username">email</label>
        <input
          name="username"
          type="email"
          required
          placeholder="email@example.com"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="password">password</label>
        <input name="password" type="password" required />
      </div>
      <div>
        <button type="submit">login</button>
      </div>
    </form>
  );
};
