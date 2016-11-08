export class DateHelper {

    constructor() {
        throw new Error('Não é possível instanciar DateHelper');
    }

    static textoParaData(texto) {
        if(!/\d{2}\/\d{2}\/\d{4}/.test(texto)) {
            throw new Error('Formato de data deve ser dd/mm/aaaa');
        }

        return new Date(...texto
            .split('/')
            .reverse()
            .map((item, indice) => item - indice % 2)
        );
    }

    static dataParaTexto(data) {
        return `${data.getDay()}/${data.getMonth() + 1}/${data.getFullYear()}`;
    }
}