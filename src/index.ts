import express from 'express';
import { getValue } from '@config/environment';
import database from '@config/database';
import logger from '@utils/logger';
import app from './app';

const initializeApp = async () => {
  try {
    console.info('==========================================');
    console.info('🔌 Conectando ao banco de dados...');
    await database.connect({
      host: getValue('host'),
      hostReadOnly: getValue('hostReadOnly'),
      databaseName: getValue('databaseName'),
      user: getValue('user'),
      password: getValue('password'),
      mysqlPoolMax: getValue('mysqlPoolMax'),
      mysqlPoolMin: getValue('mysqlPoolMin'),
      databasetimeout: getValue('databasetimeout'),
      logging: getValue('debug') === 'true',
    });
    console.info('✅ Conexão com o banco de dados estabelecida com sucesso!');
    
    // Configuração do servidor
    const port = getValue('apiPort');
    app.listen(port, () => {
      console.info('==========================================');
      console.info(`🚀 Server is running on port ${port}! Let's rock! 🔥`);
      console.info('==========================================');
    });
  } catch (error) {
    console.error('==========================================');
    console.error('Failed to initialize application:', error);
    console.error('==========================================');
    process.exit(1);
  }
};

initializeApp();
