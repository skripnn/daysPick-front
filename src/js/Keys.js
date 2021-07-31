class KeysClass{
  fb
  fetchHost
  telegramBot
  telegramBotId
  env

  dev = {
    fb: 269078168271491,
    fetchHost: window.location.hostname.match('.ngrok.io') ? '' : `http://${window.location.hostname}:8000`,
    telegramBot: 'skripnn_test_bot',
    telegramBotId: '1498958868'
  }

  prod = {
    fb: 171090181356627,
    fetchHost: '',
    telegramBot: 'dayspick_bot',
    telegramBotId: '1686627352'
  }

  constructor() {
    this.env =  process.env.NODE_ENV === 'production' && window.location.hostname === 'dayspick.ru' ? 'prod' : 'dev'
    for (const [key, value] of Object.entries(this[this.env])) {
      this[key] = value
    }
  }
}

const Keys = new KeysClass()
export default Keys
