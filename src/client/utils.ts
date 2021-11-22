interface IApi {
    host: string;
    getRoute: (routeName: string) => string;
}

class Api implements IApi {
    host: string;
    constructor(host: string) {
        this.host = host;
    }

    getRoute(routeName: string) {
        return `${this.host}api/${routeName}`
    }

}

const apiRoute: Api = Object.freeze(new Api(window.location.href)); //localhost:3000

export {
    apiRoute,
}
