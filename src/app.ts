import express from 'express';
import routes from './routes';

class App {
    public app: express.Application;

    constructor() {
        console.log('📱 Iniciando configuração da aplicação...');
        this.app = express();
        this.middlewares();
        this.routes();
        console.log('✅ Aplicação configurada com sucesso!');
    }

    private middlewares() {
        console.log('⚙️  Configurando middlewares...');
        this.app.use(express.json());
    }

    private routes() {
        console.log('🛣️  Configurando rotas...');
        this.app.use('/api', routes);
    }
}

// Alterando a exportação para uma instância única
export default new App().app;