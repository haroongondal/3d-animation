// components/Header.js
import { useTranslation } from 'react-i18next';

const Header = () => {
  const { i18n } = useTranslation();
  const changeLanguage = lng => {
    i18n.changeLanguage(lng);
  };

  return (
    <header className='flex justify-end p-4'>
      {['en', 'fr', 'zh', 'ko', 'pt', 'ro', 'es'].map(lang => (
        <button
          key={lang}
          onClick={() => changeLanguage(lang)}
          className='mx-1'
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </header>
  );
};

export default Header;
