import {IConfigs} from "./domain/IConfigs";

export const configs: IConfigs = {
    mongodb: {
        url: process.env.MONGO_DB_HOST || '127.0.0.1',
        port: 27017,
        username: '',
        password: '',
        collection: 'component_list',
    },
    telegram: {
        token: '1764265700:AAGHPfChStU3rz92YJNscIXrvPZJ6fmN0jY',
        chatId: process.env.TELEGRAM_CHAT_ID || "-401319475",
    }
}
