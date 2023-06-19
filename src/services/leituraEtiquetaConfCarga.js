$("#codbarra").focus();
$("#mensagemErroG").hide();
hideMsgs();
var count = 0;
var etiquetaValida = 0;
var etiquetaInvalida = 0;
var etiquetaDuplicada = 0;
var qtdePalete = 0;
var url;
var histLeitura = [];
var etiquetasToConf = [];
var requisicoes = [];
var promises = [];
var vars = [],
    hash;
var hashes = window.location.href
    .slice(window.location.href.indexOf("?") + 1)
    .split("&");
for (var i = 0; i < hashes.length; i++) {
    hash = hashes[i].split("=");
    vars.push(hash[0]);
    vars[hash[0]] = hash[1];
}
vars;
var descCarga = vars.desccarga.replace(/%20/g, " ");
var totalEtiquetas = vars.totetiquetas;
var etiquetaValida = vars.totconf;
$("#etiquetasToConf").text(vars.totetiquetas);
$("#etiquetasValidas").text(etiquetaValida);
$("#codCarga").text(`${vars.carga} ${decodeURI(descCarga)}`);
$("#nroEntrega").text(vars.numentrega);
url = `${vars.urlApi}rest/pprcleretiquetacargarest`;
//url = url.replace("//rest", "/rest");

function hideMsgs() {
    $("#responseDanger").hide();
    $("#responseSuccess").hide();
    $("#responseAlert").hide();
}
function verifyReturn(msg) {
    switch (msg) {
        case "Etiqueta Inválida":
            $("#responseDanger").show();
            $("#dangerText").text(
                "Etiqueta inválida, favor verificar os dados"
            );
            break;
        case "Entrada Pela Etiqueta já Efetudada":
            $("#responseDanger").show();
            $("#dangerText").text(msg);
            break;
    }
}
function lostInputFocus() {
    var validLostInput = $("#codbarra").val();
    if (validLostInput != "" && validLostInput != null) {
        $("#button").click();
        $("#codbarra").focus();
    }
}
$(document).ready(function () {
    $("#clearPage").click(function () {
        document.location.reload(true);
    });
    $(document).keypress(function (e) {
        if (e.which == 13) {
            $("#button").focus();
        }
    });
    $("#btnZeraPalete").click(() => {
        console.log("zera");
        qtdePalete = 0;
        $("#qtdePalete").text(qtdePalete);
    });
    $("button").click(function (e) {
        hideMsgs();
        var readBarcode = $("#codbarra").val();
        if (readBarcode != "") {
            var parm = new Object();
            parm.CodigoBarras = readBarcode.trim();
            parm.EntregaNroEntrega = vars.numentrega;
            parm.CargaId = vars.carga;

            requisicoes.push({
                url: url,
                method: "POST",
                data: parm,
            });

            // $.ajax({
            //     url: url,
            //     method: "POST",
            //     dataType: "json",
            //     contentType: "application/json;charset=UTF-8",
            //     data: JSON.stringify(parm),
            //     beforeSend: function () {
            //         $("#alertText").text("Processando...");
            //         $("#responseAlert").show();
            //     },
            // })
            //     .done(function (msg) {
            //         if (msg.MensagemErro == "") {
            //             let valReread = false;
            //             for (var i = 0; i < etiquetasToConf.length; i++) {
            //                 if (etiquetasToConf[i] == readBarcode) {
            //                     valReread = true;
            //                 }
            //             }
            //             if (valReread) {
            //                 etiquetaDuplicada++;
            //                 $("#etiqeutasDuplicadas").text(etiquetaDuplicada);
            //                 histLeitura.push(
            //                     `<li style="color:red;">${readBarcode} - Leitura duplicada</li>`
            //                 );
            //                 valReread = false;
            //             } else {
            //                 msg.Mensagem = `${readBarcode} - ${msg.ProdutoDescricao} ${msg.RevestimentoDescricao}`;
            //                 $("#mensagemErroG").hide();
            //                 histLeitura.push(
            //                     `<li style="color:#041A56;">${msg.Mensagem} </li>`
            //                 );
            //                 etiquetaValida++;
            //                 qtdePalete++;
            //                 /* * Diminui a quantidade total de etiquetas conforme a carga é lida */
            //                 $("#qtdePalete").text(qtdePalete);
            //                 totalEtiquetas--;
            //                 $("#etiquetasToConf").text(totalEtiquetas);
            //                 $("#etiquetasValidas").text(etiquetaValida);
            //             }
            //         } else {
            //             verifyReturn(msg.Mensagem);
            //             if (readBarcode != "")
            //                 histLeitura.push(
            //                     `<li style="color:red;">${readBarcode} - ${msg.MensagemErro}</li>`
            //                 );
            //             mensagemErroG = `${readBarcode} - ${msg.MensagemErro}`;
            //             etiquetaInvalida++;
            //             $("#etiquetasInvalidas").text(etiquetaInvalida);
            //             $("#mensagemErroG").text(mensagemErroG);
            //             $("#mensagemErroG").show();
            //         }
            //         console.log(etiquetasToConf);
            //         etiquetasToConf.push(readBarcode);
            //         $("#codbarra").focus();
            //         $("#historicoLeitura").html(histLeitura);
            //     })
            //     .fail(function (jqXHR, textStatus, msg) {
            //         $("#dangerText").text(msg.MensagemErro);
            //         $("#responseDanger").show();
            //     });
        } else {
            $("#alertText").text("Favor, informar um código de etiqueta");
            $("#responseAlert").show();
        }
        $("#codbarra").val("");
        $("#codbarra").focus();
        $("#historicoLeitura").html(histLeitura);
        if (count >= histLeitura.length) {
            $("#responseAlert").hide();
        } else {
            $("#alertText").text("Processando, favor não fechar a página");
            $("#responseAlert").show();
        }
        if (readBarcode != null) {
            count++;
        }
    });
});

$(document).ready(() => {
    $("#codbarra").focus();
});

function enviarRequisicoesEmOrdem() {
    let CodigoBarras;
    this.isProcessing = true;
    return new Promise((resolve, reject) => {
        function processarProximaPromessa(promessaAtual) {
            if (promises.length === 0) {
                console.log("zerou");
                this.isProcessing = false;
            }

            if (promises[promessaAtual] != null) {
                CodigoBarras = promises[promessaAtual].data.CodigoBarras;

                if (CodigoBarras != processarProximaPromessa.lastCodBarras) {
                    processarProximaPromessa.lastCodBarras = CodigoBarras;
                    const promessa = () => axios(promises[promessaAtual]);
                    promessa()
                        .then(function (result) {
                            if (result.data.MensagemErro == "") {
                                let valReread = false;
                                for (
                                    var i = 0;
                                    i < this.etiquetasToConf.length;
                                    i++
                                ) {
                                    if (
                                        this.etiquetasToConf[i] == CodigoBarras
                                    ) {
                                        valReread = true;
                                    }
                                }
                                if (valReread) {
                                    this.etiquetaDuplicada++;
                                    $("#etiqeutasDuplicadas").text(
                                        this.etiquetaDuplicada
                                    );
                                    histLeitura.push(
                                        `<li style="color:red;">${CodigoBarras} - Leitura duplicada</li>`
                                    );
                                    valReread = false;
                                } else {
                                    let message = `${CodigoBarras} - ${result.data.ProdutoDescricao} ${result.data.RevestimentoDescricao}`;
                                    $("#mensagemErroG").hide();
                                    histLeitura.push(
                                        `<li style="color:#041A56;">${message} </li>`
                                    );
                                    this.etiquetaValida++;
                                    this.qtdePalete++;
                                    /* * Diminui a quantidade total de etiquetas conforme a carga é lida */
                                    $("#qtdePalete").text(this.qtdePalete);
                                    this.totalEtiquetas--;
                                    $("#etiquetasToConf").text(
                                        this.totalEtiquetas
                                    );
                                    $("#etiquetasValidas").text(
                                        this.etiquetaValida
                                    );
                                }
                            } else {
                                verifyReturn(result.data.Mensagem);
                                if (CodigoBarras != "")
                                    histLeitura.push(
                                        `<li style="color:red;">${CodigoBarras} - ${result.data.MensagemErro}</li>`
                                    );
                                this.mensagemErroG = `${CodigoBarras} - ${result.data.MensagemErro}`;
                                this.etiquetaInvalida++;
                                $("#etiquetasInvalidas").text(
                                    this.etiquetaInvalida
                                );
                                $("#mensagemErroG").text(this.mensagemErroG);
                                $("#mensagemErroG").show();
                            }
                        })
                        .catch(function (error) {
                            histLeitura.push(
                                `<li style="color:red;"> Ocorreu um erro inesperado. ${JSON.stringify(
                                    error
                                )}</li>`
                            );
                            reject(error);
                        })
                        .finally(function () {
                            // remove a promessa da array após a execução
                            promises.splice(promessaAtual, 1);
                            // chama a próxima promessa
                            processarProximaPromessa(promessaAtual);
                            $("#historicoLeitura").html(histLeitura);
                        });
                } else {
                    console.log("---------------Entrou no else");
                    promises.splice(promessaAtual, 1);
                    processarProximaPromessa(promessaAtual);
                }
            }
        }

        // inicia o processamento da primeira promessa
        processarProximaPromessa(0);
    });
}

function triggerArray() {
    let tamanhoAtual = this.requisicoes.length;

    if (
        (tamanhoAtual === triggerArray.tamanhoAnterior && tamanhoAtual > 0) ||
        tamanhoAtual >= 20
    ) {
        requisicoes.forEach(function (request) {
            if (request.data.CodigoBarras != "") {
                promises.push(request);
            }
        });

        if (!this.isProcessing) {
            console.log("Chamando processamento");
            enviarRequisicoesEmOrdem();
        } else {
            console.log("já processando!");
        }

        requisicoes = [];
    }

    triggerArray.tamanhoAnterior = tamanhoAtual;
}

setInterval(triggerArray, 500);
