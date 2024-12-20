import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { init, miniApp, mainButton, mockTelegramEnv, parseInitData, shareURL} from '@telegram-apps/sdk';

const initializeTelegramSDK = async () => {
  try {
        // Попытка инициализировать настоящее окружение Telegram
    console.log("Инициализация окружения Telegram");
    init();
    // if (backButton.mount.isAvailable()) {
    //   backButton.mount();
    //   backButton.show();
    //   backButton.isMounted(); // true
    // }
    if (miniApp.mount.isAvailable()) {
      miniApp.mount();
      miniApp.isMounted(); // true
    }
    miniApp.setHeaderColor('#f4eae1');
    miniApp.setBackgroundColor('#f4eae1');
    // Инициализация главной кнопки
    if (mainButton.mount.isAvailable()) {
      mainButton.mount();
      mainButton.isMounted(); // true
    }
    mainButton.setParams({
      backgroundColor: '#f6f6f6',
      text: 'Поделиться очками',
      textColor: '#282828',
      isVisible: true,
      isEnabled: true,
    });
   
    if (mainButton.onClick.isAvailable()) {
      function handleClick() {
        try {
          const score = localStorage.getItem('memory-game-score') || 0;
          const botUrl = 'https://t.me/tgAppExampleBot';
          const messageText = `Посмотрите, моё количество очков в игре: ${score}\n\nПрисоединяйтесь прямо сейчас!`;
          shareURL(botUrl, messageText);
          console.log('Пользователь может теперь поделиться своим счетом и пригласить в игру.');
        } catch (error) {
          console.error('Ошибка при открытии окна выбора чата:', error);
        }
      }

      // Установка обработчика
      mainButton.onClick(handleClick);
    }

    await miniApp.ready();
  } catch (error) {
    // В случае ошибки инициализируем фейковое окружение
    console.error('Ошибка при инициализации Telegram:', error);

    const initDataRaw = new URLSearchParams([
      ['user', JSON.stringify({
        id: 99281932,
        first_name: 'Andrew',
        last_name: 'Rogue',
        username: 'rogue',
        language_code: 'en',
        is_premium: true,
        allows_write_to_pm: true,
      })],
      ['hash', '89d6079ad6762351f38c6dbbc41bb53048019256a9443988af7a48bcad16ba31'],
      ['auth_date', '1716922846'],
      ['start_param', 'debug'],
      ['chat_type', 'sender'],
      ['chat_instance', '8428209589180549439'],
    ]).toString();

    mockTelegramEnv({
      themeParams: {
        accentTextColor: '#6ab2f2',
        bgColor: '#17212b',
        buttonColor: '#5288c1',
        buttonTextColor: '#ffffff',
        destructiveTextColor: '#ec3942',
        headerBgColor: '#fcb69f',
        hintColor: '#708499',
        linkColor: '#6ab3f3',
        secondaryBgColor: '#232e3c',
        sectionBgColor: '#17212b',
        sectionHeaderTextColor: '#6ab3f3',
        subtitleTextColor: '#708499',
        textColor: '#f5f5f5',
      },
      initData: parseInitData(initDataRaw),
      initDataRaw,
      version: '7.2',
      platform: 'tdesktop',
    });

    console.log('Mock Telegram environment initialized');
  }
};

// Инициализация SDK
initializeTelegramSDK();

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
