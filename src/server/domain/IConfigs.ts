export interface IConfigs {
    mongodb: IMongo,
    telegram: ITelegram,
}

interface IMongo {
    url: string,
    port: number,
    username: string,
    password: string,
    collection: string,
}


interface ITelegram {
    token: string,
    chatId: string,
}
