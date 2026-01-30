/* eslint-disable unicorn/filename-case */
export const en = {
  buttons: { back: `◀️ Back`, cancel: `❌ Cancel`, english: `🇬🇧 English`, russian: `🇷🇺 Русский` },
  commands: {
    balance: {
      menu: `Check balance`,
      free: `📊 Your balance:\n\n🆓 Free requests: {count}\n💎 Premium: {status}`,
      inactive: `Inactive`,
      premium: `Active`,
    },
    help: {
      menu: `Show help`,
      text: `/start - Start working\n/help - Show help\n/balance - Check balance\n/premium - Buy premium\n/language - Change language`,
      title: `📚 Commands help`,
    },
    language: {
      changed: `✅ Language changed to English`,
      menu: `Change language`,
      select: `🌐 Выберите язык / Select language:`,
    },
    premium: {
      menu: `Buy premium`,
      button: `💳 Pay {price} RUB`,
      description: `🚀 Get unlimited requests!\n\n💰 Price: {price} RUB/month\n\n✨ Features:\n• Unlimited requests\n• Priority processing\n• All features available`,
      error: `❌ Payment error. Please try again later.`,
      success: `✅ Payment successful! Premium activated.`,
      title: `💎 Premium subscription`,
    },
    start: {
      help: `📝 How to use:\n1. Send me text\n2. Choose the function you need\n3. Get improved result\n\n💎 Free requests available: {count}`,
      menu: `Start working`,
      welcome: `👋 Hello! I'm Snappy — a bot for content improvement.\n\n✨ Send me text, and I'll help make it better!`,
    },
  },
  features: {
    addEmoji: `😊 Add emoji`,
    choose: `🎯 Choose improvement feature:`,
    error: `❌ An error occurred. Please try again.`,
    expand: `📈 Expand text`,
    fixErrors: `✅ Fix errors`,

    improveReadability: `🎯 Improve readability`,
    limit: `⚠️ Free requests limit reached.\n\n💎 Buy premium for unlimited usage: /premium`,
    processing: `⏳ Processing your text...`,
    result: `✅ Done!\n\n{text}`,
    shorten: `📉 Shorten text`,
    styleBusiness: `📊 Business style`,
    styleFriendly: `😊 Friendly style`,
    styleHumorous: `😄 Humorous style`,
    styleNeutral: `📝 Neutral style`,
    styleSelling: `💰 Selling style`,
  },
};
