// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'MindPal',
    script: 'npm',
    args: 'start',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 7070
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 7070
    }
  }]
}
