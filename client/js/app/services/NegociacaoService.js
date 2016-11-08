'use strict';

System.register(['./ConnectionFactory', './HttpService', '../dao/NegociacaoDao', '../models/Negociacao'], function (_export, _context) {
    "use strict";

    var ConnectionFactory, HttpService, NegociacaoDao, Negociacao, _createClass, NegociacaoService;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    return {
        setters: [function (_ConnectionFactory) {
            ConnectionFactory = _ConnectionFactory.ConnectionFactory;
        }, function (_HttpService) {
            HttpService = _HttpService.HttpService;
        }, function (_daoNegociacaoDao) {
            NegociacaoDao = _daoNegociacaoDao.NegociacaoDao;
        }, function (_modelsNegociacao) {
            Negociacao = _modelsNegociacao.Negociacao;
        }],
        execute: function () {
            _createClass = function () {
                function defineProperties(target, props) {
                    for (var i = 0; i < props.length; i++) {
                        var descriptor = props[i];
                        descriptor.enumerable = descriptor.enumerable || false;
                        descriptor.configurable = true;
                        if ("value" in descriptor) descriptor.writable = true;
                        Object.defineProperty(target, descriptor.key, descriptor);
                    }
                }

                return function (Constructor, protoProps, staticProps) {
                    if (protoProps) defineProperties(Constructor.prototype, protoProps);
                    if (staticProps) defineProperties(Constructor, staticProps);
                    return Constructor;
                };
            }();

            _export('NegociacaoService', NegociacaoService = function () {
                function NegociacaoService() {
                    _classCallCheck(this, NegociacaoService);

                    this._http = new HttpService();
                }

                _createClass(NegociacaoService, [{
                    key: 'cadastra',
                    value: function cadastra(negociacao) {
                        return ConnectionFactory.getConnection().then(function (connection) {
                            return new NegociacaoDao(connection);
                        }).then(function (dao) {
                            return dao.adiciona(negociacao);
                        }).then(function () {
                            return 'Negociação salva com sucesso!';
                        }).catch(function (erro) {
                            console.log(erro);
                            throw new Error("Não foi possível adicionar a negociação");
                        });
                    }
                }, {
                    key: 'lista',
                    value: function lista() {
                        return ConnectionFactory.getConnection().then(function (connection) {
                            return new NegociacaoDao(connection);
                        }).then(function (dao) {
                            return dao.listaTodos();
                        }).catch(function (erro) {
                            console.log(erro);
                            throw new Error('Não foi possível obter as negociações');
                        });
                    }
                }, {
                    key: 'apagaTodas',
                    value: function apagaTodas() {
                        var _this = this;

                        return ConnectionFactory.getConnection().then(function (connection) {
                            return new NegociacaoDao(connection);
                        }).then(function (dao) {
                            return dao.apagaTodos();
                        }).catch(function (erro) {
                            return _this._mensagem.texto = erro;
                        });
                    }
                }, {
                    key: 'importa',
                    value: function importa(listaAtual) {
                        return this.obterNegociacoes().then(function (negociacoes) {
                            return negociacoes.filter(function (negociacao) {
                                return !listaAtual.some(function (negociacaoExistente) {
                                    return negociacao.isEquals(negociacaoExistente);
                                });
                            });
                        }).catch(function (erro) {
                            console.log(erro);
                            throw new Error("Não foi possível importas as negociaçoes");
                        });
                    }
                }, {
                    key: 'obterNegociacoesDaSemana',
                    value: function obterNegociacoesDaSemana() {
                        var _this2 = this;

                        return new Promise(function (resolve, reject) {
                            _this2._http.get('negociacoes/semana').then(function (dados) {
                                return resolve(dados.map(function (dado) {
                                    return new Negociacao(new Date(dado.data), dado.quantidade, dado.valor);
                                }));
                            }).catch(function (erro) {
                                return reject('Erro ao buscar negociações: ' + erro);
                            });
                        });
                    }
                }, {
                    key: 'obterNegociacoesDaSemanaAnterior',
                    value: function obterNegociacoesDaSemanaAnterior() {
                        var _this3 = this;

                        return new Promise(function (resolve, reject) {
                            _this3._http.get('negociacoes/anterior').then(function (dados) {
                                return resolve(dados.map(function (dado) {
                                    return new Negociacao(new Date(dado.data), dado.quantidade, dado.valor);
                                }));
                            }).catch(function (erro) {
                                return reject('Erro ao buscar negociações da semana anterior: ' + erro);
                            });
                        });
                    }
                }, {
                    key: 'obterNegociacoesDaSemanaRetrasada',
                    value: function obterNegociacoesDaSemanaRetrasada() {
                        var _this4 = this;

                        return new Promise(function (resolve, reject) {
                            _this4._http.get('negociacoes/retrasada').then(function (dados) {
                                return resolve(dados.map(function (dado) {
                                    return new Negociacao(new Date(dado.data), dado.quantidade, dado.valor);
                                }));
                            }).catch(function (erro) {
                                return reject('Erro ao buscar negociações da semana retrasada: ' + erro);
                            });
                        });
                    }
                }, {
                    key: 'obterNegociacoes',
                    value: function obterNegociacoes() {
                        var _this5 = this;

                        return new Promise(function (resolve, reject) {
                            Promise.all([_this5.obterNegociacoesDaSemana(), _this5.obterNegociacoesDaSemanaAnterior(), _this5.obterNegociacoesDaSemanaRetrasada()]).then(function (negociacoes) {
                                var retorno = [];

                                negociacoes.reduce(function (arrayAchatado, array) {
                                    return arrayAchatado.concat(array);
                                }, []).forEach(function (negociacao) {
                                    return retorno.push(negociacao);
                                });

                                resolve(retorno);
                            }).catch(function (erro) {
                                return reject(erro);
                            });
                        });
                    }
                }]);

                return NegociacaoService;
            }());

            _export('NegociacaoService', NegociacaoService);
        }
    };
});
//# sourceMappingURL=NegociacaoService.js.map