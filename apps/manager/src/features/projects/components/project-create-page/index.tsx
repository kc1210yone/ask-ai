import { CreateForm } from './create-form';

export const ProjectCreatePage = () => {
  return (
    <>
      <h2 className="text-xl font-semibold">プロジェクト作成</h2>
      <p className="mt-4">新規作成するプロジェクトの情報を入力してください。</p>
      <CreateForm className="mt-8" />
    </>
  );
};
