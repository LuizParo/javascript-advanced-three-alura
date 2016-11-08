export class View {
    
    constructor(elemento) {
        this._elemento = elemento;
    }

    template(model) {
        throw new Erro('Método "template" deve ser sobrescrito!');
    }

    update(model) {
        this._elemento.innerHTML = this.template(model);
    }
}