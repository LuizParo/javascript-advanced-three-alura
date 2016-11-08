import {ConnectionFactory} from './ConnectionFactory';
import {HttpService} from './HttpService';
import {NegociacaoDao} from '../dao/NegociacaoDao';
import {Negociacao} from '../models/Negociacao';

export class NegociacaoService {

    constructor() {
        this._http = new HttpService();
    }

    cadastra(negociacao) {
        return ConnectionFactory
            .getConnection()
            .then(connection => new NegociacaoDao(connection))
            .then(dao => dao.adiciona(negociacao))
            .then(() => 'Negociação salva com sucesso!')
            .catch(erro => {
                console.log(erro);
                throw new Error("Não foi possível adicionar a negociação");
            });
    }

    lista() {
        return ConnectionFactory
            .getConnection()
            .then(connection => new NegociacaoDao(connection))
            .then(dao => dao.listaTodos())
            .catch(erro => {
                console.log(erro);
                throw new Error('Não foi possível obter as negociações');
            });
    }

    apagaTodas() {
        return ConnectionFactory
            .getConnection()
            .then(connection => new NegociacaoDao(connection))
            .then(dao => dao.apagaTodos())
            .catch(erro => this._mensagem.texto = erro);
    }

    importa(listaAtual) {
        return this.obterNegociacoes()
            .then(negociacoes => 
                negociacoes.filter(negociacao => 
                    !listaAtual.some(negociacaoExistente => negociacao.isEquals(negociacaoExistente))
                )
            )
            .catch(erro => {
                console.log(erro);
                throw new Error("Não foi possível importas as negociaçoes");
            });
    }

    obterNegociacoesDaSemana() {
        return new Promise((resolve, reject) => {
            this._http
                .get('negociacoes/semana')
                .then(dados => resolve(dados.map((dado) => new Negociacao(new Date(dado.data), dado.quantidade, dado.valor))))
                .catch(erro => reject('Erro ao buscar negociações: ' + erro));
        });
    }

    obterNegociacoesDaSemanaAnterior() {
        return new Promise((resolve, reject) => {
            this._http
                .get('negociacoes/anterior')
                .then(dados => resolve(dados.map((dado) => new Negociacao(new Date(dado.data), dado.quantidade, dado.valor))))
                .catch(erro => reject('Erro ao buscar negociações da semana anterior: ' + erro));
        });
    }

    obterNegociacoesDaSemanaRetrasada() {
        return new Promise((resolve, reject) => {
            this._http
                .get('negociacoes/retrasada')
                .then(dados => resolve(dados.map((dado) => new Negociacao(new Date(dado.data), dado.quantidade, dado.valor))))
                .catch(erro => reject('Erro ao buscar negociações da semana retrasada: ' + erro));
        });
    }

    obterNegociacoes() {
        return new Promise((resolve, reject) => {
            Promise.all([this.obterNegociacoesDaSemana(),
                         this.obterNegociacoesDaSemanaAnterior(),
                         this.obterNegociacoesDaSemanaRetrasada()])
                .then(negociacoes => {
                    let retorno = [];

                    negociacoes
                        .reduce((arrayAchatado, array) => arrayAchatado.concat(array), [])
                        .forEach(negociacao => retorno.push(negociacao));

                    resolve(retorno);
                })
                .catch(erro => reject(erro));
        });
    }
}