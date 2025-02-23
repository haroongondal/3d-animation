// components/HeadphoneNotice.js
import { useState } from 'react';

const HeadphoneNotice = () => {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <div className='fixed bottom-4 right-4 bg-gray-100 border p-2 rounded shadow'>
      <span className='text-sm'>
        For best audio experience, headphones are recommended.
      </span>
      <button
        onClick={() => setVisible(false)}
        className='ml-2 text-sm text-blue-600'
      >
        X
      </button>
    </div>
  );
};

export default HeadphoneNotice;
