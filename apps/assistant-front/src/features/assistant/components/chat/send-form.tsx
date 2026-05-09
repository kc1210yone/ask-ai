interface Props {
  onPreSend: () => void;
  onPostSend: () => void;
}

export const SendForm = ({ onPreSend, onPostSend }: Props) => {
  const onSubmit = () => {
    onPreSend();
    console.log('sent');
    const inputMessage = 'aaa';
    try {
      await fetch(`http://localhost:3000/chat/aaa`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputMessage }),
      });
    } catch {
      console.log('error');
    }
    onPostSend();
  };

  return (
    <form action={onSubmit}>
      <input />
      <button>送信</button>
    </form>
  );
};
