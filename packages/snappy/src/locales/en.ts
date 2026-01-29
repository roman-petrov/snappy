export const en = {
  commands: {
    start: {
      welcome: `👋 Hello! I'm Snappy — a bot for content improvement.\n\n✨ Send me text, and I'll help make it better!`,
      help: `📝 How to use:\n1. Send me text\n2. Choose the function you need\n3. Get improved result\n\n💎 Free requests available: {count}`,
    },
    help: {
      title: `📚 Commands help`,
      text: `/start - Start working\n/help - Show help\n/balance - Check balance\n/premium - Buy premium\n/language - Change language`,
    },
    balance: {
      free: `📊 Your balance:\n\n🆓 Free requests: {count}\n💎 Premium: {status}`,
      premium: `Active`,
      inactive: `Inactive`,
    },
    language: { select: `🌐 Выберите язык / Select language:`, changed: `✅ Language changed to English` },
    premium: {
      title: `💎 Premium subscription`,
      description: `🚀 Get unlimited requests!\n\n💰 Price: {price} RUB/month\n\n✨ Features:\n• Unlimited requests\n• Priority processing\n• All features available`,
      button: `💳 Pay {price} RUB`,
      success: `✅ Payment successful! Premium activated.`,
      error: `❌ Payment error. Please try again later.`,
    },
  },
  features: {
    choose: `🎯 Choose improvement feature:`,
    processing: `⏳ Processing your text...`,
    result: `✅ Done!\n\n{text}`,
    error: `❌ An error occurred. Please try again.`,
    limit: `⚠️ Free requests limit reached.\n\n💎 Buy premium for unlimited usage: /premium`,

    style_business: `📊 Business style`,
    style_friendly: `😊 Friendly style`,
    style_humorous: `😄 Humorous style`,
    style_selling: `💰 Selling style`,
    style_neutral: `📝 Neutral style`,

    fix_errors: `✅ Fix errors`,
    add_emoji: `😊 Add emoji`,
    shorten: `📉 Shorten text`,
    expand: `📈 Expand text`,
    improve_readability: `🎯 Improve readability`,
  },
  buttons: { back: `◀️ Back`, cancel: `❌ Cancel`, russian: `🇷🇺 Русский`, english: `🇬🇧 English` },
};
